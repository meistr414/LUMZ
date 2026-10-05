"use client";

import { useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { FilterBar } from "@/components/FilterBar";
import { ProductGrid } from "@/components/ProductGrid";
import { SearchInput } from "@/components/SearchInput";
import { filterAndSortProducts, type SortOption } from "@/lib/data/products";
import type { Category, Department, Product } from "@/types/product";

const PAGE_SIZE = 12;

type ProductsBrowserProps = {
  products: Product[];
  categories: Category[];
  colours: { id: string; name: string; hex: string }[];
  sizes: string[];
};

export function ProductsBrowser({
  products,
  categories,
  colours,
  sizes,
}: ProductsBrowserProps) {
  const searchParams = useSearchParams();

  const filters = useMemo(() => {
    const sizeParam = searchParams.get("size");
    const colourParam = searchParams.get("colour");
    const minPrice = searchParams.get("minPrice");
    const maxPrice = searchParams.get("maxPrice");
    return {
      department: (searchParams.get("department") as Department) || undefined,
      categoryId: searchParams.get("category") || undefined,
      sizes: sizeParam ? sizeParam.split(",").filter(Boolean) : undefined,
      colours: colourParam ? colourParam.split(",").filter(Boolean) : undefined,
      minPriceCents: minPrice ? Number(minPrice) * 100 : undefined,
      maxPriceCents: maxPrice ? Number(maxPrice) * 100 : undefined,
      inStockOnly: searchParams.get("inStock") === "1",
      search: searchParams.get("q") || undefined,
      sort: (searchParams.get("sort") as SortOption) || undefined,
    };
  }, [searchParams]);

  const filtered = useMemo(
    () => filterAndSortProducts(products, filters),
    [products, filters]
  );

  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  // Reset pagination when the active filters change (React's documented
  // "adjust state during render" pattern — no effect needed).
  const filterKey = JSON.stringify(filters);
  const [lastFilterKey, setLastFilterKey] = useState(filterKey);
  if (filterKey !== lastFilterKey) {
    setLastFilterKey(filterKey);
    setVisibleCount(PAGE_SIZE);
  }

  const visible = filtered.slice(0, visibleCount);
  const hasMore = visibleCount < filtered.length;

  return (
    <div className="flex flex-col gap-4">
      <SearchInput />
      <FilterBar categories={categories} colours={colours} sizes={sizes} />
      <p className="text-sm text-foreground/60" aria-live="polite">
        {filtered.length} {filtered.length === 1 ? "product" : "products"}
      </p>
      <ProductGrid products={visible} priorityCount={2} />
      {hasMore && (
        <div className="flex justify-center pt-4">
          <Button
            variant="outline"
            onClick={() => setVisibleCount((c) => c + PAGE_SIZE)}
          >
            Load more
          </Button>
        </div>
      )}
    </div>
  );
}
