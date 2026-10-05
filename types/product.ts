export type Department = "men" | "women" | "kids" | "unisex";

export type Category = {
  id: string;
  slug: string;
  name: string;
  department: Department;
  image?: string;
};

export type SizeChart = {
  id: string;
  unit: "cm";
  columns: string[];
  rows: string[][];
};

export type Colour = {
  id: string;
  name: string;
  hex: string;
  images: { src: string; alt: string }[];
};

export type Variant = {
  id: string;
  sku: string;
  colourId: string;
  size: string;
  priceCents: number;
  compareAtCents?: number;
  stock: number;
};

export type Product = {
  id: string;
  slug: string;
  name: string;
  description: string;
  department: Department;
  categoryId: string;
  colours: Colour[];
  sizes: string[];
  variants: Variant[];
  sizeChartId: string;
  fit?: "slim" | "regular" | "relaxed" | "oversized";
  modelInfo?: string;
  material: string;
  care: string[];
  tags: string[];
  featured: boolean;
  active: boolean;
};
