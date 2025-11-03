"use client"
import { use } from "react"

import MealCard from "@/app/components/app-mealcard";
import { useEffect } from "react";
import { useState } from "react";

const options: {
  name: string,
  entrees: number,
  sides: number,
}[] = [{
  name: "Bowl", 
  entrees: 1, 
  sides: 2
}, {
  name: "Plate", 
  entrees: 2, 
  sides: 2
}, {
  name: "Bigger Plate", 
  entrees: 3, 
  sides: 2
}]

export default async function Build({
    params
}: {
    params: Promise<{ slug: string }>
}) {
    // const { slug } = use(params);
    // const [recipes, setRecipes] = useState([]);

    // useEffect(() => {
    //     const fetchData = async () => {
    //         try {
    //             const response = await fetch(`/api/recipes`);
    //             if (response.ok) {
    //                 const data = await response.json();
    //                 setRecipes(data);
    //             }
    //         } catch (error) {
    //             console.error("Failed to fetch links");
    //         } 
    //     }

    //     fetchData();
    // }, []);

    return (
        <div className="flex flex-row">
            {/* <div className="grid grid-cols-4 gap-10 p-10 w-full">
                {recipes.map((item, i) => (
                    <a href="/">
                        <MealCard name={item.name} image="/images/image.png" key={i}/>
                    </a>
                ))}
            </div>
            <div className="bg-red-50 w-100">
                Hello
            </div> */}
        </div>
    );
}