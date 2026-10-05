import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProductDetail } from "@/components/ProductDetail";
import {
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
      <ProductDetail product={product} sizeChart={sizeChart} />
    </>
  );
}
