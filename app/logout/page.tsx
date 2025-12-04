"use client";

import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { CartProvider, useCart } from "@/app/providers/cart-provider";

function LogoutContent() {
    const router = useRouter();
    const [loaded, setLoaded] = useState(false);
    const { clearCart } = useCart();
    
    useEffect(() => {
        // Clear cart only once on mount
        clearCart();
        // fade-in after component mounts
        const fadeTimer = setTimeout(() => setLoaded(true), 100);
        
        // redirect after 3 seconds
        const redirectTimer = setTimeout(() => {
            router.push("/");
        }, 3000);

        return () => {
            clearTimeout(fadeTimer);
            clearTimeout(redirectTimer);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []); // Only run once on mount

    return (
        <div className="flex h-screen w-full items-center justify-center bg-background text-foreground">
            <h1
                className={`text-4xl font-bold kedebideri-bold transform transition-all duration-1000 ${
                    loaded
                    ? "opacity-100 scale-100"
                    : "opacity-0 scale-90"
                }`}
                >
                Thank you valued customer
                <span
                    className={`inline-block animate-bounce ml-2 ${
                        loaded ? "opacity-100" : "opacity-0"
                    }`}
                    >
                    🥡
                </span>
            </h1>
        </div>
    );
}

export default function LogoutPage() {
    return (
        <CartProvider>
            <LogoutContent />
        </CartProvider>
    );
}
