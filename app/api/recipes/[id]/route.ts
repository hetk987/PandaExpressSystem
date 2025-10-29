import { NextRequest, NextResponse } from 'next/server';
import { getRecipeById, updateRecipe, deleteRecipe } from '@/app/services/recipeService';

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

        const recipe = await getRecipeById(id);
        return NextResponse.json(recipe, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch recipe' }, { status: 500 });
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
        const updatedRecipe = await updateRecipe(id, body);
        return NextResponse.json(updatedRecipe, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to update recipe' }, { status: 500 });
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

        await deleteRecipe(id);
        return NextResponse.json({ message: 'Recipe deleted successfully' }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to delete recipe' }, { status: 500 });
    }
}

