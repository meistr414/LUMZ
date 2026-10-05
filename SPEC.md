# Catalogue Website — Frontend Spec

Oct 5, 2026 · @Kmeistr

## Overview

Build a fast, mobile-first clothing catalogue with a cart and a guest checkout form; payment is a stubbed step that the gateway replaces later. No customer accounts in v1: shoppers enter their delivery details at every checkout, helped by browser autofill.

- **In scope:** catalogue, product pages, search and filters, cart, checkout form, order review, mock order confirmation, order lookup page (UI only).
- **Out of scope for now:** real payments, backend order storage, admin panel, accounts.
- **Market:** South Africa. Prices in ZAR (R 1 299,00 display), SA address format, mobile data costs matter.

**Using this with Claude Code:** save this spec as `SPEC.md` in the repo root and ask Claude Code to read it first. Build one phase at a time (see Build phases) and check the acceptance criteria before moving on.

## Tech stack and project structure

Use Next.js (App Router) with TypeScript and Tailwind CSS, deployed on Vercel.

| Concern              | Choice                                                                |
| -------------------- | --------------------------------------------------------------------- |
| Framework            | Next.js 15+ App Router, TypeScript strict mode                        |
| Styling              | Tailwind CSS, shadcn/ui for primitives (Button, Input, Sheet, Dialog) |
| Cart state           | Zustand with `persist` middleware (localStorage)                      |
| Forms and validation | React Hook Form + Zod (schemas reused later on the server)            |
| Images               | `next/image`, WebP/AVIF, local `/public/products` for v1              |
| Icons                | lucide-react                                                          |
| Data (v1)            | Typed JSON/TS mock files behind a data-access layer                   |
| Testing              | Vitest + Testing Library for units, Playwright for the checkout flow  |
| Linting              | ESLint + Prettier                                                     |

```
/app
  layout.tsx            # header, footer, cart drawer
  page.tsx              # home
  products/page.tsx     # catalogue grid
  products/[slug]/page.tsx
  cart/page.tsx
  checkout/page.tsx
  checkout/review/page.tsx
  order/[ref]/page.tsx  # confirmation
  track/page.tsx        # order lookup
  (legal)/privacy/page.tsx, terms/page.tsx, returns/page.tsx
/components             # UI components
/lib
  data/                 # getProducts(), getProduct(slug), getCategories()
  schemas/              # Zod schemas (address, checkout, product)
  store/cart.ts         # Zustand cart store
  format.ts             # ZAR formatting, phone formatting
/types                  # Product, Category, CartItem, CheckoutDetails
/mocks/products.ts
```

All product reads go through `/lib/data` so the mock files can be swapped for Supabase later without touching components.

## Pages and routes

Nine customer-facing routes plus three legal pages; catalogue pages are statically generated, checkout pages are client-rendered.

| Route                            | Purpose        | Key content                                                                                                                                                                   | Rendering                     |
| -------------------------------- | -------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------- |
| `/`                              | Home           | Hero, featured categories, featured products, trust strip (delivery, secure payment, returns)                                                                                 | Static                        |
| `/products`                      | Catalogue      | Product grid, category filter, price sort, search, pagination or load-more                                                                                                    | Static + client filtering     |
| `/products/[slug]`               | Product detail | Image gallery per colour, name, price, colour swatches, size picker, Size guide link, fit and model info, quantity, Add to cart, material and care, delivery and returns info | Static (generateStaticParams) |
| `/cart`                          | Cart           | Line items, quantity steppers, remove, subtotal, delivery estimate, Checkout button                                                                                           | Client                        |
| `/checkout`                      | Guest details  | Contact + delivery address form, delivery method                                                                                                                              | Client                        |
| `/checkout/review`               | Review order   | Read-only summary of items, address, totals; Pay button (stubbed)                                                                                                             | Client                        |
| `/order/[ref]`                   | Confirmation   | Order reference, summary, "what happens next", WhatsApp/email note                                                                                                            | Client (mock)                 |
| `/track`                         | Order lookup   | Email + order reference form, mock status result                                                                                                                              | Client (mock)                 |
| `/privacy`, `/terms`, `/returns` | Legal          | POPIA privacy notice, terms, returns and size-exchange policy                                                                                                                 | Static                        |

The user flow is linear: catalogue → product → cart → checkout → review → confirmation. Guard `/checkout` and `/checkout/review` so an empty cart redirects to `/products`, and review redirects to `/checkout` if details are missing. Include a `not-found.tsx` and `error.tsx`.

## Components

Build these as small, typed, reusable components; no component fetches data directly.

| Component         | Responsibility                                                                                           |
| ----------------- | -------------------------------------------------------------------------------------------------------- |
| `Header`          | Logo, nav, search trigger, cart icon with live item count                                                |
| `Footer`          | Contact, WhatsApp link, legal links, payment-method badges                                               |
| `CartDrawer`      | Slide-over cart opened after Add to cart; mini line items, subtotal, Checkout                            |
| `ProductCard`     | Image, name, price, stock badge, quick Add to cart                                                       |
| `ProductGrid`     | Responsive grid with empty and loading (skeleton) states                                                 |
| `FilterBar`       | Department, category, size, colour, price range, sort, in-stock toggle; state synced to URL query params |
| `SearchInput`     | Debounced (300 ms) client search over name and tags                                                      |
| `ImageGallery`    | Main image + thumbnails, swipe on mobile, zoom on desktop                                                |
| `VariantPicker`   | Colour swatches plus size buttons (XS–XXL or numeric); sold-out sizes shown struck through, not hidden   |
| `QuantityStepper` | +/- buttons, min 1, max = stock or 10                                                                    |
| `PriceTag`        | Formats ZAR, shows compare-at (sale) price                                                               |
| `CartLineItem`    | Thumbnail, name, variant, stepper, line total, remove                                                    |
| `OrderSummary`    | Subtotal, delivery, total; used in cart, review, confirmation                                            |
| `CheckoutForm`    | Contact + address fields, delivery method, consent checkboxes                                            |
| `AddressFields`   | SA address inputs with correct `autocomplete` attributes                                                 |
| `Toast`           | Feedback for add/remove/errors                                                                           |
| `TrustStrip`      | Secure payment, delivery time, returns promise                                                           |

**Clothing-specific components**

| Component           | Responsibility                                                                             |
| ------------------- | ------------------------------------------------------------------------------------------ |
| `SizeGuide`         | Dialog with the product's size chart in cm, how-to-measure tips, and fit note              |
| `ColourSwatch`      | Round swatch from a hex value; swaps the gallery to that colour's images                   |
| `FitInfo`           | Fit type (slim, regular, oversized) and model info, e.g. "Model is 1.82 m and wears M"     |
| `ProductCard` hover | Shows a second image on hover (desktop) and available colours as small dots                |
| `MaterialCare`      | Collapsible fabric composition and care instructions                                       |
| `SizeReminder`      | On Add to cart with no size chosen, highlights the size picker instead of failing silently |

## Data model and mock data

Store all money as integer cents to avoid rounding errors; format only at display time.

```ts
type Department = "men" | "women" | "kids" | "unisex";

type Category = {
  id: string;
  slug: string;
  name: string;
  department: Department;
  image?: string;
};

type SizeChart = {
  id: string;
  unit: "cm";
  columns: string[]; // e.g. ["Size", "Chest", "Waist", "Length"]
  rows: string[][]; // e.g. [["M", "96–101", "81–86", "72"]]
};

type Colour = {
  id: string;
  name: string; // "Olive"
  hex: string; // "#556B2F"
  images: { src: string; alt: string }[];
};

type Variant = {
  id: string;
  sku: string;
  colourId: string;
  size: string; // "S", "M", "32", "UK 8"
  priceCents: number;
  compareAtCents?: number;
  stock: number;
};

type Product = {
  id: string;
  slug: string;
  name: string;
  description: string;
  department: Department;
  categoryId: string; // t-shirts, hoodies, jeans, dresses...
  colours: Colour[];
  sizes: string[]; // display order, e.g. ["XS","S","M","L","XL","XXL"]
  variants: Variant[]; // one per colour × size
  sizeChartId: string;
  fit?: "slim" | "regular" | "relaxed" | "oversized";
  modelInfo?: string;
  material: string; // "100% cotton, 220 gsm"
  care: string[];
  tags: string[];
  featured: boolean;
  active: boolean;
};

type CartItem = { productId: string; variantId: string; quantity: number };

type CheckoutDetails = {
  fullName: string;
  email: string;
  phone: string; // SA mobile, stored as +27XXXXXXXXX
  address: {
    line1: string;
    line2?: string;
    suburb: string;
    city: string;
    province: Province; // the 9 SA provinces as an enum
    postalCode: string; // 4 digits
  };
  deliveryMethod: "standard" | "express" | "collect";
  notes?: string;
  marketingOptIn: boolean;
  acceptedTerms: true;
};
```

- The cart stores only IDs and quantities, never prices; prices are always re-read from the product data.
- Mock data: 3–5 categories and 20–30 products, across men, women and unisex, including a sale item, a fully sold-out item, a product with some sizes sold out, a product in 3+ colours, and one with numeric sizes (jeans), so every UI state can be tested.
- Delivery fees live in one config file (`/lib/config/delivery.ts`), e.g. standard, express, free-delivery threshold.

## Cart and checkout behaviour

Checkout is a two-step guest flow (details → review) with a stubbed Pay button that the gateway replaces later.

**Cart**

- Persist to localStorage via Zustand `persist`; key `cart-v1` so the shape can be migrated later.
- On load, reconcile the stored cart against current product data: drop inactive items, clamp quantities to stock, and show a toast if anything changed.
- Adding the same variant twice increases quantity rather than creating a second line.

**Checkout form fields** (in this order, single column on mobile)

| Field                           | Input type                  | `autocomplete`   | Validation                       |
| ------------------------------- | --------------------------- | ---------------- | -------------------------------- |
| Full name                       | text                        | `name`           | 2–80 chars                       |
| Email                           | email                       | `email`          | Valid email                      |
| Mobile number                   | tel                         | `tel`            | SA mobile, normalise 0XX → +27XX |
| Street address                  | text                        | `address-line1`  | Required, max 100                |
| Apartment, complex, unit        | text                        | `address-line2`  | Optional                         |
| Suburb                          | text                        | `address-level3` | Required                         |
| City / town                     | text                        | `address-level2` | Required                         |
| Province                        | select                      | `address-level1` | One of 9 provinces               |
| Postal code                     | text, `inputMode="numeric"` | `postal-code`    | Exactly 4 digits                 |
| Delivery method                 | radio                       | —                | Required                         |
| Delivery notes                  | textarea                    | —                | Optional, max 300                |
| Marketing opt-in                | checkbox, unticked          | —                | Optional                         |
| Accept terms and privacy notice | checkbox                    | —                | Required                         |

- Wrap the fields in a real `<form>` with `name` attributes so browser and password-manager autofill works; this is the main cure for retyping addresses.
- Validate on blur and on submit; show inline errors under each field and focus the first invalid one.
- Save the details to `sessionStorage` so a page refresh doesn't wipe them; clear them after the order is confirmed.

**Review and pay (stub)**

- Show items, address, delivery method and totals, each with an Edit link back.
- The Pay button calls `createPaymentSession(payload)` from `/lib/payments/index.ts`. In v1 this is a mock that waits 1 second, generates a reference (e.g. `ORD-7K2M9Q`), clears the cart and routes to `/order/[ref]`.
- Disable the button and show a spinner while pending to prevent double submits.

## Design system, responsiveness, accessibility

Design mobile-first at 360 px wide, because most SA shoppers will arrive on a phone.

- **Tokens:** define colours, radius, spacing and font sizes as CSS variables in `globals.css` and map them in Tailwind, so rebranding is a one-file change. Support light and dark mode.
- **Breakpoints:** product grid of 2 columns on mobile, 3 at `md`, 4 at `lg`; checkout single column on mobile, form + sticky order summary side by side at `lg`.
- **Touch:** tap targets at least 44 × 44 px; sticky Add to cart bar on product pages on mobile.
- **Typography:** one system or Google font with a fallback stack; base size 16 px so iOS doesn't zoom into inputs.
- **States:** every list and page has loading (skeleton), empty and error states.
- **Accessibility (WCAG 2.2 AA):** semantic HTML, labels on every input, visible focus rings, colour contrast at least 4.5:1, alt text on all product images, `aria-live` for cart count and toasts, keyboard-operable drawer and gallery, respect `prefers-reduced-motion`.

## Security and validation rules

The frontend is never trusted: it validates for user experience, and the server will re-validate and re-price everything later.

- Never collect card details in this app; the payment step will redirect to the gateway's hosted page.
- Never send a total or price from the browser as the source of truth; the payment stub's payload contains only `variantId`, `quantity`, `CheckoutDetails` and `deliveryMethod`.
- Keep the Zod schemas in `/lib/schemas` so the same rules run on the server later.
- No `dangerouslySetInnerHTML`; if product descriptions use markdown, render with a sanitiser.
- Don't store personal details in localStorage (cart only); checkout details go in `sessionStorage` and are cleared after the order.
- No personal data in URLs or query strings; the confirmation route uses only the order reference.
- Only `NEXT_PUBLIC_` variables in client code; no secrets in the repo, commit a `.env.example`.
- Security headers in `next.config` (Content-Security-Policy, X-Frame-Options or `frame-ancestors`, Referrer-Policy, Permissions-Policy, HSTS); allow the gateway's domain in the CSP when it's added.
- Leave a slot for Cloudflare Turnstile on the checkout and track forms (rendered off until the backend exists).
- POPIA: link the privacy notice beside the consent checkbox and keep marketing opt-in unticked by default.

## SEO and performance

Target a Lighthouse score of 90+ on mobile for performance, accessibility, best practices and SEO.

- `generateMetadata` per product and category: title, description, canonical URL, Open Graph image (good for WhatsApp link previews).
- JSON-LD `Product` schema with price in ZAR and availability on product pages; `BreadcrumbList` on catalogue and product pages.
- `sitemap.ts` and `robots.ts`; block `/cart`, `/checkout` and `/order` from indexing.
- Core Web Vitals budgets: LCP under 2.5 s, CLS under 0.1, INP under 200 ms on a mid-range Android over 4G.
- Images: explicit width and height, `sizes` set, priority only on the first above-the-fold image, lazy elsewhere.
- Keep client JavaScript small: catalogue and product pages as Server Components; only interactive pieces (cart, filters, forms) as Client Components.

## Out of scope and payment integration hooks

The gateway plugs in by replacing one function, with no changes to the UI.

```ts
// /lib/payments/index.ts
export type PaymentRequest = {
  items: { variantId: string; quantity: number }[];
  customer: CheckoutDetails;
};
export type PaymentSession = { orderRef: string; redirectUrl?: string };

export async function createPaymentSession(
  req: PaymentRequest
): Promise<PaymentSession>;
```

- **v1 (now):** mock implementation returns `orderRef` with no `redirectUrl`, and the UI routes straight to the confirmation page.
- **v2 (later):** a server action or API route validates with Zod, re-prices from the database, saves a pending order, and returns the gateway's hosted-checkout `redirectUrl`. The order becomes "paid" only via the verified webhook.
- Add `/order/[ref]` states for `pending`, `paid` and `failed` now (mocked), so the UI is ready for real statuses.

**Not in this phase:** real payments, webhooks, database, emails/WhatsApp messages, admin dashboard, inventory sync, one-time-code accounts, address autocomplete API.

## Build phases and acceptance criteria

Give Claude Code one phase per prompt; tick each criterion before starting the next.

1. **Setup:** Next.js + TypeScript + Tailwind + shadcn/ui, ESLint/Prettier, folder structure, design tokens, layout with Header/Footer.
   - [ ] `npm run build` and `npm run lint` pass with no errors
   - [ ] Security headers present in the response
2. **Data layer and catalogue:** types, mock products, `/lib/data`, home page, `/products` with filters, sort and search.
   - [ ] Filters and search update the URL and survive a refresh
   - [ ] Empty and loading states render
3. **Product page:** gallery per colour, colour and size pickers, size guide, material and care, quantity, Add to cart, metadata and JSON-LD.
   - [ ] Sold-out sizes can't be added, and switching colour updates the images and available sizes
   - [ ] Every product has a unique title and OG image
4. **Cart:** Zustand store, CartDrawer, `/cart`, reconciliation on load.
   - [ ] Cart survives a browser restart
   - [ ] Totals are correct in cents for sale and multi-quantity items
5. **Checkout:** form with Zod validation, review page, payment stub, confirmation page, route guards.
   - [ ] Chrome and Safari autofill fill every address field
   - [ ] Invalid inputs show inline errors; first error gets focus
   - [ ] Double-clicking Pay creates only one order reference
6. **Track page, legal pages, polish:** `/track` mock, privacy/terms/returns, 404 and error pages.
   - [ ] Lighthouse mobile 90+ in all four categories
   - [ ] Playwright test covers catalogue → confirmation end to end
   - [ ] Keyboard-only user can complete checkout

**Open questions:** brand name and colours; departments and categories; size range and size charts per brand or product type; real product list and photos (one set per colour); delivery fees and free-delivery threshold; whether collection (pickup) is offered.
