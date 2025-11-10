"use client";

import { KitchenOrderItem } from "../components/KitchenOrderItem";
import type { Order, Cooked } from "@/lib/types";
import { useState, useEffect, useMemo } from "react";
import { KitchenDrawer} from "../components/app-kitchen-drawer";
import { extractRecipeQuantities } from "@/lib/utils";
import { RecipeQuantityMap } from "@/lib/types";

// Temporary mock data for testing
const TEMP_ORDERS: Order[] = [
    {
        id: 1001,
        tax: 2.5,
        totalCost: 27.5,
        orderTime: "10:30 AM",
        cashierId: 5,
        isCompleted: false,
        orderInfo: {
            meals: [
                {
                    mealType: "Plate",
                    quantity: 3,
                    price: 8.50,
                    selections: {
                        entrees: [
                            {recipeId: 1, recipeName: "Sugar Chicken"},
                            {recipeId: 1, recipeName: "Sugar Chicken"}
                        ],
                        sides: [{recipeId: 3, recipeName: "Chow Mein"}],
                        drinks: [{recipeId: 4, recipeName: "Diet Pepsi"}]
                    }
                }
            ],
            individualItems: [
                {
                    recipeId: 1,
                    recipeName: "Grilled Chicken",
                    recipeType: "Entree",
                    quantity: 2,
                    price: 12.0,
                },
                {
                    recipeId: 2,
                    recipeName: "French Fries",
                    recipeType: "Side",
                    quantity: 2,
                    price: 4.0,
                },
                {
                    recipeId: 3,
                    recipeName: "Coca Cola",
                    recipeType: "Drink",
                    quantity: 2,
                    price: 3.0,
                },
            ],
        },
    },
    {
        id: 1002,
        tax: 3.0,
        totalCost: 33.0,
        orderTime: "10:45 AM",
        cashierId: 3,
        isCompleted: false,
        orderInfo: {
            meals: [],
            individualItems: [
                {
                    recipeId: 4,
                    recipeName: "Burger",
                    recipeType: "Entree",
                    quantity: 1,
                    price: 8.0,
                },
                {
                    recipeId: 5,
                    recipeName: "Onion Rings",
                    recipeType: "Side",
                    quantity: 1,
                    price: 5.0,
                },
                {
                    recipeId: 6,
                    recipeName: "Sprite",
                    recipeType: "Drink",
                    quantity: 1,
                    price: 2.5,
                },
            ],
        },
    },
    {
        id: 1003,
        tax: 4.5,
        totalCost: 49.5,
        orderTime: "11:00 AM",
        cashierId: 7,
        isCompleted: false,
        orderInfo: {
            meals: [],
            individualItems: [
                {
                    recipeId: 7,
                    recipeName: "Pizza Slice",
                    recipeType: "Entree",
                    quantity: 3,
                    price: 18.0,
                },
                {
                    recipeId: 8,
                    recipeName: "Caesar Salad",
                    recipeType: "Side",
                    quantity: 2,
                    price: 10.0,
                },
                {
                    recipeId: 9,
                    recipeName: "Iced Tea",
                    recipeType: "Drink",
                    quantity: 2,
                    price: 4.0,
                },
            ],
        },
    },
    {
        id: 1004,
        tax: 1.75,
        totalCost: 19.25,
        orderTime: "11:15 AM",
        cashierId: 2,
        isCompleted: false,
        orderInfo: {
            meals: [],
            individualItems: [
                {
                    recipeId: 10,
                    recipeName: "Fish Tacos",
                    recipeType: "Entree",
                    quantity: 1,
                    price: 10.0,
                },
                {
                    recipeId: 11,
                    recipeName: "Rice",
                    recipeType: "Side",
                    quantity: 1,
                    price: 3.0,
                },
                {
                    recipeId: 12,
                    recipeName: "Water",
                    recipeType: "Drink",
                    quantity: 1,
                    price: 1.5,
                },
            ],
        },
    },
];

export default function KitchenPage() {
    const [openOrders, setOpenOrders] = useState<Order[]>(TEMP_ORDERS);
    const [cooked, setCooked] = useState<Cooked[]>([]);

    useEffect(() => {
        const fetchOpenOrders = async () => {
            let response = await fetch("/api/cooked");
            let data = await response.json();
            setCooked(data);

            // response = await fetch("/api/orders/incomplete");
            // data = await response.json();
            // setOpenOrders(data);
        };
        fetchOpenOrders();
    }, []);

    // flatten orders to check contents
    // const orderItems = useMemo(() => {
    //     const dict: Record<number, RecipeQuantityMap> = {};
    //     for (const order of openOrders) {
    //         dict[order.id] = extractRecipeQuantities(order.orderInfo);
    //     }
    //     return dict;
    // }, [openOrders]);

    // check if we can send an order
    // function isReady(order: Order): boolean {
    //     const recipes = orderItems[order.id];
    //     for (const [recipe, quantity] of Object.entries(recipes)) {
    //         const stock = cooked.find(c => c.recipeId === +recipe)?.currentStock;

    //         if (!stock || quantity > stock) {
    //             return false;
    //         }
    //     }
    //     return true;
    // }

    // TODO write function to see if we can cook something

    return (
        <div className="min-h-screen bg-white">
            {/* Header */}
            <div className="border-b border-black bg-white px-6 py-4 flex flex-row justify-between">
                <div>
                    <h1 className="text-2xl font-mono font-bold">KITCHEN ORDERS</h1>
                    <p className="text-sm text-gray-600 font-mono mt-1">
                        Active Orders: {openOrders.length}
                    </p>
                </div>
                <KitchenDrawer cooked={cooked}/>
            </div>

            {/* Orders Grid */}
            <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {openOrders.map((order) => (
                        <div key={order.id} className="bg-white">
                            <KitchenOrderItem order={order} />
                        </div>
                    ))}
                </div>

                {/* Empty state */}
                {openOrders.length === 0 && (
                    <div className="flex items-center justify-center py-20">
                        <p className="text-lg text-gray-500 font-mono">
                            No active orders
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
