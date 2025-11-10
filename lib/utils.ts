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