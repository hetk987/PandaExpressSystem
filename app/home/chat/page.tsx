"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { useCart } from "@/app/providers/cart-provider";
import { MealOrder, IndividualItem, OrderInfo, MealType, Recipe } from "@/lib/types";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { useAccessibilityStyles } from "@/hooks/use-accessibility-styles";
import { Send, Volume2, VolumeX } from "lucide-react";

export default function TestChat() {
  const { meals, individualItems, addMeal, addIndividualItem } = useCart();
  const { textClasses } = useAccessibilityStyles();
  const [mealtypes, setMealtypes] = useState<MealType[]>([]);
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [messages, setMessages] = useState<{ role: "user" | "assistant"; text: string }[]>([]);
  const [input, setInput] = useState("");
  const [isTTSEnabled, setIsTTSEnabled] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const lastBotMessageRef = useRef<string>("");
  const speechSynthesisRef = useRef<SpeechSynthesisUtterance | null>(null);

  // Text-to-speech function using browser's native API
  const speakText = useCallback((text: string) => {
    if (!isTTSEnabled || !text.trim()) return;
    
    // Stop any current speech
    if (speechSynthesisRef.current) {
      window.speechSynthesis.cancel();
    }

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1;
    utterance.pitch = 1;
    utterance.volume = 1;
    
    speechSynthesisRef.current = utterance;
    window.speechSynthesis.speak(utterance);
  }, [isTTSEnabled]);

  const stopSpeaking = useCallback(() => {
    window.speechSynthesis.cancel();
    speechSynthesisRef.current = null;
  }, []);

  // Helper function to limit messages to the 10 most recent
  const addMessage = (message: { role: "user" | "assistant"; text: string }) => {
    setMessages(prev => {
      const updated = [...prev, message];
      // Keep only the last 10 messages
      return updated.slice(-10);
    });
  };

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Cleanup speech on unmount
  useEffect(() => {
    return () => {
      window.speechSynthesis.cancel();
    };
  }, []);

  // Speak bot messages when they arrive
  useEffect(() => {
    const lastMessage = messages[messages.length - 1];
    if (lastMessage && lastMessage.role === "assistant" && lastMessage.text !== lastBotMessageRef.current) {
      lastBotMessageRef.current = lastMessage.text;
      if (isTTSEnabled && lastMessage.text) {
        // Small delay to ensure message is displayed before speaking
        setTimeout(() => {
          speakText(lastMessage.text);
        }, 300);
      }
    }
  }, [messages, isTTSEnabled, speakText]);


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

  const handleSendMessage = async (messageText?: string) => {
    const textToSend = messageText || input.trim();
    if (!textToSend) return;

    const userMessage = textToSend;
    const currentMessages = messages; // Capture current messages before state update
    addMessage({ role: "user", text: userMessage });
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
    <div className="flex flex-col h-full min-h-0">
      {/* Header */}
      <div className="p-6 border-b border-border shrink-0">
        <h1 className={`text-3xl font-bold text-tamu-maroon ${textClasses}`}>
          Chat with Kiosk Bot
        </h1>
        <p className={`text-muted-foreground mt-1 ${textClasses}`}>
          Ask me about menu items, place orders, or get recommendations
        </p>
      </div>

      {/* Messages Container */}
      <div 
        className="flex-1 overflow-y-auto p-6 space-y-4 bg-neutral-50 min-h-0"
      >
        {messages.length === 0 && (
          <div className={`text-center text-muted-foreground mt-12 ${textClasses}`}>
            <div className="max-w-md mx-auto space-y-2">
              <p className="text-lg font-medium">Start a conversation</p>
              <p className="text-sm">
                Try asking: &quot;I&apos;d like to order orange chicken&quot; or &quot;What entrees do you have?&quot;
              </p>
            </div>
          </div>
        )}
        {messages.map((m, i) => (
          <div 
            key={i} 
            className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[80%] rounded-xl px-4 py-3 ${
                m.role === "user"
                  ? "bg-tamu-maroon text-white rounded-br-sm"
                  : "bg-white text-foreground border border-border rounded-bl-sm shadow-sm"
              } ${textClasses}`}
            >
              <p className="whitespace-pre-wrap wrap-break-word">{m.text}</p>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Container - Fixed at Bottom */}
      <div className="sticky bottom-0 bg-white border-t border-border p-4 shadow-lg shrink-0">
        <div className="flex gap-3 max-w-4xl mx-auto">
          <Input
            className={`flex-1 ${textClasses}`}
            placeholder="Type your message..."
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === "Enter" && !e.shiftKey && handleSendMessage()}
          />
          
          {/* Text-to-Speech Toggle Button */}
          <Button
            variant={isTTSEnabled ? "default" : "outline"}
            className={isTTSEnabled ? "bg-tamu-maroon hover:bg-tamu-maroon-dark text-white" : ""}
            onClick={() => {
              setIsTTSEnabled(!isTTSEnabled);
              if (!isTTSEnabled && window.speechSynthesis.speaking) {
                stopSpeaking();
              }
            }}
            title={isTTSEnabled ? "Disable text-to-speech" : "Enable text-to-speech"}
          >
            {isTTSEnabled ? (
              <>
                <Volume2 className="h-4 w-4 mr-2" />
                <span className="sr-only">Disable text-to-speech</span>
              </>
            ) : (
              <>
                <VolumeX className="h-4 w-4 mr-2" />
                <span className="sr-only">Enable text-to-speech</span>
              </>
            )}
          </Button>
          
          <Button 
            className="bg-tamu-maroon hover:bg-tamu-maroon-dark text-white px-6"
            onClick={() => handleSendMessage()}
            disabled={!input.trim()}
          >
            <Send className="h-4 w-4" />
            <span className="sr-only">Send message</span>
          </Button>
        </div>
      </div>
    </div>
  );
}