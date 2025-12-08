"use client"

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';

function LogoutPage() {
    const router = useRouter();

    useEffect(() => {
        const timer = setTimeout(() => {
            router.push('/'); // Redirect to the home route after 3 seconds
        }, 3000); // 3000 milliseconds = 3 seconds

        // Clean up the timer when the component unmounts to prevent memory leaks
        return () => clearTimeout(timer);
    }, [router]); // Add router as a dependency to useEffect

    return (
        <div className="flex items-center justify-center min-h-screen">
            <h1 className="text-2xl font-semibold">Thank you! Redirecting in 3 seconds...</h1>
        </div>
    );
}

export default LogoutPage;
