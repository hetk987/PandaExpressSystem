import db from "@/drizzle/src/index";
import { inventory } from "@/drizzle/src/db/schema";
import { eq } from "drizzle-orm";

export const getInventory = async () => {
    const allInventory = await db.select().from(inventory);
    return allInventory;
};

export const getInventoryById = async (id) => {
    const inventoryItem = await db
        .select()
        .from(inventory)
        .where(eq(inventory.id, id));
    return inventoryItem;
};

export const createInventory = async (inventory) => {
    const createdInventory = await db.insert(inventory).values(inventory);
    return createdInventory;
};

export const updateInventory = async (id, inventoryItem) => {
    const updatedInventory = await db
        .update(inventory)
        .set(inventoryItem)
        .where(eq(inventory.id, id));
    return updatedInventory;
};

export const deleteInventory = async (id) => {
    const deletedInventory = await db
        .delete(inventory)
        .where(eq(inventory.id, id));
    return deletedInventory;
};

export const consumeInventory = async (inventoryId, quantity) => {
    console.log("CONSUMING INVENTORY");
    console.log(inventoryId);
    console.log(quantity);
    const inventoryItem = await getInventoryById(inventoryId);
    if (!inventoryItem) {
        throw new Error("Inventory not found");
    }
    console.log(inventoryItem, quantity);
    if (inventoryItem[0].currentStock < quantity) {
        throw new Error("Insufficient inventory: " + inventoryItem[0].name + " " + inventoryItem[0].currentStock + " " + quantity);
    }
    console.log("UPDATING INVENTORY");
    const updatedInventory = await updateInventory(inventoryId, {
        ...inventoryItem,
        currentStock: inventoryItem[0].currentStock - quantity,
    });
    return updatedInventory;
};
