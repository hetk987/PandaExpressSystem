import { pgTable, text, integer, date, check, boolean, foreignKey, real, pgEnum, jsonb } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"
import type { OrderInfo } from "@/lib/types"

export const recipeType = pgEnum("recipe_type", ['Side', 'Entree', 'Drink'])


export const roles = pgTable("roles", {
    name: text().notNull(),
    canDiscount: boolean("can_discount").notNull(),
    canRestock: boolean("can_restock").notNull(),
    id: integer().primaryKey().notNull(),
    canEditEmployees: boolean("can_edit_employees").notNull(),
}, (table) => [
    check("roles_can_discount_check", sql`can_discount = ANY (ARRAY[true, false])`),
    check("roles_can_restock_check", sql`can_restock = ANY (ARRAY[true, false])`),
    check("roles_can_edit_employees_check", sql`can_edit_employees = ANY (ARRAY[true, false])`),
]);

export const employees = pgTable("employees", {
    name: text().notNull(),
    salary: real().notNull(),
    hours: integer().notNull(),
    password: text().notNull(),
    isEmployed: boolean("is_employed").notNull(),
    id: integer().primaryKey().notNull(),
    roleId: integer("role_id").notNull(),
}, (table) => [
    foreignKey({
        columns: [table.roleId],
        foreignColumns: [roles.id],
        name: "employees_role_id_fkey"
    }),
    check("employees_is_employed_check", sql`is_employed = ANY (ARRAY[true, false])`),
]);

export const mealTypes = pgTable("meal_types", {
    name: text("type_name").primaryKey().notNull(),
    sides: integer("sides").notNull(),
    entrees: integer("entrees").notNull(),
    drinks: integer("drinks").notNull(),
    price: real("price").notNull(),
    image: text("image_file_path"),
});

export const orders = pgTable("orders", {
    tax: real().notNull(),
    totalCost: real("total_cost").notNull(),
    id: integer().primaryKey().notNull(),
    orderTime: text("order_time").notNull(),
    cashierId: integer("cashier_id").notNull(),
    orderInfo: jsonb("order_info").$type<OrderInfo>(),
    isCompleted: boolean("is_completed").notNull(),
}, (table) => [
    foreignKey({
        columns: [table.cashierId],
        foreignColumns: [employees.id],
        name: "orders_cashier_id_fkey"
    }),
]);

export const inventory = pgTable("inventory", {
    name: text().notNull(),
    id: integer().primaryKey().notNull(),
    batchPurchaseCost: real("batch_purchase_cost").notNull(),
    currentStock: integer("current_stock").notNull(),
    estimatedUsedPerDay: integer("estimated_used_per_day").notNull(),
});

export const expenses = pgTable("expenses", {
    cost: real().notNull(),
    id: integer().primaryKey().notNull(),
    itemId: integer("item_id").notNull(),
    expenseTime: text("expense_time").notNull(),
}, (table) => [
    foreignKey({
        columns: [table.itemId],
        foreignColumns: [inventory.id],
        name: "expenses_item_id_fkey"
    }),
]);

export const cooked = pgTable("cooked", {
    id: integer().primaryKey().notNull(),
    recipeId: integer("recipe_id").notNull(),
    currentStock: integer("current_stock").notNull(),
}, (table) => [
    foreignKey({
        columns: [table.recipeId],
        foreignColumns: [recipes.id],
        name: "cooked_recipe_id_fkey"
    }),
]);

export const invRecJunc = pgTable("inv_rec_junc", {
    id: integer().primaryKey().notNull(),
    inventoryId: integer("inventory_id").notNull(),
    recipeId: integer("recipe_id").notNull(),
    inventoryQuantity: integer("inventory_quantity").notNull(),
}, (table) => [
    foreignKey({
        columns: [table.inventoryId],
        foreignColumns: [inventory.id],
        name: "inv_rec_junc_inventory_id_fkey"
    }),
    foreignKey({
        columns: [table.recipeId],
        foreignColumns: [recipes.id],
        name: "inv_rec_junc_recipe_id_fkey"
    }),
]);

export const recOrderJunc = pgTable("rec_order_junc", {
    quantity: integer().notNull(),
    id: integer().primaryKey().notNull(),
    recipeId: integer("recipe_id").notNull(),
    orderId: integer("order_id").notNull(),
}, (table) => [
    foreignKey({
        columns: [table.recipeId],
        foreignColumns: [recipes.id],
        name: "rec_order_junc_recipe_id_fkey"
    }),
    foreignKey({
        columns: [table.orderId],
        foreignColumns: [orders.id],
        name: "rec_order_junc_order_id_fkey"
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
