"use client";

import type { Recipe, MealType } from "@/lib/types";
import { useState, useEffect } from "react";
import { Skeleton } from "@/app/components/ui/skeleton";

export default function KitchenPage() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [mealTypes, setMealTypes] = useState<MealType[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch both APIs in parallel for better performance
        const [r1, r2] = await Promise.all([
          fetch("/api/recipes"),
          fetch("/api/mealtypes")
        ]);
        
        const [d1, d2] = await Promise.all([
          r1.json(),
          r2.json()
        ]);
        
        setRecipes(d1);
        setMealTypes(d2);
      } catch (error) {
        console.error("Failed to fetch menu data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  if (isLoading) {
    return (
      <div className="h-screen w-screen overflow-hidden bg-orange-50 p-4">
        <div className="flex flex-row gap-10 items-start">
          <div className="flex flex-col min-w-[360px]">
            <Skeleton className="h-10 w-48 mb-4" />
            <div className="flex flex-col gap-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} className="h-24 w-full rounded-xl" />
              ))}
            </div>
          </div>
          <div className="flex flex-col gap-10">
            <div className="flex flex-row gap-10">
              <div className="flex flex-col min-w-[580px]">
                <Skeleton className="h-10 w-48 mb-4" />
                <div className="grid grid-cols-3 gap-4">
                  {Array.from({ length: 9 }).map((_, i) => (
                    <Skeleton key={i} className="h-48 w-44 rounded-xl" />
                  ))}
                </div>
              </div>
              <div className="flex flex-col min-w-[580px]">
                <Skeleton className="h-10 w-48 mb-4" />
                <div className="grid grid-cols-3 gap-4">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <Skeleton key={i} className="h-48 w-44 rounded-xl" />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const price = (n: number) => n.toFixed(2);

  const itemCard = (name: string, cost: number) => (
    <div className="flex flex-col bg-white rounded-xl p-2 shadow-sm w-44 h-48">
      <div className="w-full h-28 overflow-hidden rounded-md">
        <img
          src="/images/image.png"
          alt="food"
          className="w-full h-full object-cover object-center"
          style={{ aspectRatio: "1 / 1" }}
        />
      </div>
      <div className="flex justify-between text-xs font-semibold text-gray-900 mt-2">
        <span>{name}</span>
        <span className="text-red-700">${price(cost)}</span>
      </div>
    </div>
  );

  return (
    <div className="h-screen w-screen overflow-x-auto overflow-y-hidden bg-orange-50 p-4 select-none">
      <div className="flex flex-row gap-10 min-w-max items-start">
        {/* LEFT COLUMN: Meals + Drinks */}
        <div className="flex flex-col min-w-[360px]">
          <h1 className="text-4xl font-extrabold text-red-700 tracking-wide uppercase mb-4">
            Meals
          </h1>

          <div className="flex flex-col gap-4">
            {mealTypes
              .filter((m) => m.typeName !== "A La Carte" && m.typeName !== "Drink")
              .map((m, i) => (
                <div key={i} className="bg-white rounded-xl p-4 shadow-sm text-sm">
                  <div className="flex justify-between text-xl font-bold text-red-700 mb-1">
                    <span>{m.typeName}</span>
                    <span>${price(m.price)}</span>
                  </div>
                  {m.entrees !== undefined && m.entrees != 0 && (
                    <p className="text-gray-800 text-sm">Entrees: {m.entrees}</p>
                  )}
                  {m.sides !== undefined && m.sides != 0 && (
                    <p className="text-gray-800 text-sm">Sides: {m.sides}</p>
                  )}
                  {m.drinks !== undefined && m.drinks != 0 && (
                    <p className="text-gray-800 text-sm">Drinks: {m.drinks}</p>
                  )}
                </div>
              ))}
          </div>
        </div>

        <div className="flex flex-col gap-10">
          <div className="flex flex-row gap-10">
            {/* Entrees */}
            <div className="flex flex-col min-w-[580px]">
              <h2 className="text-4xl font-extrabold text-red-700 tracking-wide uppercase mb-4">
                Entrees
              </h2>
              <div className="grid grid-cols-3 gap-4">
                {recipes
                  .filter((r) => r.type === "Entree")
                  .map((r, i) => (
                    <div key={i}>{itemCard(r.name, r.pricePerServing)}</div>
                  ))}
              </div>
            </div>

            {/* Sides */}
            <div className="flex flex-col min-w-[580px]">
              <h2 className="text-4xl font-extrabold text-red-700 tracking-wide uppercase mb-4">
                Sides
              </h2>
              <div className="grid grid-cols-3 gap-4">
                {recipes
                  .filter((r) => r.type === "Side")
                  .map((r, i) => (
                    <div key={i}>{itemCard(r.name, r.pricePerServing)}</div>
                  ))}
              </div>

              <br/>

              <h2 className="text-4xl font-extrabold text-red-700 tracking-wide uppercase mb-4">
                Drinks
              </h2>
              <div className="grid grid-cols-3 gap-4">
                {recipes
                  .filter((r) => r.type === "Drink")
                  .map((r, i) => (
                    <div key={i}>{itemCard(r.name, r.pricePerServing)}</div>
                  ))}
              </div>
            </div>
            
            {/* Padding on the side */}
            <div className="min-w-0.5"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
