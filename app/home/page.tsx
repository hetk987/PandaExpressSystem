"use client";

import MealCard from "../components/app-mealcard";

const options: {
  href: string,
  title: string
}[] = [
  {href: 'build', title: 'Build Your Own'},
  {href: 'appetizer', title: 'Appetizers'},
  {href: 'drink', title: 'Drinks'},
  {href: 'entree', title: 'Entrees'},
  {href: 'side', title: 'Sides'}
]

export default function Home() {
    return (
        <div className="min-h-screen flex flex-col items-center bg-neutral-50 p-10 w-full">
            <h1 className="text-4xl font-bold text-neutral-900 mb-8">
                What would you like today?
            </h1>

            <div className="grid grid-cols-5 gap-10 w-full max-w-6xl">
                {options.map((item, i) => (
                    <a href={`/home/${item.href}`} key={i}>
                        <MealCard name={item.title} image="/images/image.png" />
                    </a>
                ))}
            </div>
        </div>
    );
}
