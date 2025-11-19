"use client";

import CashierCard from "../components/app-cashier-card";

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
            <div className="grid grid-cols-5 gap-10 w-full max-w-6xl">
                {options.map((item, i) => (
                    <a href={`/cashier/${item.href}`} key={i}>
                        <CashierCard name={item.title} />
                    </a>
                ))}
            </div>
        </div>
    );
}
