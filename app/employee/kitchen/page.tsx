"use client";

import { useMemo, useState } from "react";
import useSWR from "swr";
import { fetcher } from "@/lib/fetcher";
import { KitchenOrderItem } from "@/app/components/KitchenOrderItem";
import { KitchenDrawer } from "@/app/components/app-kitchen-drawer";
import type { Order, Cooked } from "@/lib/types";
import { Skeleton } from "@/app/components/ui/skeleton";

export default function KitchenPage() {
    const [selectedMealType, setSelectedMealType] = useState<string>("All");
    
    const { data: cooked, isLoading: cookedLoading } = useSWR<Cooked[]>(
        "/api/cooked",
        fetcher,
        { refreshInterval: 5000 }
    );
    const { data: openOrders, isLoading: ordersLoading } = useSWR<Order[]>(
        "/api/orders/incomplete",
        fetcher,
        { refreshInterval: 5000 }
    );
    const loading = cookedLoading || ordersLoading;

    const filteredOrders = useMemo(() => {
        if (!openOrders) return [];
        if (selectedMealType === "All") return openOrders;
        
        return openOrders.filter(order => 
            order.orderInfo?.meals?.some(meal => 
                meal.mealType === selectedMealType
            )
        );
    }, [openOrders, selectedMealType]);

    const mealTypes = ["All", "Bowl", "Plate", "Bigger Plate", "A La Carte"];

    if (loading) {
        return (
            <div className="min-h-screen bg-white">
                {/* Header Skeleton */}
                <div className="border-b border-black bg-white px-6 py-4 flex flex-row justify-between items-center">
                    <div>
                        <Skeleton className="h-8 w-64 mb-2" />
                        <Skeleton className="h-5 w-32" />
                    </div>
                    <Skeleton className="h-14 w-56" />
                </div>

                {/* Filter Skeleton */}
                <div className="border-b border-gray-200 bg-gray-50 px-6 py-3">
                    <div className="flex gap-2">
                        {Array.from({ length: 5 }).map((_, i) => (
                            <Skeleton key={i} className="h-10 w-32" />
                        ))}
                    </div>
                </div>

                {/* Orders Grid Skeleton */}
                <div className="p-6">
                    <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
                        {Array.from({ length: 6 }).map((_, i) => (
                            <div key={i} className="break-inside-avoid mb-6">
                                <Skeleton className="h-72 w-full rounded-lg" />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white">
            {/* Header */}
            <div className="border-b border-black bg-white px-6 py-4 flex flex-row justify-between items-center">
                <div>
                    <h1 className="text-2xl font-mono font-bold">
                        KITCHEN ORDERS
                    </h1>
                    <p className="text-sm text-gray-600 font-mono mt-1">
                        Active Orders: {filteredOrders?.length ?? 0} / {openOrders?.length ?? 0}
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="text-right mr-2">
                        <p className="text-xs font-mono text-gray-500 uppercase tracking-wide">Inventory</p>
                        <p className="text-xs font-mono text-gray-400">Stock Management</p>
                    </div>
                    <KitchenDrawer cooked={cooked || []} />
                </div>
            </div>

            {/* Meal Type Filter */}
            <div className="border-b border-gray-200 bg-gray-50 px-6 py-3">
                <div className="flex gap-2 flex-wrap">
                    {mealTypes.map((type) => (
                        <button
                            key={type}
                            onClick={() => setSelectedMealType(type)}
                            className={`
                                px-4 py-2 font-mono font-bold text-sm border-2 transition-all
                                ${selectedMealType === type 
                                    ? 'bg-black text-white border-black' 
                                    : 'bg-white text-black border-black hover:bg-gray-100'
                                }
                            `}
                        >
                            {type.toUpperCase()}
                        </button>
                    ))}
                </div>
            </div>

            {/* Orders Masonry Layout */}
            <div className="p-6">
                <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
                    {filteredOrders?.map((order) => (
                        <div key={order.id} className="break-inside-avoid mb-6">
                            <KitchenOrderItem
                                order={order}
                                cooked={cooked || []}
                            />
                        </div>
                    ))}
                </div>

                {/* Empty state */}
                {filteredOrders?.length === 0 && (
                    <div className="flex items-center justify-center py-20">
                        <p className="text-lg text-gray-500 font-mono">
                            {selectedMealType === "All" ? "No active orders" : `No ${selectedMealType} orders`}
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}