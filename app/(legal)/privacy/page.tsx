import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy notice",
  description:
    "How LUMZ collects, uses and protects your personal information, in line with South Africa's POPIA.",
};

export default function PrivacyPage() {
  return (
    <>
      <p className="rounded-lg border border-border bg-muted/50 p-3 text-xs text-foreground/60">
        Draft placeholder — review with a qualified professional before this
        site goes live. Bracketed text marks details the business still needs to
        fill in.
      </p>

      <h1>Privacy notice</h1>
      <p>Last updated: 5 October 2026</p>
      <p>
        LUMZ (&ldquo;we&rdquo;, &ldquo;us&rdquo;) respects your privacy and is
        committed to protecting your personal information in line with South
        Africa&apos;s Protection of Personal Information Act (POPIA).
      </p>

      <h2>What we collect</h2>
      <p>When you place an order or contact us, we collect:</p>
      <ul>
        <li>Your name, email address and mobile number</li>
        <li>Your delivery address</li>
        <li>Details of the items you order</li>
      </ul>
      <p>
        We never ask for or store card details on this site — payment is handled
        by our payment provider once enabled.
      </p>

      <h2>Why we collect it</h2>
      <ul>
        <li>To process, deliver and provide updates on your order</li>
        <li>To respond to questions you send us</li>
        <li>
          To send marketing about new drops and offers, only if you opt in
        </li>
      </ul>

      <h2>Sharing your information</h2>
      <p>
        We share your details only where necessary to fulfil your order — for
        example, with our delivery courier — or where the law requires it. We do
        not sell your personal information.
      </p>

      <h2>How long we keep it</h2>
      <p>
        We keep order information for as long as needed to fulfil the order and
        meet our legal and accounting obligations, then delete or anonymise it.
      </p>

      <h2>Your rights</h2>
      <p>Under POPIA, you have the right to:</p>
      <ul>
        <li>Ask what personal information we hold about you</li>
        <li>Ask us to correct or delete it</li>
        <li>Object to how we use it, or withdraw marketing consent</li>
        <li>
          Lodge a complaint with the Information Regulator of South Africa
        </li>
      </ul>

      <h2>Cookies and storage</h2>
      <p>
        We use your browser&apos;s local storage to remember your cart and your
        browser&apos;s session storage to remember your checkout details while
        you shop — never in a cookie, and never shared with third-party
        advertisers.
      </p>

      <h2>Contact us</h2>
      <p>
        To ask about your personal information or exercise any of the rights
        above, contact us at [insert contact email / WhatsApp number].
      </p>
    </>
  );
}
