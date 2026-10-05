import { useSyncExternalStore } from "react";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { CartItem } from "@/types/cart";

type CartState = {
  items: CartItem[];
  addItem: (productId: string, variantId: string, quantity: number) => void;
  removeItem: (variantId: string) => void;
  setQuantity: (variantId: string, quantity: number) => void;
  clear: () => void;
};

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      items: [],
      addItem: (productId, variantId, quantity) =>
        set((state) => {
          const existing = state.items.find(
            (item) => item.variantId === variantId
          );
          if (existing) {
            return {
              items: state.items.map((item) =>
                item.variantId === variantId
                  ? { ...item, quantity: item.quantity + quantity }
                  : item
              ),
            };
          }
          return {
            items: [...state.items, { productId, variantId, quantity }],
          };
        }),
      removeItem: (variantId) =>
        set((state) => ({
          items: state.items.filter((item) => item.variantId !== variantId),
        })),
      setQuantity: (variantId, quantity) =>
        set((state) => ({
          items: state.items.map((item) =>
            item.variantId === variantId ? { ...item, quantity } : item
          ),
        })),
      clear: () => set({ items: [] }),
    }),
    { name: "cart-v1" }
  )
);

function getCartCountSnapshot(): number {
  return useCartStore
    .getState()
    .items.reduce((sum, item) => sum + item.quantity, 0);
}

function getServerCartCountSnapshot(): number {
  return 0;
}

/**
 * Hydration-safe cart item count: the server (and the client's first paint,
 * before localStorage has been read) always has an empty cart, so this
 * reports 0 until the persisted store snapshot is available.
 */
export function useCartCount(): number {
  return useSyncExternalStore(
    useCartStore.subscribe,
    getCartCountSnapshot,
    getServerCartCountSnapshot
  );
}
