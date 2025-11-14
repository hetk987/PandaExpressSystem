import type React from "react";
import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";
import { Toaster } from "sonner";
import ClientProviders from "./client-providers";
import { Metadata } from "next";

const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"], variable: "--font-geist-mono" });

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
        className={`${_geist.className} ${_geistMono.className} antialiased`}
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
