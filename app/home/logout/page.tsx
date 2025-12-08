"use client"

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';

function LogoutPage() {
    const router = useRouter();

    useEffect(() => {
        const timer = setTimeout(() => {
            router.push('/');
        }, 3000);

        return () => clearTimeout(timer);
    }, [router]);

    return (
        <div className="flex h-screen w-full items-center justify-center bg-background text-foreground">
            <h1 className="text-4xl font-bold kedebideri-bold transform transition-all duration-1000 opacity-0 scale-90">
                Thank you valued customer
                <span className="inline-block animate-bounce ml-2 opacity-0">
                    🥡
                </span>
            </h1>
        </div>
    );
}

export default LogoutPage;
