import db from "@/drizzle/src/index";
import { recOrderJunc } from "@/drizzle/src/db/schema";

export const getRecOrderJuncs = async () => {
  const allRecOrderJuncs = await db.select().from(recOrderJunc);
  return allRecOrderJuncs;
};

export const getRecOrderJuncById = async (id) => {
  const recOrderJunc = await db
    .select()
    .from(recOrderJunc)
    .where(eq(recOrderJunc.id, id));
  return recOrderJunc;
};

export const createRecOrderJunc = async (recOrderJunc) => {
  const createdRecOrderJunc = await db
    .insert(recOrderJunc)
    .values(recOrderJunc);
  return createdRecOrderJunc;
};

export const updateRecOrderJunc = async (id, recOrderJunc) => {
  const updatedRecOrderJunc = await db
    .update(recOrderJunc)
    .set(recOrderJunc)
    .where(eq(recOrderJunc.id, id));
  return updatedRecOrderJunc;
};

export const deleteRecOrderJunc = async (id) => {
  const deletedRecOrderJunc = await db
    .delete(recOrderJunc)
    .where(eq(recOrderJunc.id, id));
  return deletedRecOrderJunc;
};
