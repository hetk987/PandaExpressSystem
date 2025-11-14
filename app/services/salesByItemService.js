import db from "@/drizzle/src/index";
import { orders, recOrderJunc, recipes } from "@/drizzle/src/db/schema";
import { sql, and, gte, lt, eq, sum } from "drizzle-orm";

export const getSalesByItem = async (startDate, endDate) => {
    // Convert dates to match Java behavior: start at start of day, end at start of next day
    const start = new Date(startDate);
    start.setHours(0, 0, 0, 0);

    const end = new Date(endDate);
    end.setDate(end.getDate() + 1);
    end.setHours(0, 0, 0, 0);

    // Query: orders -> recOrderJunc -> recipes
    // Group by recipe.id
    // Calculate: total quantity sold, total revenue (quantity * pricePerServing)
    const salesByItem = await db
        .select({
            recipeId: recipes.id,
            recipeName: recipes.name,
            recipeType: recipes.type,
            totalQuantity: sum(recOrderJunc.quantity),
            totalRevenue: sql`SUM(${recOrderJunc.quantity} * ${recipes.pricePerServing})`.as('totalRevenue'),
        })
        .from(orders)
        .innerJoin(recOrderJunc, eq(orders.id, recOrderJunc.orderId))
        .innerJoin(recipes, eq(recOrderJunc.recipeId, recipes.id))
        .where(
            and(
                gte(orders.orderTime, start.toISOString()),
                lt(orders.orderTime, end.toISOString())
            )
        )
        .groupBy(recipes.id, recipes.name, recipes.type);

    return salesByItem;
};

