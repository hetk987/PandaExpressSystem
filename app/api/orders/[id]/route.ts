import { NextRequest, NextResponse } from 'next/server';
import { getOrderById, updateOrder, deleteOrder } from '@/app/services/orderServices';

export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const id = parseInt(params.id);
        if (isNaN(id)) {
            return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });
        }

        const order = await getOrderById(id);
        return NextResponse.json(order, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch order' }, { status: 500 });
    }
}

export async function PUT(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const id = parseInt(params.id);
        if (isNaN(id)) {
            return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });
        }

        const body = await request.json();
        const updatedOrder = await updateOrder(id, body);
        return NextResponse.json(updatedOrder, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to update order' }, { status: 500 });
    }
}

export async function DELETE(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const id = parseInt(params.id);
        if (isNaN(id)) {
            return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });
        }

        await deleteOrder(id);
        return NextResponse.json({ message: 'Order deleted successfully' }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to delete order' }, { status: 500 });
    }
}

