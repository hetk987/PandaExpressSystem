import { NextRequest, NextResponse } from 'next/server';
import { getInvRecJuncById, updateInvRecJunc, deleteInvRecJunc } from '@/app/services/invRecService';

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id: idString } = await params;
        const id = parseInt(idString);
        if (isNaN(id)) {
            return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });
        }

        const junc = await getInvRecJuncById(id);
        return NextResponse.json(junc, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch inventory-recipe junction' }, { status: 500 });
    }
}

export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id: idString } = await params;
        const id = parseInt(idString);
        if (isNaN(id)) {
            return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });
        }

        const body = await request.json();
        const updatedJunc = await updateInvRecJunc(id, body);
        return NextResponse.json(updatedJunc, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to update inventory-recipe junction' }, { status: 500 });
    }
}

export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id: idString } = await params;
        const id = parseInt(idString);
        if (isNaN(id)) {
            return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });
        }

        await deleteInvRecJunc(id);
        return NextResponse.json({ message: 'Inventory-recipe junction deleted successfully' }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to delete inventory-recipe junction' }, { status: 500 });
    }
}

