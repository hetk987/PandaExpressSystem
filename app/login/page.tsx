"use client";

import { useState, Suspense } from "react";
import { signIn } from "next-auth/react";
import { Button } from "@/app/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/app/components/ui/card";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import { UserCircle, Lock, Delete } from "lucide-react";
import { useSearchParams } from "next/navigation";

function LoginContent() {
    const [pin, setPin] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const params = useSearchParams();
    const oauthError = params.get("error");
    const callbackUrl = params.get("callbackUrl") || "/employee/kitchen";

    const oauthMessage =
        oauthError === "AccessDenied"
            ? "Your Google account is not registered as an employee."
            : oauthError === "OAuthAccountNotLinked"
            ? "This Google account is not linked to an employee profile."
            : oauthError === "Callback"
            ? "Google login failed. Please try again."
            : null;

    const onPinSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        const res = await signIn("credentials", {
            password: pin,
            redirect: false,
            callbackUrl: callbackUrl,
        });

        setLoading(false);

        if (res?.error) {
            setError("Invalid PIN");
        } else {
            window.location.href = callbackUrl;
        }
    };

    const addDigit = (num: string) => {
        if (pin.length < 6) setPin(pin + num);
    };

    const clearPin = () => setPin(pin.slice(0, -1));

    const resetPin = () => setPin("");

    // Check if demo mode is enabled
    // Show sticky note if NEXT_PUBLIC_DEMO_MODE is "true" or NEXT_PUBLIC_DEMO_PIN is set
    const demoPinEnv = process.env.NEXT_PUBLIC_DEMO_PIN;
    const demoModeEnv = process.env.NEXT_PUBLIC_DEMO_MODE;
    const demoPin = demoPinEnv || "9999";
    const isDemoMode = demoModeEnv === "true" || (demoPinEnv !== undefined && demoPinEnv !== "");

    return (
        <div className="min-h-screen flex items-center justify-center bg-neutral-100 p-6 relative">
            {/* Demo PIN Sticky Note */}
            {isDemoMode && (
                <div className="absolute top-6 right-6 z-10 transform rotate-[-3deg] hover:rotate-0 transition-transform duration-200">
                    <div className="bg-yellow-200 shadow-lg border-2 border-yellow-300 rounded-lg p-4 max-w-[200px] relative">
                        {/* Sticky note tape effect */}
                        <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-12 h-4 bg-yellow-300/50 rounded-sm"></div>
                        <div className="space-y-2">
                            <p className="text-xs font-bold text-yellow-900 uppercase tracking-wide">
                                Demo Mode
                            </p>
                            <div className="border-t border-yellow-400/30 pt-2">
                                <p className="text-xs text-yellow-800 mb-1">Demo PIN:</p>
                                <p className="text-2xl font-mono font-bold text-yellow-900 text-center bg-yellow-100 rounded px-2 py-1">
                                    {demoPin}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            <Card className="w-full max-w-md border-2 shadow-lg">
                <CardHeader className="space-y-4 text-center">
                    <div className="flex justify-center">
                        <div className="rounded-full bg-neutral-900/10 p-6">
                            <UserCircle className="h-16 w-16 text-neutral-900" />
                        </div>
                    </div>

                    <CardTitle className="text-3xl font-bold text-neutral-900">
                        Employee Login
                    </CardTitle>

                    <CardDescription className="text-neutral-600">
                        Sign in with Google or enter your PIN.
                    </CardDescription>
                </CardHeader>

                <CardContent className="flex flex-col gap-6">
                    {oauthMessage && (
                        <p className="text-center text-sm text-red-600 font-medium">
                            {oauthMessage}
                        </p>
                    )}
                    <Button
                        onClick={() =>
                            signIn("google", { callbackUrl: callbackUrl })
                        }
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 text-lg rounded-xl"
                    >
                        Sign in with Google
                    </Button>

                    <div className="h-px bg-neutral-300" />

                    <form onSubmit={onPinSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <Label
                                htmlFor="pin"
                                className="font-semibold text-neutral-900"
                            >
                                PIN Number
                            </Label>

                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-neutral-400" />

                                <Input
                                    id="pin"
                                    type="password"
                                    value={pin}
                                    readOnly
                                    placeholder="Enter PIN"
                                    className="pl-10 text-center text-2xl tracking-widest font-mono h-14 rounded-xl"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-3 gap-3">
                            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
                                <Button
                                    key={num}
                                    type="button"
                                    variant="outline"
                                    onClick={() => addDigit(num.toString())}
                                    className="h-16 text-2xl font-semibold hover:bg-neutral-100 rounded-xl"
                                >
                                    {num}
                                </Button>
                            ))}

                            <Button
                                type="button"
                                variant="outline"
                                onClick={resetPin}
                                className="h-16 text-lg font-semibold hover:bg-neutral-100 rounded-xl"
                            >
                                Clear
                            </Button>

                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => addDigit("0")}
                                className="h-16 text-2xl font-semibold hover:bg-neutral-100 rounded-xl"
                            >
                                0
                            </Button>

                            <Button
                                type="button"
                                variant="outline"
                                onClick={clearPin}
                                className="h-16 flex items-center justify-center hover:bg-neutral-100 rounded-xl"
                            >
                                <Delete className="w-6 h-6" />
                            </Button>
                        </div>

                        <Button
                            type="submit"
                            disabled={loading || pin.length < 4}
                            className="w-full bg-green-600 hover:bg-green-700 text-white py-3 text-lg rounded-xl"
                        >
                            {loading ? "Logging in..." : "Login with PIN"}
                        </Button>

                        {error && (
                            <p className="text-center text-sm text-red-600 font-medium">
                                {error}
                            </p>
                        )}
                    </form>

                    <p className="text-center text-xs text-neutral-500">
                        Contact your manager if you forgot your PIN.
                    </p>
                </CardContent>
            </Card>
        </div>
    );
}

export default function LoginPage() {
    return (
        <Suspense
            fallback={
                <div className="min-h-screen flex items-center justify-center bg-neutral-100 p-6">
                    <Card className="w-full max-w-md border-2 shadow-lg">
                        <CardHeader className="space-y-4 text-center">
                            <div className="flex justify-center">
                                <div className="rounded-full bg-neutral-900/10 p-6">
                                    <UserCircle className="h-16 w-16 text-neutral-900" />
                                </div>
                            </div>
                            <CardTitle className="text-3xl font-bold text-neutral-900">
                                Employee Login
                            </CardTitle>
                            <CardDescription className="text-neutral-600">
                                Loading...
                            </CardDescription>
                        </CardHeader>
                    </Card>
                </div>
            }
        >
            <LoginContent />
        </Suspense>
    );
}
