"use client"
import { useEffect } from "react";
import { useState } from "react";

import { Recipe } from "@/lib/types";
import MealCard from "@/app/components/app-mealcard";

export default function Home() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);

  // fetch meal types
  useEffect(() => {
      const fetchData = async () => {
          try {
              const response = await fetch(`/api/recipes`);
              if (response.ok) {
                  const data = await response.json();
                  setRecipes(data);
              }
          } catch (error) {
              console.error("Failed to fetch links");
          } 
      }

      fetchData();
  }, []);

  return (
      <div className="grid grid-cols-5 gap-10 p-10 w-full mb-10">
        {recipes.filter(r => r.type === "Side").map((item, i) => (
            <a href={`/home`} key={i}>
              <MealCard name={item.name} image="/images/image.png" key={i}/>
            </a>
        ))}
    </div>
  );
}