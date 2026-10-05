import Image from "next/image";
import Link from "next/link";
import {
  getProductCompareAtCents,
  getProductMinPriceCents,
  isProductSoldOut,
} from "@/lib/data/products";
import { cn } from "@/lib/utils";
import type { Product } from "@/types/product";
import { PriceTag } from "@/components/PriceTag";

type ProductCardProps = {
  product: Product;
  priority?: boolean;
};

export function ProductCard({ product, priority = false }: ProductCardProps) {
  const primaryColour = product.colours[0];
  const [image1, image2] = primaryColour?.images ?? [];
  const soldOut = isProductSoldOut(product);
  const compareAtCents = getProductCompareAtCents(product);
  const onSale = compareAtCents !== undefined;

  return (
    <Link
      href={`/products/${product.slug}`}
      className="group block rounded-lg focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
    >
      <div className="relative aspect-4/5 overflow-hidden rounded-lg bg-muted">
        {image1 && (
          <Image
            src={image1.src}
            alt={image1.alt}
            fill
            priority={priority}
            sizes="(min-width: 1024px) 25vw, (min-width: 768px) 33vw, 50vw"
            className={cn(
              "object-cover transition-opacity duration-200",
              image2 && "group-hover:opacity-0"
            )}
          />
        )}
        {image2 && (
          <Image
            src={image2.src}
            alt=""
            aria-hidden="true"
            fill
            sizes="(min-width: 1024px) 25vw, (min-width: 768px) 33vw, 50vw"
            className="object-cover opacity-0 transition-opacity duration-200 group-hover:opacity-100"
          />
        )}

        <div className="absolute left-2 top-2 flex flex-col gap-1">
          {soldOut && (
            <span className="rounded bg-background/90 px-2 py-1 text-xs font-medium">
              Sold out
            </span>
          )}
          {!soldOut && onSale && (
            <span className="rounded bg-brand px-2 py-1 text-xs font-semibold text-brand-foreground">
              Sale
            </span>
          )}
        </div>
      </div>

      <div className="mt-3 flex flex-col gap-1">
        <h2 className="text-sm font-medium">{product.name}</h2>
        <PriceTag
          priceCents={getProductMinPriceCents(product)}
          compareAtCents={compareAtCents}
          className="text-sm"
        />
        {product.colours.length > 1 && (
          <div
            className="flex gap-1 pt-1"
            aria-label={`${product.colours.length} colours available`}
          >
            {product.colours.map((colour) => (
              <span
                key={colour.id}
                title={colour.name}
                className="size-3 rounded-full border border-border"
                style={{ backgroundColor: colour.hex }}
              />
            ))}
          </div>
        )}
      </div>
    </Link>
  );
}
