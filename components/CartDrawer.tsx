"use client";

import Link from "next/link";
import { CartLineItem } from "@/components/CartLineItem";
import { OrderSummary } from "@/components/OrderSummary";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { resolveCartItem } from "@/lib/data/products";
import { useCartStore } from "@/lib/store/cart";

export function CartDrawer() {
  const items = useCartStore((s) => s.items);
  const drawerOpen = useCartStore((s) => s.drawerOpen);
  const closeDrawer = useCartStore((s) => s.closeDrawer);

  const resolved = items
    .map((item) => ({ item, resolved: resolveCartItem(item) }))
    .filter(
      (
        entry
      ): entry is {
        item: typeof entry.item;
        resolved: NonNullable<typeof entry.resolved>;
      } => entry.resolved !== null
    );

  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotalCents = resolved.reduce(
    (sum, { item, resolved }) =>
      sum + resolved.variant.priceCents * item.quantity,
    0
  );

  return (
    <Sheet open={drawerOpen} onOpenChange={(open) => !open && closeDrawer()}>
      <SheetContent side="right" className="flex flex-col overflow-y-auto">
        <SheetHeader>
          <SheetTitle>
            Your cart{itemCount > 0 ? ` (${itemCount})` : ""}
          </SheetTitle>
        </SheetHeader>

        {resolved.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-3 px-4 text-center">
            <p className="text-foreground/70">Your cart is empty</p>
            <Button
              render={<Link href="/products" />}
              nativeButton={false}
              onClick={closeDrawer}
            >
              Continue shopping
            </Button>
          </div>
        ) : (
          <>
            <div className="flex flex-1 flex-col gap-4 overflow-y-auto px-4">
              {resolved.map(({ item, resolved }) => (
                <CartLineItem
                  key={item.variantId}
                  item={item}
                  product={resolved.product}
                  variant={resolved.variant}
                />
              ))}
            </div>
            <SheetFooter>
              <OrderSummary subtotalCents={subtotalCents} />
              <Button
                variant="outline"
                render={<Link href="/cart" />}
                nativeButton={false}
                onClick={closeDrawer}
              >
                View cart
              </Button>
              <Button
                render={<Link href="/checkout" />}
                nativeButton={false}
                onClick={closeDrawer}
              >
                Checkout
              </Button>
            </SheetFooter>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
