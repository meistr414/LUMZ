"use client";

import { Loader2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { OrderSummary } from "@/components/OrderSummary";
import { Button } from "@/components/ui/button";
import {
  buildOrderSnapshot,
  clearCheckoutDetails,
  loadCheckoutDetails,
  saveLastOrder,
  type OrderLineSnapshot,
} from "@/lib/checkout-session";
import { getDeliveryCents } from "@/lib/config/delivery";
import { resolveCartItem } from "@/lib/data/products";
import { formatZAR } from "@/lib/format";
import { createPaymentSession } from "@/lib/payments";
import { checkoutDetailsSchema } from "@/lib/schemas/checkout";
import { useCartStore } from "@/lib/store/cart";
import { useToastStore } from "@/lib/store/toast";
import type { CheckoutDetails } from "@/types/checkout";

const DELIVERY_LABELS: Record<CheckoutDetails["deliveryMethod"], string> = {
  standard: "Standard delivery",
  express: "Express delivery",
  collect: "Collect in store",
};

export function CheckoutReviewView() {
  const router = useRouter();
  const items = useCartStore((s) => s.items);
  const clearCart = useCartStore((s) => s.clear);
  const showToast = useToastStore((s) => s.show);

  const [details, setDetails] = useState<CheckoutDetails | null>(null);
  const [checking, setChecking] = useState(true);
  const [pending, setPending] = useState(false);
  const pendingRef = useRef(false);
  // Suppresses the empty-cart guard once payment succeeds: clearCart() below
  // makes the cart empty on purpose, which would otherwise race this effect
  // into redirecting to /products instead of the order confirmation page.
  const orderPlacedRef = useRef(false);

  useEffect(() => {
    if (orderPlacedRef.current) return;
    // Check the store's true current state, not the `items` closure value —
    // zustand's hook deliberately returns the pre-hydration (SSR) snapshot on
    // the first client render to avoid a hydration mismatch, even though
    // getState() is already hydrated by then.
    if (useCartStore.getState().items.length === 0) {
      router.replace("/products");
      return;
    }
    const saved = loadCheckoutDetails();
    const parsed = checkoutDetailsSchema.safeParse(saved);
    if (!parsed.success) {
      router.replace("/checkout");
      return;
    }
    // sessionStorage has no subscribe/change event to synchronize against —
    // this is the one-time "read an external system on mount" case React's
    // own docs carve out for effects, not state derived from render inputs.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setDetails({ ...parsed.data, acceptedTerms: true });
    setChecking(false);
  }, [items.length, router]);

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

  async function handlePay() {
    if (pendingRef.current || !details) return;
    pendingRef.current = true;
    setPending(true);

    try {
      const session = await createPaymentSession({
        items: items.map((item) => ({
          variantId: item.variantId,
          quantity: item.quantity,
        })),
        customer: details,
      });

      const deliveryCents = getDeliveryCents(
        details.deliveryMethod,
        subtotalCents
      );
      const lineSnapshots: OrderLineSnapshot[] = resolved.map(
        ({ item, resolved }) => {
          const colour = resolved.product.colours.find(
            (c) => c.id === resolved.variant.colourId
          );
          return {
            name: resolved.product.name,
            colour: colour?.name ?? "",
            size: resolved.variant.size,
            quantity: item.quantity,
            priceCents: resolved.variant.priceCents,
          };
        }
      );

      saveLastOrder(
        buildOrderSnapshot({
          ref: session.orderRef,
          items: lineSnapshots,
          deliveryMethod: details.deliveryMethod,
          subtotalCents,
          deliveryCents,
        })
      );

      orderPlacedRef.current = true;
      clearCart();
      clearCheckoutDetails();
      router.push(`/order/${session.orderRef}`);
    } catch {
      pendingRef.current = false;
      setPending(false);
      showToast(
        "Something went wrong placing your order. Please try again.",
        "error"
      );
    }
  }

  if (checking || !details) return null;

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <h1 className="mb-6 text-2xl font-bold tracking-tight">Review order</h1>

      <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
        <div className="flex flex-col gap-8">
          <section className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-medium text-foreground/70">Items</h2>
              <Link
                href="/cart"
                className="text-sm font-medium underline-offset-4 hover:underline"
              >
                Edit cart
              </Link>
            </div>
            <div className="flex flex-col divide-y divide-border">
              {resolved.map(({ item, resolved }) => {
                const colour = resolved.product.colours.find(
                  (c) => c.id === resolved.variant.colourId
                );
                const image = colour?.images[0];
                return (
                  <div
                    key={item.variantId}
                    className="flex gap-3 py-4 first:pt-0"
                  >
                    <div className="relative size-16 shrink-0 overflow-hidden rounded-md bg-muted">
                      {image && (
                        <Image
                          src={image.src}
                          alt={image.alt}
                          fill
                          sizes="64px"
                          className="object-cover"
                        />
                      )}
                    </div>
                    <div className="flex flex-1 items-start justify-between gap-2">
                      <div>
                        <p className="text-sm font-medium">
                          {resolved.product.name}
                        </p>
                        <p className="text-xs text-foreground/60">
                          {colour?.name} / {resolved.variant.size} &times;{" "}
                          {item.quantity}
                        </p>
                      </div>
                      <span className="text-sm font-medium">
                        {formatZAR(resolved.variant.priceCents * item.quantity)}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          <section className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-medium text-foreground/70">
                Delivery address
              </h2>
              <Link
                href="/checkout"
                className="text-sm font-medium underline-offset-4 hover:underline"
              >
                Edit details
              </Link>
            </div>
            <div className="text-sm text-foreground/80">
              <p>{details.fullName}</p>
              <p>{details.address.line1}</p>
              {details.address.line2 && <p>{details.address.line2}</p>}
              <p>
                {details.address.suburb}, {details.address.city}
              </p>
              <p>
                {details.address.province} {details.address.postalCode}
              </p>
              <p className="mt-2">{details.email}</p>
              <p>{details.phone}</p>
            </div>
          </section>

          <section className="flex flex-col gap-1">
            <h2 className="text-sm font-medium text-foreground/70">
              Delivery method
            </h2>
            <p className="text-sm text-foreground/80">
              {DELIVERY_LABELS[details.deliveryMethod]}
            </p>
          </section>
        </div>

        <div className="flex h-fit flex-col gap-4 rounded-lg border border-border p-4 lg:sticky lg:top-20">
          <OrderSummary
            subtotalCents={subtotalCents}
            deliveryMethod={details.deliveryMethod}
          />
          <Button size="lg" onClick={handlePay} disabled={pending}>
            {pending ? (
              <>
                <Loader2 className="animate-spin" aria-hidden />
                Processing&hellip;
              </>
            ) : (
              "Pay now"
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
