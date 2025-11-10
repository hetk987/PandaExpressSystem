"use client";

import React, { useState } from "react";
import { useAuth } from "./auth-context";

const LoginComponent = () => {
    const { login } = useAuth();
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const response = await fetch("/api/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ password }),
            });

            const data = await response.json();

            if (!response.ok) {
                setError(data.error || "Login failed");
                return;
            }

            login(data.name);
            setError("");
        } catch {
            setError("Network error");
        }

        setPassword("");
    };

    return (
        <form onSubmit={handleSubmit} className="flex flex-col items-center space-y-3">
            <input
                type="password"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="border px-3 py-2 rounded-md text-black text-center tracking-widest w-40"
            />
            <button
                type="submit"
                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
            >
                Log In
            </button>
            {error && <p className="text-red-500">{error}</p>}
        </form>
    );
};

export default LoginComponent;
