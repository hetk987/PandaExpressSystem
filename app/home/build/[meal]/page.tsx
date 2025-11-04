"use client"
import { use } from "react"

import MealCard from "@/app/components/app-mealcard";
import { useEffect, useMemo, useState } from "react";

import { RecipeType } from "@/lib/types";
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
    const [currentMenu, setCurrentMenu] = useState<RecipeType>();

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

                setCurrentMenu(mealtype && mealtype?.entrees > 0 ? "Entree" : "Side");

            } catch (error) {
                console.error("Failed to fetch links");
            } 
        }

        fetchData();
    }, []);

    const mealtype = useMemo(
        () => mealtypes.find(t => t.name === meal), [meal, mealtypes]
    );

    const entrees = useMemo(
        () => [...Array(mealtype?.entrees)], [mealtype]
    );

    const sides = useMemo(
        () => [...Array(mealtype?.sides)], [mealtype]
    );

    return (
        <div className="flex flex-row">
            <div className="grid grid-cols-4 gap-10 p-10 w-full mb-10">
                {recipes.filter(r => r.type === currentMenu).map((item, i) => (
                    <a href="/" key={i}>
                        <MealCard name={item.name} image="/images/image.png" key={i}/>
                    </a>
                ))}
            </div>
            <div className="flex flex-col w-70 p-10 gap-10 mb-10">
                <p>{currentMenu}</p>
                {entrees?.map((e, i) => (
                    <button key={i} onClick={() => setCurrentMenu("Entree")}>
                        <MealCard name={`Entree ${i + 1}`}/>
                    </button>
                ))}
                {sides?.map((e, i) => (
                    <button key={i} onClick={() => setCurrentMenu("Side")}>
                        <MealCard name={`Side ${i + 1}`}/>
                    </button>
                ))}
            </div>
        </div>
    );
}