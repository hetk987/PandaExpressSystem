import db from "@/drizzle/src/index";
import { employees } from "@/drizzle/src/db/schema";
import { eq } from "drizzle-orm";

export const verifyLoginPassword = async (password) => {
    const cleanedPassword = password.trim();
    try {
        console.log("Checking employee login for password:", cleanedPassword);

        const result = await db
            .select({
                id: employees.id,
                name: employees.name,
                roleId: employees.roleId,
                isEmployed: employees.isEmployed,
                password: employees.password,
            })
            .from(employees)
            .where(eq(employees.password, cleanedPassword));

        console.log("Query result:", result);

        if (!result || result.length === 0) {
            console.log("No matching employee found for password:", cleanedPassword);
            return null;
        }

        const user = result.find((u) => u.isEmployed === true);
        if (!user) {
            console.log("Employee exists but not employed:", result[0]);
            return null;
        }

        console.log("Authenticated employee:", user);

        return {
            id: user.id,
            name: user.name,
            roleId: user.roleId,
            isEmployed: user.isEmployed,
        };
    } catch (error) {
        console.error("Database login error:", error);
        throw new Error("Failed to verify employee credentials");
    }
};
