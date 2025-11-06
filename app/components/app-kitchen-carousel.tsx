"use client"

import { useEffect } from "react";
import { useState } from "react";

import { Card, CardContent } from "@/components/ui/card"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import { Cooked, Recipe } from "@/lib/types"

// export default function Home() {
//   const [mealtypes, setMealtypes] = useState<MealType[]>([]);

//   // fetch meal types
//   useEffect(() => {
//       const fetchData = async () => {
//           try {
//               const response = await fetch(`/api/mealtypes`);
//               if (response.ok) {
//                   const data = await response.json();
//                   setMealtypes(data);
//               }
//           } catch (error) {
//               console.error("Failed to fetch links");
//           } 
//       }

//       fetchData();
//   }, []);

//   return (
//       <div className="grid grid-cols-5 gap-10 p-10 w-full mb-10">
//         {mealtypes.map((item, i) => (
//             <a href={`/home/build/${item.name}`} key={i}>
//               <MealCard name={item.name} image="/images/image.png" key={i}/>
//             </a>
//         ))}
//     </div>
//   );
// }

export function CarouselSpacing() {
    const [cooked, setCooked] = useState<Cooked[]>([]);
    const [recipes, setRecipes] = useState<Recipe[]>([]);

    useEffect(() => {
        const fetchData = async () => {
          try {
              let response = await fetch(`/api/cooked`);
              if (response.ok) {
                  const data = await response.json();
                  setCooked(data);
              }

              response = await fetch(`/api/recipes`);
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
    <Carousel className="w-full">
      <CarouselContent className="-ml-1">
        {recipes.map((recipe, index) => (
          <CarouselItem key={index} className="pl-1 sm:basis-1/2 md:basis-1/4 lg:basis-1/6 basis-1/2">
            <div className="p-1">
              <Card className="h-50">
                <CardContent className="flex aspect-square items-center justify-center p-3 h-full">
                    <div className="flex flex-col justify-around">
                        <div className="text-lg font-semibold min-h-25">{recipe.name}</div>
                        <div className="min-h-13">
                            <p>Stock: {cooked.find(c => c.id === recipe.id)?.currentStock ?? 0}</p>
                            <p>Cooks: {recipe.ordersPerBatch}</p>
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