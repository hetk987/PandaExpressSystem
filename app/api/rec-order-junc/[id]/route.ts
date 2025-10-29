import { NextRequest, NextResponse } from 'next/server';
import { getRecOrderJuncById, updateRecOrderJunc, deleteRecOrderJunc } from '@/app/services/recOrderService';

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

        const junc = await getRecOrderJuncById(id);
        return NextResponse.json(junc, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch recipe-order junction' }, { status: 500 });
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
        const updatedJunc = await updateRecOrderJunc(id, body);
        return NextResponse.json(updatedJunc, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to update recipe-order junction' }, { status: 500 });
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

        await deleteRecOrderJunc(id);
        return NextResponse.json({ message: 'Recipe-order junction deleted successfully' }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to delete recipe-order junction' }, { status: 500 });
    }
}

