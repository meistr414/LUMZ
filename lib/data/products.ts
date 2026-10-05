import { CATEGORIES } from "@/mocks/categories";
import { PRODUCTS } from "@/mocks/products";
import type { Category, Department, Product } from "@/types/product";

export function getProducts(): Product[] {
  return PRODUCTS.filter((product) => product.active);
}

export function getProduct(slug: string): Product | undefined {
  return PRODUCTS.find((product) => product.slug === slug && product.active);
}

export function getCategories(): Category[] {
  return CATEGORIES;
}

export function getFeaturedProducts(limit = 4): Product[] {
  return getProducts()
    .filter((product) => product.featured)
    .slice(0, limit);
}

/** Lowest current price across a product's variants, in cents. */
export function getProductMinPriceCents(product: Product): number {
  return Math.min(...product.variants.map((v) => v.priceCents));
}

/** The compare-at price to show, if any variant is discounted below it. */
export function getProductCompareAtCents(product: Product): number | undefined {
  const onSale = product.variants.find(
    (v) => v.compareAtCents !== undefined && v.compareAtCents > v.priceCents
  );
  return onSale?.compareAtCents;
}

export function getProductTotalStock(product: Product): number {
  return product.variants.reduce((sum, v) => sum + v.stock, 0);
}

export function isProductSoldOut(product: Product): boolean {
  return getProductTotalStock(product) === 0;
}

/** All distinct colours used across the catalogue, for the colour filter. */
export function getAllColours(products: Product[]) {
  const seen = new Map<string, { id: string; name: string; hex: string }>();
  for (const product of products) {
    for (const colour of product.colours) {
      if (!seen.has(colour.id)) {
        seen.set(colour.id, {
          id: colour.id,
          name: colour.name,
          hex: colour.hex,
        });
      }
    }
  }
  return [...seen.values()];
}

/** All distinct sizes used across the catalogue, in first-seen display order. */
export function getAllSizes(products: Product[]): string[] {
  const seen = new Set<string>();
  for (const product of products) {
    for (const size of product.sizes) {
      seen.add(size);
    }
  }
  return [...seen];
}

export type SortOption = "featured" | "price-asc" | "price-desc";

export type ProductFilters = {
  department?: Department;
  categoryId?: string;
  sizes?: string[];
  colours?: string[];
  minPriceCents?: number;
  maxPriceCents?: number;
  inStockOnly?: boolean;
  search?: string;
  sort?: SortOption;
};

function matchesSearch(product: Product, query: string): boolean {
  const haystack = `${product.name} ${product.tags.join(" ")}`.toLowerCase();
  return haystack.includes(query.toLowerCase());
}

export function filterAndSortProducts(
  products: Product[],
  filters: ProductFilters
): Product[] {
  let result = products;

  if (filters.department) {
    result = result.filter((p) => p.department === filters.department);
  }
  if (filters.categoryId) {
    result = result.filter((p) => p.categoryId === filters.categoryId);
  }
  if (filters.sizes && filters.sizes.length > 0) {
    const wanted = new Set(filters.sizes);
    result = result.filter((p) => p.sizes.some((s) => wanted.has(s)));
  }
  if (filters.colours && filters.colours.length > 0) {
    const wanted = new Set(filters.colours);
    result = result.filter((p) => p.colours.some((c) => wanted.has(c.id)));
  }
  if (filters.minPriceCents !== undefined) {
    const min = filters.minPriceCents;
    result = result.filter((p) => getProductMinPriceCents(p) >= min);
  }
  if (filters.maxPriceCents !== undefined) {
    const max = filters.maxPriceCents;
    result = result.filter((p) => getProductMinPriceCents(p) <= max);
  }
  if (filters.inStockOnly) {
    result = result.filter((p) => !isProductSoldOut(p));
  }
  if (filters.search && filters.search.trim().length > 0) {
    const query = filters.search.trim();
    result = result.filter((p) => matchesSearch(p, query));
  }

  const sorted = [...result];
  if (filters.sort === "price-asc") {
    sorted.sort(
      (a, b) => getProductMinPriceCents(a) - getProductMinPriceCents(b)
    );
  } else if (filters.sort === "price-desc") {
    sorted.sort(
      (a, b) => getProductMinPriceCents(b) - getProductMinPriceCents(a)
    );
  } else {
    sorted.sort((a, b) => Number(b.featured) - Number(a.featured));
  }
  return sorted;
}
