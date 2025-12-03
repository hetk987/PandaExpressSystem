"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import MealCard from "../components/app-mealcard";
import { useSession } from "next-auth/react";
import { signOut } from "next-auth/react";
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
    const router = useRouter();
    const { data: session, status } = useSession();
    const { textClasses } = useAccessibilityStyles();

    // Redirect if not logged in
    useEffect(() => {
        if (status === "unauthenticated") router.push("/");
    }, [status, router]);

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
        <div className="min-h-screen flex flex-col items-center bg-neutral-50 p-10 w-full">
            <h1 className={`text-4xl font-bold text-neutral-900 mb-8 ${textClasses}`}>
                Welcome, {session.user?.name || "Employee"}!
            </h1>

            <div className="grid grid-cols-5 gap-10 w-full max-w-6xl">
                {options.map((item, i) => (
                    <a href={`/home/${item.href}`} key={i}>
                        <MealCard name={item.title} image={"/images/image.png"}/>
                    </a>
                ))}
            </div>
            {/*temporary button*/}
            {/*<div>*/}
            {/*    <button*/}
            {/*        onClick={() => signOut({ callbackUrl: "/" })}*/}
            {/*        className="px-4 py-2 bg-red-600 text-white rounded-lg shadow hover:bg-red-700"*/}
            {/*    >*/}
            {/*        Logout*/}
            {/*    </button>*/}

            {/*</div>*/}
        </div>
    );
}
