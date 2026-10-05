"use client";

import { Minus, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

type QuantityStepperProps = {
  value: number;
  onChange: (value: number) => void;
  max: number;
  min?: number;
};

export function QuantityStepper({
  value,
  onChange,
  max,
  min = 1,
}: QuantityStepperProps) {
  return (
    <div className="inline-flex items-center rounded-lg border border-input">
      <Button
        type="button"
        variant="ghost"
        size="icon"
        aria-label="Decrease quantity"
        disabled={value <= min}
        onClick={() => onChange(Math.max(min, value - 1))}
      >
        <Minus aria-hidden />
      </Button>
      <span
        className="min-w-8 text-center text-sm font-medium tabular-nums"
        aria-live="polite"
      >
        {value}
      </span>
      <Button
        type="button"
        variant="ghost"
        size="icon"
        aria-label="Increase quantity"
        disabled={value >= max}
        onClick={() => onChange(Math.min(max, value + 1))}
      >
        <Plus aria-hidden />
      </Button>
    </div>
  );
}
