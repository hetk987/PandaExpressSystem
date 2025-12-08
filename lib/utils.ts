import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { OrderInfo, RecipeQuantityMap, RecipeSelection } from "./types";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

export function extractRecipeQuantities(order: OrderInfo): RecipeQuantityMap {
    const result: RecipeQuantityMap = {};

    // Process meals
    for (const meal of order.meals) {
        const { quantity, selections } = meal;

        // Helper to add all recipes from a selection array
        const addRecipes = (recipes: RecipeSelection[]) => {
            for (const { recipeId } of recipes) {
                result[recipeId] = (result[recipeId] || 0) + quantity;
            }
        };

        addRecipes(selections.entrees);
        addRecipes(selections.sides);
        addRecipes(selections.drinks);
    }

    // Process individual items
    for (const item of order.individualItems) {
        result[item.recipeId] = (result[item.recipeId] || 0) + item.quantity;
    }

    return result;
}

/**
 * Returns today's date in YYYY-MM-DD format using Chicago timezone
 * Use this for HTML date inputs and date-based queries
 */
export function getTodayDateCST(): string {
    const now = new Date();
    const year = now.toLocaleString("en-US", { timeZone: "America/Chicago", year: "numeric" });
    const month = now.toLocaleString("en-US", { timeZone: "America/Chicago", month: "2-digit" });
    const day = now.toLocaleString("en-US", { timeZone: "America/Chicago", day: "2-digit" });
    return `${year}-${month}-${day}`;
}

/**
 * Returns the current timestamp in Chicago timezone formatted as an ISO string
 * Use this for timestamps stored in the database
 */
export function getCSTTimestamp(): string {
    const now = new Date();
    // Get Chicago time components
    const options: Intl.DateTimeFormatOptions = {
        timeZone: "America/Chicago",
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
    };
    const parts = new Intl.DateTimeFormat("en-US", options).formatToParts(now);
    const get = (type: string) => parts.find(p => p.type === type)?.value || "00";

    return `${get("year")}-${get("month")}-${get("day")}T${get("hour")}:${get("minute")}:${get("second")}.000Z`;
}