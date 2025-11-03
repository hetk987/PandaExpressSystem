"use client"
import { useEffect } from "react";
import { useState } from "react";

import { MealType } from "@/lib/types";
import MealCard from "@/app/components/app-mealcard";

export default function Home() {
  const [mealtypes, setMealtypes] = useState<MealType[]>([]);

  // fetch meal types
  useEffect(() => {
      const fetchData = async () => {
          try {
              const response = await fetch(`/api/mealtypes`);
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

  return (
      <div className="grid grid-cols-5 gap-10 p-10 w-full mb-10">
        {mealtypes.map((item, i) => (
            <a href={`/home/build/${item.name}`} key={i}>
              <MealCard name={item.name} image="/images/image.png" key={i}/>
            </a>
        ))}
    </div>
  );
}