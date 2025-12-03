"use client";

import MealCard from "../components/app-mealcard";

const options = [
    { href: "build", title: "Build Your Own" },
    { href: "appetizer", title: "Appetizers" },
    { href: "drink", title: "Drinks" },
    { href: "entree", title: "Entrees" },
    { href: "side", title: "Sides" },
];

export default function Home() {
    return (
        <div className="flex flex-col">
            <div className="grid grid-cols-5 gap-10 p-10 w-full mb-10">
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
