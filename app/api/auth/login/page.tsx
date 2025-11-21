"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";

export default function Login() {
    const [pin, setPin] = useState("");

    return (
        <div className="flex flex-col items-center gap-6 p-10">

            {/* GOOGLE LOGIN */}
            <button
                onClick={() => signIn("google", { callbackUrl: "/home" })}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg"
            >
                Sign in with Google
            </button>

            {/* PIN LOGIN */}
            <form
                onSubmit={(e) => {
                    e.preventDefault();
                    signIn("credentials", {
                        password: pin,
                        callbackUrl: "/home",
                    });
                }}
                className="flex flex-col gap-3 w-64"
            >
                <input
                    value={pin}
                    onChange={(e) => setPin(e.target.value)}
                    type="password"
                    placeholder="Enter PIN"
                    className="border px-4 py-2 rounded"
                />

                <button
                    className="px-4 py-2 bg-green-600 text-white rounded"
                >
                    Login with PIN
                </button>
            </form>

        </div>
    );
}
