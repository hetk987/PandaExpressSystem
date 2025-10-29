import { getEmployees } from "../services/employeesService";

export default async function EmployeesPage() {
  const employees = await getEmployees();
  return (
    <div>
      <h1>Employees</h1>
      <ul>
        {employees.map((employee) => (
          <li key={employee.id}>{employee.name}</li>
        ))}
      </ul>
    </div>
  );
}
