import type { Metadata } from "next";
import { CheckoutReviewView } from "@/components/CheckoutReviewView";

export const metadata: Metadata = {
  title: "Review your order",
  robots: { index: false, follow: false },
};

export default function CheckoutReviewPage() {
  return <CheckoutReviewView />;
}
