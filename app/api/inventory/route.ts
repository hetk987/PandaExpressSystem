import { NextRequest, NextResponse } from 'next/server';
import { getInventory, createInventory } from '@/app/services/inventoryServices';

export async function GET() {
    try {
        const inventoryItems = await getInventory();
        return NextResponse.json(inventoryItems, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch inventory' }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();

        // Validation: required fields for inventory
        if (!body.name || body.batchPurchaseCost === undefined ||
            body.currentStock === undefined || body.estimatedUsedPerDay === undefined) {
            return NextResponse.json(
                { error: 'Missing required fields: name, batchPurchaseCost, currentStock, estimatedUsedPerDay' },
                { status: 400 }
            );
        }

        const newInventory = await createInventory(body);
        return NextResponse.json(newInventory, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to create inventory item' }, { status: 500 });
    }
}

