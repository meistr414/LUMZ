import { formatZAR } from "@/lib/format";
import type { LastOrderSnapshot } from "@/lib/checkout-session";

export function OrderSnapshotSummary({ order }: { order: LastOrderSnapshot }) {
  return (
    <div className="flex flex-col gap-4 rounded-lg border border-border p-4">
      <h2 className="text-sm font-medium text-foreground/70">Order summary</h2>
      <div className="flex flex-col divide-y divide-border">
        {order.items.map((line, i) => (
          <div
            key={i}
            className="flex items-center justify-between py-2 text-sm first:pt-0"
          >
            <span>
              {line.name} ({line.colour} / {line.size}) &times; {line.quantity}
            </span>
            <span>{formatZAR(line.priceCents * line.quantity)}</span>
          </div>
        ))}
      </div>
      <div className="flex flex-col gap-1 border-t border-border pt-3 text-sm">
        <div className="flex justify-between">
          <span className="text-foreground/70">Subtotal</span>
          <span>{formatZAR(order.subtotalCents)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-foreground/70">Delivery</span>
          <span>
            {order.deliveryCents === 0
              ? "Free"
              : formatZAR(order.deliveryCents)}
          </span>
        </div>
        <div className="flex justify-between font-semibold">
          <span>Total</span>
          <span>{formatZAR(order.totalCents)}</span>
        </div>
      </div>
    </div>
  );
}
