import type { Category } from "@/types/product";

export const CATEGORIES: Category[] = [
  {
    id: "t-shirts",
    slug: "t-shirts",
    name: "T-Shirts",
    department: "unisex",
    image: "/products/classic-logo-tee/black-1.svg",
  },
  {
    id: "hoodies",
    slug: "hoodies",
    name: "Hoodies",
    department: "unisex",
    image: "/products/essential-hoodie/black-1.svg",
  },
  {
    id: "jeans",
    slug: "jeans",
    name: "Jeans",
    department: "men",
    image: "/products/straight-leg-jeans/denim-1.svg",
  },
  {
    id: "dresses",
    slug: "dresses",
    name: "Dresses",
    department: "women",
    image: "/products/slip-midi-dress/black-1.svg",
  },
];
