import type { DeliveryMethod } from "@/types/checkout";

/**
 * Placeholder delivery pricing — not yet confirmed with the business.
 * Change these values (all integer cents) once real courier rates are set.
 */
export const DELIVERY_CONFIG = {
  standardCents: 6500,
  expressCents: 12000,
  freeDeliveryThresholdCents: 100000,
} as const;

/** Collection is always free; standard/express become free over the threshold. */
export function getDeliveryCents(
  method: DeliveryMethod,
  subtotalCents: number
): number {
  if (method === "collect") return 0;
  if (subtotalCents >= DELIVERY_CONFIG.freeDeliveryThresholdCents) return 0;
  return method === "express"
    ? DELIVERY_CONFIG.expressCents
    : DELIVERY_CONFIG.standardCents;
}
