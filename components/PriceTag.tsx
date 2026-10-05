import { formatZAR } from "@/lib/format";
import { cn } from "@/lib/utils";

type PriceTagProps = {
  priceCents: number;
  compareAtCents?: number;
  className?: string;
};

export function PriceTag({
  priceCents,
  compareAtCents,
  className,
}: PriceTagProps) {
  const onSale = compareAtCents !== undefined && compareAtCents > priceCents;

  return (
    <span className={cn("inline-flex items-baseline gap-2", className)}>
      <span
        className={onSale ? "font-semibold text-brand-text" : "font-medium"}
      >
        {formatZAR(priceCents)}
      </span>
      {onSale && (
        <span className="text-sm text-foreground/60 line-through">
          {formatZAR(compareAtCents)}
        </span>
      )}
    </span>
  );
}
