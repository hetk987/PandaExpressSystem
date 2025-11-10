"use client";

import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import { Order } from "@/lib/types";
import { toast } from "sonner";

export function KitchenOrderItem({ order }: { order: Order }) {
    async function completeOrder(id: number): Promise<void> {
        const response = await fetch(`/api/orders/complete/${id}`, {
            method: "PUT",
        });
        if (response.ok) {
            toast.success("Order completed successfully");
        } else {
            toast.error("Failed to complete order");
        }
        window.location.reload();
    }

    return (
        <div className="w-full max-w-md mx-auto">
            <Card className="border-2 border-black">
                {/* Header - Order Number and Time */}
                <CardHeader className="border-b-2 border-black pb-2 pt-4 px-4">
                    <div className="flex justify-between items-start">
                        <CardTitle className="text-2xl font-bold">
                            ORDER #{order.id}
                        </CardTitle>
                        <span className="text-sm font-mono">
                            {order.orderTime}
                        </span>
                    </div>
                </CardHeader>

                {/* Items */}
                <CardContent className="px-4 py-3">
                    <div className="border-b-2 border-black pb-3 mb-3">
                        <div className="space-y-2">
                            {order.orderInfo?.meals.map((item, i) => (
                                <div
                                    key={i}
                                    className="flex justify-between items-start gap-2"
                                >
                                    <div className="flex-1">
                                        <div className="font-bold text-lg">
                                            {item.quantity}x {item.mealType}
                                        </div>
                                        {item.selections.entrees.map(
                                            (entree, j) => (
                                                <div
                                                    className="text-xs text-muted-foreground"
                                                    key={j}
                                                >
                                                    {entree.recipeName}
                                                </div>
                                            )
                                        )}
                                        {item.selections.sides.map(
                                            (side, j) => (
                                                <div
                                                    className="text-xs text-muted-foreground"
                                                    key={j}
                                                >
                                                    {side.recipeName}
                                                </div>
                                            )
                                        )}
                                        {item.selections.drinks.map(
                                            (drink, j) => (
                                                <div
                                                    className="text-xs text-muted-foreground"
                                                    key={j}
                                                >
                                                    {drink.recipeName}
                                                </div>
                                            )
                                        )}
                                    </div>
                                </div>
                            ))}
                            {order.orderInfo?.individualItems.map((item) => (
                                <div
                                    key={item.recipeName}
                                    className="flex justify-between items-start gap-2"
                                >
                                    <div className="flex-1">
                                        <div className="font-bold text-lg">
                                            {item.quantity}x {item.recipeName}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Footer Info */}
                    <div className="space-y-1 text-sm mb-4 font-mono">
                        <div className="flex justify-between">
                            <span>Cashier ID:</span>
                            <span>{order.cashierId}</span>
                        </div>
                        <div className="border-t-2 border-black pt-2 mt-2 flex justify-between font-bold">
                            <span>Total Items:</span>
                            <span>
                                {order.orderInfo?.individualItems?.reduce(
                                    (sum, item) => sum + item.quantity,
                                    0
                                )}
                            </span>
                        </div>
                    </div>

                    {/* Complete Button */}
                    <Button
                        className="w-full font-bold text-base py-6 bg-black text-white hover:bg-gray-800"
                        onClick={async () => await completeOrder(order.id)}
                    >
                        COMPLETE ORDER
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
}
