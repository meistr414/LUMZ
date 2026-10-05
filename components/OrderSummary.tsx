import { getDeliveryCents } from "@/lib/config/delivery";
import { formatZAR } from "@/lib/format";
import type { DeliveryMethod } from "@/types/checkout";

type OrderSummaryProps = {
  subtotalCents: number;
  deliveryMethod?: DeliveryMethod;
};

export function OrderSummary({
  subtotalCents,
  deliveryMethod = "standard",
}: OrderSummaryProps) {
  const deliveryCents = getDeliveryCents(deliveryMethod, subtotalCents);
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
