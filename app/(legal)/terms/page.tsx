import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms and conditions",
  description: "The terms that apply to shopping with LUMZ.",
};

export default function TermsPage() {
  return (
    <>
      <p className="rounded-lg border border-border bg-muted/50 p-3 text-xs text-foreground/60">
        Draft placeholder — review with a qualified professional before this
        site goes live. Bracketed text marks details the business still needs to
        fill in.
      </p>

      <h1>Terms and conditions</h1>
      <p>Last updated: 5 October 2026</p>
      <p>
        These terms apply whenever you use the LUMZ website or place an order
        with us. By using this site, you agree to them.
      </p>

      <h2>Products and pricing</h2>
      <p>
        We try to describe and price products accurately, but mistakes can
        happen. If we find a pricing or stock error after you&apos;ve ordered,
        we&apos;ll contact you before taking payment, and you can choose to
        continue at the correct price or cancel. All prices are in South African
        Rand (ZAR).
      </p>

      <h2>Orders and payment</h2>
      <p>
        Placing an order is an offer to buy, which we may accept or decline (for
        example, if an item is out of stock). Payment is processed by our
        payment provider once enabled — we never collect or store your card
        details on this site.
      </p>

      <h2>Delivery</h2>
      <p>
        Delivery fees and timeframes are shown at checkout. See our{" "}
        <a href="/returns" className="underline underline-offset-2">
          Returns &amp; exchanges
        </a>{" "}
        page for what happens if something arrives damaged or isn&apos;t what
        you ordered.
      </p>

      <h2>Intellectual property</h2>
      <p>
        All content on this site — including the LUMZ name, logo, photos and
        text — belongs to LUMZ or its licensors and may not be used without
        permission.
      </p>

      <h2>Liability</h2>
      <p>
        We provide this site &ldquo;as is&rdquo; and aren&apos;t liable for
        losses beyond what South African law requires, including the Consumer
        Protection Act.
      </p>

      <h2>Changes to these terms</h2>
      <p>
        We may update these terms from time to time. The version shown here is
        the one that applies to your order.
      </p>

      <h2>Governing law</h2>
      <p>These terms are governed by the laws of South Africa.</p>

      <h2>Contact us</h2>
      <p>
        Questions about these terms? Contact us at [insert contact email /
        WhatsApp number].
      </p>
    </>
  );
}
