import db from "@/drizzle/src/index";
import { employees } from "@/drizzle/src/db/schema";

export const getEmployees = async () => {
  const employees = await db.select().from(employees);
  return employees;
};

export const getEmployeeById = async (id) => {
  const employee = await db
    .select()
    .from(employees)
    .where(eq(employees.id, id));
  return employee;
};

export const createEmployee = async (employee) => {
  const createdEmployee = await db.insert(employees).values(employee);
  return createdEmployee;
};

export const updateEmployee = async (id, employee) => {
  const updatedEmployee = await db
    .update(employees)
    .set(employee)
    .where(eq(employees.id, id));
  return updatedEmployee;
};
