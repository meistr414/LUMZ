import type { SizeChart } from "@/types/product";

export const SIZE_CHARTS: Record<string, SizeChart> = {
  tops: {
    id: "tops",
    unit: "cm",
    columns: ["Size", "Chest", "Length"],
    rows: [
      ["XS", "84-89", "66"],
      ["S", "90-95", "68"],
      ["M", "96-101", "70"],
      ["L", "102-107", "72"],
      ["XL", "108-113", "74"],
      ["XXL", "114-119", "76"],
    ],
  },
  jeans: {
    id: "jeans",
    unit: "cm",
    columns: ["Size", "Waist", "Inseam"],
    rows: [
      ["28", "71-74", "81"],
      ["30", "76-79", "81"],
      ["32", "81-84", "82"],
      ["34", "86-89", "82"],
      ["36", "91-94", "83"],
    ],
  },
  dresses: {
    id: "dresses",
    unit: "cm",
    columns: ["Size", "Bust", "Waist", "Length"],
    rows: [
      ["XS", "80-83", "62-65", "92"],
      ["S", "84-87", "66-69", "94"],
      ["M", "88-92", "70-74", "96"],
      ["L", "93-98", "75-80", "98"],
      ["XL", "99-104", "81-86", "100"],
    ],
  },
};
