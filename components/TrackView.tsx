"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { OrderSnapshotSummary } from "@/components/OrderSnapshotSummary";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { loadLastOrder, type LastOrderSnapshot } from "@/lib/checkout-session";
import { trackOrderSchema, type TrackOrderInput } from "@/lib/schemas/track";

const MOCK_STATUSES = ["Processing", "Shipped", "Delivered"] as const;

function mockStatusFor(ref: string): (typeof MOCK_STATUSES)[number] {
  const sum = [...ref].reduce((acc, ch) => acc + ch.charCodeAt(0), 0);
  return MOCK_STATUSES[sum % MOCK_STATUSES.length];
}

type LookupResult =
  { found: true; order: LastOrderSnapshot; status: string } | { found: false };

export function TrackView() {
  const [result, setResult] = useState<LookupResult | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<TrackOrderInput>({
    resolver: zodResolver(trackOrderSchema),
    defaultValues: { email: "", orderRef: "" },
  });

  async function onSubmit(data: TrackOrderInput) {
    // A brief delay reads as "looking this up" rather than an instant,
    // suspiciously-fake result.
    await new Promise((resolve) => setTimeout(resolve, 600));
    const order = loadLastOrder();
    const refMatches =
      !!order &&
      order.ref.trim().toLowerCase() === data.orderRef.trim().toLowerCase();
    if (refMatches && order) {
      setResult({ found: true, order, status: mockStatusFor(order.ref) });
    } else {
      setResult({ found: false });
    }
  }

  return (
    <div className="mx-auto max-w-md px-4 py-12">
      <h1 className="mb-2 text-2xl font-bold tracking-tight">
        Track your order
      </h1>
      <p className="mb-6 text-sm text-foreground/70">
        Enter the email and order reference from your confirmation to check its
        status.
      </p>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-4"
        noValidate
      >
        <div className="flex flex-col gap-1.5">
          <label htmlFor="track-email" className="text-sm font-medium">
            Email
          </label>
          <Input
            id="track-email"
            type="email"
            autoComplete="email"
            aria-invalid={!!errors.email}
            aria-describedby={errors.email ? "track-email-error" : undefined}
            {...register("email")}
          />
          {errors.email && (
            <p
              id="track-email-error"
              className="text-sm text-destructive"
              role="alert"
            >
              {errors.email.message}
            </p>
          )}
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="track-ref" className="text-sm font-medium">
            Order reference
          </label>
          <Input
            id="track-ref"
            placeholder="ORD-XXXXXX"
            aria-invalid={!!errors.orderRef}
            aria-describedby={errors.orderRef ? "track-ref-error" : undefined}
            {...register("orderRef")}
          />
          {errors.orderRef && (
            <p
              id="track-ref-error"
              className="text-sm text-destructive"
              role="alert"
            >
              {errors.orderRef.message}
            </p>
          )}
        </div>

        <Button type="submit" size="lg" disabled={isSubmitting}>
          {isSubmitting ? "Looking up…" : "Track order"}
        </Button>
      </form>

      {result && (
        <div className="mt-8" aria-live="polite">
          {result.found ? (
            <div className="flex flex-col gap-4">
              <p className="text-sm font-medium">
                Status: <span className="font-semibold">{result.status}</span>
              </p>
              <OrderSnapshotSummary order={result.order} />
            </div>
          ) : (
            <p className="text-sm text-foreground/70">
              We couldn&apos;t find an order with that reference. Double-check
              your order confirmation email and try again.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
