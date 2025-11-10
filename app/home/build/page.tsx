"use client"
import { useEffect } from "react";
import { useState } from "react";

import { MealType } from "@/lib/types";
import MealCard from "@/app/components/app-mealcard";

export default function Home() {
  const [mealtypes, setMealtypes] = useState<MealType[]>([]);

  // fetch meal types
  useEffect(() => {
    console.log("fetching meal types");
      const fetchData = async () => {
        console.log("fetching meal types 1");
          try {
              const response = await fetch(`/api/mealtypes`);
              console.log("response", response.ok);
              if (response.ok) {
                  const data = await response.json();
                  console.log(data);
                  setMealtypes(data);
              }
          } catch (error) {
              console.error("Failed to fetch links");
          } 
      }

      fetchData();
  }, []);

  return (
      <div className="grid grid-cols-5 gap-10 p-10 w-full mb-10">
        {mealtypes.map((item, i) => (
            <a href={`/home/build/${item.typeName}`} key={i}>
              <MealCard name={item.typeName} image="/images/image.png" key={i}/>
            </a>
        ))}
    </div>
  );
}