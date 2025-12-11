import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

// Validate Stripe secret key
if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error('STRIPE_SECRET_KEY environment variable is not set');
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: '2025-11-17.clover',
});

export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams;
        const sessionId = searchParams.get('session_id');

        if (!sessionId) {
            return NextResponse.json(
                { error: 'Missing session_id parameter' },
                { status: 400 }
            );
        }

        // Retrieve the checkout session from Stripe
        const session = await stripe.checkout.sessions.retrieve(sessionId);

        // Verify payment was successful
        if (session.payment_status !== 'paid') {
            return NextResponse.json(
                { error: 'Payment not completed' },
                { status: 400 }
            );
        }

        // Extract order ID from metadata
        const metadata = session.metadata;
        if (!metadata || !metadata.orderId) {
            return NextResponse.json(
                { error: 'Missing order ID in metadata' },
                { status: 400 }
            );
        }

        const orderId = parseInt(metadata.orderId);

        // Order was already created before Stripe session
        // We just need to verify it exists and payment was successful
        // The order is already in the database with isCompleted: false
        // Optionally, we could update it to mark payment as complete, but for now
        // we'll leave it as is since isCompleted refers to kitchen completion, not payment

        // Get base URL for redirect - use same logic as checkout/create
        // Priority: NEXTAUTH_URL > request origin > fallback
        let baseUrl = process.env.NEXTAUTH_URL;
        
        // If NEXTAUTH_URL is not set, use the request origin
        if (!baseUrl) {
            const origin = request.headers.get('origin') || request.nextUrl.origin;
            baseUrl = origin;
        }
        
        // Ensure we have a valid URL
        if (!baseUrl) {
            baseUrl = 'https://panda-pos-nrtf.onrender.com'; // Fallback to production URL
        }
        
        // Ensure the URL doesn't have a trailing slash
        baseUrl = baseUrl.replace(/\/$/, '');

        // Redirect to logout page
        return NextResponse.redirect(new URL('/logout', baseUrl));
    } catch (error) {
        console.error('Error processing successful payment:', error);
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        return NextResponse.json(
            { error: 'Failed to process payment', details: errorMessage },
            { status: 500 }
        );
    }
}
