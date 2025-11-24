"use client";

import useSWR from "swr";
import { fetcher } from "@/lib/fetcher";
import { KitchenOrderItem } from "@/app/components/KitchenOrderItem";
import { KitchenDrawer } from "@/app/components/app-kitchen-drawer";
import type { Order, Cooked } from "@/lib/types";

export default function KitchenPage() {
  const { data: cooked, isLoading: cookedLoading } = useSWR<Cooked[]>("/api/cooked", fetcher, { refreshInterval: 5000 });
  const { data: openOrders, isLoading: ordersLoading } = useSWR<Order[]>("/api/orders/incomplete", fetcher, { refreshInterval: 5000 });
  const loading = cookedLoading || ordersLoading;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen font-mono text-gray-500">
        Loading kitchen data...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="border-b border-black bg-white px-6 py-4 flex flex-row justify-between">
        <div>
          <h1 className="text-2xl font-mono font-bold">KITCHEN ORDERS</h1>
          <p className="text-sm text-gray-600 font-mono mt-1">
            Active Orders: {openOrders?.length ?? 0}
          </p>
        </div>
        <KitchenDrawer cooked={cooked || []} />
      </div>

      {/* Orders Grid */}
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {openOrders?.map((order) => (
            <div key={order.id} className="bg-white">
              <KitchenOrderItem order={order} cooked={cooked || []} />
            </div>
          ))}
        </div>

        {/* Empty state */}
        {openOrders?.length === 0 && (
          <div className="flex items-center justify-center py-20">
            <p className="text-lg text-gray-500 font-mono">No active orders</p>
          </div>
        )}
      </div>
    </div>
  );
}
