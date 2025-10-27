import { NextRequest, NextResponse } from 'next/server';
import { getOrders, createOrder } from '@/app/services/orderService';

export async function GET() {
    try {
        const orders = await getOrders();
        return NextResponse.json(orders, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();

        // Validation: required fields for orders
        if (!body.tax || !body.totalCost || !body.orderTime || !body.cashierId) {
            return NextResponse.json(
                { error: 'Missing required fields: tax, totalCost, orderTime, cashierId' },
                { status: 400 }
            );
        }

        const newOrder = await createOrder(body);
        return NextResponse.json(newOrder, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to create order' }, { status: 500 });
    }
}

