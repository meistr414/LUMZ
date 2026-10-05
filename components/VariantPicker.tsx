import { SizeGuide } from "@/components/SizeGuide";
import { cn } from "@/lib/utils";
import type { Product, SizeChart } from "@/types/product";

type VariantPickerProps = {
  product: Product;
  sizeChart: SizeChart;
  selectedColourId: string;
  selectedSize: string | null;
  onColourChange: (colourId: string) => void;
  onSizeChange: (size: string) => void;
  sizeError?: boolean;
};

export function VariantPicker({
  product,
  sizeChart,
  selectedColourId,
  selectedSize,
  onColourChange,
  onSizeChange,
  sizeError,
}: VariantPickerProps) {
  const selectedColour = product.colours.find((c) => c.id === selectedColourId);

  function stockFor(size: string): number {
    const variant = product.variants.find(
      (v) => v.colourId === selectedColourId && v.size === size
    );
    return variant?.stock ?? 0;
  }

  return (
    <div className="flex flex-col gap-5">
      {product.colours.length > 1 && (
        <fieldset className="flex flex-col gap-2">
          <legend className="text-sm font-medium">
            Colour{selectedColour ? `: ${selectedColour.name}` : ""}
          </legend>
          <div className="flex flex-wrap gap-2">
            {product.colours.map((colour) => (
              <button
                key={colour.id}
                type="button"
                aria-pressed={colour.id === selectedColourId}
                aria-label={colour.name}
                title={colour.name}
                onClick={() => onColourChange(colour.id)}
                className={cn(
                  "flex size-10 items-center justify-center rounded-full border-2",
                  colour.id === selectedColourId
                    ? "border-foreground"
                    : "border-transparent"
                )}
              >
                <span
                  className="size-7 rounded-full border border-border"
                  style={{ backgroundColor: colour.hex }}
                />
              </button>
            ))}
          </div>
        </fieldset>
      )}

      <fieldset className="flex flex-col gap-2">
        <div className="flex items-baseline justify-between">
          <legend className="text-sm font-medium">Size</legend>
          <SizeGuide sizeChart={sizeChart} fit={product.fit} />
        </div>
        <div
          className={cn(
            "flex flex-wrap gap-2 rounded-md",
            sizeError && "ring-2 ring-destructive ring-offset-2"
          )}
        >
          {product.sizes.map((size) => {
            const soldOut = stockFor(size) === 0;
            return (
              <button
                key={size}
                type="button"
                disabled={soldOut}
                aria-pressed={size === selectedSize}
                aria-label={soldOut ? `${size}, sold out` : size}
                onClick={() => onSizeChange(size)}
                className={cn(
                  "min-h-11 min-w-11 rounded-md border border-border px-3 text-sm",
                  size === selectedSize &&
                    "border-foreground bg-foreground text-background",
                  soldOut &&
                    "cursor-not-allowed text-foreground/60 line-through"
                )}
              >
                {size}
              </button>
            );
          })}
        </div>
        {sizeError && (
          <p className="text-sm text-destructive" role="alert">
            Please select a size
          </p>
        )}
      </fieldset>
    </div>
  );
}
