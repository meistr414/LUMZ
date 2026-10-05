"use client";

import Link from "next/link";
import { ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCartCount } from "@/lib/store/cart";

export function CartLink() {
  const count = useCartCount();

  return (
    <Button
      variant="ghost"
      size="icon"
      aria-label={`Cart, ${count} items`}
      nativeButton={false}
      render={<Link href="/cart" />}
    >
      <span className="relative">
        <ShoppingBag aria-hidden="true" />
        <span
          aria-live="polite"
          className="absolute -right-2 -top-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-brand px-1 text-[10px] font-semibold leading-none text-brand-foreground"
        >
          {count}
        </span>
      </span>
    </Button>
  );
}
