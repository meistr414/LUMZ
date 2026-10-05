"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { FormProvider, useForm, useWatch } from "react-hook-form";
import { AddressFields } from "@/components/AddressFields";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  saveCheckoutDetails,
  loadCheckoutDetails,
} from "@/lib/checkout-session";
import { resolveCartItem } from "@/lib/data/products";
import { getDeliveryCents } from "@/lib/config/delivery";
import { formatZAR } from "@/lib/format";
import {
  checkoutDetailsSchema,
  type CheckoutFormInput,
} from "@/lib/schemas/checkout";
import { useCartStore } from "@/lib/store/cart";
import type { DeliveryMethod } from "@/types/checkout";

const DEFAULT_VALUES: CheckoutFormInput = {
  fullName: "",
  email: "",
  phone: "",
  address: {
    line1: "",
    line2: "",
    // Placeholder sentinel for the "Select a province" option — not a real
    // Province value; the resolver rejects it if left unchanged.
    province: "" as CheckoutFormInput["address"]["province"],
    suburb: "",
    city: "",
    postalCode: "",
  },
  deliveryMethod: "standard",
  notes: "",
  marketingOptIn: false,
  acceptedTerms: false,
};

const DELIVERY_OPTIONS: { value: DeliveryMethod; label: string }[] = [
  { value: "standard", label: "Standard delivery" },
  { value: "express", label: "Express delivery" },
  { value: "collect", label: "Collect in store" },
];

export function CheckoutForm() {
  const router = useRouter();
  const cartItems = useCartStore((s) => s.items);

  const subtotalCents = cartItems.reduce((sum, item) => {
    const resolved = resolveCartItem(item);
    return resolved ? sum + resolved.variant.priceCents * item.quantity : sum;
  }, 0);

  const methods = useForm<CheckoutFormInput>({
    resolver: zodResolver(checkoutDetailsSchema),
    mode: "onBlur",
    defaultValues: DEFAULT_VALUES,
  });
  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors, isSubmitting },
  } = methods;

  // Restore a draft saved before a refresh, once, after mount (client-only —
  // doing this during render would mismatch the server-rendered empty form).
  useEffect(() => {
    const saved = loadCheckoutDetails();
    if (saved) {
      reset({
        ...DEFAULT_VALUES,
        ...saved,
        address: { ...DEFAULT_VALUES.address, ...saved.address },
      });
    }
  }, [reset]);

  // Autosave the draft as the shopper types, so a refresh doesn't lose it.
  const values = useWatch({ control });
  useEffect(() => {
    const timeout = setTimeout(() => saveCheckoutDetails(values), 300);
    return () => clearTimeout(timeout);
  }, [values]);

  function onSubmit(data: CheckoutFormInput) {
    saveCheckoutDetails(data);
    router.push("/checkout/review");
  }

  return (
    <FormProvider {...methods}>
      <form
        name="checkout"
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-6"
        noValidate
      >
        <div className="flex flex-col gap-1.5">
          <label htmlFor="fullName" className="text-sm font-medium">
            Full name
          </label>
          <Input
            id="fullName"
            autoComplete="name"
            aria-invalid={!!errors.fullName}
            aria-describedby={errors.fullName ? "fullName-error" : undefined}
            {...register("fullName")}
          />
          {errors.fullName && (
            <p
              id="fullName-error"
              className="text-sm text-destructive"
              role="alert"
            >
              {errors.fullName.message}
            </p>
          )}
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="email" className="text-sm font-medium">
            Email
          </label>
          <Input
            id="email"
            type="email"
            autoComplete="email"
            aria-invalid={!!errors.email}
            aria-describedby={errors.email ? "email-error" : undefined}
            {...register("email")}
          />
          {errors.email && (
            <p
              id="email-error"
              className="text-sm text-destructive"
              role="alert"
            >
              {errors.email.message}
            </p>
          )}
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="phone" className="text-sm font-medium">
            Mobile number
          </label>
          <Input
            id="phone"
            type="tel"
            autoComplete="tel"
            placeholder="082 123 4567"
            aria-invalid={!!errors.phone}
            aria-describedby={errors.phone ? "phone-error" : undefined}
            {...register("phone")}
          />
          {errors.phone && (
            <p
              id="phone-error"
              className="text-sm text-destructive"
              role="alert"
            >
              {errors.phone.message}
            </p>
          )}
        </div>

        <AddressFields />

        <fieldset className="flex flex-col gap-2">
          <legend className="text-sm font-medium">Delivery method</legend>
          <div className="flex flex-col gap-2">
            {DELIVERY_OPTIONS.map((option) => {
              const cents = getDeliveryCents(option.value, subtotalCents);
              return (
                <label
                  key={option.value}
                  className="flex min-h-11 items-center justify-between gap-2 rounded-lg border border-border px-3 has-[:checked]:border-foreground"
                >
                  <span className="flex items-center gap-2">
                    <input
                      type="radio"
                      value={option.value}
                      className="size-4"
                      {...register("deliveryMethod")}
                    />
                    {option.label}
                  </span>
                  <span className="text-sm text-foreground/70">
                    {cents === 0 ? "Free" : formatZAR(cents)}
                  </span>
                </label>
              );
            })}
          </div>
          {errors.deliveryMethod && (
            <p className="text-sm text-destructive" role="alert">
              {errors.deliveryMethod.message}
            </p>
          )}
        </fieldset>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="notes" className="text-sm font-medium">
            Delivery notes{" "}
            <span className="font-normal text-foreground/50">(optional)</span>
          </label>
          <textarea
            id="notes"
            maxLength={300}
            rows={3}
            className="rounded-lg border border-input bg-transparent px-3 py-2 text-base md:text-sm"
            {...register("notes")}
          />
        </div>

        <label className="flex items-start gap-2 text-sm">
          <input
            type="checkbox"
            className="mt-0.5 size-4"
            {...register("marketingOptIn")}
          />
          Keep me updated on new drops and offers
        </label>

        <div className="flex flex-col gap-1.5">
          <label className="flex items-start gap-2 text-sm">
            <input
              type="checkbox"
              className="mt-0.5 size-4"
              aria-invalid={!!errors.acceptedTerms}
              aria-describedby={
                errors.acceptedTerms ? "acceptedTerms-error" : undefined
              }
              {...register("acceptedTerms")}
            />
            I accept the{" "}
            <Link href="/terms" className="underline underline-offset-2">
              Terms
            </Link>{" "}
            and{" "}
            <Link href="/privacy" className="underline underline-offset-2">
              Privacy notice
            </Link>
          </label>
          {errors.acceptedTerms && (
            <p
              id="acceptedTerms-error"
              className="text-sm text-destructive"
              role="alert"
            >
              {errors.acceptedTerms.message}
            </p>
          )}
        </div>

        {/* Cloudflare Turnstile slot — rendered off until the backend exists
            to verify it; mount the widget here once a site key is available. */}

        <Button type="submit" size="lg" disabled={isSubmitting}>
          Continue to review
        </Button>
      </form>
    </FormProvider>
  );
}
