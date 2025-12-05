"use client"

import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function LogoutPage() {
    const navigate = useNavigate();

    useEffect(() => {
    const timer = setTimeout(() => {
        navigate('/home'); // Redirect to the '/home' route after 3 seconds
    }, 3000); // 3000 milliseconds = 3 seconds

    // Clean up the timer when the component unmounts to prevent memory leaks
    return () => clearTimeout(timer);
    }, [navigate]); // Add navigate as a dependency to useEffect

    return (
    <div>
        <h1>Welcome! Redirecting in 3 seconds...</h1>
    </div>
    );
}

export default LogoutPage;
