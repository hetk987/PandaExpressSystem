"use client";

import React, { useState } from "react";
import { useAuth } from "./auth-context";

const VALID_PIN = "1234"; // TODO Should change this to be based on the database.

const LoginComponent = () => {
    const { login } = useAuth();
    const [pin, setPin] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (pin === VALID_PIN) {
            login("Employee"); // TODO make this the employee name from the database corresponding to the pin
            setError("");
        } else {
            setError("Invalid PIN. Please try again.");
        }

        setPin("");
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="flex flex-col items-center space-y-3"
        >
            <input
                type="password"
                placeholder="Enter PIN"
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                className="border px-3 py-2 rounded-md text-black text-center tracking-widest w-40"
                maxLength={4}
            />
            <button
                type="submit"
                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
            >
                Log In
            </button>
            {error && <p className="text-red-500 text-sm">{error}</p>}
        </form>
    );
};

export default LoginComponent;
