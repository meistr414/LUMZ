import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { ProductDetail } from "@/components/ProductDetail";
import { breadcrumbJsonLd } from "@/lib/breadcrumb-jsonld";
import {
  getCategories,
  getProductCompareAtCents,
  getProductMinPriceCents,
  getProduct,
  getProducts,
  isProductSoldOut,
} from "@/lib/data/products";
import { SIZE_CHARTS } from "@/mocks/size-charts";

export function generateStaticParams() {
  return getProducts().map((product) => ({ slug: product.slug }));
}

export async function generateMetadata(
  props: PageProps<"/products/[slug]">
): Promise<Metadata> {
  const { slug } = await props.params;
  const product = getProduct(slug);
  if (!product) return {};

  const ogImage = product.colours[0]?.images[0]?.src;

  return {
    title: product.name,
    description: product.description,
    alternates: {
      canonical: `/products/${product.slug}`,
    },
    openGraph: {
      title: product.name,
      description: product.description,
      images: ogImage ? [ogImage] : undefined,
    },
  };
}

export default async function ProductPage(
  props: PageProps<"/products/[slug]">
) {
  const { slug } = await props.params;
  const product = getProduct(slug);
  if (!product) notFound();

  const sizeChart = SIZE_CHARTS[product.sizeChartId];
  if (!sizeChart) notFound();

  const priceCents = getProductMinPriceCents(product);
  const compareAtCents = getProductCompareAtCents(product);
  const soldOut = isProductSoldOut(product);
  const category = getCategories().find((c) => c.id === product.categoryId);

  const breadcrumbItems = [
    { name: "Home", path: "/" },
    { name: "Shop all", path: "/products" },
    ...(category
      ? [{ name: category.name, path: `/products?category=${category.id}` }]
      : []),
    { name: product.name, path: `/products/${product.slug}` },
  ];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    image: product.colours.flatMap((c) => c.images.map((i) => i.src)),
    offers: {
      "@type": "Offer",
      priceCurrency: "ZAR",
      price: (priceCents / 100).toFixed(2),
      availability: soldOut
        ? "https://schema.org/OutOfStock"
        : "https://schema.org/InStock",
    },
    ...(compareAtCents
      ? {
          additionalProperty: {
            "@type": "PropertyValue",
            name: "sale",
            value: true,
          },
        }
      : {}),
  };

  return (
    <>
      {/* Plain text child, not dangerouslySetInnerHTML — a <script> tag's
          children are set as text content, never HTML-parsed. */}
      <script type="application/ld+json">
        {JSON.stringify(jsonLd).replace(/</g, "\\u003c")}
      </script>
      <script type="application/ld+json">
        {JSON.stringify(breadcrumbJsonLd(breadcrumbItems)).replace(
          /</g,
          "\\u003c"
        )}
      </script>
      <div className="mx-auto max-w-6xl px-4 pt-4">
        <Breadcrumbs
          items={[
            { label: "Home", href: "/" },
            { label: "Shop all", href: "/products" },
            ...(category
              ? [
                  {
                    label: category.name,
                    href: `/products?category=${category.id}`,
                  },
                ]
              : []),
            { label: product.name },
          ]}
        />
      </div>
      <ProductDetail product={product} sizeChart={sizeChart} />
    </>
  );
}
