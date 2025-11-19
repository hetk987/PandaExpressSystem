"use client";

import React from "react";
import {
    Sheet,
    SheetClose,
    SheetContent,
    SheetDescription,
    SheetFooter,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/app/components/ui/sheet";
import { Button } from "@/app/components/ui/button";
import { WeatherWidget } from "./app-weather-widget";

interface AccessibilitySheetProps {
    temperature?: number;
    precipitation?: number;
    windSpeed?: number;
    windDirection?: number;
    trigger: React.ReactNode;
}

export function AccessibilitySheet({
    temperature,
    precipitation,
    windSpeed,
    windDirection,
    trigger,
}: AccessibilitySheetProps) {
    return (
        <Sheet>
            <SheetTrigger asChild>
                {trigger}
            </SheetTrigger>
            <SheetContent side="right" className="bg-white w-full sm:max-w-2xl overflow-y-auto">
                <div className="mx-auto w-full max-w-4xl">
                    <SheetHeader className="text-center space-y-2">
                        <SheetTitle className="text-3xl font-bold text-gray-900">
                            Accessibility & Weather Information
                        </SheetTitle>
                        <SheetDescription className="text-gray-600 text-base">
                            Current weather conditions and accessibility information
                        </SheetDescription>
                    </SheetHeader>

                    <div className="overflow-y-auto">
                        <WeatherWidget
                            temperature={temperature}
                            precipitation={precipitation}
                            windSpeed={windSpeed}
                            windDirection={windDirection}
                        />
                    </div>

                    <SheetFooter className="border-t border-gray-200 pt-4">
                        <SheetClose asChild>
                            <div className="flex justify-center w-full">
                                <Button className="w-full max-w-sm bg-gray-900 text-white hover:bg-gray-800 transition-all">
                                    Close
                                </Button>
                            </div>
                        </SheetClose>
                    </SheetFooter>
                </div>
            </SheetContent>
        </Sheet>
    );
}

