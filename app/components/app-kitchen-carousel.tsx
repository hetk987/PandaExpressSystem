"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Cooked, Recipe, Inventory } from "@/lib/types";

export const KitchenCarousel = ({ cooked }: { cooked: Cooked[] }) => {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [inventory, setInventory] = useState<Inventory[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [recipesRes, inventoryRes] = await Promise.all([
          fetch(`/api/recipes`),
          fetch(`/api/inventory`),
        ]);
        if (recipesRes.ok) setRecipes(await recipesRes.json());
        if (inventoryRes.ok) setInventory(await inventoryRes.json());
      } catch (err) {
        console.error("Failed to fetch data", err);
      }
    };
    fetchData();
  }, []);

  async function canCook(recipe: Recipe): Promise<boolean> {
    const response = await fetch(`/api/inv-rec-junc/recipe/${recipe.id}`);
    if (response.ok) {
      const data: {
        id: number;
        inventoryId: number;
        recipeId: number;
        inventoryQuantity: number;
        inventoryName: string;
      }[] = await response.json();

      for (const inv of data) {
        const inInv = inventory.find((i) => i.id === inv.inventoryId);
        if (!inInv || inInv.currentStock < inv.inventoryQuantity) return false;
      }
      return true;
    } else if (response.status === 404) return true; // no ingredients required
    return false;
  }

  async function cook(recipe: Recipe) {
    const hasIngredients = await canCook(recipe);
    if (!hasIngredients) return;

    try {
      const response = await fetch(`/api/cooked/cook/${recipe.id}`, {
        method: "POST",
      });
      if (!response.ok) console.error("Cook failed:", response.status);
    } catch (error) {
      console.error("Failed to cook item", error);
    }
  }

  return (
    <Carousel className="w-full">
      <CarouselContent className="-ml-2 mt-2">
        {recipes.map((recipe) => {
          const cookedItem =
            cooked.find((c) => c.recipeId === recipe.id)?.currentStock ?? 0;

          return (
            <CarouselItem
              key={recipe.id}
              className="pl-2 sm:basis-1/2 md:basis-1/4 lg:basis-1/6 basis-1/2"
            >
              <Card className="border-2 border-black hover:shadow-lg hover:-translate-y-1 transition-all h-full">
                <CardContent className="flex flex-col justify-between h-full p-4">
                  <div className="space-y-2 text-center">
                    <h3 className="font-mono text-lg font-bold truncate">
                      {recipe.name}
                    </h3>
                    <div className="text-xs font-mono text-gray-600">
                      <p>Stock: {cookedItem}</p>
                      <p>Makes: {recipe.ordersPerBatch}</p>
                    </div>
                  </div>

                  <div className="flex justify-center w-full">
                    <Button
                      className=" w-full mt-2 bg-black text-white font-semibold rounded-xl px-3 py-2 shadow-[0_4px_0_0_#000] hover:-translate-y-0.5 hover:shadow-[0_6px_0_0_#000] active:translate-y-[3px] active:shadow-[0_1px_0_0_#000] active:scale-[0.97] transform transition-all duration-150 ease-in-out"
                      onClick={() => cook(recipe)}
                    >
                      Cook
                    </Button>
                  </div>
                  
                </CardContent>
              </Card>
            </CarouselItem>
          );
        })}
      </CarouselContent>

      <CarouselPrevious className="border-black hover:bg-black hover:text-white transition-all" />
      <CarouselNext className="border-black hover:bg-black hover:text-white transition-all" />
    </Carousel>
  );
};
