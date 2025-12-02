import db from "@/drizzle/src/index";
import { orders, recOrderJunc, recipes } from "@/drizzle/src/db/schema";
import { sql, and, gte, lte, eq, sum } from "drizzle-orm";

export const getSalesByItem = async (startDate, endDate) => {
    // Convert dates: start at beginning of start day, end at end of end day (inclusive)
    // Parse as UTC to match database timestamps
    const start = new Date(startDate + "T00:00:00.000Z");
    const end = new Date(endDate + "T23:59:59.999Z");

    // Query: orders -> recOrderJunc -> recipes
    // Group by recipe.id
    // Calculate: total quantity sold, total revenue (quantity * pricePerServing)
    const salesByItem = await db
        .select({
            recipeId: recipes.id,
            recipeName: recipes.name,
            recipeType: recipes.type,
            totalQuantity: sum(recOrderJunc.quantity),
            totalRevenue:
                sql`SUM(${recOrderJunc.quantity} * ${recipes.pricePerServing})`.as(
                    "totalRevenue"
                ),
        })
        .from(orders)
        .innerJoin(recOrderJunc, eq(orders.id, recOrderJunc.orderId))
        .innerJoin(recipes, eq(recOrderJunc.recipeId, recipes.id))
        .where(
            and(
                eq(orders.isCompleted, true),
                gte(orders.orderTime, start.toISOString()),
                lte(orders.orderTime, end.toISOString())
            )
        )
        .groupBy(recipes.id, recipes.name, recipes.type);

    return salesByItem;
};
