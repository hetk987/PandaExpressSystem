"use client"
import { use } from "react"

import MealCard from "@/app/components/app-mealcard";
import { useEffect } from "react";
import { useState } from "react";

import { Recipe } from "@/lib/types";
import { MealType } from "@/lib/types";

export default function Build({
    params
}: {
    params: Promise<{ meal: string }>
}) {
    const { meal } = use(params);

    const [recipes, setRecipes] = useState<Recipe[]>([]);
    const [mealtypes, setMealtypes] = useState<MealType[]>([]);

    // fetch recipes
    useEffect(() => {

        const fetchData = async () => {
            try {
                let response = await fetch(`/api/recipes`);
                if (response.ok) {
                    const data = await response.json();
                    setRecipes(data);
                }

                response = await fetch(`/api/mealtypes`);
                if (response.ok) {
                    const data = await response.json();
                    setMealtypes(data);
                }
            } catch (error) {
                console.error("Failed to fetch links");
            } 
        }

        fetchData();
    }, []);

    const mealtype = mealtypes.find(m => m.name === meal);

    return (
        <div className="flex flex-row">
            <div className="grid grid-cols-4 gap-10 p-10 w-full mb-10">
                {recipes.map((item, i) => (
                    <a href="/" key={i}>
                        <MealCard name={item.name} image="/images/image.png" key={i}/>
                    </a>
                ))}
            </div>
            <div className="flex flex-col w-100 bg-red-50">
                <p>{mealtype?.name}</p>
                <MealCard name="Entree 1"/>
            </div>
        </div>
    );
}