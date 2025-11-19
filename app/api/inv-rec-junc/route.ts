import { NextRequest, NextResponse } from 'next/server';
import { getInvRecJuncs, createInvRecJunc } from '@/app/services/invRecService';

export async function GET() {
    try {
        const juncs = await getInvRecJuncs();
        return NextResponse.json(juncs, { status: 200 });
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        return NextResponse.json(
            { error: 'Failed to fetch inventory-recipe junctions', details: errorMessage },
            { status: 500 }
        );
    }
}

export async function POST(request: NextRequest) {
    try {
        let body;
        try {
            body = await request.json();
        } catch (parseError) {
            return NextResponse.json(
                { error: 'Invalid JSON in request body' },
                { status: 400 }
            );
        }

        // Validation: required fields for inv-rec-junc
        if (!body.inventoryId || !body.recipeId || body.inventoryQuantity === undefined) {
            return NextResponse.json(
                { error: 'Missing required fields: inventoryId, recipeId, inventoryQuantity' },
                { status: 400 }
            );
        }

        // Type validation
        if (typeof body.inventoryId !== 'number' || typeof body.recipeId !== 'number' || typeof body.inventoryQuantity !== 'number') {
            return NextResponse.json(
                { error: 'Invalid data types: inventoryId, recipeId, and inventoryQuantity must be numbers' },
                { status: 400 }
            );
        }
        if (body.inventoryQuantity < 0) {
            return NextResponse.json(
                { error: 'inventoryQuantity must be a non-negative number' },
                { status: 400 }
            );
        }

        const newJunc = await createInvRecJunc(body);
        return NextResponse.json(newJunc, { status: 201 });
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        
        // Handle database constraint errors
        if (errorMessage.includes('foreign key') || errorMessage.includes('violates foreign key')) {
            return NextResponse.json(
                { error: 'Invalid inventoryId or recipeId: one or both do not exist', details: errorMessage },
                { status: 400 }
            );
        }

        return NextResponse.json(
            { error: 'Failed to create inventory-recipe junction', details: errorMessage },
            { status: 500 }
        );
    }
}

