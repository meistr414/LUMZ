"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";
import { SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import type { Category, Department } from "@/types/product";

const DEPARTMENTS: { value: Department; label: string }[] = [
  { value: "men", label: "Men" },
  { value: "women", label: "Women" },
  { value: "kids", label: "Kids" },
  { value: "unisex", label: "Unisex" },
];

type FilterBarProps = {
  categories: Category[];
  colours: { id: string; name: string; hex: string }[];
  sizes: string[];
};

function getList(params: URLSearchParams, key: string): string[] {
  const value = params.get(key);
  return value ? value.split(",").filter(Boolean) : [];
}

export function FilterBar({ categories, colours, sizes }: FilterBarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [open, setOpen] = useState(false);

  const department = searchParams.get("department") ?? undefined;
  const categoryId = searchParams.get("category") ?? undefined;
  const selectedSizes = useMemo(
    () => getList(searchParams, "size"),
    [searchParams]
  );
  const selectedColours = useMemo(
    () => getList(searchParams, "colour"),
    [searchParams]
  );
  const minPrice = searchParams.get("minPrice") ?? "";
  const maxPrice = searchParams.get("maxPrice") ?? "";
  const inStockOnly = searchParams.get("inStock") === "1";
  const sort = searchParams.get("sort") ?? "featured";

  const activeFilterCount =
    (department ? 1 : 0) +
    (categoryId ? 1 : 0) +
    selectedSizes.length +
    selectedColours.length +
    (minPrice ? 1 : 0) +
    (maxPrice ? 1 : 0) +
    (inStockOnly ? 1 : 0);

  function updateParams(mutate: (params: URLSearchParams) => void) {
    const params = new URLSearchParams(searchParams.toString());
    mutate(params);
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  }

  function setSingle(key: string, value: string | undefined) {
    updateParams((params) => {
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
    });
  }

  function toggleListValue(key: string, current: string[], value: string) {
    const next = current.includes(value)
      ? current.filter((v) => v !== value)
      : [...current, value];
    setSingle(key, next.length > 0 ? next.join(",") : undefined);
  }

  function clearAll() {
    updateParams((params) => {
      for (const key of [
        "department",
        "category",
        "size",
        "colour",
        "minPrice",
        "maxPrice",
        "inStock",
      ]) {
        params.delete(key);
      }
    });
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="left" className="overflow-y-auto">
          <SheetHeader>
            <SheetTitle>Filters</SheetTitle>
          </SheetHeader>

          <div className="flex flex-col gap-6 px-4">
            <fieldset className="flex flex-col gap-2">
              <legend className="text-sm font-medium">Department</legend>
              <div className="flex flex-wrap gap-2">
                {DEPARTMENTS.map((d) => (
                  <button
                    key={d.value}
                    type="button"
                    aria-pressed={department === d.value}
                    onClick={() =>
                      setSingle(
                        "department",
                        department === d.value ? undefined : d.value
                      )
                    }
                    className={cn(
                      "min-h-9 rounded-full border border-border px-3 text-sm",
                      department === d.value &&
                        "border-foreground bg-foreground text-background"
                    )}
                  >
                    {d.label}
                  </button>
                ))}
              </div>
            </fieldset>

            <fieldset className="flex flex-col gap-2">
              <legend className="text-sm font-medium">Category</legend>
              <div className="flex flex-wrap gap-2">
                {categories.map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    aria-pressed={categoryId === c.id}
                    onClick={() =>
                      setSingle(
                        "category",
                        categoryId === c.id ? undefined : c.id
                      )
                    }
                    className={cn(
                      "min-h-9 rounded-full border border-border px-3 text-sm",
                      categoryId === c.id &&
                        "border-foreground bg-foreground text-background"
                    )}
                  >
                    {c.name}
                  </button>
                ))}
              </div>
            </fieldset>

            <fieldset className="flex flex-col gap-2">
              <legend className="text-sm font-medium">Size</legend>
              <div className="flex flex-wrap gap-2">
                {sizes.map((size) => (
                  <button
                    key={size}
                    type="button"
                    aria-pressed={selectedSizes.includes(size)}
                    onClick={() => toggleListValue("size", selectedSizes, size)}
                    className={cn(
                      "min-h-9 min-w-9 rounded-md border border-border px-2 text-sm",
                      selectedSizes.includes(size) &&
                        "border-foreground bg-foreground text-background"
                    )}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </fieldset>

            <fieldset className="flex flex-col gap-2">
              <legend className="text-sm font-medium">Colour</legend>
              <div className="flex flex-wrap gap-3">
                {colours.map((colour) => (
                  <button
                    key={colour.id}
                    type="button"
                    aria-pressed={selectedColours.includes(colour.id)}
                    aria-label={colour.name}
                    title={colour.name}
                    onClick={() =>
                      toggleListValue("colour", selectedColours, colour.id)
                    }
                    className={cn(
                      "flex size-9 items-center justify-center rounded-full border-2",
                      selectedColours.includes(colour.id)
                        ? "border-foreground"
                        : "border-transparent"
                    )}
                  >
                    <span
                      className="size-6 rounded-full border border-border"
                      style={{ backgroundColor: colour.hex }}
                    />
                  </button>
                ))}
              </div>
            </fieldset>

            <fieldset className="flex flex-col gap-2">
              <legend className="text-sm font-medium">Price (R)</legend>
              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  inputMode="numeric"
                  min={0}
                  placeholder="Min"
                  aria-label="Minimum price in Rand"
                  defaultValue={minPrice}
                  onBlur={(e) =>
                    setSingle("minPrice", e.target.value || undefined)
                  }
                  className="w-full"
                />
                <span className="text-foreground/40">&ndash;</span>
                <Input
                  type="number"
                  inputMode="numeric"
                  min={0}
                  placeholder="Max"
                  aria-label="Maximum price in Rand"
                  defaultValue={maxPrice}
                  onBlur={(e) =>
                    setSingle("maxPrice", e.target.value || undefined)
                  }
                  className="w-full"
                />
              </div>
            </fieldset>

            <label className="flex min-h-11 items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={inStockOnly}
                onChange={(e) =>
                  setSingle("inStock", e.target.checked ? "1" : undefined)
                }
                className="size-4"
              />
              In stock only
            </label>
          </div>

          <SheetFooter>
            <Button variant="outline" onClick={clearAll}>
              Clear all
            </Button>
            <Button onClick={() => setOpen(false)}>Show results</Button>
          </SheetFooter>
        </SheetContent>

        <Button
          variant="outline"
          onClick={() => setOpen(true)}
          aria-label={`Filters${activeFilterCount > 0 ? `, ${activeFilterCount} active` : ""}`}
        >
          <SlidersHorizontal aria-hidden />
          Filters{activeFilterCount > 0 ? ` (${activeFilterCount})` : ""}
        </Button>
      </Sheet>

      <select
        value={sort}
        onChange={(e) =>
          setSingle(
            "sort",
            e.target.value === "featured" ? undefined : e.target.value
          )
        }
        aria-label="Sort products"
        className="h-11 rounded-lg border border-input bg-transparent px-3 text-sm"
      >
        <option value="featured">Featured</option>
        <option value="price-asc">Price: Low to High</option>
        <option value="price-desc">Price: High to Low</option>
      </select>
    </div>
  );
}
