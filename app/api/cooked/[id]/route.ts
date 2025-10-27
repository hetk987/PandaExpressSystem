import { NextRequest, NextResponse } from 'next/server';
import { getCookedById, updateCooked, deleteCooked } from '@/app/services/cookedService';

export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const id = parseInt(params.id);
        if (isNaN(id)) {
            return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });
        }

        const cookedItem = await getCookedById(id);
        return NextResponse.json(cookedItem, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch cooked item' }, { status: 500 });
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
        const updatedCooked = await updateCooked(id, body);
        return NextResponse.json(updatedCooked, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to update cooked item' }, { status: 500 });
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

        await deleteCooked(id);
        return NextResponse.json({ message: 'Cooked item deleted successfully' }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to delete cooked item' }, { status: 500 });
    }
}

