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
 * Returns the current timestamp in CST (Central Standard Time, UTC-6)
 * formatted as an ISO string
 */
export function getCSTTimestamp(): string {
    const now = new Date();
    // CST is UTC-6 hours
    const cstOffset = -6 * 60; // in minutes
    // Adjust from local time to UTC, then to CST
    const cstTime = new Date(
        now.getTime() + 
        (cstOffset * 60 * 1000) + 
        (now.getTimezoneOffset() * 60 * 1000)
    );
    return cstTime.toISOString();
}