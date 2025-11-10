import db from "@/drizzle/src/index";
import { orders } from "@/drizzle/src/db/schema";
import { eq } from "drizzle-orm";

export const getOrders = async () => {
    const allOrders = await db.select().from(orders);
    return allOrders;
};

export const getOrderById = async (id) => {
    console.log("id: " + id);
    const [output] = await db.select().from(orders).where(eq(orders.id, id));
    return output;
};

export const createOrder = async (order) => {
    console.log("order: " + JSON.stringify(order));
    const [createdOrder] = await db.insert(orders).values(order).returning();
    console.log("createdOrder: " + JSON.stringify(createdOrder));
    return createdOrder;
};

export const updateOrder = async (id, order) => {
    const updatedOrder = await db
        .update(orders)
        .set(order)
        .where(eq(orders.id, id));
    return updatedOrder;
};

export const deleteOrder = async (id) => {
    const deletedOrder = await db.delete(orders).where(eq(orders.id, id));
    return deletedOrder;
};

export const getIncompleteOrders = async () => {
    const incompleteOrders = await db
        .select()
        .from(orders)
        .where(eq(orders.isCompleted, false));
    return incompleteOrders;
};
