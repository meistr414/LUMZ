"use client";

import { CheckCircle2, Clock, XCircle } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { loadLastOrder } from "@/lib/checkout-session";
import { formatZAR } from "@/lib/format";
import { cn } from "@/lib/utils";

type OrderConfirmationViewProps = {
  orderRef: string;
};

const STATUS_CONTENT = {
  paid: {
    icon: CheckCircle2,
    iconClassName: "text-green-600",
    title: "Order confirmed",
    message:
      "Thanks for your order — we've received it and are getting it ready.",
  },
  pending: {
    icon: Clock,
    iconClassName: "text-foreground/50",
    title: "Payment pending",
    message:
      "We're still waiting to confirm your payment. We'll email you once it's through.",
  },
  failed: {
    icon: XCircle,
    iconClassName: "text-destructive",
    title: "Payment failed",
    message:
      "Something went wrong processing your payment. No charge was made — please try again.",
  },
} as const;

function isStatus(value: string | null): value is keyof typeof STATUS_CONTENT {
  return !!value && value in STATUS_CONTENT;
}

export function OrderConfirmationView({
  orderRef,
}: OrderConfirmationViewProps) {
  const searchParams = useSearchParams();
  const statusParam = searchParams.get("status");
  const status = isStatus(statusParam) ? statusParam : "paid";
  const { icon: Icon, iconClassName, title, message } = STATUS_CONTENT[status];

  const order = loadLastOrder();
  const matchesOrder = order?.ref === orderRef;

  return (
    <div className="mx-auto max-w-2xl px-4 py-12">
      <div className="flex flex-col items-center gap-3 text-center">
        <Icon className={cn("size-12", iconClassName)} aria-hidden />
        <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
        <p className="text-foreground/70">{message}</p>
        <p className="text-sm font-medium">
          Order reference: <span className="font-mono">{orderRef}</span>
        </p>
      </div>

      {matchesOrder && order && (
        <div className="mt-8 flex flex-col gap-4 rounded-lg border border-border p-4">
          <h2 className="text-sm font-medium text-foreground/70">
            Order summary
          </h2>
          <div className="flex flex-col divide-y divide-border">
            {order.items.map((line, i) => (
              <div
                key={i}
                className="flex items-center justify-between py-2 text-sm first:pt-0"
              >
                <span>
                  {line.name} ({line.colour} / {line.size}) &times;{" "}
                  {line.quantity}
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
      )}

      <div className="mt-8 flex flex-col gap-2 text-sm text-foreground/70">
        <h2 className="font-medium text-foreground">What happens next</h2>
        <p>
          We&apos;ll send updates on your order by email, and reach out via
          WhatsApp if we need anything from you.
        </p>
      </div>

      <div className="mt-8 flex justify-center">
        <Button
          size="lg"
          nativeButton={false}
          render={<Link href="/products" />}
        >
          Continue shopping
        </Button>
      </div>
    </div>
  );
}
