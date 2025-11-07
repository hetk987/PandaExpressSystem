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
    const [inventory, setInventory] = useState<Inventory[]>([]);

    useEffect(() => {
        const fetchData = async () => {
          try {
            // cooked
            let response = await fetch(`/api/recipes`);
            if (response.ok) {
                const data = await response.json();
                setRecipes(data);
            }

            // inventory
            response = await fetch(`/api/inventory`);
            if (response.ok) {
                const data = await response.json();
                setInventory(data);
            }
          } catch (error) {
              console.error("Failed to fetch links");
          } 
      }

      fetchData();
    }, []);

    // Need function, given recipe, determine all inventory and quantity

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
                            <p>Stock: {props.cooked.find(c => c.id === recipe.id)?.currentStock ?? 0}</p>
                            <p>Cooks: {recipe.ordersPerBatch}</p>
                          </div>
                          <Button className="w-20 mt-2">
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