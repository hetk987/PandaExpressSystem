"use client";

import React from "react";
import { Button } from "@/app/components/ui/button";
import { CreditCard, IdCard, Smartphone, Trash2 } from "lucide-react";
import { useState, useMemo, useEffect, useRef } from "react";
import { cn, getCSTTimestamp } from "@/lib/utils";
import { CartProvider, useCart } from "../providers/cart-provider";
import { OrderInfo } from "@/lib/types";
import { toast } from "sonner";
import { fetchWeatherApi } from "openmeteo";

function CheckoutContent({ children }: { children: React.ReactNode }) {
    const { meals, individualItems, clearCart, removeMeal, removeIndividualItem } = useCart();
    const paymentMethods = [
        { id: 1, name: "Card", icon: CreditCard },
        { id: 2, name: "Student Card", icon: IdCard },
        { id: 3, name: "Mobile Pay", icon: Smartphone },
    ];
    const [selectedPayment, setSelectedPayment] = useState<number | null>(null);

    // Transform cart data to display format
    const orderItems = useMemo(() => {
        const mealItems = meals.map((meal, index) => ({
            id: `meal-${index}`,
            kind: "meal" as const,
            name: meal.mealType,
            components: [
                ...meal.selections.entrees.map((e) => e.recipeName),
                ...meal.selections.sides.map((s) => s.recipeName),
                ...meal.selections.drinks.map((d) => d.recipeName),
            ],
            quantity: meal.quantity,
            price: meal.price,
        }));

        const individualItemDisplay = individualItems.map((item, index) => ({
            id: `item-${index}`,
            kind: "ala" as const,
            name: item.recipeName,
            quantity: item.quantity,
            price: item.price,
        }));

        return [...mealItems, ...individualItemDisplay];
    }, [meals, individualItems]);

    const subtotal = useMemo(() => {
        const mealsTotal = meals.reduce(
            (sum, meal) => sum + meal.price * meal.quantity,
            0
        );
        const itemsTotal = individualItems.reduce(
            (sum, item) => sum + item.price * item.quantity,
            0
        );
        return mealsTotal + itemsTotal;
    }, [meals, individualItems]);

    const tax = useMemo(() => +(subtotal * 0.095).toFixed(2), [subtotal]);
    const total = useMemo(() => +(subtotal + tax).toFixed(2), [subtotal, tax]);

    const handlePay = async () => {
        const orderInfo: OrderInfo = {
            meals: meals,
            individualItems: individualItems,
        };
        const response = await fetch("/api/orders", {
            method: "POST",
            body: JSON.stringify({
                tax: tax,
                totalCost: total,
                orderTime: getCSTTimestamp(),
                cashierId: 2,
                orderInfo: orderInfo,
                isCompleted: false,
            }),
        });

        if (response.ok) {
            toast.success("Order placed successfully");
            clearCart();
        } else {
            const error = await response.json();
            toast.error("Failed to place order");
            console.error("Failed to place order: " + error.error);
        }
    };

    const handleClearCart = () => {
        clearCart();    
        toast.success("Cart cleared successfully");
    };

    const handleRemoveItem = (item: typeof orderItems[0]) => {
        // Extract index from item.id (format: "meal-0" or "item-0")
        const index = parseInt(item.id.split("-")[1]);
        
        if (item.kind === "meal") {
            removeMeal(index);
            toast.success("Meal removed from cart");
        } else {
            removeIndividualItem(index);
            toast.success("Item removed from cart");
        }
    };

    const [temperature, setTemperature] = useState<number>();
    const [precipitation, setPrecipitation] = useState<number>();
    const [windSpeed, setWindSpeed] = useState<number>();
    const [windDirection, setWindDirection] = useState<number>();

    // load weather data
    useEffect(() => {
        const fetchData = async () => {
            const params = {
                latitude: 30.628,
                longitude: -96.3344,
                current: ["temperature_2m", "precipitation", "wind_speed_10m", "wind_direction_10m"],
                timezone: "auto",
                wind_speed_unit: "mph",
                temperature_unit: "fahrenheit",
                precipitation_unit: "inch",
            };
            const url = "https://api.open-meteo.com/v1/forecast";
            const responses = await fetchWeatherApi(url, params);

            // Process first location. Add a for-loop for multiple locations or weather models
            const response = responses[0];
            const utcOffsetSeconds = response.utcOffsetSeconds();
            const current = response.current()!;

            // Note: The order of weather variables in the URL query and the indices below need to match!
            const weatherData = {
                current: {
                    time: new Date((Number(current.time()) + utcOffsetSeconds) * 1000),
                    temperature_2m: current.variables(0)!.value(),
                    precipitation: current.variables(1)!.value(),
                    wind_speed_10m: current.variables(2)!.value(),
                    wind_direction_10m: current.variables(3)!.value(),
                },
            };

            setTemperature(weatherData.current.temperature_2m);
            setPrecipitation(weatherData.current.precipitation);
            setWindSpeed(weatherData.current.wind_speed_10m);
            setWindDirection(weatherData.current.wind_direction_10m);
        }

        fetchData();
    }, []);

    return (
        <div className="flex flex-col">
            <div className="flex flex-row">
                <main className="flex-1 overflow-y-auto">
                    {children}
                </main>
                <div>
                    <div className="flex flex-col gap-4 p-4 h-full">
                        <div className="max-h-64 overflow-y-auto rounded-md bg-white/5">
                            {orderItems.length === 0 ? (
                                <div className="px-4 py-8 text-center text-black">
                                    <p>Your cart is empty</p>
                                </div>
                            ) : (
                                <div className="divide-y divide-white/10">
                                    {orderItems.map((item) => (
                                        <div
                                            key={item.id}
                                            className="px-4 py-3 relative"
                                        >
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-2">
                                                    <span className="font-semibold">
                                                        {item.kind ===
                                                        "meal"
                                                            ? item.name
                                                            : "Individual A-la-carte"}
                                                    </span>
                                                    <span className="text-xs text-black">
                                                        {item.quantity}x
                                                    </span>
                                                </div>
                                                <div className="text-right font-medium">
                                                    <span>
                                                        $
                                                        {(
                                                            item.price *
                                                            item.quantity
                                                        ).toFixed(2)}
                                                    </span>
                                                </div>
                                            </div>
                                            {item.kind === "meal" && (
                                                <ul className="mt-1 list-disc list-inside text-sm text-black">
                                                    {item.components.map(
                                                        (c) => (
                                                            <li key={c}>
                                                                {c}
                                                            </li>
                                                        )
                                                    )}
                                                </ul>
                                            )}
                                            {item.kind === "ala" && (
                                                <div className="mt-1 text-sm text-black">
                                                    {item.name}
                                                </div>
                                            )}
                                            <Button
                                                onClick={() => handleRemoveItem(item)}
                                                variant="ghost"
                                                size="icon"
                                                className="absolute bottom-2 right-2 h-6 w-6 text-white/70 hover:text-white hover:bg-white/20 cursor-pointer"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div className="space-y-2 rounded-md bg-white/5 p-4">
                            <div className="flex justify-between text-black">
                                <span>Subtotal</span>
                                <span>${subtotal.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-black">
                                <span>Tax</span>
                                <span>${tax.toFixed(2)}</span>
                            </div>
                            <div className="h-px bg-white/20" />
                            <div className="flex justify-between text-lg font-semibold">
                                <span>Total</span>
                                <span>${total.toFixed(2)}</span>
                            </div>
                        </div>

                        <div className="space-y-3">
                            <p className="text-sm uppercase tracking-wide text-black">
                                Payment method
                            </p>
                            <div className="grid grid-cols-2 gap-3">
                                {paymentMethods.map((method) => (
                                    <Button
                                        onClick={() =>
                                            setSelectedPayment(method.id)
                                        }
                                        key={method.id}
                                        variant="outline"
                                        className={cn(
                                            "justify-center border-black bg-white/10 text-black hover:bg-white/20",
                                            selectedPayment === method.id &&
                                                "border-black bg-white/20 ring-2 ring-black",
                                            method.id === 3 && "col-span-2"
                                        )}
                                    >
                                        <method.icon className="size-4" />
                                        {method.name}
                                    </Button>
                                ))}
                            </div>
                        </div>
                    </div>
                    <Button onClick={handleClearCart} variant="outline" className="bg-panda-dark-red cursor-pointer hover:bg-panda-dark-red/90 hover:text-white hover:border-panda-light-red/60">
                        <Trash2 className="size-4" />
                        Clear Cart
                    </Button>
                    <Button
                        disabled={
                            selectedPayment === null ||
                            orderItems.length === 0
                        }
                        onClick={handlePay}
                        className="cursor-pointer hover:bg-white/90"
                        >
                        Pay ${total.toFixed(2)}
                    </Button>
                </div>
            </div>
        </div>
    );
}

export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <CartProvider>
            <CheckoutContent>{children}</CheckoutContent>
        </CartProvider>
    );
}
