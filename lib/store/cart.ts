import { useSyncExternalStore } from "react";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { resolveCartItem } from "@/lib/data/products";
import { useToastStore } from "@/lib/store/toast";
import type { CartItem } from "@/types/cart";

type CartState = {
  items: CartItem[];
  drawerOpen: boolean;
  addItem: (productId: string, variantId: string, quantity: number) => void;
  removeItem: (variantId: string) => void;
  setQuantity: (variantId: string, quantity: number) => void;
  clear: () => void;
  openDrawer: () => void;
  closeDrawer: () => void;
};

/** Drops items whose product/variant no longer exists, clamps quantity to stock. */
function reconcile(items: CartItem[]): {
  items: CartItem[];
  changed: boolean;
} {
  let changed = false;
  const next: CartItem[] = [];
  for (const item of items) {
    const resolved = resolveCartItem(item);
    if (!resolved || resolved.variant.stock === 0) {
      changed = true;
      continue;
    }
    if (item.quantity > resolved.variant.stock) {
      changed = true;
      next.push({ ...item, quantity: resolved.variant.stock });
    } else {
      next.push(item);
    }
  }
  return { items: next, changed };
}

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      items: [],
      drawerOpen: false,
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
      openDrawer: () => set({ drawerOpen: true }),
      closeDrawer: () => set({ drawerOpen: false }),
    }),
    {
      name: "cart-v1",
      partialize: (state) => ({ items: state.items }),
    }
  )
);

// zustand's persist middleware rehydrates from localStorage synchronously
// (localStorage itself is sync, and persist resolves synchronously when the
// storage isn't Promise-based) — by the time this line runs, on the client,
// useCartStore's state already reflects whatever was in storage. Reconciling
// here, rather than in `onRehydrateStorage`, avoids a genuine temporal-dead-
// zone bug: that option's callback would still be executing *inside* the
// `create()` call above, before this `const` finishes initializing, so
// referencing `useCartStore` from within it throws a ReferenceError.
{
  const { items, changed } = reconcile(useCartStore.getState().items);
  if (changed) {
    useCartStore.setState({ items });
    useToastStore
      .getState()
      .show("Your cart was updated — some items changed or sold out.");
  }
}

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
