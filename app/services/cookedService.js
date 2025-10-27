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

export const deleteCooked = async (id) => {
  const deletedCooked = await db.delete(cooked).where(eq(cooked.id, id));
  return deletedCooked;
};
