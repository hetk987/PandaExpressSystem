import { NextRequest, NextResponse } from "next/server";
import { cookRecipe } from "@/app/services/cookedService";

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const { id: idString } = await params;
    const id = parseInt(idString);
    if (isNaN(id)) {
        return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });
    }
    try {
        const cooked = await cookRecipe(id);
        return NextResponse.json(cooked, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to cook recipe: ' + error }, { status: 500 });
    }
}