"use client";

import AdminTabsCard from "@/app/components/admin-tabs-card";

export default function Page() {
    return (
        <div className="min-h-screen flex flex-col bg-background">
            <header className="border-b border-border bg-card shadow-md sticky top-0 z-50">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-5">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-panda-red text-white flex items-center justify-center font-bold text-sm font-mono">
                                PE
                            </div>
                            <div className="flex flex-col">
                                <h1 className="text-2xl font-bold text-foreground tracking-tight">
                                    Manager Dashboard
                                </h1>
                                <p className="text-xs text-muted-foreground mt-0.5">
                                    Restaurant Operations
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            <main className="flex-1 mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
                <AdminTabsCard />
            </main>

            <footer className="border-t border-border bg-card mt-12">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                        <p className="text-sm text-muted-foreground">
                            © 2025 Panda Express. All rights reserved.
                        </p>
                        <p className="text-xs text-muted-foreground">
                            Management System v1.0
                        </p>
                    </div>
                </div>
            </footer>
        </div>
    );
}
