import { NextRequest, NextResponse } from 'next/server';
import { getInventoryById, updateInventory, deleteInventory } from '@/app/services/inventoryServices';

export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const id = parseInt(params.id);
        if (isNaN(id)) {
            return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });
        }

        const inventoryItem = await getInventoryById(id);
        return NextResponse.json(inventoryItem, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch inventory item' }, { status: 500 });
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
        const updatedInventory = await updateInventory(id, body);
        return NextResponse.json(updatedInventory, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to update inventory item' }, { status: 500 });
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

        await deleteInventory(id);
        return NextResponse.json({ message: 'Inventory item deleted successfully' }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to delete inventory item' }, { status: 500 });
    }
}

