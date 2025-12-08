import { consumeCooked } from "@/app/services/cookedService";
import { getOrderById, updateOrder } from "@/app/services/orderService";
import { sendOrderReadyNotification } from "@/app/services/twilioService";
import { IndividualItem, MealOrder, Order } from "@/lib/types";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        console.log("In api/orders/complete/[id]/route.ts");
        const { id: idString } = await params;
        const id = parseInt(idString);
        if (isNaN(id)) {
            return NextResponse.json({ error: 'Invalid ID: must be a number' }, { status: 400 });
        }
        const order: Order = await getOrderById(id) as unknown as Order;
        console.log("Order: " + JSON.stringify(order));
        if (!order) {
            return NextResponse.json({ error: 'Order not found' }, { status: 404 });
        }
        if (order.isCompleted) {
            return NextResponse.json({ error: 'Order already completed' }, { status: 400 });
        }
        const updatedOrder = await updateOrder(id, { isCompleted: true });
        const mealOrder: MealOrder[] = order.orderInfo?.meals as unknown as MealOrder[];
        const individualItemOrder: IndividualItem[] = order.orderInfo?.individualItems as unknown as IndividualItem[];

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

        // Send SMS notification if customer provided a phone number (fire-and-forget)
        console.log("Customer phone: " + order.customerPhone);
        if (order.customerPhone) {
            sendOrderReadyNotification(order.customerPhone, id)
                .then((success) => {
                    if (success) {
                        console.log(`SMS notification sent for order #${id}`);
                    } else {
                        console.log(`Failed to send SMS for order #${id}`);
                    }
                })
                .catch((err) => {
                    console.error(`Error sending SMS for order #${id}:`, err);
                });
        }

        return NextResponse.json({ message: 'Order completed successfully' + JSON.stringify(updatedOrder) }, { status: 200 });

    }
    catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        return NextResponse.json({ message: 'Order not found' + errorMessage }, { status: 404 });
    }
}