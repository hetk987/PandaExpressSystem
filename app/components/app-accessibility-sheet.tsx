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
import { Switch } from "@/app/components/ui/switch";
import { Label } from "@/app/components/ui/label";
import { Card, CardContent } from "@/app/components/ui/card";
import { Separator } from "@/app/components/ui/separator";
import { WeatherWidget } from "./app-weather-widget";
import { useAccessibility, TextSize } from "@/app/providers/accessibility-provider";
import { useAccessibilityStyles } from "@/hooks/use-accessibility-styles";
import { cn } from "@/lib/utils";
import { Type, Accessibility, X } from "lucide-react";

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
    const { textSize, isBold, setTextSize, setIsBold } = useAccessibility();
    const { textClasses } = useAccessibilityStyles();

    const textSizeOptions: { value: TextSize; label: string }[] = [
        { value: "small", label: "Small" },
        { value: "medium", label: "Medium" },
        { value: "large", label: "Large" },
        { value: "extra-large", label: "Extra Large" },
    ];

    return (
        <Sheet>
            <SheetTrigger asChild>
                {trigger}
            </SheetTrigger>
            <SheetContent 
                side="right" 
                className="bg-gradient-to-br from-slate-50 to-slate-100 w-full sm:max-w-2xl overflow-y-auto border-l border-slate-200"
            >
                <div className="mx-auto w-full max-w-4xl h-full flex flex-col">
                    <SheetHeader className="space-y-3 pb-6">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="p-2.5 bg-gradient-to-br from-red-500 to-red-600 rounded-xl shadow-lg">
                                    <Accessibility className="w-6 h-6 text-white" />
                                </div>
                                <div>
                                    <SheetTitle className={`text-2xl font-bold text-slate-900 text-left ${textClasses}`}>
                                        Accessibility Settings
                                    </SheetTitle>
                                    <SheetDescription className={`text-slate-600 text-sm text-left ${textClasses}`}>
                                        Customize your viewing experience
                                    </SheetDescription>
                                </div>
                            </div>
                        </div>
                    </SheetHeader>

                    <div className="flex-1 space-y-6 overflow-y-auto pb-6">
                        {/* Accessibility Controls Card */}
                        <Card className="border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                            <CardContent className="p-6 space-y-6">
                                <div className="flex items-center gap-2 mb-4">
                                    <Type className="w-5 h-5 text-red-600" />
                                    <h3 className={`text-lg font-semibold text-slate-900 ${textClasses}`}>
                                        Text Preferences
                                    </h3>
                                </div>
                                
                                <Separator className="bg-slate-200" />
                                
                                {/* Text Size Selector */}
                                <div className="space-y-3">
                                    <Label className={`text-sm font-medium text-slate-700 ${textClasses}`}>
                                        Font Size
                                    </Label>
                                    <div className="grid grid-cols-2 gap-3">
                                        {textSizeOptions.map((option) => (
                                            <Button
                                                key={option.value}
                                                variant={textSize === option.value ? "default" : "outline"}
                                                onClick={() => setTextSize(option.value)}
                                                className={cn(
                                                    `w-full transition-all duration-200 font-medium ${textClasses}`,
                                                    textSize === option.value
                                                        ? "bg-gradient-to-r from-red-600 to-red-700 text-white hover:from-red-700 hover:to-red-800 shadow-md"
                                                        : "bg-white text-slate-700 hover:bg-slate-50 border-slate-300 hover:border-red-300"
                                                )}
                                            >
                                                {option.label}
                                            </Button>
                                        ))}
                                    </div>
                                </div>

                                <Separator className="bg-slate-200" />

                                {/* Bold Text Toggle */}
                                <div className="flex items-center justify-between p-4 rounded-lg bg-slate-50 border border-slate-200">
                                    <div className="space-y-0.5">
                                        <Label 
                                            htmlFor="bold-toggle" 
                                            className={`text-sm font-medium text-slate-900 cursor-pointer ${textClasses}`}
                                        >
                                            Bold Text
                                        </Label>
                                        <p className={`text-xs text-slate-600 ${textClasses}`}>
                                            Make all text appear bolder
                                        </p>
                                    </div>
                                    <Switch
                                        id="bold-toggle"
                                        checked={isBold}
                                        onCheckedChange={setIsBold}
                                        className="data-[state=checked]:bg-red-600"
                                    />
                                </div>
                            </CardContent>
                        </Card>

                        {/* Weather Widget Card */}
                        <Card className="border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                            <CardContent className="p-6">
                                <div className="mb-4">
                                    <h3 className={`text-lg font-semibold text-slate-900 ${textClasses}`}>
                                        Current Weather
                                    </h3>
                                    <p className={`text-sm text-slate-600 ${textClasses}`}>
                                        Real-time weather conditions
                                    </p>
                                </div>
                                
                                <Separator className="mb-6 bg-slate-200" />
                                
                                <WeatherWidget
                                    temperature={temperature}
                                    precipitation={precipitation}
                                    windSpeed={windSpeed}
                                    windDirection={windDirection}
                                />
                            </CardContent>
                        </Card>
                    </div>

                    {/* <SheetFooter className="border-t border-slate-200 pt-4 mt-auto bg-gradient-to-br from-slate-50 to-slate-100">
                        <SheetClose asChild>
                            <Button 
                                className="w-full bg-gradient-to-r from-slate-700 to-slate-900 text-white hover:from-slate-800 hover:to-black transition-all shadow-md hover:shadow-lg font-medium"
                                size="lg"
                            >
                                <X className="w-4 h-4 mr-2" />
                                Close Settings
                            </Button>
                        </SheetClose>
                    </SheetFooter> */}
                </div>
            </SheetContent>
        </Sheet>
    );
}