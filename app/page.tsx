"use client";

import CustomerOrderSection from "@/app/components/customer-order-section";
import EmployeeLoginSection from "@/app/components/employee-login-section";

export default function Home() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-neutral-50 to-neutral-100">
            <header className="border-b border-neutral-200 bg-white">
                <div className="container mx-auto px-4 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="h-12 w-12 rounded-full bg-panda-red flex items-center justify-center">
                                <span className="text-2xl">🐼</span>
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold text-neutral-900">
                                    Panda Express
                                </h1>
                                <p className="text-sm text-neutral-600">
                                    Point of Sale System
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            <main className="container mx-auto px-4 py-12">
                <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
                    <CustomerOrderSection />
                    <EmployeeLoginSection />
                </div>
            </main>

            <footer className="mt-16 border-t border-neutral-200 bg-white py-8">
                <div className="container mx-auto px-4 text-center text-sm text-neutral-600">
                    <p>Panda Express PoS System.</p>
                </div>
            </footer>
        </div>
    );
}
