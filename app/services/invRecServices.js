import db from "@/drizzle/src/index";

import { invRecJunc } from "@/drizzle/src/db/schema";

export const getInvRecJuncs = async () => {
  const invRecJuncs = await db.select().from(invRecJunc);
  return invRecJuncs;
};

export const getInvRecJuncById = async (id) => {
  const invRecJunc = await db
    .select()
    .from(invRecJunc)
    .where(eq(invRecJunc.id, id));
  return invRecJunc;
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
