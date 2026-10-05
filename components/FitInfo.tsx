import type { Product } from "@/types/product";

const FIT_LABELS: Record<NonNullable<Product["fit"]>, string> = {
  slim: "Slim fit",
  regular: "Regular fit",
  relaxed: "Relaxed fit",
  oversized: "Oversized fit",
};

type FitInfoProps = {
  fit?: Product["fit"];
  modelInfo?: string;
};

export function FitInfo({ fit, modelInfo }: FitInfoProps) {
  if (!fit && !modelInfo) return null;

  return (
    <div className="flex flex-col gap-0.5 text-sm text-foreground/70">
      {fit && <p>{FIT_LABELS[fit]}</p>}
      {modelInfo && <p>{modelInfo}</p>}
    </div>
  );
}
