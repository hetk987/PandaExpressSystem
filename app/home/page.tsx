"use client";

import MealCard from "../components/app-mealcard";
import { useSession } from "next-auth/react";
import { useAccessibilityStyles } from "@/hooks/use-accessibility-styles";
import { Skeleton } from "@/app/components/ui/skeleton";

const options = [
    { href: "build", title: "Build Your Own" },
    { href: "appetizer", title: "Appetizers" },
    { href: "drink", title: "Drinks" },
    { href: "entree", title: "Entrees" },
    { href: "side", title: "Sides" },
];

export default function Home() {
    const { data: session, status } = useSession();
    const { textClasses } = useAccessibilityStyles();

    if (status === "loading") {
        return (
            <div className="min-h-screen flex flex-col items-center bg-neutral-50 p-10 w-full">
                <Skeleton className="h-12 w-64 mb-8" />
                <div className="grid grid-cols-5 gap-10 w-full max-w-6xl">
                    {Array.from({ length: 5 }).map((_, i) => (
                        <Skeleton key={i} className="h-48 w-full rounded-lg" />
                    ))}
                </div>
            </div>
        );
    }

    if (!session) {
        return (
            <div className="min-h-screen flex items-center justify-center text-gray-600">
                Redirecting to login...
            </div>
        );
    }

    return (
        <div className="flex flex-col">
            <div className="grid grid-cols-5 gap-10 p-10 w-full mb-10">
                {options.map((item, i) => (
                    <a href={`/home/${item.href}`} key={i}>
                        <MealCard name={item.title} image={"/images/image.png"}/>
                    </a>
                ))}
            </div>
        </div>
    );
}
