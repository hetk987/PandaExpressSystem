import { NextRequest, NextResponse } from 'next/server';
import { getInvRecJuncs, createInvRecJunc } from '@/app/services/invRecServices';

export async function GET() {
    try {
        const juncs = await getInvRecJuncs();
        return NextResponse.json(juncs, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch inventory-recipe junctions' }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();

        // Validation: required fields for inv-rec-junc
        if (!body.inventoryId || !body.recipeId || body.inventoryQuantity === undefined) {
            return NextResponse.json(
                { error: 'Missing required fields: inventoryId, recipeId, inventoryQuantity' },
                { status: 400 }
            );
        }

        const newJunc = await createInvRecJunc(body);
        return NextResponse.json(newJunc, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to create inventory-recipe junction' }, { status: 500 });
    }
}

