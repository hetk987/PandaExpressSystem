"use client";

import React, { useState, useEffect } from "react";
import { useCart } from "@/app/providers/cart-provider";
import { MealOrder, IndividualItem, OrderInfo, MealType, Recipe } from "@/lib/types";

export default function TestChat() {
  const { meals, individualItems, addMeal, addIndividualItem } = useCart();
  const [mealtypes, setMealtypes] = useState<MealType[]>([]);
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [messages, setMessages] = useState<{ role: "user" | "assistant"; text: string }[]>([]);
  const [input, setInput] = useState("");

  // Helper function to limit messages to the 10 most recent
  const addMessage = (message: { role: "user" | "assistant"; text: string }) => {
    setMessages(prev => {
      const updated = [...prev, message];
      // Keep only the last 10 messages
      return updated.slice(-10);
    });
  };

  const validateMeal = (meal: MealOrder): MealOrder | null => {
    const validMealType = mealtypes.find(mt => mt.typeName === meal.mealType);
    if (!validMealType) {
      console.warn("Invalid meal type:", meal.mealType);
      return null;
    }

    const validateSelections = (selections: { entrees: any[], sides: any[], drinks: any[] }) => {
      const filterValid = (items: any[], type: "Entree" | "Side" | "Drink") =>
        items.filter(i => {
          const valid = recipes.some(r => r.id === i.recipeId && r.type === type);
          if (!valid) console.warn(`Invalid ${type}:`, i);
          return valid;
        });
      
      const validated = {
        entrees: filterValid(selections.entrees || [], "Entree"),
        sides: filterValid(selections.sides || [], "Side"),
        drinks: filterValid(selections.drinks || [], "Drink")
      };
      
      // Validate that counts match meal type requirements
      if (validated.entrees.length !== validMealType.entrees) {
        console.warn(`Meal requires ${validMealType.entrees} entrees, got ${validated.entrees.length}`);
        return null;
      }
      if (validated.sides.length !== validMealType.sides) {
        console.warn(`Meal requires ${validMealType.sides} sides, got ${validated.sides.length}`);
        return null;
      }
      if (validated.drinks.length !== validMealType.drinks) {
        console.warn(`Meal requires ${validMealType.drinks} drinks, got ${validated.drinks.length}`);
        return null;
      }
      
      return validated;
    };

    const validatedSelections = validateSelections(meal.selections);
    if (!validatedSelections) {
      return null;
    }

    // Use the correct price from meal type if not provided or different
    const price = validMealType.price;

    return {
      ...meal,
      price: price,
      quantity: meal.quantity || 1,
      selections: validatedSelections
    };
  };

  const validateIndividualItem = (item: IndividualItem): IndividualItem | null => {
    const recipe = recipes.find(r => r.id === item.recipeId && r.type === item.recipeType);
    if (!recipe) {
      console.warn("Invalid individual item:", item);
      return null;
    }
    
    // Auto-fill price if missing or invalid
    const price = item.price && item.price > 0 ? item.price : (recipe.pricePerServing || 0);
    
    return {
      ...item,
      price: price,
      quantity: item.quantity || 1
    };
  };

  const handleFunctionCall = (jsonString: string) => {
    try {
      console.log("Processing function call with arguments:", jsonString);
      const args = JSON.parse(jsonString) as OrderInfo;

      let addedCount = 0;

      // Add valid meals
      if (args.meals && Array.isArray(args.meals)) {
        args.meals.forEach(m => {
          const validMeal = validateMeal(m);
          if (validMeal) {
            console.log("Adding valid meal:", validMeal);
            addMeal(validMeal);
            addedCount++;
          }
        });
      }

      // Add valid individual items
      if (args.individualItems && Array.isArray(args.individualItems)) {
        args.individualItems.forEach(i => {
          const validItem = validateIndividualItem(i);
          if (validItem) {
            console.log("Adding valid individual item:", validItem);
            addIndividualItem(validItem);
            addedCount++;
          }
        });
      }

      if (addedCount > 0) {
        addMessage({ 
          role: "assistant", 
          text: `✓ Added ${addedCount} item(s) to your cart` 
        });
      } else {
        addMessage({ 
          role: "assistant", 
          text: "⚠ No valid items were added to cart. Please check that all items and meal selections are valid." 
        });
      }
    } catch (err) {
      console.error("Failed to parse function call", err);
      addMessage({ 
        role: "assistant", 
        text: "Failed to add items to cart. Please try again or rephrase your request." 
      });
    }
  };

  // fetch recipes and meal types
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [recipesRes, mealtypesRes] = await Promise.all([
          fetch("/api/recipes"),
          fetch("/api/mealtypes"),
        ]);

        if (recipesRes.ok) {
          const recipesData = await recipesRes.json();
          setRecipes(recipesData);
          console.log("Loaded recipes:", recipesData.length);
        }
        if (mealtypesRes.ok) {
          const mealtypesData = await mealtypesRes.json();
          setMealtypes(mealtypesData);
          console.log("Loaded meal types:", mealtypesData.length);
        }
      } catch (err) {
        console.error("Failed to fetch recipes or meal types", err);
      }
    };
    fetchData();
  }, []);

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = input;
    const currentMessages = messages; // Capture current messages before state update
    addMessage({ role: "user", text: input });
    setInput("");

    try {
      // Send conversation history along with the new message
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          message: userMessage,
          conversationHistory: currentMessages
        })
      });

      if (!res.ok) {
        throw new Error(`API returned ${res.status}`);
      }

      const data = await res.json();
      console.log("API Response:", data);

      // If bot sent a function call, handle it
      if (data.function_call) {
        console.log("Function call detected:", data.function_call);
        handleFunctionCall(data.function_call.arguments);
      }

      // Display bot message
      const botMessage = data.message || data.text;
      if (botMessage) {
        addMessage({ role: "assistant", text: botMessage });
      } else if (!data.function_call) {
        console.warn("No message or function_call in response", data);
      }
    } catch (err) {
      console.error("Chat error:", err);
      addMessage({ 
        role: "assistant", 
        text: "Error contacting bot" 
      });
    }
  };

  return (
    <div className="p-10">
      <h1 className="text-2xl font-bold mb-4">Chat with Kiosk Bot</h1>

      <div className="mb-4 space-y-2 max-h-96 overflow-y-auto border border-gray-300 rounded p-4">
        {messages.length === 0 && (
          <div className="text-gray-400 text-center">
            Start a conversation with the bot...
          </div>
        )}
        {messages.map((m, i) => (
          <div key={i} className={m.role === "user" ? "text-right" : "text-left"}>
            <span className={`inline-block p-2 rounded ${m.role === "user" ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-800"}`}>
              {m.text}
            </span>
          </div>
        ))}
      </div>

      <div className="flex gap-2">
        <input
          className="flex-1 border border-gray-300 p-2 rounded"
          placeholder="Type your message..."
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === "Enter" && handleSendMessage()}
        />
        <button 
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700" 
          onClick={handleSendMessage}
        >
          Send
        </button>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-4">
        <div>
          <h2 className="text-xl font-bold mb-2">Current Cart</h2>
          <div className="bg-gray-100 p-4 rounded max-h-96 overflow-auto">
            <div className="mb-4">
              <h3 className="font-semibold">Meals ({meals.length})</h3>
              {meals.length === 0 ? (
                <p className="text-gray-500 text-sm">No meals in cart</p>
              ) : (
                <ul className="list-disc list-inside text-sm">
                  {meals.map((meal, i) => (
                    <li key={i}>{meal.mealType}</li>
                  ))}
                </ul>
              )}
            </div>
            <div>
              <h3 className="font-semibold">Individual Items ({individualItems.length})</h3>
              {individualItems.length === 0 ? (
                <p className="text-gray-500 text-sm">No individual items in cart</p>
              ) : (
                <ul className="list-disc list-inside text-sm">
                  {individualItems.map((item, i) => (
                    <li key={i}>{item.recipeType} (ID: {item.recipeId})</li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>

        <div>
          <h2 className="text-xl font-bold mb-2">Cart JSON</h2>
          <pre className="bg-gray-100 p-4 rounded max-h-96 overflow-auto text-xs">
            {JSON.stringify({ meals, individualItems }, null, 2)}
          </pre>
        </div>
      </div>

      <div className="mt-4 text-sm text-gray-600">
        <p>Available: {recipes.length} recipes, {mealtypes.length} meal types</p>
      </div>
    </div>
  );
}