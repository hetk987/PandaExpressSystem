import { pgTable, foreignKey, real, integer, text, boolean, jsonb, check, pgEnum } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"
import { OrderInfo } from "@/lib/types";

export const recipeType = pgEnum("recipe_type", ['Side', 'Entree', 'Drink'])


export const roles = pgTable("roles", {
    name: text().notNull(),
    canDiscount: boolean("canDiscount").notNull(),
    canRestock: boolean("canRestock").notNull(),
    id: integer().primaryKey().notNull(),
    canEditEmployees: boolean("canEditEmployees").notNull(),
}, (table) => [
    check("roles_canDiscount_check", sql`canDiscount = ANY (ARRAY[true, false])`),
    check("roles_canRestock_check", sql`canRestock = ANY (ARRAY[true, false])`),
    check("roles_canEditEmployees_check", sql`canEditEmployees = ANY (ARRAY[true, false])`),
]);

export const employees = pgTable("employees", {
    name: text().notNull(),
    salary: real().notNull(),
    hours: integer().notNull(),
    password: text().notNull(),
    isEmployed: boolean("isEmployed").notNull(),
    id: integer().primaryKey().notNull(),
    roleId: integer("roleId").notNull(),
}, (table) => [
    foreignKey({
        columns: [table.roleId],
        foreignColumns: [roles.id],
        name: "employees_roleId_fkey"
    }),
    check("employees_isEmployed_check", sql`isEmployed = ANY (ARRAY[true, false])`),
]);

export const mealTypes = pgTable("meal_types", {
    name: text("typeName").primaryKey().notNull(),
    sides: integer("sides").notNull(),
    entrees: integer("entrees").notNull(),
    drinks: integer("drinks").notNull(),
    price: real("price").notNull(),
    image: text("imageFilePath"),
});

export const orders = pgTable("orders", {
    tax: real().notNull(),
    totalCost: real("totalCost").notNull(),
    id: integer().primaryKey().notNull(),
    orderTime: text("orderTime").notNull(),
    cashierId: integer("cashierId").notNull(),
    orderInfo: jsonb("orderInfo").$type<OrderInfo>(),
    isCompleted: boolean("isCompleted").notNull(),
}, (table) => [
    foreignKey({
        columns: [table.cashierId],
        foreignColumns: [employees.id],
        name: "orders_cashierId_fkey"
    }),
]);

export const inventory = pgTable("inventory", {
    name: text().notNull(),
    id: integer().primaryKey().notNull(),
    batchPurchaseCost: real("batchPurchaseCost").notNull(),
    currentStock: integer("currentStock").notNull(),
    estimatedUsedPerDay: integer("estimatedUsedPerDay").notNull(),
});

export const expenses = pgTable("expenses", {
    cost: real().notNull(),
    id: integer().primaryKey().notNull(),
    itemId: integer("itemId").notNull(),
    expenseTime: text("expenseTime").notNull(),
}, (table) => [
    foreignKey({
        columns: [table.itemId],
        foreignColumns: [inventory.id],
        name: "expenses_itemId_fkey"
    }),
]);

export const cooked = pgTable("cooked", {
    id: integer().primaryKey().notNull(),
    recipeId: integer("recipeId").notNull(),
    currentStock: integer("currentStock").notNull(),
}, (table) => [
    foreignKey({
        columns: [table.recipeId],
        foreignColumns: [recipes.id],
        name: "cooked_recipeId_fkey"
    }),
]);

export const invRecJunc = pgTable("inv_rec_junc", {
    id: integer().primaryKey().notNull(),
    inventoryId: integer("inventoryId").notNull(),
    recipeId: integer("recipeId").notNull(),
    inventoryQuantity: integer("inventoryQuantity").notNull(),
}, (table) => [
    foreignKey({
        columns: [table.inventoryId],
        foreignColumns: [inventory.id],
        name: "inv_rec_junc_inventoryId_fkey"
    }),
    foreignKey({
        columns: [table.recipeId],
        foreignColumns: [recipes.id],
        name: "inv_rec_junc_recipeId_fkey"
    }),
]);

export const recOrderJunc = pgTable("rec_order_junc", {
    quantity: integer().notNull(),
    id: integer().primaryKey().notNull(),
    recipeId: integer("recipeId").notNull(),
    orderId: integer("orderId").notNull(),
}, (table) => [
    foreignKey({
        columns: [table.recipeId],
        foreignColumns: [recipes.id],
        name: "rec_order_junc_recipeId_fkey"
    }),
    foreignKey({
        columns: [table.orderId],
        foreignColumns: [orders.id],
        name: "rec_order_junc_orderId_fkey"
    }),
]);

export const recipes = pgTable("recipes", {
    name: text().notNull(),
    image: text(),
    id: integer().primaryKey().notNull(),
    pricePerServing: real("price_per_serving").notNull(),
    ordersPerBatch: integer("orders_per_batch").notNull(),
    type: recipeType(),
});
