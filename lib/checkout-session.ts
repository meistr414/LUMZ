import type { CheckoutFormInput } from "@/lib/schemas/checkout";

// Matches the shape react-hook-form's useWatch produces while a form is
// still being filled in (nested objects partial too, not just top-level).
type DeepPartial<T> = T extends object
  ? { [K in keyof T]?: DeepPartial<T[K]> }
  : T;

const DETAILS_KEY = "checkout-details-v1";
const LAST_ORDER_KEY = "last-order-v1";

export type OrderLineSnapshot = {
  name: string;
  colour: string;
  size: string;
  quantity: number;
  priceCents: number;
};

export type LastOrderSnapshot = {
  ref: string;
  items: OrderLineSnapshot[];
  deliveryMethod: CheckoutFormInput["deliveryMethod"];
  subtotalCents: number;
  deliveryCents: number;
  totalCents: number;
  placedAt: number;
};

function readJson<T>(key: string): T | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.sessionStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    return null;
  }
}

function writeJson(key: string, value: unknown): void {
  if (typeof window === "undefined") return;
  window.sessionStorage.setItem(key, JSON.stringify(value));
}

export function loadCheckoutDetails(): DeepPartial<CheckoutFormInput> | null {
  return readJson<DeepPartial<CheckoutFormInput>>(DETAILS_KEY);
}

export function saveCheckoutDetails(
  details: DeepPartial<CheckoutFormInput>
): void {
  writeJson(DETAILS_KEY, details);
}

export function clearCheckoutDetails(): void {
  if (typeof window === "undefined") return;
  window.sessionStorage.removeItem(DETAILS_KEY);
}

export function buildOrderSnapshot(
  fields: Omit<LastOrderSnapshot, "totalCents" | "placedAt">
): LastOrderSnapshot {
  return {
    ...fields,
    totalCents: fields.subtotalCents + fields.deliveryCents,
    placedAt: Date.now(),
  };
}

export function saveLastOrder(order: LastOrderSnapshot): void {
  writeJson(LAST_ORDER_KEY, order);
}

export function loadLastOrder(): LastOrderSnapshot | null {
  return readJson<LastOrderSnapshot>(LAST_ORDER_KEY);
}
