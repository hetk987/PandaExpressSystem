import db from "@/drizzle/src/index";
import { inventory } from "@/drizzle/src/db/schema";

export const getInventory = async () => {
  const allInventory = await db.select().from(inventory);
  return allInventory;
};

export const getInventoryById = async (id) => {
  const inventory = await db
    .select()
    .from(inventory)
    .where(eq(inventory.id, id));
  return inventory;
};

export const createInventory = async (inventory) => {
  const createdInventory = await db.insert(inventory).values(inventory);
  return createdInventory;
};

export const updateInventory = async (id, inventory) => {
  const updatedInventory = await db
    .update(inventory)
    .set(inventory)
    .where(eq(inventory.id, id));
  return updatedInventory;
};

export const deleteInventory = async (id) => {
  const deletedInventory = await db
    .delete(inventory)
    .where(eq(inventory.id, id));
  return deletedInventory;
};
