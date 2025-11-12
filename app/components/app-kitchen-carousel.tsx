"use client"

import { useEffect } from "react";
import { useState } from "react";

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import { Cooked, Recipe, Inventory } from "@/lib/types"


export const KitchenCarousel = (props: {
    cooked: Cooked[]
}) => {
    const [recipes, setRecipes] = useState<Recipe[]>([]);
    const [inventory, setInventoy] = useState<Inventory[]>([]);

    useEffect(() => {
        const fetchData = async () => {
          try {
            let response = await fetch(`/api/recipes`);
            if (response.ok) {
                const data = await response.json();
                setRecipes(data);
            }

            response = await fetch(`/api/inventory`);
            if (response.ok) {
                const data = await response.json();
                setInventoy(data);
            }
          } catch (error) {
              console.error("Failed to fetch links");
          } 
      }

      fetchData();
    }, []);

    async function canCook(recipe: Recipe): Promise<boolean> {
      const response = await fetch(`/api/inv-rec-junc/recipe/${recipe.id}`);
      if (response.ok) {
        const data: {
          id: number,
          inventoryId: number,
          recipeId: number,
          inventoryQuantity: number,
          inventoryName: string
        }[] = await response.json();

        data.forEach(inv => {
            const inInv = inventory.find(i => i.id === inv.id);
            if (!inInv) return false;
            if (inInv.currentStock < inv.inventoryQuantity) return false;
        });
        return true;

        // no ingredients required
      } else if (response.status === 404) { return true;
      } else { return false; }
    }

    async function cook(recipe: Recipe) {
      const hasIngedients = await canCook(recipe);

      if (!hasIngedients) return;

      try {
        let response = await fetch(`/api/cooked/cook/${recipe.id}`, {
          method:'POST'
        });

        // remove inventory items and add cooked, reload both data
        if (response.ok) {
          const data = await response.json();
          return;
        }
        // window.location.reload();

        console.log(response.status);

        // if we failed to cook, throw up a popup with what we need to buy

      } catch (error) {
        console.error("Failed to cook item");
      }
    }

  return (
    <Carousel className="w-full">
      <CarouselContent className="-ml-1">
        {recipes.map((recipe, index) => (
          <CarouselItem key={index} className="pl-1 sm:basis-1/2 md:basis-1/4 lg:basis-1/6 basis-1/2">
            <div className="p-1">
              <Card className="h-50">
                <CardContent className="flex aspect-square items-center justify-center p-3 h-full">
                    <div className="flex flex-col justify-around w-full">
                        <div className="text-lg font-semibold min-h-25">{recipe.name}</div>
                        <div className="min-h-13 flex flex-row justify-between w-full">
                          <div>
                            <p>Stock: {props.cooked.find(c => c.recipeId === recipe.id)?.currentStock ?? 0}</p>
                            <p>Cooks: {recipe.ordersPerBatch}</p>
                          </div>
                          <Button className="w-20 mt-2" onClick={() => {
                            cook(recipe);
                          }}>
                            Cook
                          </Button>
                        </div>
                    </div>
                </CardContent>
              </Card>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  )
}