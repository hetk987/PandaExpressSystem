import type React from "react";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import ClientProviders from "./client-providers";

const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "Panda Express PoS System",
    description: "Point of Sale System for Panda Express",
    generator: "v0.app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {/* All global client-side providers (Auth, theme, etc.) */}
        <ClientProviders>
            {children}
        </ClientProviders>
        <Toaster position="top-right" richColors/>
        
        {/* Vercel Analytics */}
        <Analytics />
      </body>
    </html>
  );
}
