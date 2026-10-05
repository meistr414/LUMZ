export const COLOUR_SWATCHES = {
  black: { name: "Black", hex: "#0a0a0a" },
  offwhite: { name: "Off-White", hex: "#f5f1e8" },
  olive: { name: "Olive", hex: "#556b2f" },
  navy: { name: "Navy", hex: "#1b2a4a" },
  rust: { name: "Rust", hex: "#b5533c" },
  sand: { name: "Sand", hex: "#d8c3a5" },
  charcoal: { name: "Charcoal", hex: "#2b2b2b" },
  denim: { name: "Denim Blue", hex: "#35506b" },
} as const;

export type ColourKey = keyof typeof COLOUR_SWATCHES;

/** Builds a product's images for one colourway from the generated placeholder set. */
export function colourImages(
  productSlug: string,
  colourKey: ColourKey,
  productName: string
) {
  const { name } = COLOUR_SWATCHES[colourKey];
  return [
    {
      src: `/products/${productSlug}/${colourKey}-1.svg`,
      alt: `${productName} in ${name}`,
    },
    {
      src: `/products/${productSlug}/${colourKey}-2.svg`,
      alt: `${productName} in ${name}, alternate view`,
    },
  ];
}
