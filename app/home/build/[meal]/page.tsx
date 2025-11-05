"use client"
import { use } from "react"

import MealCard from "@/app/components/app-mealcard";
import { useEffect, useMemo, useState } from "react";

import { RecipeType } from "@/lib/types";
import { Recipe } from "@/lib/types";
import { MealType } from "@/lib/types";

interface Selection {
    type: RecipeType;
    num: number;
};

export default function Build({
    params
}: {
    params: Promise<{ meal: string }>
}) {
    const { meal } = use(params);

    const [recipes, setRecipes] = useState<Recipe[]>([]);
    const [mealtypes, setMealtypes] = useState<MealType[]>([]);
    const [currentMenu, setCurrentMenu] = useState<RecipeType>();
    const [selection, setSelection] = useState<Selection>();

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

                const start = mealtype && mealtype?.entrees > 0 ? "Entree" : "Side";
                setCurrentMenu(start);
                setSelection({
                    type: start,
                    num: 0
                });

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
            <div className="w-full">
                <div className="pt-5 pl-5">
                    <h2 className=" text-3xl font-bold ">{`Select ${selection?.type} ${selection ? selection.num + 1 : ""}`}</h2>
                </div>
                <div className="grid grid-cols-4 gap-10 p-10 w-full mb-10">
                    {recipes.filter(r => r.type === currentMenu).map((item, i) => (
                        <a href="/" key={i}>
                            <MealCard name={item.name} image="/images/image.png" key={i}/>
                        </a>
                    ))}
                </div>
            </div>
            <div className="w-70">
                <div className="pt-5 pl-5">
                    <h2 className=" text-3xl font-bold ">{meal}</h2>
                </div>
                <div className="flex flex-col p-10 gap-10 mb-10">
                    {entrees?.map((e, i) => (
                        <button key={i} onClick={() => {
                            setCurrentMenu("Entree");
                            setSelection({
                                type: "Entree",
                                num: i
                            })
                        }}>
                            <MealCard name={`Entree ${i + 1}`} className={`cursor-pointer ${selection && selection.type == "Entree" && selection.num == i ? "border-yellow-300 border-3" : ""}`}/>
                        </button>
                    ))}
                    {sides?.map((e, i) => (
                        <button key={i} onClick={() => {
                            setCurrentMenu("Side");
                            setSelection({
                                type: "Side",
                                num: i
                            })
                        }}>
                            <MealCard name={`Side ${i + 1}`} className={`cursor-pointer ${selection && selection.type == "Side" && selection.num == i ? "border-yellow-300 border-3" : ""}`}/>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}