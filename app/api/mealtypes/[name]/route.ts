import { NextRequest, NextResponse } from 'next/server';
import { getMealTypeByName, updateMealType, deleteMealType } from '@/app/services/mealTypeService';

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ name: string }> }
) {
    try {
        const { name } = await params;
        if (!name) {
            return NextResponse.json({ error: 'Invalid name' }, { status: 400 });
        }

        const mealType = await getMealTypeByName(name);
        return NextResponse.json(mealType, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch meal type' }, { status: 500 });
    }
}

export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ name: string }> }
) {
    try {
        const { name } = await params;
        if (!name) {
            return NextResponse.json({ error: 'Invalid name' }, { status: 400 });
        }

        const body = await request.json();
        const updated = await updateMealType(name, body);
        return NextResponse.json(updated, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to update meal type' }, { status: 500 });
    }
}

export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ name: string }> }
) {
    try {
        const { name } = await params;
        if (!name) {
            return NextResponse.json({ error: 'Invalid name' }, { status: 400 });
        }

        await deleteMealType(name);
        return NextResponse.json({ message: 'Meal type deleted successfully' }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to delete meal type' }, { status: 500 });
    }
}


