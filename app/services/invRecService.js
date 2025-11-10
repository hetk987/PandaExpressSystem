import db from "@/drizzle/src/index";
import { getInventoryById } from "@/app/services/inventoryService";
import { invRecJunc } from "@/drizzle/src/db/schema";
import { eq } from "drizzle-orm";

export const getInvRecJuncs = async () => {
    const allInvRecJuncs = await db.select().from(invRecJunc);
    return allInvRecJuncs;
};

export const getInvRecJuncById = async (id) => {
    const invRecJuncItem = await db
        .select()
        .from(invRecJunc)
        .where(eq(invRecJunc.id, id));
    return invRecJuncItem;
};

export const getIngredientsByRecipeId = async (recipeId) => {
    const output = await db
        .select()
        .from(invRecJunc)
        .where(eq(invRecJunc.recipeId, recipeId));
        for (const item of output) {
            item.inventoryName = (await getInventoryById(item.inventoryId))[0].name;
        }
    console.log(output);
    return output;
};

export const createInvRecJunc = async (invRecJuncData) => {
    const [createdInvRecJunc] = await db
        .insert(invRecJunc)
        .values(invRecJuncData)
        .returning();
    return createdInvRecJunc;
};

export const updateInvRecJunc = async (id, invRecJuncData) => {
    const [updatedInvRecJunc] = await db
        .update(invRecJunc)
        .set(invRecJuncData)
        .where(eq(invRecJunc.id, id))
        .returning();
    return updatedInvRecJunc;
};

export const deleteInvRecJunc = async (id) => {
    const deletedInvRecJunc = await db
        .delete(invRecJunc)
        .where(eq(invRecJunc.id, id));
    return deletedInvRecJunc;
};
