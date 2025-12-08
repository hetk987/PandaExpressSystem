// /app/api/chat/route.ts
import { NextResponse } from "next/server";
import OpenAI from "openai";
import { OrderInfo, MealType, Recipe } from "@/lib/types";
import { getMealTypes } from "@/app/services/mealTypeService";
import { getRecipes } from "@/app/services/recipeService";

const client = new OpenAI({
  apiKey: process.env.OPEN_AI_SECRET
});

if (!process.env.OPEN_AI_SECRET) {
  console.error("OPEN_AI_SECRET is missing!");
}

export async function POST(req: Request) {
  const body = await req.json();
  const userMessage = body.message as string;
  const conversationHistory = body.conversationHistory as { role: "user" | "assistant"; text: string }[] || [];

  // Fetch available meal types and recipes
  let mealtypes: MealType[] = [];
  let recipes: Recipe[] = [];
  
  try {
    const [mealtypesData, recipesData] = await Promise.all([
      getMealTypes(),
      getRecipes()
    ]);
    
    // Filter and cast meal types - use empty string for null imageFilePath
    mealtypes = mealtypesData
      .map((mt: any) => ({
        typeName: mt.typeName,
        sides: mt.sides,
        entrees: mt.entrees,
        drinks: mt.drinks,
        price: mt.price,
        imageFilePath: mt.imageFilePath || ""
      }));
    
    // Filter and cast recipes - ensure required fields are present and filter out null types
    recipes = recipesData
      .filter((r: any) => r.type != null && r.id != null)
      .map((r: any) => ({
        name: r.name,
        image: r.image,
        id: r.id,
        pricePerServing: r.pricePerServing,
        ordersPerBatch: r.ordersPerBatch,
        type: r.type as Recipe["type"],
        premium: r.premium ?? false
      }));
  } catch (error) {
    console.error("Failed to fetch meal types or recipes:", error);
  }

  // Build system prompt with available options
  const buildSystemPrompt = (mealtypes: MealType[], recipes: Recipe[]): string => {
    let prompt = "You are an AI assistant for a Panda Express Kiosk. Your goal is to help the customer add items to their cart. Please be kind and helpful. Please keep your messages brief and tell the customer what actions you take. You can only add items to the cart, you cannot remove items from the cart, and you cannot navigate the Kiosk.\n\n";
    
    prompt += "AVAILABLE MEAL TYPES:\n";
    mealtypes
      .filter(mt => mt.typeName !== "Drink" && mt.typeName !== "A La Carte" && !mt.typeName.includes("Party"))
      .forEach(mt => {
        prompt += `- ${mt.typeName}: $${mt.price.toFixed(2)} (${mt.entrees} entree(s), ${mt.sides} side(s), ${mt.drinks} drink(s))\n`;
      });
    
    prompt += "\nAVAILABLE RECIPES:\n";
    const recipesByType = {
      Entree: recipes.filter(r => r.type === "Entree"),
      Side: recipes.filter(r => r.type === "Side"),
      Drink: recipes.filter(r => r.type === "Drink"),
      Appetizer: recipes.filter(r => r.type === "Appetizer")
    };
    
    Object.entries(recipesByType).forEach(([type, items]) => {
      if (items.length > 0) {
        prompt += `\n${type}s:\n`;
        items.forEach(r => {
          const price = r.pricePerServing != null ? r.pricePerServing.toFixed(2) : "N/A";
          prompt += `  - ${r.name} (ID: ${r.id}) - $${price}\n`;
        });
      }
    });
    
    prompt += "\nINSTRUCTIONS:\n";
    prompt += "- When a customer orders a meal, you must select the exact number of entrees, sides, and drinks required by the meal type.\n";
    prompt += "- Use recipe IDs and names when adding items to cart.\n";
    prompt += "- For meals, provide the mealType name exactly as listed above.\n";
    prompt += "- For individual items, use the recipeType (Entree, Side, Drink, or Appetizer).\n";
    prompt += "- IMPORTANT: You can only ADD items to the cart. You cannot remove items from the cart. If a customer asks to remove items, politely inform them that you can only add items and suggest they check their cart separately.\n";
    
    return prompt;
  };

  const systemPrompt = buildSystemPrompt(mealtypes, recipes);

  // Build messages array with system prompt, conversation history, and new user message
  const messages: Array<{ role: "system" | "user" | "assistant"; content: string }> = [
    {
      role: "system",
      content: systemPrompt
    }
  ];

  // Add conversation history (convert to OpenAI format)
  conversationHistory.forEach((msg: { role: "user" | "assistant"; text: string }) => {
    if (msg.role === "user" || msg.role === "assistant") {
      messages.push({
        role: msg.role,
        content: msg.text
      });
    }
  });

  // Add the new user message
  messages.push({ role: "user", content: userMessage });

  const response = await client.chat.completions.create({
    model: "gpt-4o-mini",
    messages: messages,
    functions: [
      {
        name: "addToCart",
        description: "Adds meals or individual items to the cart. Use this function when the customer wants to add items to their order.",
        parameters: {
          type: "object",
          properties: {
            meals: {
              type: "array",
              description: "Array of meal orders. Each meal must include all required entrees, sides, and drinks based on the meal type requirements.",
              items: {
                type: "object",
                properties: {
                  mealType: {
                    type: "string",
                    description: "The name of the meal type (e.g., 'Bowl', 'Plate', 'Bigger Plate')"
                  },
                  quantity: {
                    type: "number",
                    description: "Number of this meal to add (usually 1)"
                  },
                  price: {
                    type: "number",
                    description: "Price of the meal type"
                  },
                  selections: {
                    type: "object",
                    description: "Selections for this meal, must match the meal type requirements",
                    properties: {
                      entrees: {
                        type: "array",
                        description: "Array of entrees. Must match the number required by the meal type.",
                        items: {
                          type: "object",
                          properties: {
                            recipeId: { type: "number", description: "The recipe ID of the entree" },
                            recipeName: { type: "string", description: "The name of the entree recipe" }
                          },
                          required: ["recipeId", "recipeName"]
                        }
                      },
                      sides: {
                        type: "array",
                        description: "Array of sides. Must match the number required by the meal type.",
                        items: {
                          type: "object",
                          properties: {
                            recipeId: { type: "number", description: "The recipe ID of the side" },
                            recipeName: { type: "string", description: "The name of the side recipe" }
                          },
                          required: ["recipeId", "recipeName"]
                        }
                      },
                      drinks: {
                        type: "array",
                        description: "Array of drinks. Must match the number required by the meal type.",
                        items: {
                          type: "object",
                          properties: {
                            recipeId: { type: "number", description: "The recipe ID of the drink" },
                            recipeName: { type: "string", description: "The name of the drink recipe" }
                          },
                          required: ["recipeId", "recipeName"]
                        }
                      }
                    },
                    required: ["entrees", "sides", "drinks"]
                  }
                },
                required: ["mealType", "quantity", "price", "selections"]
              }
            },
            individualItems: {
              type: "array",
              description: "Array of individual items (entrees, sides, drinks, or appetizers) that are not part of a meal",
              items: {
                type: "object",
                properties: {
                  recipeId: {
                    type: "number",
                    description: "The recipe ID of the item"
                  },
                  recipeName: {
                    type: "string",
                    description: "The name of the recipe"
                  },
                  recipeType: {
                    type: "string",
                    enum: ["Entree", "Side", "Drink", "Appetizer"],
                    description: "The type of recipe"
                  },
                  quantity: {
                    type: "number",
                    description: "Quantity of this item"
                  },
                  price: {
                    type: "number",
                    description: "Price per serving of this recipe"
                  }
                },
                required: ["recipeId", "recipeName", "recipeType", "quantity", "price"]
              }
            }
          },
          required: []
        }
      }
    ]
  });

  const msg = response.choices[0].message;

  if (msg.function_call?.name === "addToCart") {
    // Return the function call to the frontend so it can handle adding to cart
    return NextResponse.json({
      type: "function-called",
      message: "Items added to cart.",
      function_call: {
        name: msg.function_call.name,
        arguments: msg.function_call.arguments
      }
    });
  }

  return NextResponse.json({
    type: "message",
    message: msg.content
  });
}