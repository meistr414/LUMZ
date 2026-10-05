import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Returns and exchanges",
  description: "How to return or exchange a LUMZ order.",
};

export default function ReturnsPage() {
  return (
    <>
      <p className="rounded-lg border border-border bg-muted/50 p-3 text-xs text-foreground/60">
        Draft placeholder — review with a qualified professional before this
        site goes live, including the exact return window required under South
        African consumer protection law. Bracketed text marks details the
        business still needs to fill in.
      </p>

      <h1>Returns and exchanges</h1>
      <p>Last updated: 5 October 2026</p>
      <p>
        We want you to be happy with your order. In line with South African
        consumer protection law for online purchases, you can return an unused
        item, in its original condition with tags attached, within 7 days of
        delivery for a full refund or exchange.
      </p>

      <h2>How to start a return or exchange</h2>
      <ul>
        <li>
          Contact us with your order reference and the item you&apos;d like to
          return or exchange
        </li>
        <li>We&apos;ll confirm the next steps and a return address</li>
        <li>Pack the item in its original packaging with tags attached</li>
      </ul>

      <h2>Size exchanges</h2>
      <p>
        Need a different size? Let us know your order reference and the size
        you&apos;d like instead — we&apos;ll arrange the swap once we&apos;ve
        received the original item back.
      </p>

      <h2>Refunds</h2>
      <p>
        Once we&apos;ve received and checked your return, we&apos;ll refund you
        using your original payment method. Refunds are typically processed
        within [insert number] business days.
      </p>

      <h2>Damaged or incorrect items</h2>
      <p>
        If an item arrives damaged or isn&apos;t what you ordered, contact us as
        soon as possible with your order reference and a photo — we&apos;ll sort
        out a replacement or refund at no extra cost to you.
      </p>

      <h2>Contact us</h2>
      <p>
        To start a return or exchange, contact us at [insert contact email /
        WhatsApp number].
      </p>
    </>
  );
}
