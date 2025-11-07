import db from "@/drizzle/src/index";
import { cooked } from "@/drizzle/src/db/schema";

export const getCooked = async () => {
    const allCooked = await db.select().from(cooked);
    return allCooked;
};

export const getCookedById = async (id) => {
    const getCookedById = await db
        .select()
        .from(cooked)
        .where(eq(cooked.id, id));
    return getCookedById;
};

export const getCookedByRecipeId = async (recipeId) => {
    const getCookedByRecipeId = await db
        .select()
        .from(cooked)
        .where(eq(cooked.recipeId, recipeId));
    return getCookedByRecipeId;
};

export const createCooked = async (cooked) => {
    const createdCooked = await db.insert(cooked).values(cooked);
    return createdCooked;
};

export const updateCooked = async (id, cooked) => {
    const updatedCooked = await db
        .update(cooked)
        .set(cooked)
        .where(eq(cooked.id, id));
    return updatedCooked;
};

export const cookRecipe = async (recipeId) => {
    const recipe = await getRecipeById(recipeId);
    if (!recipe) {
        throw new Error("Recipe not found");
    }
    await cookIngredients(recipeId);
    if ((cookedByRecipeId = await getCookedByRecipeId(recipeId))) {
        const updatedCookedReturn = await updateCooked(cookedByRecipeId.id, {
            currentStock: cookedByRecipeId.currentStock + recipe.quantity,
        });
        return updatedCookedReturn;
    } else {
        const newCookedReturn = await createCooked({
            recipeId,
            currentStock: recipe.quantity,
        });
        return newCookedReturn;
    }
};

export const deleteCooked = async (id) => {
    const deletedCooked = await db.delete(cooked).where(eq(cooked.id, id));
    return deletedCooked;
};
