"use client";

import * as React from "react";
import { buildCartItemKey } from "@/lib/cart-key";
import type { CartItem, CartItemAddon, CartItemVariant } from "@/types/cart";

interface AddToCartInput {
  dishId: number;
  dishName: string;
  dishImageUrl: string | null;
  unitPrice: number;
  quantity: number;
  variant: CartItemVariant | null;
  addons: CartItemAddon[];
  comment: string | null;
}

interface CartContextValue {
  items: CartItem[];
  itemCount: number;
  subtotal: number;
  addItem: (input: AddToCartInput) => void;
  updateQuantity: (key: string, quantity: number) => void;
  removeItem: (key: string) => void;
  clear: () => void;
}

const CartContext = React.createContext<CartContextValue | null>(null);

export function useCart(): CartContextValue {
  const context = React.useContext(CartContext);

  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }

  return context;
}

function lineTotal(item: CartItem): number {
  const addonsTotal = item.addons.reduce((sum, addon) => sum + addon.price, 0);
  return (item.unitPrice + addonsTotal) * item.quantity;
}

export function CartProvider({ cafeSlug, children }: { cafeSlug: string; children: React.ReactNode }) {
  const storageKey = `menzo_cart_${cafeSlug}`;
  const [items, setItems] = React.useState<CartItem[]>([]);
  const isHydrated = React.useRef(false);

  React.useEffect(() => {
    try {
      const raw = window.localStorage.getItem(storageKey);
      if (raw) setItems(JSON.parse(raw));
    } catch {
      // Corrupt or inaccessible storage — start with an empty cart.
    } finally {
      isHydrated.current = true;
    }
  }, [storageKey]);

  React.useEffect(() => {
    if (!isHydrated.current) return;
    window.localStorage.setItem(storageKey, JSON.stringify(items));
  }, [items, storageKey]);

  const addItem = React.useCallback((input: AddToCartInput) => {
    const key = buildCartItemKey(input.dishId, input.variant, input.addons, input.comment);

    setItems((current) => {
      const existingIndex = current.findIndex((item) => item.key === key);

      if (existingIndex >= 0) {
        const next = [...current];
        const existing = next[existingIndex]!;
        next[existingIndex] = { ...existing, quantity: existing.quantity + input.quantity };
        return next;
      }

      return [
        ...current,
        {
          key,
          dishId: input.dishId,
          dishName: input.dishName,
          dishImageUrl: input.dishImageUrl,
          unitPrice: input.unitPrice,
          quantity: input.quantity,
          variant: input.variant,
          addons: input.addons,
          comment: input.comment,
        },
      ];
    });
  }, []);

  const updateQuantity = React.useCallback((key: string, quantity: number) => {
    setItems((current) => {
      if (quantity <= 0) {
        return current.filter((item) => item.key !== key);
      }

      return current.map((item) => (item.key === key ? { ...item, quantity } : item));
    });
  }, []);

  const removeItem = React.useCallback((key: string) => {
    setItems((current) => current.filter((item) => item.key !== key));
  }, []);

  const clear = React.useCallback(() => setItems([]), []);

  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = items.reduce((sum, item) => sum + lineTotal(item), 0);

  const value = React.useMemo<CartContextValue>(
    () => ({ items, itemCount, subtotal, addItem, updateQuantity, removeItem, clear }),
    [items, itemCount, subtotal, addItem, updateQuantity, removeItem, clear]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}
