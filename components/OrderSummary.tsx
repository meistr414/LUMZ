import { DELIVERY_CONFIG } from "@/lib/config/delivery";
import { formatZAR } from "@/lib/format";

type OrderSummaryProps = {
  subtotalCents: number;
  deliveryMethod?: "standard" | "express" | "collect";
};

export function OrderSummary({
  subtotalCents,
  deliveryMethod = "standard",
}: OrderSummaryProps) {
  const deliveryCents =
    deliveryMethod === "collect"
      ? 0
      : subtotalCents >= DELIVERY_CONFIG.freeDeliveryThresholdCents
        ? 0
        : deliveryMethod === "express"
          ? DELIVERY_CONFIG.expressCents
          : DELIVERY_CONFIG.standardCents;

  const totalCents = subtotalCents + deliveryCents;

  return (
    <dl className="flex flex-col gap-2 text-sm">
      <div className="flex items-center justify-between">
        <dt className="text-foreground/70">Subtotal</dt>
        <dd>{formatZAR(subtotalCents)}</dd>
      </div>
      <div className="flex items-center justify-between">
        <dt className="text-foreground/70">Delivery</dt>
        <dd>{deliveryCents === 0 ? "Free" : formatZAR(deliveryCents)}</dd>
      </div>
      <div className="flex items-center justify-between border-t border-border pt-2 text-base font-semibold">
        <dt>Total</dt>
        <dd>{formatZAR(totalCents)}</dd>
      </div>
    </dl>
  );
}
