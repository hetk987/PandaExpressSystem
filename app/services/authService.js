import db from "@/drizzle/src/index";
import { employees } from "@/drizzle/src/db/schema";
import { eq } from "drizzle-orm";

export const verifyLoginPassword = async (password) => {
    try {
        const result = await db
            .select({
                id: employees.id,
                name: employees.name,
                roleId: employees.roleId,
                isEmployed: employees.isEmployed,
                password: employees.password,
            })
            .from(employees)
            .where(eq(employees.password, password.trim()));

        console.log("Login query result:", result);

        if (!result || result.length === 0) {
            return null;
        }

        // Optional: ensure isEmployed is actually true in JS
        const user = result.find((u) => u.isEmployed === true || u.isEmployed === "t");
        if (!user) return null;

        return { id: user.id, name: user.name, roleId: user.roleId, isEmployed: user.isEmployed };
    } catch (error) {
        console.error("Database login error:", error);
        throw new Error("Failed to verify employee credentials");
    }
};
