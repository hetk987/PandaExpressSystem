"use client";
import Link from "next/link";
import { useAuth } from "./auth-context";
import LoginComponent from "./login-component";

export default function AuthHome() {
    const { isAuthenticated, user, logout } = useAuth();

    return (
        <div className="flex flex-col items-center justify-center space-y-4">
            {!isAuthenticated ? (
                <>
                    <h2 className="text-xl font-semibold text-gray-700">Enter your PIN</h2>
                    <LoginComponent />
                </>
            ) : (
                <>
                    <h2 className="text-xl font-semibold text-gray-700">
                        Welcome, {user?.username}!
                    </h2>

                    <div className="flex space-x-4">
                        <Link href="/home">
                            <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
                                Start
                            </button>
                        </Link>

                        <button
                            onClick={logout}
                            className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                        >
                            Logout
                        </button>
                    </div>
                </>
            )}
        </div>
    );
}
