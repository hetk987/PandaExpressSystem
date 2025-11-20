'use client';

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCaption,
  TableHead,
  TableHeader,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/app/components/ui/button"; 
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

type ReportType = "x" | "z" | null;

type HourlyRow = {
  hour: number;
  netSales: number;
};

type Employee = {
  id?: number;
  name: string;
  salary: number;
  hours: number;
  password: string;
  isEmployed: boolean;
  roleid?: number | null;
};

export default function AdminTabsCard() {
  const [reportDialogOpen, setReportDialogOpen] = React.useState(false);
  const [activeReport, setActiveReport] = React.useState<ReportType>(null);
  const [reportData, setReportData] = React.useState<HourlyRow[] | null>(null);
  const [reportLoading, setReportLoading] = React.useState(false);
  const [reportError, setReportError] = React.useState<string | null>(null);

  const [employees, setEmployees] = React.useState<Employee[]>([]);
  const [empDialogOpen, setEmpDialogOpen] = React.useState(false);
  const [selectedEmployee, setSelectedEmployee] = React.useState<Employee | null>(null);
  const [empLoading, setEmpLoading] = React.useState(false);
  const [empError, setEmpError] = React.useState<string | null>(null);

  async function fetchXReport() {
    try {
      setReportLoading(true);
      setReportError(null);
      setReportData(null);

      const res = await fetch(`/api/reports/x-report?startHour=0&endHour=23`);

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || "Failed to fetch X-report");
      }

      const data = await res.json();

      const normalized: HourlyRow[] = (data ?? []).map((row: any) => ({
        hour: Number(row.hour),
        netSales: Number(row.netSales) || 0,
      }));

      setReportData(normalized);
    } catch (err: any) {
      setReportError(err.message ?? "Unknown error");
    } finally {
      setReportLoading(false);
    }
  }

  async function fetchZReport() {
    try {
      setReportLoading(true);
      setReportError(null);
      setReportData(null);

      // TODO: implement this route on backend
      const res = await fetch(`/api/reports/z-report`);

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || "Failed to fetch Z-report");
      }

      const data = await res.json();
      const normalized: HourlyRow[] = (data ?? []).map((row: any) => ({
        hour: Number(row.hour),
        netSales: Number(row.netSales) || 0,
      }));
      setReportData(normalized);
    } catch (err: any) {
      setReportError(err.message ?? "Unknown error");
    } finally {
      setReportLoading(false);
    }
  }

  function handleOpenXReport() {
    setActiveReport("x");
    setReportDialogOpen(true);
    void fetchXReport();
  }

  function handleOpenZReport() {
    setActiveReport("z");
    setReportDialogOpen(true);
    void fetchZReport();
  }

  async function fetchEmployees() {
    try {
      setEmpLoading(true);
      setEmpError(null);

      const res = await fetch("/api/employee");
      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || "Failed to fetch employees");
      }

      const data = await res.json();
      setEmployees(data ?? []);
    } catch (err: any) {
      setEmpError(err.message ?? "Unknown error");
    } finally {
      setEmpLoading(false);
    }
  }

  React.useEffect(() => {
    // Load employees on mount
    void fetchEmployees();
  }, []);

  function openNewEmployeeDialog() {
    setSelectedEmployee({
      name: "",
      salary: 0,
      hours: 0,
      password: "",
      isEmployed: true,
      roleid: null,
    });
    setEmpError(null);
    setEmpDialogOpen(true);
  }

  function openEditEmployeeDialog(emp: Employee) {
    setSelectedEmployee({ ...emp });
    setEmpError(null);
    setEmpDialogOpen(true);
  }

  function updateSelected<K extends keyof Employee>(key: K, value: Employee[K]) {
    setSelectedEmployee((prev) =>
      prev ? { ...prev, [key]: value } : prev
    );
  }

  async function saveEmployee() {
    if (!selectedEmployee) return;

    try {
      setEmpLoading(true);
      setEmpError(null);

      const { id, ...payload } = selectedEmployee;
      const isNew = id === undefined || id === null;

      const res = await fetch(
        isNew ? "/api/employee" : `/api/employee/${id}`,
        {
          method: isNew ? "POST" : "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || "Failed to save employee");
      }

      await fetchEmployees();
      setEmpDialogOpen(false);
    } catch (err: any) {
      setEmpError(err.message ?? "Unknown error");
    } finally {
      setEmpLoading(false);
    }
  }

  async function deleteEmployee() {
    if (!selectedEmployee || selectedEmployee.id == null) return;
    if (!confirm(`Delete employee "${selectedEmployee.name}"?`)) return;

    try {
      setEmpLoading(true);
      setEmpError(null);

      const res = await fetch(`/api/employee/${selectedEmployee.id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || "Failed to delete employee");
      }

      await fetchEmployees();
      setEmpDialogOpen(false);
    } catch (err: any) {
      setEmpError(err.message ?? "Unknown error");
    } finally {
      setEmpLoading(false);
    }
  }


  return (
    <div className="min-h-screen w-[190%] bg-background flex items-start justify-center p-6 md:p-10">
      <Card className="w-full max-w-[1600px] rounded-2xl shadow-lg">
        <CardHeader className="pb-2">
          <CardTitle className="text-2xl">Manager Dashboard</CardTitle>
        </CardHeader>
        <Separator />
        <CardContent className="pt-6">
          <Tabs defaultValue="reports" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="reports">Reports</TabsTrigger>
              <TabsTrigger value="employees">Manage Employees</TabsTrigger>
              <TabsTrigger value="inventory">Buy Inventory</TabsTrigger>
              <TabsTrigger value="recipes">Create Recipes</TabsTrigger>
            </TabsList>

            <TabsContent value="reports" className="mt-6">
              <Table aria-label="Reports table">
                <TableCaption className="sr-only">Reports</TableCaption>
                <TableHeader>
                  <TableRow className="space-x-2">
                    <TableHead className="border-none">
                      <Button onClick={handleOpenXReport}>X-Report</Button>
                    </TableHead>
                    <TableHead className="border-none">
                      <Button onClick={handleOpenZReport}>Z-Report</Button>
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>{/* summary rows later */}</TableBody>
              </Table>

              {/* X/Z REPORT DIALOG */}
              <Dialog open={reportDialogOpen} onOpenChange={setReportDialogOpen}>
                <DialogContent className="max-w-2xl max-h-[70vh] overflow-auto">
                  <DialogHeader>
                    <DialogTitle>
                      {activeReport === "x"
                        ? "X-Report (Hourly Sales)"
                        : activeReport === "z"
                        ? "Z-Report (End-of-Day Summary)"
                        : "Report"}
                    </DialogTitle>
                    <DialogDescription>
                      {activeReport === "x"
                        ? "Sales data for the current day by hour."
                        : activeReport === "z"
                        ? "End-of-day totals and summary."
                        : "Report details."}
                    </DialogDescription>
                  </DialogHeader>

                  <div className="mt-4 space-y-4">
                    {reportLoading && (
                      <p className="text-sm text-muted-foreground">
                        Loading report…
                      </p>
                    )}

                    {reportError && (
                      <p className="text-sm text-red-500">{reportError}</p>
                    )}

                    {!reportLoading &&
                      !reportError &&
                      reportData &&
                      reportData.length > 0 && (
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Hour</TableHead>
                              <TableHead className="text-right">
                                Net Sales ($)
                              </TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {reportData.map((row) => (
                              <TableRow key={row.hour}>
                                <TableCell>{row.hour}:00</TableCell>
                                <TableCell className="text-right">
                                  {row.netSales.toFixed(2)}
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      )}

                    {!reportLoading &&
                      !reportError &&
                      reportData &&
                      reportData.length === 0 && (
                        <p className="text-sm text-muted-foreground">
                          No data for this report.
                        </p>
                      )}

                    {!reportLoading &&
                      !reportError &&
                      !reportData &&
                      activeReport && (
                        <p className="text-sm text-muted-foreground">
                          No data returned for this report.
                        </p>
                      )}
                  </div>
                </DialogContent>
              </Dialog>
            </TabsContent>

            <TabsContent value="employees" className="mt-6 space-y-4">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-semibold">Employees</h2>
                <Button onClick={openNewEmployeeDialog}>Add Employee</Button>
              </div>

              {empLoading && employees.length === 0 && (
                <p className="text-sm text-muted-foreground">
                  Loading employees…
                </p>
              )}

              {empError && (
                <p className="text-sm text-red-500">{empError}</p>
              )}

              <Table aria-label="Employees table">
                <TableCaption className="sr-only">
                  Manage Employees
                </TableCaption>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Salary</TableHead>
                    <TableHead>Hours</TableHead>
                    <TableHead>Employed</TableHead>
                    <TableHead>Role ID</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {employees.length === 0 && !empLoading && (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center text-sm">
                        No employees found.
                      </TableCell>
                    </TableRow>
                  )}

                  {employees.map((emp) => (
                    <TableRow key={emp.id}>
                      <TableCell>{emp.name}</TableCell>
                      <TableCell>{emp.salary}</TableCell>
                      <TableCell>{emp.hours}</TableCell>
                      <TableCell>
                        {emp.isEmployed ? "Yes" : "No"}
                      </TableCell>
                      <TableCell>{emp.roleid ?? "-"}</TableCell>
                      <TableCell className="text-right">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => openEditEmployeeDialog(emp)}
                        >
                          Edit
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              <Dialog open={empDialogOpen} onOpenChange={setEmpDialogOpen}>
                <DialogContent className="max-w-xl">
                  <DialogHeader>
                    <DialogTitle>
                      {selectedEmployee?.id
                        ? `Edit Employee #${selectedEmployee.id}`
                        : "Add Employee"}
                    </DialogTitle>
                    <DialogDescription>
                      Update employee details such as salary, hours, and
                      employment status.
                    </DialogDescription>
                  </DialogHeader>

                  {selectedEmployee && (
                    <div className="space-y-4 mt-4">
                      {empError && (
                        <p className="text-sm text-red-500">{empError}</p>
                      )}

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <Label htmlFor="emp-name">Name</Label>
                          <Input
                            id="emp-name"
                            value={selectedEmployee.name}
                            onChange={(e) =>
                              updateSelected("name", e.target.value)
                            }
                          />
                        </div>

                        <div className="space-y-1">
                          <Label htmlFor="emp-salary">Salary</Label>
                          <Input
                            id="emp-salary"
                            type="number"
                            value={selectedEmployee.salary}
                            onChange={(e) =>
                              updateSelected(
                                "salary",
                                Number(e.target.value) || 0
                              )
                            }
                          />
                        </div>

                        <div className="space-y-1">
                          <Label htmlFor="emp-hours">Hours</Label>
                          <Input
                            id="emp-hours"
                            type="number"
                            value={selectedEmployee.hours}
                            onChange={(e) =>
                              updateSelected(
                                "hours",
                                Number(e.target.value) || 0
                              )
                            }
                          />
                        </div>

                        <div className="space-y-1">
                          <Label htmlFor="emp-roleid">Role ID</Label>
                          <Input
                            id="emp-roleid"
                            type="number"
                            value={selectedEmployee.roleid ?? ""}
                            onChange={(e) =>
                              updateSelected(
                                "roleid",
                                e.target.value === ""
                                  ? null
                                  : Number(e.target.value) || 0
                              )
                            }
                          />
                        </div>

                        <div className="space-y-1 md:col-span-2">
                          <Label htmlFor="emp-password">
                            Password (for demo only)
                          </Label>
                          <Input
                            id="emp-password"
                            type="text"
                            value={selectedEmployee.password}
                            onChange={(e) =>
                              updateSelected("password", e.target.value)
                            }
                          />
                        </div>

                        <div className="flex items-center space-x-2 md:col-span-2">
                          <Switch
                            id="emp-employed"
                            checked={selectedEmployee.isEmployed}
                            onCheckedChange={(checked) =>
                              updateSelected("isEmployed", checked)
                            }
                          />
                          <Label htmlFor="emp-employed">
                            Currently employed
                          </Label>
                        </div>
                      </div>

                      <div className="flex justify-between items-center pt-4">
                        {selectedEmployee.id && (
                          <Button
                            type="button"
                            variant="destructive"
                            onClick={deleteEmployee}
                            disabled={empLoading}
                          >
                            Delete
                          </Button>
                        )}

                        <div className="ml-auto flex gap-2">
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => setEmpDialogOpen(false)}
                            disabled={empLoading}
                          >
                            Cancel
                          </Button>
                          <Button
                            type="button"
                            onClick={saveEmployee}
                            disabled={empLoading}
                          >
                            {empLoading ? "Saving..." : "Save"}
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}
                </DialogContent>
              </Dialog>
            </TabsContent>

            <TabsContent value="inventory" className="mt-6">
              <Table aria-label="Inventory table">
                <TableCaption className="sr-only">Buy Inventory</TableCaption>
                <TableHeader>
                  <TableRow>{/* TODO: columns */}</TableRow>
                </TableHeader>
                <TableBody>{/* TODO: rows */}</TableBody>
              </Table>
            </TabsContent>

            <TabsContent value="recipes" className="mt-6">
              <Table aria-label="Recipes table">
                <TableCaption className="sr-only">Create Recipes</TableCaption>
                <TableHeader>
                  <TableRow>{/* TODO: columns */}</TableRow>
                </TableHeader>
                <TableBody>{/* TODO: rows */}</TableBody>
              </Table>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
