"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/auth/auth-context";
import { Button } from "@/app/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/app/components/ui/card";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import { UserCircle, Lock } from "lucide-react";

export default function EmployeeLoginSection() {
    const [pin, setPin] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const { login, isAuthenticated, user, logout } = useAuth();

    const router = useRouter();

    useEffect(() => {
        console.log(`[EmployeeLoginSection] useEffect triggered`);
        if (isAuthenticated) {
            console.log("Redirecting to /home...");
            router.push("/home");
        }
    }, [isAuthenticated, router]);

    const handlePinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.replace(/\D/g, "");
        if (value.length <= 6) setPin(value);
    };

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        console.log("[v0] Logging in with PIN:", pin);

        if (pin.length < 4) {
            return;
        }

        setIsLoading(true);
        setError("");

        try {
            console.log("[v0] Sending fetch request to /api/login ...");
            const res = await fetch("/api/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ password: pin }),
            });
            console.log("[v0] Response status:", res.status);
            const data = await res.json();
            console.log("[v0] Response JSON:", data);

            if (!res.ok) {
                setError(data.error || "Invalid Login PIN");
                console.warn("[v0] Login failed:", data.error);
                return;
            }
            // console.log("[v0] Before login() call:", data);
            login(data.name || `Employee-${pin}`);
            // console.log("[v0] After login() call. isAuthenticated =", isAuthenticated);
        } catch (err) {
            console.error("[v0] Fetch error:", err);
            setError("Network or server error");
        } finally {
            setIsLoading(false);
        }
    };

    const handleNumberPad = (num: string) => {
        if (pin.length < 6) setPin(pin + num);
    };

    const handleClear = () => setPin("");

    if (isAuthenticated) {
        return (
            <Card className="border-2 border-green-200 shadow-lg bg-green-50 hover:shadow-xl transition-shadow">
                <CardHeader className="text-center space-y-3">
                    <CardTitle className="text-2xl font-bold text-green-900">
                        Welcome, {user?.username || "Employee"}!
                    </CardTitle>
                    <CardDescription className="text-green-700">
                        Redirecting to home...
                    </CardDescription>
                </CardHeader>
                <CardContent className="flex justify-center">
                    <Link href="/home">
                        <Button className="bg-neutral-900 hover:bg-neutral-800 text-white px-6 py-3 rounded-lg">
                            Go Now
                        </Button>
                    </Link>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="border-2 border-neutral-200 shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader className="space-y-4 pb-8">
                <div className="flex items-center justify-center">
                    <div className="rounded-full bg-neutral-900/10 p-6">
                        <UserCircle className="h-16 w-16 text-neutral-900" />
                    </div>
                </div>
                <div className="text-center">
                    <CardTitle className="text-3xl font-bold text-neutral-900">
                        Employee Login
                    </CardTitle>
                    <CardDescription className="mt-2 text-base text-neutral-600">
                        Enter your PIN to access the system
                    </CardDescription>
                </div>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleLogin} className="space-y-6">
                    <div className="space-y-2">
                        <Label
                            htmlFor="pin"
                            className="text-base font-semibold text-neutral-900"
                        >
                            PIN Number
                        </Label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-neutral-400" />
                            <Input
                                id="pin"
                                type="password"
                                value={pin}
                                onChange={handlePinChange}
                                placeholder="Enter your PIN"
                                className="pl-10 text-center text-2xl tracking-widest font-mono h-14 rounded-xl"
                                maxLength={6}
                                inputMode="numeric"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-3 gap-3">
                        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
                            <Button
                                key={num}
                                type="button"
                                variant="outline"
                                onClick={() => handleNumberPad(num.toString())}
                                className="h-16 text-2xl font-semibold hover:bg-neutral-100 rounded-xl"
                            >
                                {num}
                            </Button>
                        ))}
                        <Button
                            type="button"
                            variant="outline"
                            onClick={handleClear}
                            className="h-16 text-lg font-semibold hover:bg-neutral-100 rounded-xl bg-transparent"
                        >
                            Clear
                        </Button>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => handleNumberPad("0")}
                            className="h-16 text-2xl font-semibold hover:bg-neutral-100 rounded-xl"
                        >
                            0
                        </Button>
                        <Button
                            type="submit"
                            disabled={isLoading || pin.length < 4}
                            className="h-16 text-lg font-semibold bg-neutral-900 hover:bg-neutral-800 text-white rounded-xl"
                        >
                            {isLoading ? "..." : "Login"}
                        </Button>
                    </div>

                    {error && (
                        <p className="text-center text-sm text-red-600 font-medium">
                            {error}
                        </p>
                    )}

                    <p className="text-center text-xs text-neutral-500">
                        Contact your manager if you forgot your PIN
                    </p>
                </form>
            </CardContent>
        </Card>
    );
}
