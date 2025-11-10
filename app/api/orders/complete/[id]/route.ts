import { consumeCooked } from "@/app/services/cookedService";
import { getOrderById, updateOrder } from "@/app/services/orderService";
import { IndividualItem, MealOrder, Order } from "@/lib/types";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id: idString } = await params;
        const id = parseInt(idString);
        if (isNaN(id)) {
            return NextResponse.json({ error: 'Invalid ID: must be a number' }, { status: 400 });
        }
        const order: Order[] = await getOrderById(id) as unknown as Order[];
        if (!order) {
            return NextResponse.json({ error: 'Order not found' }, { status: 404 });
        }
        if (order[0].isCompleted) {
            return NextResponse.json({ error: 'Order already completed' }, { status: 400 });
        }
        const updatedOrder = await updateOrder(id, { isCompleted: true });
        const mealOrder: MealOrder[] = order[0].orderInfo?.meals as unknown as MealOrder[];
        const individualItemOrder: IndividualItem[] = order[0].orderInfo?.individualItems as unknown as IndividualItem[];

        for (const meal of mealOrder) {
            for (const recipe of meal.selections.entrees) {
                await consumeCooked(recipe.recipeId, meal.quantity);
            }
            for (const recipe of meal.selections.sides) {
                await consumeCooked(recipe.recipeId, meal.quantity);
            }
            for (const recipe of meal.selections.drinks) {
                await consumeCooked(recipe.recipeId, meal.quantity);
            }
        }
        for (const item of individualItemOrder) {
            await consumeCooked(item.recipeId, item.quantity);
        }
        return NextResponse.json({ message: 'Order completed successfully' + updatedOrder }, { status: 200 });

    }
    catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        return NextResponse.json({ message: 'Order not found' + errorMessage }, { status: 404 });
    }
}