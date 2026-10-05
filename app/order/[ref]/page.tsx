import type { Metadata } from "next";
import { Suspense } from "react";
import { OrderConfirmationView } from "@/components/OrderConfirmationView";

export const metadata: Metadata = {
  title: "Order confirmation",
  robots: { index: false, follow: false },
};

export default async function OrderPage(props: PageProps<"/order/[ref]">) {
  const { ref } = await props.params;

  return (
    <Suspense fallback={null}>
      <OrderConfirmationView orderRef={ref} />
    </Suspense>
  );
}
