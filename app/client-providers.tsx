"use client";

import React from "react";
import { AuthProvider } from "@/app/auth/auth-context";

export default function ClientProviders({ children, }: { children: React.ReactNode; }) {
    return <AuthProvider>{children}</AuthProvider>;
}
