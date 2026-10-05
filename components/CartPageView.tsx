"use client";

import Link from "next/link";
import { CartLineItem } from "@/components/CartLineItem";
import { OrderSummary } from "@/components/OrderSummary";
import { Button } from "@/components/ui/button";
import { resolveCartItem } from "@/lib/data/products";
import { useCartStore } from "@/lib/store/cart";

export function CartPageView() {
  const items = useCartStore((s) => s.items);

  const resolved = items
    .map((item) => ({ item, resolved: resolveCartItem(item) }))
    .filter(
      (
        entry
      ): entry is {
        item: typeof entry.item;
        resolved: NonNullable<typeof entry.resolved>;
      } => entry.resolved !== null
    );

  const subtotalCents = resolved.reduce(
    (sum, { item, resolved }) =>
      sum + resolved.variant.priceCents * item.quantity,
    0
  );

  if (resolved.length === 0) {
    return (
      <div className="mx-auto flex max-w-xl flex-col items-center gap-4 px-4 py-24 text-center">
        <h1 className="text-2xl font-bold tracking-tight">
          Your cart is empty
        </h1>
        <p className="text-foreground/70">
          Looks like you haven&apos;t added anything yet.
        </p>
        <Button
          size="lg"
          nativeButton={false}
          render={<Link href="/products" />}
        >
          Shop the catalogue
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <h1 className="mb-6 text-2xl font-bold tracking-tight">Your cart</h1>
      <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
        <div className="flex flex-col divide-y divide-border">
          {resolved.map(({ item, resolved }) => (
            <div key={item.variantId} className="py-4 first:pt-0">
              <CartLineItem
                item={item}
                product={resolved.product}
                variant={resolved.variant}
              />
            </div>
          ))}
        </div>

        <div className="flex h-fit flex-col gap-4 rounded-lg border border-border p-4 lg:sticky lg:top-20">
          <OrderSummary subtotalCents={subtotalCents} />
          <Button
            size="lg"
            nativeButton={false}
            render={<Link href="/checkout" />}
          >
            Checkout
          </Button>
        </div>
      </div>
    </div>
  );
}
