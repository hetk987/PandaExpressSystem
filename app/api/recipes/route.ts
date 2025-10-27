import { NextRequest, NextResponse } from 'next/server';
import { getRecipes, createRecipe } from '@/app/services/recipeService';

export async function GET() {
    try {
        const recipes = await getRecipes();
        return NextResponse.json(recipes, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch recipes' }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();

        // Validation: required fields for recipes
        if (!body.name || !body.pricePerServing || !body.ordersPerBatch) {
            return NextResponse.json(
                { error: 'Missing required fields: name, pricePerServing, ordersPerBatch' },
                { status: 400 }
            );
        }

        const newRecipe = await createRecipe(body);
        return NextResponse.json(newRecipe, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to create recipe' }, { status: 500 });
    }
}

