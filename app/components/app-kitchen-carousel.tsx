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
import { cookIngredients } from "../services/recipeService";


export const KitchenCarousel = (props: {
    cooked: Cooked[]
}) => {
    const [recipes, setRecipes] = useState<Recipe[]>([]);
    const [inventory, setInventory] = useState<Inventory[]>([]);
    // const [needInventory, setNeedInventory]

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

    // given recipe id, determine all inventory and quantity
    // complete order, remove the cooked items, maybe database side validation if there is enough cooked
    // cook recipe, remove inventory, maybe database side validation if there is enough inventory

    async function canCook(recipe: Recipe) {

    }

    async function cook(recipe: Recipe) {
      try {
        let response = await fetch(`/api/cooked/cook/${recipe.id}`);

        // remove inventory items and add cooked, reload both data
        if (response.ok) {
          const data = await response.json();
          return;
        }

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