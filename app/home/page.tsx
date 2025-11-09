"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/auth/auth-context";

export default function HomePage() {
    const { isAuthenticated, user } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!isAuthenticated) {
            router.push("/");
        }
    }, [isAuthenticated, router]);

    if (!isAuthenticated) {
        return (
            <div className="min-h-screen flex items-center justify-center text-gray-600">
                Redirecting to login...
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-neutral-50">
            <h1 className="text-4xl font-bold text-neutral-900 mb-4">
                Welcome, {user?.username}!
            </h1>
            <p className="text-lg text-neutral-600">
                This is your secure employee dashboard.
            </p>
        </div>
    );
}
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
    <div className="grid grid-cols-5 gap-10 p-10 w-full">
        {options.map((item, i) => (
            <a href={`/home/${item.href}`} key={i}>
              <MealCard name={item.title} image="/images/image.png" key={i}/>
            </a>
        ))}
    </div>
  );
}
