import { NextRequest, NextResponse } from 'next/server';
import { getMealTypes, createMealType } from '@/app/services/mealTypeService';

export async function GET() {
    try {
        const all = await getMealTypes();
        return NextResponse.json(all, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch meal types' }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();

        // Validation: required fields for meal types
        if (!body.name || body.sides === undefined || body.entrees === undefined || body.drinks === undefined || body.price === undefined) {
            return NextResponse.json(
                { error: 'Missing required fields: name, sides, entrees, drinks, price' },
                { status: 400 }
            );
        }

        const created = await createMealType(body);
        return NextResponse.json(created, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to create meal type' }, { status: 500 });
    }
}


