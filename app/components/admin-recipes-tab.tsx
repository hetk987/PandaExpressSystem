"use client";

import React from "react";
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
import { Separator } from "@/app/components/ui/separator";
import { Switch } from "@/app/components/ui/switch";
import {
    Table,
    TableBody,
    TableCaption,
    TableHead,
    TableHeader,
    TableRow,
    TableCell,
} from "@/app/components/ui/table";
import { Recipe, Inventory } from "@/lib/types";

type Ingredient = {
    id?: number;
    inventoryId: number;
    recipeId?: number;
    inventoryQuantity: number;
    inventoryName?: string;
};

export default function AdminRecipesTab() {
    const [recipes, setRecipes] = React.useState<Recipe[]>([]);
    const [inventory, setInventory] = React.useState<Inventory[]>([]);
    const [recDialogOpen, setRecDialogOpen] = React.useState(false);
    const [selectedRecipe, setSelectedRecipe] = React.useState<Recipe | null>(
        null
    );
    const [ingredients, setIngredients] = React.useState<Ingredient[]>([]);
    const [newIngredientId, setNewIngredientId] = React.useState<number>(0);
    const [newIngredientQty, setNewIngredientQty] = React.useState<number>(0);
    const [recLoading, setRecLoading] = React.useState(false);
    const [recError, setRecError] = React.useState<string | null>(null);

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
        } catch (err: unknown) {
            setRecError(err instanceof Error ? err.message : "Unknown error");
        } finally {
            setRecLoading(false);
        }
    }

    async function fetchInventory() {
        try {
            const res = await fetch("/api/inventory");
            if (!res.ok) {
                const text = await res.text();
                throw new Error(text || "Failed to fetch inventory");
            }

            const data = await res.json();
            setInventory(data ?? []);
        } catch (err: unknown) {
            console.error("Failed to fetch inventory:", err);
        }
    }

    React.useEffect(() => {
        void fetchRecipes();
        void fetchInventory();
    }, []);

    async function openNewRecipeDialog() {
        setSelectedRecipe({
            name: "",
            pricePerServing: 0,
            ordersPerBatch: 1,
            type: null,
            image: "",
            premium: false,
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
        } catch (err: unknown) {
            setRecError(err instanceof Error ? err.message : "Unknown error");
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
        } catch (err: unknown) {
            setRecError(err instanceof Error ? err.message : "Unknown error");
        } finally {
            setRecLoading(false);
        }
    }

    return (
        <div className="mt-6 space-y-4">
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
                <TableCaption className="sr-only">Create Recipes</TableCaption>
                <TableHeader>
                    <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Price/Serving</TableHead>
                        <TableHead>Orders/Batch</TableHead>
                        <TableHead>Premium</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {recipes.length === 0 && !recLoading && (
                        <TableRow>
                            <TableCell
                                colSpan={6}
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
                            <TableCell>{rec.ordersPerBatch}</TableCell>
                            <TableCell>
                                <span
                                    className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                                        rec.premium
                                            ? "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200"
                                            : "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400"
                                    }`}
                                >
                                    {rec.premium ? "Premium" : "Standard"}
                                </span>
                            </TableCell>
                            <TableCell className="text-right">
                                <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => openEditRecipeDialog(rec)}
                                >
                                    Edit
                                </Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>

            {/* Create/Edit Recipe Dialog */}
            <Dialog open={recDialogOpen} onOpenChange={setRecDialogOpen}>
                <DialogContent className="max-w-3xl max-h-[80vh] overflow-auto">
                    <DialogHeader>
                        <DialogTitle>
                            {selectedRecipe?.id
                                ? `Edit Recipe #${selectedRecipe.id}`
                                : "Create Recipe"}
                        </DialogTitle>
                        <DialogDescription>
                            Enter recipe details and add ingredients.
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
                                        <Label htmlFor="rec-name">Name</Label>
                                        <Input
                                            id="rec-name"
                                            value={selectedRecipe.name}
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
                                                selectedRecipe.pricePerServing ===
                                                0
                                                    ? ""
                                                    : selectedRecipe.pricePerServing
                                            }
                                            onChange={(e) =>
                                                updateSelectedRecipe(
                                                    "pricePerServing",
                                                    e.target.value === ""
                                                        ? 0
                                                        : Number(
                                                              e.target.value
                                                          ) || 0
                                                )
                                            }
                                            placeholder="0.00"
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
                                                selectedRecipe.ordersPerBatch ===
                                                0
                                                    ? ""
                                                    : selectedRecipe.ordersPerBatch
                                            }
                                            onChange={(e) =>
                                                updateSelectedRecipe(
                                                    "ordersPerBatch",
                                                    e.target.value === ""
                                                        ? 1
                                                        : Number(
                                                              e.target.value
                                                          ) || 1
                                                )
                                            }
                                            placeholder="1"
                                        />
                                    </div>

                                    <div className="space-y-1">
                                        <Label htmlFor="rec-type">Type</Label>
                                        <select
                                            id="rec-type"
                                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                                            value={selectedRecipe.type ?? ""}
                                            onChange={(e) =>
                                                updateSelectedRecipe(
                                                    "type",
                                                    e.target.value === ""
                                                        ? null
                                                        : (e.target.value as
                                                              | "Side"
                                                              | "Entree"
                                                              | "Drink")
                                                )
                                            }
                                        >
                                            <option value="">None</option>
                                            <option value="Side">Side</option>
                                            <option value="Entree">
                                                Entree
                                            </option>
                                            <option value="Drink">Drink</option>
                                        </select>
                                    </div>

                                    <div className="space-y-1">
                                        <Label htmlFor="rec-image">
                                            Image Path (Optional)
                                        </Label>
                                        <Input
                                            id="rec-image"
                                            value={selectedRecipe.image ?? ""}
                                            onChange={(e) =>
                                                updateSelectedRecipe(
                                                    "image",
                                                    e.target.value || ""
                                                )
                                            }
                                        />
                                    </div>

                                    <div className="space-y-1">
                                        <Label htmlFor="rec-premium">
                                            Premium Item
                                        </Label>
                                        <div className="flex items-center gap-3 h-10">
                                            <Switch
                                                id="rec-premium"
                                                checked={selectedRecipe.premium}
                                                onCheckedChange={(checked) =>
                                                    updateSelectedRecipe(
                                                        "premium",
                                                        checked
                                                    )
                                                }
                                            />
                                            <span
                                                className={`text-sm ${
                                                    selectedRecipe.premium
                                                        ? "text-amber-600 dark:text-amber-400 font-medium"
                                                        : "text-muted-foreground"
                                                }`}
                                            >
                                                {selectedRecipe.premium
                                                    ? "Premium"
                                                    : "Standard"}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <Separator />

                            {/* Ingredients */}
                            <div className="space-y-4">
                                <h3 className="font-semibold">Ingredients</h3>

                                {/* Ingredients Table */}
                                {ingredients.length > 0 && (
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>
                                                    Inventory Item
                                                </TableHead>
                                                <TableHead>Quantity</TableHead>
                                                <TableHead className="text-right">
                                                    Actions
                                                </TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {ingredients.map((ing, idx) => (
                                                <TableRow key={idx}>
                                                    <TableCell>
                                                        {ing.inventoryName ??
                                                            `ID: ${ing.inventoryId}`}
                                                    </TableCell>
                                                    <TableCell>
                                                        {ing.inventoryQuantity}
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
                                            ))}
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
                                                value={newIngredientId}
                                                onChange={(e) =>
                                                    setNewIngredientId(
                                                        Number(
                                                            e.target.value
                                                        ) || 0
                                                    )
                                                }
                                            >
                                                <option value={0}>
                                                    Select item...
                                                </option>
                                                {inventory.map((inv) => (
                                                    <option
                                                        key={inv.id}
                                                        value={inv.id}
                                                    >
                                                        {inv.name}
                                                    </option>
                                                ))}
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
                                                    newIngredientQty === 0
                                                        ? ""
                                                        : newIngredientQty
                                                }
                                                onChange={(e) =>
                                                    setNewIngredientQty(
                                                        e.target.value === ""
                                                            ? 0
                                                            : Number(
                                                                  e.target.value
                                                              ) || 0
                                                    )
                                                }
                                                placeholder="0"
                                            />
                                        </div>

                                        <div className="flex items-end">
                                            <Button
                                                type="button"
                                                variant="outline"
                                                onClick={addIngredient}
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
                                        onClick={() => setRecDialogOpen(false)}
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
        </div>
    );
}
