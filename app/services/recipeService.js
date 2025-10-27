import db from "@/drizzle/src/index";
import { recipes } from "@/drizzle/src/db/schema";

export const getRecipes = async () => {
  const recipes = await db.select().from(recipes);
  return recipes;
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
