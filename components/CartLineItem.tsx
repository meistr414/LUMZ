"use client";

import Image from "next/image";
import { X } from "lucide-react";
import { PriceTag } from "@/components/PriceTag";
import { QuantityStepper } from "@/components/QuantityStepper";
import { useCartStore } from "@/lib/store/cart";
import type { CartItem } from "@/types/cart";
import type { Product, Variant } from "@/types/product";

type CartLineItemProps = {
  item: CartItem;
  product: Product;
  variant: Variant;
};

export function CartLineItem({ item, product, variant }: CartLineItemProps) {
  const setQuantity = useCartStore((s) => s.setQuantity);
  const removeItem = useCartStore((s) => s.removeItem);

  const colour = product.colours.find((c) => c.id === variant.colourId);
  const image = colour?.images[0];

  return (
    <div className="flex gap-3">
      <div className="relative size-20 shrink-0 overflow-hidden rounded-md bg-muted">
        {image && (
          <Image
            src={image.src}
            alt={image.alt}
            fill
            sizes="80px"
            className="object-cover"
          />
        )}
      </div>

      <div className="flex flex-1 flex-col gap-2">
        <div className="flex items-start justify-between gap-2">
          <div>
            <p className="text-sm font-medium">{product.name}</p>
            <p className="text-xs text-foreground/60">
              {colour?.name}
              {colour && " / "}
              {variant.size}
            </p>
          </div>
          <button
            type="button"
            onClick={() => removeItem(item.variantId)}
            aria-label={`Remove ${product.name} from cart`}
            className="shrink-0 p-1 text-foreground/50 hover:text-foreground"
          >
            <X className="size-4" aria-hidden />
          </button>
        </div>

        <div className="flex items-center justify-between gap-2">
          <QuantityStepper
            value={item.quantity}
            onChange={(q) => setQuantity(item.variantId, q)}
            max={Math.min(variant.stock, 10)}
          />
          <PriceTag
            priceCents={variant.priceCents * item.quantity}
            compareAtCents={
              variant.compareAtCents
                ? variant.compareAtCents * item.quantity
                : undefined
            }
            className="text-sm"
          />
        </div>
      </div>
    </div>
  );
}
