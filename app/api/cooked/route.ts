import { NextRequest, NextResponse } from 'next/server';
import { getCooked, createCooked } from '@/app/services/cookedService';

export async function GET() {
    try {
        const cookedItems = await getCooked();
        return NextResponse.json(cookedItems, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch cooked items' }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();

        // Validation: required fields for cooked
        if (!body.recipeId || body.currentStock === undefined) {
            return NextResponse.json(
                { error: 'Missing required fields: recipeId, currentStock' },
                { status: 400 }
            );
        }

        const newCooked = await createCooked(body);
        return NextResponse.json(newCooked, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to create cooked item' }, { status: 500 });
    }
}

