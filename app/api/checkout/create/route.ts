import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { getCSTTimestamp } from '@/lib/utils';
import { OrderInfo } from '@/lib/types';
import { createOrder } from '@/app/services/orderService';

// Validate Stripe secret key
if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error('STRIPE_SECRET_KEY environment variable is not set');
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: '2025-11-17.clover',
});

export async function POST(request: NextRequest) {
    try {
        // Validate Stripe secret key is available
        const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
        if (!stripeSecretKey) {
            console.error('STRIPE_SECRET_KEY environment variable is not set');
            return NextResponse.json(
                { error: 'Stripe configuration error: Missing STRIPE_SECRET_KEY' },
                { status: 500 }
            );
        }

        const body = await request.json();
        const { meals, individualItems, subtotal, tax, total, customerEmail } = body;

        // Validate required fields
        if (!meals || !individualItems || subtotal === undefined || tax === undefined || total === undefined) {
            return NextResponse.json(
                { error: 'Missing required fields: meals, individualItems, subtotal, tax, total' },
                { status: 400 }
            );
        }

        // Build line items for Stripe
        const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = [];

        // Add meals to line items
        meals.forEach((meal: any) => {
            const mealDescription = [
                ...meal.selections.entrees.map((e: any) => e.recipeName),
                ...meal.selections.sides.map((s: any) => s.recipeName),
                ...meal.selections.drinks.map((d: any) => d.recipeName),
            ].join(', ');

            for (let i = 0; i < meal.quantity; i++) {
                lineItems.push({
                    price_data: {
                        currency: 'usd',
                        product_data: {
                            name: meal.mealType,
                            description: mealDescription || 'Meal',
                        },
                        unit_amount: Math.round(meal.price * 100), // Convert to cents
                    },
                    quantity: 1,
                });
            }
        });

        // Add individual items to line items
        individualItems.forEach((item: any) => {
            for (let i = 0; i < item.quantity; i++) {
                lineItems.push({
                    price_data: {
                        currency: 'usd',
                        product_data: {
                            name: item.recipeName,
                            description: `${item.recipeType} - A la carte`,
                        },
                        unit_amount: Math.round(item.price * 100), // Convert to cents
                    },
                    quantity: 1,
                });
            }
        });

        // Add tax as a line item
        if (tax > 0) {
            lineItems.push({
                price_data: {
                    currency: 'usd',
                    product_data: {
                        name: 'Tax',
                        description: 'Sales tax',
                    },
                    unit_amount: Math.round(tax * 100), // Convert to cents
                },
                quantity: 1,
            });
        }

        // Prepare order info
        const orderInfo: OrderInfo = {
            meals: meals,
            individualItems: individualItems,
        };

        const orderTime = getCSTTimestamp();
        const cashierId = 2; // Default cashier ID for customer orders

        // Create the order in the database first (with isCompleted: false)
        // This allows us to pass only the order ID in Stripe metadata instead of the full order data
        // Direct service call avoids HTTP/HTTPS protocol issues in production
        try {
            const order = await createOrder({
                tax: tax,
                totalCost: total,
                orderTime: orderTime,
                cashierId: cashierId,
                orderInfo: orderInfo,
                isCompleted: false,
                customerEmail: customerEmail || undefined,
            });

            const orderId = order.id;

            // Get base URL for callbacks
            // Priority: NEXTAUTH_URL > origin header > fallback
            const baseUrl = 
                process.env.NEXTAUTH_URL || 
                request.headers.get('origin') || 
                request.nextUrl.origin ||
                'http://localhost:3000';

            // Create Stripe checkout session with only order ID in metadata
            const session = await stripe.checkout.sessions.create({
                payment_method_types: ['card'],
                line_items: lineItems,
                mode: 'payment',
                success_url: `${baseUrl}/api/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
                cancel_url: `${baseUrl}/api/checkout/cancel`,
                metadata: {
                    orderId: orderId.toString(),
                },
            });

            return NextResponse.json({ url: session.url }, { status: 200 });
        } catch (orderError) {
            console.error('Failed to create order:', orderError);
            const errorMessage = orderError instanceof Error ? orderError.message : 'Unknown error';
            return NextResponse.json(
                { error: 'Failed to create order', details: errorMessage },
                { status: 500 }
            );
        }
    } catch (error) {
        console.error('Error creating Stripe checkout session:', error);
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        
        // Provide more helpful error messages
        let userMessage = 'Failed to create checkout session';
        if (errorMessage.includes('STRIPE_SECRET_KEY')) {
            userMessage = 'Stripe configuration error: Missing API key. Please check environment variables.';
        } else if (errorMessage.includes('Invalid API Key')) {
            userMessage = 'Stripe configuration error: Invalid API key. Please verify your Stripe secret key.';
        }
        console.error('Error creating Stripe checkout session:', errorMessage);
        
        return NextResponse.json(
            { error: userMessage, details: errorMessage },
            { status: 500 }
        );
    }
}
