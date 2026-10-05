import type { CheckoutDetails } from "@/types/checkout";

export type PaymentRequest = {
  items: { variantId: string; quantity: number }[];
  customer: CheckoutDetails;
};

export type PaymentSession = { orderRef: string; redirectUrl?: string };

const REF_CHARS = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // no 0/O/1/I ambiguity

function generateOrderRef(): string {
  let code = "";
  for (let i = 0; i < 6; i++) {
    code += REF_CHARS[Math.floor(Math.random() * REF_CHARS.length)];
  }
  return `ORD-${code}`;
}

/**
 * v1 mock: waits briefly and returns a reference with no redirectUrl, so the
 * UI routes straight to the confirmation page. v2 swaps this implementation
 * for a server action / API route that validates with Zod, re-prices from
 * the database, saves a pending order, and returns the gateway's hosted
 * checkout redirectUrl — no UI changes needed (see SPEC.md).
 */
export async function createPaymentSession(
  req: PaymentRequest
): Promise<PaymentSession> {
  void req;
  await new Promise((resolve) => setTimeout(resolve, 1000));
  return { orderRef: generateOrderRef() };
}
