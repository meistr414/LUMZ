const ZAR_FORMATTER = new Intl.NumberFormat("en-ZA", {
  style: "currency",
  currency: "ZAR",
  currencyDisplay: "narrowSymbol",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

/** Formats integer cents as "R 1 299,00" (spaces are non-breaking). */
export function formatZAR(cents: number): string {
  return ZAR_FORMATTER.format(cents / 100);
}
