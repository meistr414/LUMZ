"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import type { Product, SizeChart } from "@/types/product";

type SizeGuideProps = {
  sizeChart: SizeChart;
  fit?: Product["fit"];
};

const FIT_NOTES: Record<NonNullable<Product["fit"]>, string> = {
  slim: "Fits close to the body. Size up for a roomier fit.",
  regular: "A true-to-size, everyday fit.",
  relaxed: "A looser fit through the body with room to move.",
  oversized: "Intentionally oversized. Size down for a closer fit.",
};

export function SizeGuide({ sizeChart, fit }: SizeGuideProps) {
  return (
    <Dialog>
      <DialogTrigger render={<Button variant="link" className="h-auto p-0" />}>
        Size guide
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Size guide</DialogTitle>
          <DialogDescription>
            Measurements in centimetres. Lay a similar garment flat and measure
            chest/bust, waist and length to find your closest match.
          </DialogDescription>
        </DialogHeader>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-border">
                {sizeChart.columns.map((column) => (
                  <th key={column} className="py-2 pr-4 font-medium">
                    {column}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {sizeChart.rows.map((row) => (
                <tr key={row[0]} className="border-b border-border/60">
                  {row.map((cell, i) => (
                    <td key={i} className="py-2 pr-4 text-foreground/80">
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {fit && (
          <p className="text-sm text-foreground/70">
            <span className="font-medium text-foreground">Fit note: </span>
            {FIT_NOTES[fit]}
          </p>
        )}
      </DialogContent>
    </Dialog>
  );
}
