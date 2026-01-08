"use client";

import React, { createContext, useContext, useState, ReactNode, useCallback } from 'react';
import type { CartItem } from '@/lib/types';
import { useToast } from './use-toast';
import { useEffect } from "react";

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (item: Omit<CartItem, 'quantity'>) => void;
  removeFromCart: (productId: string) => void;
updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  cartTotal: number;
  cartCount: number;
}
const CART_STORAGE_KEY = "riva_cart";


const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {

const [cartItems, setCartItems] = useState<CartItem[]>(() => {
  if (typeof window === "undefined") return [];
  try {
    const stored = localStorage.getItem(CART_STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
});

const { toast } = useToast();

useEffect(() => {
  if (typeof window !== "undefined") {
    localStorage.setItem(
      CART_STORAGE_KEY,
      JSON.stringify(cartItems)
    );
  }
}, [cartItems]);

const addToCart = useCallback(
  (itemToAdd: Omit<CartItem, "quantity">) => {
    setCartItems((prevItems) => {
      const existingItem = prevItems.find(
        (item) => item.productId === itemToAdd.productId
      );

      // ✅ Same product → increase quantity
      if (existingItem) {
        return prevItems.map((item) =>
          item.productId === itemToAdd.productId
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }

      // ✅ New product → add new row
      return [...prevItems, { ...itemToAdd, quantity: 1 }];
    });

    toast({
      title: "Added to cart",
      description: `${itemToAdd.name} has been added to your cart.`,
    });
  },
  [toast]
);


 const removeFromCart = useCallback((productId: string) => {
  setCartItems((prevItems) =>
    prevItems.filter((item) => item.productId !== productId)
  );

  toast({
    title: "Item removed",
    description: "The item has been removed from your cart.",
  });
}, [toast]);


  const updateQuantity = useCallback(
  (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }

    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.productId === productId
          ? { ...item, quantity }
          : item
      )
    );
  },
  [removeFromCart]
);


  const clearCart = useCallback(() => {
    setCartItems([]);
  }, []);

  const cartTotal = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  const cartCount = cartItems.reduce((count, item) => count + item.quantity, 0);

  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, updateQuantity, clearCart, cartTotal, cartCount }}>
      {children}
    </CartContext.Provider>
  );
};


export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
