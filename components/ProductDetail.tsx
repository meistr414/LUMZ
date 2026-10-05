"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { FitInfo } from "@/components/FitInfo";
import { ImageGallery } from "@/components/ImageGallery";
import { MaterialCare } from "@/components/MaterialCare";
import { PriceTag } from "@/components/PriceTag";
import { QuantityStepper } from "@/components/QuantityStepper";
import { VariantPicker } from "@/components/VariantPicker";
import { getProductMinPriceCents, isProductSoldOut } from "@/lib/data/products";
import { useCartStore } from "@/lib/store/cart";
import type { Product, SizeChart } from "@/types/product";

type ProductDetailProps = {
  product: Product;
  sizeChart: SizeChart;
};

export function ProductDetail({ product, sizeChart }: ProductDetailProps) {
  const [selectedColourId, setSelectedColourId] = useState(
    product.colours[0]?.id ?? ""
  );
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [sizeError, setSizeError] = useState(false);

  const addItem = useCartStore((s) => s.addItem);
  const openDrawer = useCartStore((s) => s.openDrawer);

  const soldOut = isProductSoldOut(product);
  const selectedColour = product.colours.find((c) => c.id === selectedColourId);
  const selectedVariant = product.variants.find(
    (v) => v.colourId === selectedColourId && v.size === selectedSize
  );
  const displayPriceCents =
    selectedVariant?.priceCents ?? getProductMinPriceCents(product);
  const maxQuantity = Math.min(selectedVariant?.stock ?? 10, 10);

  function handleColourChange(colourId: string) {
    setSelectedColourId(colourId);
    setSelectedSize(null);
    setQuantity(1);
    setSizeError(false);
  }

  function handleSizeChange(size: string) {
    setSelectedSize(size);
    setQuantity(1);
    setSizeError(false);
  }

  function handleAddToCart() {
    if (!selectedVariant) {
      setSizeError(true);
      return;
    }
    addItem(product.id, selectedVariant.id, quantity);
    openDrawer();
  }

  return (
    <div className="mx-auto grid max-w-6xl gap-8 px-4 py-8 pb-28 md:pb-8 lg:grid-cols-2">
      <ImageGallery images={selectedColour?.images ?? []} />

      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{product.name}</h1>
          <PriceTag
            priceCents={displayPriceCents}
            compareAtCents={selectedVariant?.compareAtCents}
            className="mt-2 text-lg"
          />
        </div>

        <p className="text-sm text-foreground/70">{product.description}</p>

        <VariantPicker
          product={product}
          sizeChart={sizeChart}
          selectedColourId={selectedColourId}
          selectedSize={selectedSize}
          onColourChange={handleColourChange}
          onSizeChange={handleSizeChange}
          sizeError={sizeError}
        />

        <FitInfo fit={product.fit} modelInfo={product.modelInfo} />

        {soldOut ? (
          <Button size="lg" disabled>
            Sold out
          </Button>
        ) : (
          <div className="flex items-center gap-4">
            <QuantityStepper
              value={quantity}
              onChange={setQuantity}
              max={maxQuantity}
            />
            <Button size="lg" className="flex-1" onClick={handleAddToCart}>
              Add to cart
            </Button>
          </div>
        )}

        <MaterialCare material={product.material} care={product.care} />
      </div>

      {!soldOut && (
        <div
          className="fixed inset-x-0 bottom-0 z-30 border-t border-border bg-background p-4 md:hidden"
          style={{ paddingBottom: "calc(env(safe-area-inset-bottom) + 1rem)" }}
        >
          <div className="flex items-center gap-3">
            <PriceTag
              priceCents={displayPriceCents}
              compareAtCents={selectedVariant?.compareAtCents}
            />
            <Button size="lg" className="flex-1" onClick={handleAddToCart}>
              Add to cart
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
