import { NextRequest, NextResponse } from 'next/server';
import { getRecOrderJuncs, createRecOrderJunc } from '@/app/services/recOrderService';

export async function GET() {
    try {
        const juncs = await getRecOrderJuncs();
        return NextResponse.json(juncs, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch recipe-order junctions' }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();

        // Validation: required fields for rec-order-junc
        if (!body.recipeId || !body.orderId || body.quantity === undefined) {
            return NextResponse.json(
                { error: 'Missing required fields: recipeId, orderId, quantity' },
                { status: 400 }
            );
        }

        const newJunc = await createRecOrderJunc(body);
        return NextResponse.json(newJunc, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to create recipe-order junction' }, { status: 500 });
    }
}

