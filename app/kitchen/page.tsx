"use client";

import { KitchenOrderItem } from "../components/KitchenOrderItem";
import type { Order, Cooked } from "@/lib/types";
import { useState, useEffect, useMemo } from "react";
import { KitchenDrawer } from "../components/app-kitchen-drawer";
import { extractRecipeQuantities } from "@/lib/utils";
import { RecipeQuantityMap } from "@/lib/types";

export default function KitchenPage() {
    const [openOrders, setOpenOrders] = useState<Order[]>([] as Order[]);
    const [cooked, setCooked] = useState<Cooked[]>([]);

    useEffect(() => {
        const fetchOpenOrders = async () => {
            let response = await fetch("/api/cooked");
            let data = await response.json();
            setCooked(data);

            response = await fetch("/api/orders/incomplete");
            data = await response.json();
            setOpenOrders(data);
        };
        fetchOpenOrders();
    }, []);

    return (
        <div className="min-h-screen bg-white">
            {/* Header */}
            <div className="border-b border-black bg-white px-6 py-4 flex flex-row justify-between">
                <div>
                    <h1 className="text-2xl font-mono font-bold">
                        KITCHEN ORDERS
                    </h1>
                    <p className="text-sm text-gray-600 font-mono mt-1">
                        Active Orders: {openOrders.length}
                    </p>
                </div>
                <KitchenDrawer cooked={cooked} />
            </div>

            {/* Orders Grid */}
            <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {openOrders.map((order) => (
                        <div key={order.id} className="bg-white">
                            <KitchenOrderItem order={order} cooked={cooked} />
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
