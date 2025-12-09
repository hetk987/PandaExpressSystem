import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { getCSTTimestamp } from '@/lib/utils';
import { OrderInfo } from '@/lib/types';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
    apiVersion: '2025-11-17.clover',
});

export async function POST(request: NextRequest) {
    try {
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
        const orderResponse = await fetch(`${request.nextUrl.origin}/api/orders`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                tax: tax,
                totalCost: total,
                orderTime: orderTime,
                cashierId: cashierId,
                orderInfo: orderInfo,
                isCompleted: false,
                customerEmail: customerEmail || undefined,
            }),
        });

        if (!orderResponse.ok) {
            const error = await orderResponse.json();
            console.error('Failed to create order:', error);
            return NextResponse.json(
                { error: 'Failed to create order', details: error },
                { status: 500 }
            );
        }

        const order = await orderResponse.json();
        const orderId = order.id;

        // Get base URL for callbacks
        const baseUrl = process.env.NEXTAUTH_URL || request.headers.get('origin') || 'http://localhost:3000';

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
    } catch (error) {
        console.error('Error creating Stripe checkout session:', error);
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        return NextResponse.json(
            { error: 'Failed to create checkout session', details: errorMessage },
            { status: 500 }
        );
    }
}
