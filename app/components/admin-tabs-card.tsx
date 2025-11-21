"use client";

import React from "react";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/app/components/ui/card";
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/app/components/ui/tabs";
import {
    Table,
    TableBody,
    TableCaption,
    TableHead,
    TableHeader,
    TableRow,
    TableCell,
} from "@/app/components/ui/table";
import { Separator } from "@/app/components/ui/separator";
import { Button } from "@/app/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/app/components/ui/dialog";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import { Switch } from "@/app/components/ui/switch";
import { Employee, Recipe } from "@/lib/types";

type ReportType = "x" | "z" | null;

type HourlyRow = {
    hour: number;
    netSales: number;
};

// type Employee = {
//     id?: number;
//     name: string;
//     salary: number;
//     hours: number;
//     password: string;
//     isEmployed: boolean;
//     roleid?: number | null;
// };

// type InventoryItem = {
//     id?: number;
//     name: string;
//     batchPurchaseCost: number;
//     currentStock: number;
//     estimatedUsedPerDay: number;
// };

// type Recipe = {
//     id?: number;
//     name: string;
//     pricePerServing: number;
//     ordersPerBatch: number;
//     type?: "Side" | "Entree" | "Drink" | null;
//     image?: string | null;
// };

// type Ingredient = {
//     id?: number;
//     inventoryId: number;
//     recipeId?: number;
//     inventoryQuantity: number;
//     inventoryName?: string;
// };

export default function AdminTabsCard() {
    const [reportDialogOpen, setReportDialogOpen] = React.useState(false);
    const [activeReport, setActiveReport] = React.useState<ReportType>(null);
    const [reportData, setReportData] = React.useState<HourlyRow[] | null>(
        null
    );
    const [reportLoading, setReportLoading] = React.useState(false);
    const [reportError, setReportError] = React.useState<string | null>(null);

    const [employees, setEmployees] = React.useState<Employee[]>([]);
    const [empDialogOpen, setEmpDialogOpen] = React.useState(false);
    const [selectedEmployee, setSelectedEmployee] =
        React.useState<Employee | null>(null);
    const [empLoading, setEmpLoading] = React.useState(false);
    const [empError, setEmpError] = React.useState<string | null>(null);

    const [inventory, setInventory] = React.useState<InventoryItem[]>([]);
    const [invDialogOpen, setInvDialogOpen] = React.useState(false);
    const [restockDialogOpen, setRestockDialogOpen] = React.useState(false);
    const [selectedInventory, setSelectedInventory] =
        React.useState<InventoryItem | null>(null);
    const [restockQuantity, setRestockQuantity] = React.useState<number>(0);
    const [invLoading, setInvLoading] = React.useState(false);
    const [invError, setInvError] = React.useState<string | null>(null);

    const [recipes, setRecipes] = React.useState<Recipe[]>([]);
    const [recDialogOpen, setRecDialogOpen] = React.useState(false);
    const [selectedRecipe, setSelectedRecipe] = React.useState<Recipe | null>(
        null
    );
    const [ingredients, setIngredients] = React.useState<Ingredient[]>([]);
    const [newIngredientId, setNewIngredientId] = React.useState<number>(0);
    const [newIngredientQty, setNewIngredientQty] = React.useState<number>(0);
    const [recLoading, setRecLoading] = React.useState(false);
    const [recError, setRecError] = React.useState<string | null>(null);

    async function fetchXReport() {
        try {
            setReportLoading(true);
            setReportError(null);
            setReportData(null);

            const res = await fetch(
                `/api/reports/x-report?startHour=0&endHour=23`
            );

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
        void fetchEmployees();
        void fetchInventory();
        void fetchRecipes();
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

    function updateSelected<K extends keyof Employee>(
        key: K,
        value: Employee[K]
    ) {
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

    async function fetchInventory() {
        try {
            setInvLoading(true);
            setInvError(null);

            const res = await fetch("/api/inventory");
            if (!res.ok) {
                const text = await res.text();
                throw new Error(text || "Failed to fetch inventory");
            }

            const data = await res.json();
            setInventory(data ?? []);
        } catch (err: any) {
            setInvError(err.message ?? "Unknown error");
        } finally {
            setInvLoading(false);
        }
    }

    function openNewInventoryDialog() {
        setSelectedInventory({
            name: "",
            batchPurchaseCost: 0,
            currentStock: 0,
            estimatedUsedPerDay: 0,
        });
        setInvError(null);
        setInvDialogOpen(true);
    }

    function openEditInventoryDialog(inv: InventoryItem) {
        setSelectedInventory({ ...inv });
        setInvError(null);
        setInvDialogOpen(true);
    }

    function openRestockDialog(inv: InventoryItem) {
        setSelectedInventory({ ...inv });
        setRestockQuantity(0);
        setInvError(null);
        setRestockDialogOpen(true);
    }

    function updateSelectedInventory<K extends keyof InventoryItem>(
        key: K,
        value: InventoryItem[K]
    ) {
        setSelectedInventory((prev) =>
            prev ? { ...prev, [key]: value } : prev
        );
    }

    async function saveInventory() {
        if (!selectedInventory) return;

        try {
            setInvLoading(true);
            setInvError(null);

            const { id, ...payload } = selectedInventory;
            const isNew = id === undefined || id === null;

            const res = await fetch(
                isNew ? "/api/inventory" : `/api/inventory/${id}`,
                {
                    method: isNew ? "POST" : "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(payload),
                }
            );

            if (!res.ok) {
                const text = await res.text();
                throw new Error(text || "Failed to save inventory item");
            }

            await fetchInventory();
            setInvDialogOpen(false);
        } catch (err: any) {
            setInvError(err.message ?? "Unknown error");
        } finally {
            setInvLoading(false);
        }
    }

    async function restockInventory() {
        if (!selectedInventory || selectedInventory.id == null) return;
        if (restockQuantity <= 0) {
            setInvError("Restock quantity must be greater than 0");
            return;
        }

        try {
            setInvLoading(true);
            setInvError(null);

            // Update inventory stock
            const newStock = selectedInventory.currentStock + restockQuantity;
            const res = await fetch(`/api/inventory/${selectedInventory.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ currentStock: newStock }),
            });

            if (!res.ok) {
                const text = await res.text();
                throw new Error(text || "Failed to restock inventory");
            }

            // Create expense record
            const expenseRes = await fetch("/api/expenses", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    cost: selectedInventory.batchPurchaseCost,
                    itemId: selectedInventory.id,
                    expenseTime: new Date().toISOString(),
                }),
            });

            if (!expenseRes.ok) {
                console.warn("Failed to create expense record");
            }

            await fetchInventory();
            setRestockDialogOpen(false);
        } catch (err: any) {
            setInvError(err.message ?? "Unknown error");
        } finally {
            setInvLoading(false);
        }
    }

    async function deleteInventory() {
        if (!selectedInventory || selectedInventory.id == null) return;
        if (!confirm(`Delete inventory item "${selectedInventory.name}"?`))
            return;

        try {
            setInvLoading(true);
            setInvError(null);

            const res = await fetch(`/api/inventory/${selectedInventory.id}`, {
                method: "DELETE",
            });

            if (!res.ok) {
                const text = await res.text();
                throw new Error(text || "Failed to delete inventory item");
            }

            await fetchInventory();
            setInvDialogOpen(false);
        } catch (err: any) {
            setInvError(err.message ?? "Unknown error");
        } finally {
            setInvLoading(false);
        }
    }

    async function fetchRecipes() {
        try {
            setRecLoading(true);
            setRecError(null);

            const res = await fetch("/api/recipes");
            if (!res.ok) {
                const text = await res.text();
                throw new Error(text || "Failed to fetch recipes");
            }

            const data = await res.json();
            setRecipes(data ?? []);
        } catch (err: any) {
            setRecError(err.message ?? "Unknown error");
        } finally {
            setRecLoading(false);
        }
    }

    async function openNewRecipeDialog() {
        setSelectedRecipe({
            name: "",
            pricePerServing: 0,
            ordersPerBatch: 1,
            type: null,
            image: null,
        });
        setIngredients([]);
        setRecError(null);
        setRecDialogOpen(true);
    }

    async function openEditRecipeDialog(rec: Recipe) {
        setSelectedRecipe({ ...rec });
        setRecError(null);

        // Fetch ingredients for this recipe
        if (rec.id) {
            try {
                setRecLoading(true);
                const res = await fetch(`/api/inv-rec-junc/recipe/${rec.id}`);
                if (res.ok) {
                    const data = await res.json();
                    setIngredients(data ?? []);
                } else {
                    setIngredients([]);
                }
            } catch (err) {
                console.error("Failed to fetch ingredients:", err);
                setIngredients([]);
            } finally {
                setRecLoading(false);
            }
        } else {
            setIngredients([]);
        }

        setRecDialogOpen(true);
    }

    function updateSelectedRecipe<K extends keyof Recipe>(
        key: K,
        value: Recipe[K]
    ) {
        setSelectedRecipe((prev) => (prev ? { ...prev, [key]: value } : prev));
    }

    async function addIngredient() {
        if (newIngredientId === 0 || newIngredientQty <= 0) {
            setRecError(
                "Please select an inventory item and enter a valid quantity"
            );
            return;
        }

        // Check if ingredient already exists
        if (ingredients.some((ing) => ing.inventoryId === newIngredientId)) {
            setRecError("This ingredient is already added");
            return;
        }

        // Find inventory name
        const invItem = inventory.find((inv) => inv.id === newIngredientId);
        const newIngredient: Ingredient = {
            inventoryId: newIngredientId,
            inventoryQuantity: newIngredientQty,
            inventoryName: invItem?.name ?? "Unknown",
        };

        setIngredients([...ingredients, newIngredient]);
        setNewIngredientId(0);
        setNewIngredientQty(0);
        setRecError(null);
    }

    async function removeIngredient(index: number) {
        const ingredient = ingredients[index];

        // If it has an id, delete from database
        if (ingredient.id && selectedRecipe?.id) {
            try {
                const res = await fetch(`/api/inv-rec-junc/${ingredient.id}`, {
                    method: "DELETE",
                });
                if (!res.ok) {
                    console.error("Failed to delete ingredient from database");
                }
            } catch (err) {
                console.error("Error deleting ingredient:", err);
            }
        }

        // Remove from local state
        setIngredients(ingredients.filter((_, i) => i !== index));
    }

    async function saveRecipe() {
        if (!selectedRecipe) return;

        try {
            setRecLoading(true);
            setRecError(null);

            const { id, ...payload } = selectedRecipe;
            const isNew = id === undefined || id === null;

            // Save recipe
            const res = await fetch(
                isNew ? "/api/recipes" : `/api/recipes/${id}`,
                {
                    method: isNew ? "POST" : "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(payload),
                }
            );

            if (!res.ok) {
                const text = await res.text();
                throw new Error(text || "Failed to save recipe");
            }

            const savedRecipe = await res.json();
            const recipeId = savedRecipe.id;

            // Save ingredients
            for (const ingredient of ingredients) {
                if (!ingredient.id) {
                    // New ingredient
                    await fetch("/api/inv-rec-junc", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                            inventoryId: ingredient.inventoryId,
                            recipeId: recipeId,
                            inventoryQuantity: ingredient.inventoryQuantity,
                        }),
                    });
                }
            }

            await fetchRecipes();
            setRecDialogOpen(false);
        } catch (err: any) {
            setRecError(err.message ?? "Unknown error");
        } finally {
            setRecLoading(false);
        }
    }

    async function deleteRecipe() {
        if (!selectedRecipe || selectedRecipe.id == null) return;
        if (!confirm(`Delete recipe "${selectedRecipe.name}"?`)) return;

        try {
            setRecLoading(true);
            setRecError(null);

            const res = await fetch(`/api/recipes/${selectedRecipe.id}`, {
                method: "DELETE",
            });

            if (!res.ok) {
                const text = await res.text();
                throw new Error(text || "Failed to delete recipe");
            }

            await fetchRecipes();
            setRecDialogOpen(false);
        } catch (err: any) {
            setRecError(err.message ?? "Unknown error");
        } finally {
            setRecLoading(false);
        }
    }

    return (
        <Card className="w-full rounded-lg shadow-md border-border">
            <CardHeader className="pb-3">
                <CardTitle className="text-2xl font-semibold">
                    Dashboard
                </CardTitle>
            </CardHeader>
            <Separator />
            <CardContent className="pt-6">
                <Tabs defaultValue="reports" className="w-full">
                    <TabsList className="grid w-full grid-cols-4 bg-secondary/50">
                        <TabsTrigger value="reports">Reports</TabsTrigger>
                        <TabsTrigger value="employees">
                            Manage Employees
                        </TabsTrigger>
                        <TabsTrigger value="inventory">
                            Buy Inventory
                        </TabsTrigger>
                        <TabsTrigger value="recipes">
                            Create Recipes
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="reports" className="mt-6">
                        <Table aria-label="Reports table">
                            <TableCaption className="sr-only">
                                Reports
                            </TableCaption>
                            <TableHeader>
                                <TableRow className="space-x-2">
                                    <TableHead className="border-none">
                                        <Button
                                            onClick={handleOpenXReport}
                                            className="bg-primary hover:bg-primary/90"
                                        >
                                            X-Report
                                        </Button>
                                    </TableHead>
                                    <TableHead className="border-none">
                                        <Button
                                            onClick={handleOpenZReport}
                                            className="bg-primary hover:bg-primary/90"
                                        >
                                            Z-Report
                                        </Button>
                                    </TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>{}</TableBody>
                        </Table>

                        <Dialog
                            open={reportDialogOpen}
                            onOpenChange={setReportDialogOpen}
                        >
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
                                        <p className="text-sm text-red-500">
                                            {reportError}
                                        </p>
                                    )}

                                    {!reportLoading &&
                                        !reportError &&
                                        reportData &&
                                        reportData.length > 0 && (
                                            <Table>
                                                <TableHeader>
                                                    <TableRow>
                                                        <TableHead>
                                                            Hour
                                                        </TableHead>
                                                        <TableHead className="text-right">
                                                            Net Sales ($)
                                                        </TableHead>
                                                    </TableRow>
                                                </TableHeader>
                                                <TableBody>
                                                    {reportData.map((row) => (
                                                        <TableRow
                                                            key={row.hour}
                                                        >
                                                            <TableCell>
                                                                {row.hour}:00
                                                            </TableCell>
                                                            <TableCell className="text-right">
                                                                {row.netSales.toFixed(
                                                                    2
                                                                )}
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
                                                No data returned for this
                                                report.
                                            </p>
                                        )}
                                </div>
                            </DialogContent>
                        </Dialog>
                    </TabsContent>

                    <TabsContent value="employees" className="mt-6 space-y-4">
                        <div className="flex justify-between items-center">
                            <h2 className="text-lg font-semibold">Employees</h2>
                            <Button
                                onClick={openNewEmployeeDialog}
                                className="bg-primary hover:bg-primary/90"
                            >
                                Add Employee
                            </Button>
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
                                    <TableHead className="text-right">
                                        Actions
                                    </TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {employees.length === 0 && !empLoading && (
                                    <TableRow>
                                        <TableCell
                                            colSpan={6}
                                            className="text-center text-sm"
                                        >
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
                                        <TableCell>
                                            {emp.roleid ?? "-"}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                onClick={() =>
                                                    openEditEmployeeDialog(emp)
                                                }
                                            >
                                                Edit
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>

                        <Dialog
                            open={empDialogOpen}
                            onOpenChange={setEmpDialogOpen}
                        >
                            <DialogContent className="max-w-xl">
                                <DialogHeader>
                                    <DialogTitle>
                                        {selectedEmployee?.id
                                            ? `Edit Employee #${selectedEmployee.id}`
                                            : "Add Employee"}
                                    </DialogTitle>
                                    <DialogDescription>
                                        Update employee details such as salary,
                                        hours, and employment status.
                                    </DialogDescription>
                                </DialogHeader>

                                {selectedEmployee && (
                                    <div className="space-y-4 mt-4">
                                        {empError && (
                                            <p className="text-sm text-red-500">
                                                {empError}
                                            </p>
                                        )}

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="space-y-1">
                                                <Label htmlFor="emp-name">
                                                    Name
                                                </Label>
                                                <Input
                                                    id="emp-name"
                                                    value={
                                                        selectedEmployee.name
                                                    }
                                                    onChange={(e) =>
                                                        updateSelected(
                                                            "name",
                                                            e.target.value
                                                        )
                                                    }
                                                />
                                            </div>

                                            <div className="space-y-1">
                                                <Label htmlFor="emp-salary">
                                                    Salary
                                                </Label>
                                                <Input
                                                    id="emp-salary"
                                                    type="number"
                                                    value={
                                                        selectedEmployee.salary
                                                    }
                                                    onChange={(e) =>
                                                        updateSelected(
                                                            "salary",
                                                            Number(
                                                                e.target.value
                                                            ) || 0
                                                        )
                                                    }
                                                />
                                            </div>

                                            <div className="space-y-1">
                                                <Label htmlFor="emp-hours">
                                                    Hours
                                                </Label>
                                                <Input
                                                    id="emp-hours"
                                                    type="number"
                                                    value={
                                                        selectedEmployee.hours
                                                    }
                                                    onChange={(e) =>
                                                        updateSelected(
                                                            "hours",
                                                            Number(
                                                                e.target.value
                                                            ) || 0
                                                        )
                                                    }
                                                />
                                            </div>

                                            <div className="space-y-1">
                                                <Label htmlFor="emp-roleid">
                                                    Role ID
                                                </Label>
                                                <Input
                                                    id="emp-roleid"
                                                    type="number"
                                                    value={
                                                        selectedEmployee.roleid ??
                                                        ""
                                                    }
                                                    onChange={(e) =>
                                                        updateSelected(
                                                            "roleid",
                                                            e.target.value ===
                                                                ""
                                                                ? null
                                                                : Number(
                                                                      e.target
                                                                          .value
                                                                  ) || 0
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
                                                    value={
                                                        selectedEmployee.password
                                                    }
                                                    onChange={(e) =>
                                                        updateSelected(
                                                            "password",
                                                            e.target.value
                                                        )
                                                    }
                                                />
                                            </div>

                                            <div className="flex items-center space-x-2 md:col-span-2">
                                                <Switch
                                                    id="emp-employed"
                                                    checked={
                                                        selectedEmployee.isEmployed
                                                    }
                                                    onCheckedChange={(
                                                        checked
                                                    ) =>
                                                        updateSelected(
                                                            "isEmployed",
                                                            checked
                                                        )
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
                                                    onClick={() =>
                                                        setEmpDialogOpen(false)
                                                    }
                                                    disabled={empLoading}
                                                >
                                                    Cancel
                                                </Button>
                                                <Button
                                                    type="button"
                                                    className="bg-primary hover:bg-primary/90"
                                                    onClick={saveEmployee}
                                                    disabled={empLoading}
                                                >
                                                    {empLoading
                                                        ? "Saving..."
                                                        : "Save"}
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </DialogContent>
                        </Dialog>
                    </TabsContent>

                    <TabsContent value="inventory" className="mt-6 space-y-4">
                        <div className="flex justify-between items-center">
                            <h2 className="text-lg font-semibold">
                                Inventory Items
                            </h2>
                            <Button
                                onClick={openNewInventoryDialog}
                                className="bg-primary hover:bg-primary/90"
                            >
                                Add New Item
                            </Button>
                        </div>

                        {invLoading && inventory.length === 0 && (
                            <p className="text-sm text-muted-foreground">
                                Loading inventory…
                            </p>
                        )}

                        {invError && (
                            <p className="text-sm text-red-500">{invError}</p>
                        )}

                        <Table aria-label="Inventory table">
                            <TableCaption className="sr-only">
                                Buy Inventory
                            </TableCaption>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Name</TableHead>
                                    <TableHead>Current Stock</TableHead>
                                    <TableHead>Batch Cost</TableHead>
                                    <TableHead>Est. Daily Use</TableHead>
                                    <TableHead className="text-right">
                                        Actions
                                    </TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {inventory.length === 0 && !invLoading && (
                                    <TableRow>
                                        <TableCell
                                            colSpan={5}
                                            className="text-center text-sm"
                                        >
                                            No inventory items found.
                                        </TableCell>
                                    </TableRow>
                                )}

                                {inventory.map((inv) => (
                                    <TableRow key={inv.id}>
                                        <TableCell>{inv.name}</TableCell>
                                        <TableCell>
                                            {inv.currentStock}
                                        </TableCell>
                                        <TableCell>
                                            ${inv.batchPurchaseCost.toFixed(2)}
                                        </TableCell>
                                        <TableCell>
                                            {inv.estimatedUsedPerDay}
                                        </TableCell>
                                        <TableCell className="text-right space-x-2">
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                onClick={() =>
                                                    openEditInventoryDialog(inv)
                                                }
                                            >
                                                Edit
                                            </Button>
                                            <Button
                                                size="sm"
                                                className="bg-green-600 hover:bg-green-700"
                                                onClick={() =>
                                                    openRestockDialog(inv)
                                                }
                                            >
                                                Restock
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>

                        {/* Add/Edit Inventory Dialog */}
                        <Dialog
                            open={invDialogOpen}
                            onOpenChange={setInvDialogOpen}
                        >
                            <DialogContent className="max-w-xl">
                                <DialogHeader>
                                    <DialogTitle>
                                        {selectedInventory?.id
                                            ? `Edit Inventory Item #${selectedInventory.id}`
                                            : "Add Inventory Item"}
                                    </DialogTitle>
                                    <DialogDescription>
                                        Enter inventory item details.
                                    </DialogDescription>
                                </DialogHeader>

                                {selectedInventory && (
                                    <div className="space-y-4 mt-4">
                                        {invError && (
                                            <p className="text-sm text-red-500">
                                                {invError}
                                            </p>
                                        )}

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="space-y-1 md:col-span-2">
                                                <Label htmlFor="inv-name">
                                                    Name
                                                </Label>
                                                <Input
                                                    id="inv-name"
                                                    value={
                                                        selectedInventory.name
                                                    }
                                                    onChange={(e) =>
                                                        updateSelectedInventory(
                                                            "name",
                                                            e.target.value
                                                        )
                                                    }
                                                />
                                            </div>

                                            <div className="space-y-1">
                                                <Label htmlFor="inv-cost">
                                                    Batch Purchase Cost
                                                </Label>
                                                <Input
                                                    id="inv-cost"
                                                    type="number"
                                                    step="0.01"
                                                    value={
                                                        selectedInventory.batchPurchaseCost
                                                    }
                                                    onChange={(e) =>
                                                        updateSelectedInventory(
                                                            "batchPurchaseCost",
                                                            Number(
                                                                e.target.value
                                                            ) || 0
                                                        )
                                                    }
                                                />
                                            </div>

                                            <div className="space-y-1">
                                                <Label htmlFor="inv-stock">
                                                    Current Stock
                                                </Label>
                                                <Input
                                                    id="inv-stock"
                                                    type="number"
                                                    value={
                                                        selectedInventory.currentStock
                                                    }
                                                    onChange={(e) =>
                                                        updateSelectedInventory(
                                                            "currentStock",
                                                            Number(
                                                                e.target.value
                                                            ) || 0
                                                        )
                                                    }
                                                />
                                            </div>

                                            <div className="space-y-1 md:col-span-2">
                                                <Label htmlFor="inv-daily">
                                                    Estimated Used Per Day
                                                </Label>
                                                <Input
                                                    id="inv-daily"
                                                    type="number"
                                                    value={
                                                        selectedInventory.estimatedUsedPerDay
                                                    }
                                                    onChange={(e) =>
                                                        updateSelectedInventory(
                                                            "estimatedUsedPerDay",
                                                            Number(
                                                                e.target.value
                                                            ) || 0
                                                        )
                                                    }
                                                />
                                            </div>
                                        </div>

                                        <div className="flex justify-between items-center pt-4">
                                            {selectedInventory.id && (
                                                <Button
                                                    type="button"
                                                    variant="destructive"
                                                    onClick={deleteInventory}
                                                    disabled={invLoading}
                                                >
                                                    Delete
                                                </Button>
                                            )}

                                            <div className="ml-auto flex gap-2">
                                                <Button
                                                    type="button"
                                                    variant="outline"
                                                    onClick={() =>
                                                        setInvDialogOpen(false)
                                                    }
                                                    disabled={invLoading}
                                                >
                                                    Cancel
                                                </Button>
                                                <Button
                                                    type="button"
                                                    className="bg-primary hover:bg-primary/90"
                                                    onClick={saveInventory}
                                                    disabled={invLoading}
                                                >
                                                    {invLoading
                                                        ? "Saving..."
                                                        : "Save"}
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </DialogContent>
                        </Dialog>

                        {/* Restock Dialog */}
                        <Dialog
                            open={restockDialogOpen}
                            onOpenChange={setRestockDialogOpen}
                        >
                            <DialogContent className="max-w-md">
                                <DialogHeader>
                                    <DialogTitle>
                                        Restock {selectedInventory?.name}
                                    </DialogTitle>
                                    <DialogDescription>
                                        Enter the quantity to add to current
                                        stock. This will also create an expense
                                        record.
                                    </DialogDescription>
                                </DialogHeader>

                                {selectedInventory && (
                                    <div className="space-y-4 mt-4">
                                        {invError && (
                                            <p className="text-sm text-red-500">
                                                {invError}
                                            </p>
                                        )}

                                        <div className="space-y-2">
                                            <p className="text-sm">
                                                Current Stock:{" "}
                                                <span className="font-semibold">
                                                    {
                                                        selectedInventory.currentStock
                                                    }
                                                </span>
                                            </p>
                                            <p className="text-sm">
                                                Batch Cost:{" "}
                                                <span className="font-semibold">
                                                    $
                                                    {selectedInventory.batchPurchaseCost.toFixed(
                                                        2
                                                    )}
                                                </span>
                                            </p>
                                        </div>

                                        <div className="space-y-1">
                                            <Label htmlFor="restock-qty">
                                                Restock Quantity
                                            </Label>
                                            <Input
                                                id="restock-qty"
                                                type="number"
                                                value={restockQuantity}
                                                onChange={(e) =>
                                                    setRestockQuantity(
                                                        Number(
                                                            e.target.value
                                                        ) || 0
                                                    )
                                                }
                                            />
                                        </div>

                                        {restockQuantity > 0 && (
                                            <p className="text-sm">
                                                New Stock:{" "}
                                                <span className="font-semibold">
                                                    {selectedInventory.currentStock +
                                                        restockQuantity}
                                                </span>
                                            </p>
                                        )}

                                        <div className="flex justify-end gap-2 pt-4">
                                            <Button
                                                type="button"
                                                variant="outline"
                                                onClick={() =>
                                                    setRestockDialogOpen(false)
                                                }
                                                disabled={invLoading}
                                            >
                                                Cancel
                                            </Button>
                                            <Button
                                                type="button"
                                                className="bg-green-600 hover:bg-green-700"
                                                onClick={restockInventory}
                                                disabled={invLoading}
                                            >
                                                {invLoading
                                                    ? "Restocking..."
                                                    : "Restock"}
                                            </Button>
                                        </div>
                                    </div>
                                )}
                            </DialogContent>
                        </Dialog>
                    </TabsContent>

                    <TabsContent value="recipes" className="mt-6 space-y-4">
                        <div className="flex justify-between items-center">
                            <h2 className="text-lg font-semibold">Recipes</h2>
                            <Button
                                onClick={openNewRecipeDialog}
                                className="bg-primary hover:bg-primary/90"
                            >
                                Create Recipe
                            </Button>
                        </div>

                        {recLoading && recipes.length === 0 && (
                            <p className="text-sm text-muted-foreground">
                                Loading recipes…
                            </p>
                        )}

                        {recError && !recDialogOpen && (
                            <p className="text-sm text-red-500">{recError}</p>
                        )}

                        <Table aria-label="Recipes table">
                            <TableCaption className="sr-only">
                                Create Recipes
                            </TableCaption>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Name</TableHead>
                                    <TableHead>Type</TableHead>
                                    <TableHead>Price/Serving</TableHead>
                                    <TableHead>Orders/Batch</TableHead>
                                    <TableHead className="text-right">
                                        Actions
                                    </TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {recipes.length === 0 && !recLoading && (
                                    <TableRow>
                                        <TableCell
                                            colSpan={5}
                                            className="text-center text-sm"
                                        >
                                            No recipes found.
                                        </TableCell>
                                    </TableRow>
                                )}

                                {recipes.map((rec) => (
                                    <TableRow key={rec.id}>
                                        <TableCell>{rec.name}</TableCell>
                                        <TableCell>{rec.type ?? "-"}</TableCell>
                                        <TableCell>
                                            ${rec.pricePerServing.toFixed(2)}
                                        </TableCell>
                                        <TableCell>
                                            {rec.ordersPerBatch}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                onClick={() =>
                                                    openEditRecipeDialog(rec)
                                                }
                                            >
                                                Edit
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>

                        {/* Create/Edit Recipe Dialog */}
                        <Dialog
                            open={recDialogOpen}
                            onOpenChange={setRecDialogOpen}
                        >
                            <DialogContent className="max-w-3xl max-h-[80vh] overflow-auto">
                                <DialogHeader>
                                    <DialogTitle>
                                        {selectedRecipe?.id
                                            ? `Edit Recipe #${selectedRecipe.id}`
                                            : "Create Recipe"}
                                    </DialogTitle>
                                    <DialogDescription>
                                        Enter recipe details and add
                                        ingredients.
                                    </DialogDescription>
                                </DialogHeader>

                                {selectedRecipe && (
                                    <div className="space-y-6 mt-4">
                                        {recError && (
                                            <p className="text-sm text-red-500">
                                                {recError}
                                            </p>
                                        )}

                                        {/* Recipe Details */}
                                        <div className="space-y-4">
                                            <h3 className="font-semibold">
                                                Recipe Details
                                            </h3>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div className="space-y-1 md:col-span-2">
                                                    <Label htmlFor="rec-name">
                                                        Name
                                                    </Label>
                                                    <Input
                                                        id="rec-name"
                                                        value={
                                                            selectedRecipe.name
                                                        }
                                                        onChange={(e) =>
                                                            updateSelectedRecipe(
                                                                "name",
                                                                e.target.value
                                                            )
                                                        }
                                                    />
                                                </div>

                                                <div className="space-y-1">
                                                    <Label htmlFor="rec-price">
                                                        Price Per Serving
                                                    </Label>
                                                    <Input
                                                        id="rec-price"
                                                        type="number"
                                                        step="0.01"
                                                        value={
                                                            selectedRecipe.pricePerServing
                                                        }
                                                        onChange={(e) =>
                                                            updateSelectedRecipe(
                                                                "pricePerServing",
                                                                Number(
                                                                    e.target
                                                                        .value
                                                                ) || 0
                                                            )
                                                        }
                                                    />
                                                </div>

                                                <div className="space-y-1">
                                                    <Label htmlFor="rec-orders">
                                                        Orders Per Batch
                                                    </Label>
                                                    <Input
                                                        id="rec-orders"
                                                        type="number"
                                                        value={
                                                            selectedRecipe.ordersPerBatch
                                                        }
                                                        onChange={(e) =>
                                                            updateSelectedRecipe(
                                                                "ordersPerBatch",
                                                                Number(
                                                                    e.target
                                                                        .value
                                                                ) || 1
                                                            )
                                                        }
                                                    />
                                                </div>

                                                <div className="space-y-1">
                                                    <Label htmlFor="rec-type">
                                                        Type
                                                    </Label>
                                                    <select
                                                        id="rec-type"
                                                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                                                        value={
                                                            selectedRecipe.type ??
                                                            ""
                                                        }
                                                        onChange={(e) =>
                                                            updateSelectedRecipe(
                                                                "type",
                                                                e.target
                                                                    .value ===
                                                                    ""
                                                                    ? null
                                                                    : (e.target
                                                                          .value as
                                                                          | "Side"
                                                                          | "Entree"
                                                                          | "Drink")
                                                            )
                                                        }
                                                    >
                                                        <option value="">
                                                            None
                                                        </option>
                                                        <option value="Side">
                                                            Side
                                                        </option>
                                                        <option value="Entree">
                                                            Entree
                                                        </option>
                                                        <option value="Drink">
                                                            Drink
                                                        </option>
                                                    </select>
                                                </div>

                                                <div className="space-y-1">
                                                    <Label htmlFor="rec-image">
                                                        Image Path (Optional)
                                                    </Label>
                                                    <Input
                                                        id="rec-image"
                                                        value={
                                                            selectedRecipe.image ??
                                                            ""
                                                        }
                                                        onChange={(e) =>
                                                            updateSelectedRecipe(
                                                                "image",
                                                                e.target
                                                                    .value ||
                                                                    null
                                                            )
                                                        }
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        <Separator />

                                        {/* Ingredients */}
                                        <div className="space-y-4">
                                            <h3 className="font-semibold">
                                                Ingredients
                                            </h3>

                                            {/* Ingredients Table */}
                                            {ingredients.length > 0 && (
                                                <Table>
                                                    <TableHeader>
                                                        <TableRow>
                                                            <TableHead>
                                                                Inventory Item
                                                            </TableHead>
                                                            <TableHead>
                                                                Quantity
                                                            </TableHead>
                                                            <TableHead className="text-right">
                                                                Actions
                                                            </TableHead>
                                                        </TableRow>
                                                    </TableHeader>
                                                    <TableBody>
                                                        {ingredients.map(
                                                            (ing, idx) => (
                                                                <TableRow
                                                                    key={idx}
                                                                >
                                                                    <TableCell>
                                                                        {ing.inventoryName ??
                                                                            `ID: ${ing.inventoryId}`}
                                                                    </TableCell>
                                                                    <TableCell>
                                                                        {
                                                                            ing.inventoryQuantity
                                                                        }
                                                                    </TableCell>
                                                                    <TableCell className="text-right">
                                                                        <Button
                                                                            size="sm"
                                                                            variant="destructive"
                                                                            onClick={() =>
                                                                                removeIngredient(
                                                                                    idx
                                                                                )
                                                                            }
                                                                        >
                                                                            Remove
                                                                        </Button>
                                                                    </TableCell>
                                                                </TableRow>
                                                            )
                                                        )}
                                                    </TableBody>
                                                </Table>
                                            )}

                                            {/* Add Ingredient Form */}
                                            <div className="border rounded-md p-4 space-y-3">
                                                <h4 className="text-sm font-medium">
                                                    Add Ingredient
                                                </h4>
                                                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                                    <div className="space-y-1 md:col-span-1">
                                                        <Label htmlFor="new-ing-item">
                                                            Inventory Item
                                                        </Label>
                                                        <select
                                                            id="new-ing-item"
                                                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                                                            value={
                                                                newIngredientId
                                                            }
                                                            onChange={(e) =>
                                                                setNewIngredientId(
                                                                    Number(
                                                                        e.target
                                                                            .value
                                                                    ) || 0
                                                                )
                                                            }
                                                        >
                                                            <option value={0}>
                                                                Select item...
                                                            </option>
                                                            {inventory.map(
                                                                (inv) => (
                                                                    <option
                                                                        key={
                                                                            inv.id
                                                                        }
                                                                        value={
                                                                            inv.id
                                                                        }
                                                                    >
                                                                        {
                                                                            inv.name
                                                                        }
                                                                    </option>
                                                                )
                                                            )}
                                                        </select>
                                                    </div>

                                                    <div className="space-y-1">
                                                        <Label htmlFor="new-ing-qty">
                                                            Quantity
                                                        </Label>
                                                        <Input
                                                            id="new-ing-qty"
                                                            type="number"
                                                            value={
                                                                newIngredientQty
                                                            }
                                                            onChange={(e) =>
                                                                setNewIngredientQty(
                                                                    Number(
                                                                        e.target
                                                                            .value
                                                                    ) || 0
                                                                )
                                                            }
                                                        />
                                                    </div>

                                                    <div className="flex items-end">
                                                        <Button
                                                            type="button"
                                                            variant="outline"
                                                            onClick={
                                                                addIngredient
                                                            }
                                                            className="w-full"
                                                        >
                                                            Add
                                                        </Button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Action Buttons */}
                                        <div className="flex justify-between items-center pt-4 border-t">
                                            {selectedRecipe.id && (
                                                <Button
                                                    type="button"
                                                    variant="destructive"
                                                    onClick={deleteRecipe}
                                                    disabled={recLoading}
                                                >
                                                    Delete Recipe
                                                </Button>
                                            )}

                                            <div className="ml-auto flex gap-2">
                                                <Button
                                                    type="button"
                                                    variant="outline"
                                                    onClick={() =>
                                                        setRecDialogOpen(false)
                                                    }
                                                    disabled={recLoading}
                                                >
                                                    Cancel
                                                </Button>
                                                <Button
                                                    type="button"
                                                    className="bg-primary hover:bg-primary/90"
                                                    onClick={saveRecipe}
                                                    disabled={recLoading}
                                                >
                                                    {recLoading
                                                        ? "Saving..."
                                                        : "Save Recipe"}
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </DialogContent>
                        </Dialog>
                    </TabsContent>
                </Tabs>
            </CardContent>
        </Card>
    );
}
