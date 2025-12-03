import { toast } from "sonner";
import { MealOrder, IndividualItem, OrderInfo } from "@/lib/types";

interface AddToCartOptions {
  onSuccess?: () => void;
  successMessage?: string;
  loadingMessage?: string;
  errorMessage?: string;
}

export function useAddToCartToast() {
  const addItemWithToast = async (
    addItem: () => void,
    options: AddToCartOptions = {}
  ) => {
    const {
      onSuccess,
      successMessage = "Item has been added to cart",
      loadingMessage = "Adding to cart...",
      errorMessage = "Failed to add item to cart",
    } = options;

    const addToCartPromise = new Promise<void>((resolve, reject) => {
      try {
        addItem();
        resolve();
        onSuccess?.();
      } catch (error) {
        reject(error);
      }
    });

    toast.promise(addToCartPromise, {
      loading: loadingMessage,
      success: successMessage,
      error: errorMessage,
    });

    return addToCartPromise;
  };

  const addMealWithToast = async (
    addMeal: () => void,
    options: AddToCartOptions = {}
  ) => {
    const {
      onSuccess,
      successMessage = "Meal has been added to cart",
      loadingMessage = "Adding to cart...",
      errorMessage = "Failed to add meal to cart",
    } = options;

    const addToCartPromise = new Promise<void>((resolve, reject) => {
      try {
        addMeal();
        resolve();
        onSuccess?.();
      } catch (error) {
        reject(error);
      }
    });

    toast.promise(addToCartPromise, {
      loading: loadingMessage,
      success: successMessage,
      error: errorMessage,
    });

    return addToCartPromise;
  };

  const addOrderInfoWithToast = async (
    orderInfo: OrderInfo,
  ) => {
    console.log(JSON.stringify(orderInfo, null, 2))
    toast.success("Order placed successfully")
  }

  return {
    addItemWithToast,
    addMealWithToast,
    addOrderInfoWithToast,
  };
}

