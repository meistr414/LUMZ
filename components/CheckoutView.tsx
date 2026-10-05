"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { CheckoutForm } from "@/components/CheckoutForm";
import { useCartStore } from "@/lib/store/cart";

export function CheckoutView() {
  const router = useRouter();
  const itemCount = useCartStore((s) => s.items.length);

  useEffect(() => {
    // Re-check the store's true current state here rather than trusting the
    // `itemCount` closure value: zustand's hook deliberately returns the
    // pre-hydration (SSR) snapshot on the first client render to avoid a
    // hydration mismatch, even though getState() is already hydrated by now.
    if (useCartStore.getState().items.length === 0) {
      router.replace("/products");
    }
  }, [itemCount, router]);

  if (itemCount === 0) return null;

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <h1 className="mb-6 text-2xl font-bold tracking-tight">
        Delivery details
      </h1>
      <CheckoutForm />
    </div>
  );
}
