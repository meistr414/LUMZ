import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ProductGrid } from "@/components/ProductGrid";
import { TrustStrip } from "@/components/TrustStrip";
import { getCategories, getFeaturedProducts } from "@/lib/data/products";

export default function Home() {
  const categories = getCategories();
  const featured = getFeaturedProducts();

  return (
    <div className="flex flex-col gap-16 pb-16">
      <section className="flex flex-col items-center gap-6 bg-foreground px-4 py-20 text-center text-background">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">LUMZ</h1>
        <p className="max-w-md text-background/70">
          Streetwear essentials, cut for South Africa.
        </p>
        <Button
          size="lg"
          nativeButton={false}
          render={<Link href="/products" />}
          className="bg-brand text-brand-foreground hover:bg-brand/90"
        >
          Shop the catalogue
        </Button>
      </section>

      <section className="mx-auto w-full max-w-6xl px-4">
        <h2 className="mb-4 text-xl font-bold tracking-tight">
          Shop by category
        </h2>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/products?category=${category.id}`}
              className="group relative aspect-square overflow-hidden rounded-lg bg-muted"
            >
              {category.image && (
                <Image
                  src={category.image}
                  alt={category.name}
                  fill
                  sizes="(min-width: 640px) 25vw, 50vw"
                  className="object-cover transition-transform group-hover:scale-105"
                />
              )}
              <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent p-3 text-sm font-semibold text-white">
                {category.name}
              </span>
            </Link>
          ))}
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-4">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-bold tracking-tight">Featured</h2>
          <Link
            href="/products"
            className="text-sm font-medium underline-offset-4 hover:underline"
          >
            Shop all
          </Link>
        </div>
        <ProductGrid products={featured} />
      </section>

      <section className="mx-auto w-full max-w-6xl px-4">
        <TrustStrip />
      </section>
    </div>
  );
}
