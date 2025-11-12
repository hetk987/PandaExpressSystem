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
        <div className="min-h-screen bg-orange-100">
            <div>
                
            </div>
        </div>
    );
}
