import db from "@/drizzle/src/index";
import { cooked } from "@/drizzle/src/db/schema";

export const getCooked = async () => {
    const allCooked = await db.select().from(cooked);
    return allCooked;
};

export const getCookedById = async (id) => {
    const cooked = await db.select().from(cooked).where(eq(cooked.id, id));
    return cooked;
};

export const getCookedByRecipeId = async (recipeId) => {
    const cooked = await db
        .select()
        .from(cooked)
        .where(eq(cooked.recipeId, recipeId));
    return cooked;
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
    if ((cooked = await getCookedByRecipeId(recipeId))) {
        const updatedCooked = await updateCooked(cooked.id, {
            currentStock: cooked.currentStock + recipe.quantity,
        });
        return updatedCooked;
    } else {
        const newCooked = await createCooked({
            recipeId,
            currentStock: recipe.quantity,
        });
        return newCooked;
    }
};

export const deleteCooked = async (id) => {
    const deletedCooked = await db.delete(cooked).where(eq(cooked.id, id));
    return deletedCooked;
};
