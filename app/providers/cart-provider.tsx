"use client"

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { MealOrder, IndividualItem } from "@/lib/types";
import { toast } from "sonner";

interface CartContextType {
  meals: MealOrder[];
  individualItems: IndividualItem[];
  addMeal: (meal: MealOrder) => void;
  addIndividualItem: (item: IndividualItem) => void;
  removeMeal: (index: number) => void;
  removeIndividualItem: (index: number) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = "cart_state";

export function CartProvider({ children }: { children: ReactNode }) {
  const [meals, setMeals] = useState<MealOrder[]>([]);
  const [individualItems, setIndividualItems] = useState<IndividualItem[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);

  // Load cart from localStorage on mount
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem(CART_STORAGE_KEY);
      if (savedCart) {
        const parsed = JSON.parse(savedCart);
        setMeals(parsed.meals || []);
        setIndividualItems(parsed.individualItems || []);
      }
    } catch (error) {
      console.error("Failed to load cart from localStorage:", error);
    } finally {
      setIsInitialized(true);
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    if (isInitialized) {
      try {
        localStorage.setItem(
          CART_STORAGE_KEY,
          JSON.stringify({ meals, individualItems })
        );
      } catch (error) {
        console.error("Failed to save cart to localStorage:", error);
      }
    }
  }, [meals, individualItems, isInitialized]);

  const addMeal = (meal: MealOrder) => {
    setMeals((prev) => [...prev, meal]);
  };

  const addIndividualItem = (item: IndividualItem) => {
    setIndividualItems((prev) => [...prev, item]);
  };

  const removeMeal = (index: number) => {
    setMeals((prev) => prev.filter((_, i) => i !== index));
  };

  const removeIndividualItem = (index: number) => {
    setIndividualItems((prev) => prev.filter((_, i) => i !== index));
  };

  const clearCart = () => {
    setMeals([]);
    setIndividualItems([]);
    localStorage.removeItem(CART_STORAGE_KEY);
  };

  return (
    <CartContext.Provider
      value={{
        meals,
        individualItems,
        addMeal,
        addIndividualItem,
        removeMeal,
        removeIndividualItem,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}

