import type { Metadata } from "next";
import { Suspense } from "react";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { ProductGridSkeleton } from "@/components/ProductGrid";
import { ProductsBrowser } from "@/components/ProductsBrowser";
import { breadcrumbJsonLd } from "@/lib/breadcrumb-jsonld";
import {
  getAllColours,
  getAllSizes,
  getCategories,
  getProducts,
} from "@/lib/data/products";

const BREADCRUMB_ITEMS = [
  { name: "Home", path: "/" },
  { name: "Shop all", path: "/products" },
];

export const metadata: Metadata = {
  title: "Shop all",
  description:
    "Browse the full LUMZ catalogue — men's, women's and kids' streetwear, filtered by size, colour and price.",
};

export default function ProductsPage() {
  const products = getProducts();
  const categories = getCategories();
  const colours = getAllColours(products);
  const sizes = getAllSizes(products);

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <script type="application/ld+json">
        {JSON.stringify(breadcrumbJsonLd(BREADCRUMB_ITEMS)).replace(
          /</g,
          "\\u003c"
        )}
      </script>
      <Breadcrumbs
        items={[{ label: "Home", href: "/" }, { label: "Shop all" }]}
      />
      <h1 className="mb-6 text-2xl font-bold tracking-tight">Shop all</h1>
      <Suspense fallback={<ProductsBrowserFallback />}>
        <ProductsBrowser
          products={products}
          categories={categories}
          colours={colours}
          sizes={sizes}
        />
      </Suspense>
    </div>
  );
}

function ProductsBrowserFallback() {
  return (
    <div className="flex flex-col gap-4">
      <div className="h-11 w-full animate-pulse rounded-lg bg-muted" />
      <div className="h-11 w-40 animate-pulse rounded-lg bg-muted" />
      <ProductGridSkeleton />
    </div>
  );
}
