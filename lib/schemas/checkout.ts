import { z } from "zod";
import { PROVINCES } from "@/types/checkout";

// Accepts 0XX XXX XXXX or +27XX XXX XXXX (spaces/dashes allowed), normalises to +27XXXXXXXXX.
const SA_MOBILE_REGEX = /^(0\d{9}|\+27\d{9})$/;

function normalizePhone(value: string): string {
  const digits = value.replace(/[\s-]/g, "");
  return digits.startsWith("0") ? `+27${digits.slice(1)}` : digits;
}

export const addressSchema = z.object({
  line1: z
    .string()
    .trim()
    .min(1, "Street address is required")
    .max(100, "Keep it under 100 characters"),
  line2: z.string().trim().max(100).optional(),
  suburb: z.string().trim().min(1, "Suburb is required"),
  city: z.string().trim().min(1, "City / town is required"),
  province: z.enum(PROVINCES, { error: "Select a province" }),
  postalCode: z
    .string()
    .trim()
    .regex(/^\d{4}$/, "Enter a 4-digit postal code"),
});

export const checkoutDetailsSchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(2, "Enter your full name")
    .max(80, "Keep it under 80 characters"),
  email: z.email("Enter a valid email address"),
  phone: z
    .string()
    .trim()
    .regex(SA_MOBILE_REGEX, "Enter a valid South African mobile number")
    .transform(normalizePhone),
  address: addressSchema,
  deliveryMethod: z.enum(["standard", "express", "collect"], {
    error: "Select a delivery method",
  }),
  notes: z.string().trim().max(300, "Keep it under 300 characters").optional(),
  marketingOptIn: z.boolean(),
  // A plain boolean (not z.literal(true)) keeps the form's TS type a natural
  // `boolean` for the checkbox's controlled state; .refine enforces "must be
  // checked" at validation time instead.
  acceptedTerms: z.boolean().refine((value) => value, {
    error: "You must accept the terms and privacy notice",
  }),
});

export type CheckoutFormInput = z.input<typeof checkoutDetailsSchema>;
export type CheckoutFormOutput = z.output<typeof checkoutDetailsSchema>;
