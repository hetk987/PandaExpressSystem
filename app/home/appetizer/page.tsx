"use client";

import { useAccessibilityStyles } from "@/hooks/use-accessibility-styles";

export default function Home() {
  const { textClasses } = useAccessibilityStyles();
  
  return (
    <div className={`p-10 ${textClasses}`}>
        <h1 className={`text-4xl font-bold mb-8 ${textClasses}`}>Appetizers</h1>
    </div>
  );
}