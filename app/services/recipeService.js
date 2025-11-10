import db from "@/drizzle/src/index";
import { recipes } from "@/drizzle/src/db/schema";

export const getRecipes = async () => {
  const allRecipes = await db.select().from(recipes);
  return allRecipes;
};

export const getRecipeById = async (id) => {
  const recipe = await db.select().from(recipes).where(eq(recipes.id, id));
  return recipe;
};

export const createRecipe = async (recipe) => {
  const newRecipe = await db.insert(recipes).values(recipe);
  return newRecipe;
};

export const updateRecipe = async (id, recipe) => {
  const updatedRecipe = await db
    .update(recipes)
    .set(recipe)
    .where(eq(recipes.id, id));
  return updatedRecipe;
};

export const deleteRecipe = async (id) => {
  const deletedRecipe = await db.delete(recipes).where(eq(recipes.id, id));
  return deletedRecipe;
};

export const cookIngredients = async (recipeId) => {
  const invRecJuncs = await getInvRecJuncByRecipeId(recipeId);
  if (!invRecJuncs) {
    throw new Error("Inventory recipe junction not found");
  }
  for (const junction of invRecJuncs) {
    await consumeInventory(junction.inventoryId, junction.inventoryQuantity);
  }
};