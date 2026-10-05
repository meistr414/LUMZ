import { z } from "zod";

export const trackOrderSchema = z.object({
  email: z.email("Enter a valid email address"),
  orderRef: z.string().trim().min(1, "Enter your order reference"),
});

export type TrackOrderInput = z.input<typeof trackOrderSchema>;
