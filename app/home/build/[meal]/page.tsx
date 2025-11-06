"use client"
import { use } from "react"

import MealCard from "@/app/components/app-mealcard";
import { useEffect, useMemo, useState } from "react";
import { RecipeType, Recipe, MealType, RecipeSelection } from "@/lib/types";
import { useCart } from "@/app/providers/cart-provider";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useAddToCartToast } from "@/app/hooks/use-add-to-cart-toast";

interface Selection {
    type: RecipeType;
    num: number;
};

interface MealSelections {
    entrees: Recipe[];
    sides: Recipe[];
    drinks: Recipe[];
}

export default function Build({
    params
}: {
    params: Promise<{ meal: string }>
}) {
    const { meal } = use(params);
    const { addMeal } = useCart();
    const router = useRouter();
    const { addMealWithToast } = useAddToCartToast();
    const [recipes, setRecipes] = useState<Recipe[]>([]);
    const [mealtypes, setMealtypes] = useState<MealType[]>([]);
    const [currentMenu, setCurrentMenu] = useState<RecipeType>();
    const [selection, setSelection] = useState<Selection>();
    const [mealSelections, setMealSelections] = useState<MealSelections>({
        entrees: [],
        sides: [],
        drinks: []
    });

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

                setCurrentMenu("Entree");
                setSelection({
                    type: "Entree",
                    num: 0
                });

            } catch (error) {
                console.error("Failed to fetch links");
            } 
        }

        fetchData();
    }, []);

    const mealName = useMemo(
        () => meal.replaceAll('%20', ' '), [meal]
    );

    const mealtype = useMemo(
        () => mealtypes.find(t => t.name === meal.replaceAll('%20', ' ')), [mealName, mealtypes]
    );

    const entrees = useMemo(
        () => [...Array(mealtype?.entrees || 0)], [mealtype]
    );

    const sides = useMemo(
        () => [...Array(mealtype?.sides || 0)], [mealtype]
    );

    const drinks = useMemo(
        () => [...Array(mealtype?.drinks || 0)], [mealtype]
    );

    const isComplete = useMemo(() => {
        if (!mealtype) return false;
        const entreesComplete = mealSelections.entrees.filter(Boolean).length === mealtype.entrees;
        const sidesComplete = mealSelections.sides.filter(Boolean).length === mealtype.sides;
        const drinksComplete = mealSelections.drinks.filter(Boolean).length === mealtype.drinks;
        return entreesComplete && sidesComplete && drinksComplete;
    }, [mealtype, mealSelections]);

    const handleRecipeClick = (recipe: Recipe) => {
        if (!selection) return;

        const newSelections = { ...mealSelections };
        
        if (selection.type === "Entree") {
            const updatedEntrees = [...newSelections.entrees];
            updatedEntrees[selection.num] = recipe;
            newSelections.entrees = updatedEntrees;
        } else if (selection.type === "Side") {
            const updatedSides = [...newSelections.sides];
            updatedSides[selection.num] = recipe;
            newSelections.sides = updatedSides;
        } else if (selection.type === "Drink") {
            const updatedDrinks = [...newSelections.drinks];
            updatedDrinks[selection.num] = recipe;
            newSelections.drinks = updatedDrinks;
        }

        setMealSelections(newSelections);

        // Auto-advance to next selection
        if (selection.type === "Entree" && selection.num < (mealtype?.entrees || 0) - 1) {
            setSelection({ type: "Entree", num: selection.num + 1 });
            setCurrentMenu("Entree");
        } else if (selection.type === "Entree" && mealtype && mealtype.sides > 0) {
            setSelection({ type: "Side", num: 0 });
            setCurrentMenu("Side");
        } else if (selection.type === "Side" && selection.num < (mealtype?.sides || 0) - 1) {
            setSelection({ type: "Side", num: selection.num + 1 });
            setCurrentMenu("Side");
        } else if (selection.type === "Side" && mealtype && mealtype.drinks > 0) {
            setSelection({ type: "Drink", num: 0 });
            setCurrentMenu("Drink");
        } else if (selection.type === "Drink" && selection.num < (mealtype?.drinks || 0) - 1) {
            setSelection({ type: "Drink", num: selection.num + 1 });
            setCurrentMenu("Drink");
        }
    };

    const handleAddToCart = async () => {
        if (!mealtype || !isComplete) return;

        const selections: {
            entrees: RecipeSelection[];
            sides: RecipeSelection[];
            drinks: RecipeSelection[];
        } = {
            entrees: mealSelections.entrees.map(r => ({
                recipeId: r.id,
                recipeName: r.name
            })),
            sides: mealSelections.sides.map(r => ({
                recipeId: r.id,
                recipeName: r.name
            })),
            drinks: mealSelections.drinks.map(r => ({
                recipeId: r.id,
                recipeName: r.name
            }))
        };

        await addMealWithToast(
            () => {
                addMeal({
                    mealType: mealtype.name,
                    quantity: 1,
                    price: mealtype.price,
                    selections: selections
                });
            },
            {
                onSuccess: () => {
                    // Reset selections
                    setMealSelections({ entrees: [], sides: [], drinks: [] });
                    setSelection({ type: "Entree", num: 0 });
                    setCurrentMenu("Entree");
                }
            }
        );
        
        router.push("/home/build");
    };

    return (
        <div className="flex flex-row">
            <div className="w-full">
                <div className="pt-5 pl-5">
                    <h2 className=" text-3xl font-bold ">{`Select ${selection?.type} ${selection ? selection.num + 1 : ""}`}</h2>
                </div>
                <div className="grid grid-cols-4 gap-10 p-10 w-full mb-10">
                    {recipes.filter(r => r.type === currentMenu).map((item, i) => (
                        <button
                            key={i}
                            onClick={() => handleRecipeClick(item)}
                            className="cursor-pointer"
                        >
                            <MealCard name={item.name} image="/images/image.png"/>
                        </button>
                    ))}
                </div>
                {isComplete && (
                    <div className="px-5 pb-5">
                        <Button onClick={handleAddToCart} className="w-full">
                            Add to Cart
                        </Button>
                    </div>
                )}
            </div>
            <div className="w-70">
                <div className="pt-5 pl-5">
                    <h2 className=" text-3xl font-bold ">{mealName}</h2>
                </div>
                <div className="flex flex-col p-10 gap-10 mb-10">
                    {entrees?.map((e, i) => {
                        const selectedRecipe = mealSelections.entrees[i];
                        return (
                            <button 
                                key={i} 
                                onClick={() => {
                                    setCurrentMenu("Entree");
                                    setSelection({
                                        type: "Entree",
                                        num: i
                                    })
                                }}
                            >
                                <MealCard 
                                    name={selectedRecipe ? selectedRecipe.name : `Entree ${i + 1}`} 
                                    className={`cursor-pointer ${selection && selection.type == "Entree" && selection.num == i ? "border-yellow-300 border-3" : ""}`}
                                />
                            </button>
                        );
                    })}
                    {sides?.map((e, i) => {
                        const selectedRecipe = mealSelections.sides[i];
                        return (
                            <button 
                                key={i} 
                                onClick={() => {
                                    setCurrentMenu("Side");
                                    setSelection({
                                        type: "Side",
                                        num: i
                                    })
                                }}
                            >
                                <MealCard 
                                    name={selectedRecipe ? selectedRecipe.name : `Side ${i + 1}`} 
                                    className={`cursor-pointer ${selection && selection.type == "Side" && selection.num == i ? "border-yellow-300 border-3" : ""}`}
                                />
                            </button>
                        );
                    })}
                    {drinks?.map((e, i) => {
                        const selectedRecipe = mealSelections.drinks[i];
                        return (
                            <button 
                                key={i} 
                                onClick={() => {
                                    setCurrentMenu("Drink");
                                    setSelection({
                                        type: "Drink",
                                        num: i
                                    })
                                }}
                            >
                                <MealCard 
                                    name={selectedRecipe ? selectedRecipe.name : `Drink ${i + 1}`} 
                                    className={`cursor-pointer ${selection && selection.type == "Drink" && selection.num == i ? "border-yellow-300 border-3" : ""}`}
                                />
                            </button>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}