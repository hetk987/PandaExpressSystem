import db from "@/drizzle/src/index";
import { orders, recOrderJunc, recipes, invRecJunc, inventory } from "@/drizzle/src/db/schema";
import { sql, and, gte, lt, eq } from "drizzle-orm";

export const getProductUsage = async (startDate, endDate) => {
    // Convert dates to match Java behavior: start at start of day, end at start of next day
    const start = new Date(startDate);
    start.setHours(0, 0, 0, 0);

    const end = new Date(endDate);
    end.setDate(end.getDate() + 1);
    end.setHours(0, 0, 0, 0);

    // Query: orders -> recOrderJunc -> recipes -> invRecJunc -> inventory
    // Calculate: SUM(invRecJunc.inventoryQuantity * recOrderJunc.quantity) grouped by inventory item
    const productUsage = await db
        .select({
            inventoryId: inventory.id,
            inventoryName: inventory.name,
            totalUsed: sql`SUM(${invRecJunc.inventoryQuantity} * ${recOrderJunc.quantity})`.as('totalUsed'),
        })
        .from(orders)
        .innerJoin(recOrderJunc, eq(orders.id, recOrderJunc.orderId))
        .innerJoin(recipes, eq(recOrderJunc.recipeId, recipes.id))
        .innerJoin(invRecJunc, eq(recipes.id, invRecJunc.recipeId))
        .innerJoin(inventory, eq(invRecJunc.inventoryId, inventory.id))
        .where(
            and(
                gte(orders.orderTime, start.toISOString()),
                lt(orders.orderTime, end.toISOString())
            )
        )
        .groupBy(inventory.id, inventory.name);

    return productUsage;
};

