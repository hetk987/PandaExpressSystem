import db from "@/drizzle/src/index";

import { invRecJunc } from "@/drizzle/src/db/schema";
import { eq } from "drizzle-orm";

export const getInvRecJuncs = async () => {
    const allInvRecJuncs = await db.select().from(invRecJunc);
    return allInvRecJuncs;
};

export const getInvRecJuncById = async (id) => {
    const invRecJunc = await db
        .select()
        .from(invRecJunc)
        .where(eq(invRecJunc.id, id));
    return invRecJunc;
};

export const getInvRecJuncByRecipeId = async (recipeId) => {
    console.log("YO YO YO");
    const output = await db
        .select()
        .from(invRecJunc)
        .where(eq(invRecJunc.recipeId, recipeId));
    console.log(output);
    return output;
};

export const createInvRecJunc = async (invRecJunc) => {
    const createdInvRecJunc = await db.insert(invRecJunc).values(invRecJunc);
    return createdInvRecJunc;
};

export const updateInvRecJunc = async (id, invRecJunc) => {
    const updatedInvRecJunc = await db
        .update(invRecJunc)
        .set(invRecJunc)
        .where(eq(invRecJunc.id, id));
    return updatedInvRecJunc;
};

export const deleteInvRecJunc = async (id) => {
    const deletedInvRecJunc = await db
        .delete(invRecJunc)
        .where(eq(invRecJunc.id, id));
    return deletedInvRecJunc;
};
