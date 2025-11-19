"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/auth/auth-context";
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
        <div className="min-h-screen flex flex-col items-center bg-neutral-50 p-10 w-full">
            <h1 className="text-4xl font-bold text-neutral-900 mb-8">
                Welcome, {user?.username}!
            </h1>

            <div className="grid grid-cols-5 gap-10 w-full max-w-6xl">
                {options.map((item, i) => (
                    <a href={`/home/${item.href}`} key={i}>
                        <MealCard name={item.title} image={"/images/image.png"}/>
                    </a>
                ))}
            </div>
        </div>
    );
}
