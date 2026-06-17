# Add "One Piece" Product Category Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add a new "One Piece" product category across the Manasvi Fashion eCommerce platform so it behaves identically to Kurti, Dress, and Tunic in every layer (database, API, admin, frontend, search, filters, inventory, analytics, SEO).

**Architecture:** This is a **category-list evolution**, not a refactor. The platform already supports a closed set of `Category` / `ProductType` literals. We add `"one-piece"` to those union types, add a `one_piece` `ProductType`, add a `/one-piece` route that mirrors `/kurtis`, add `/collections/one-piece` for the lookbook, and add the One Piece–specific attributes (`length`, `fitType`, `sleeveType`, `neckType`, `occasion`) as optional fields on the `Product` interface. Schema-level CHECK constraints and category unions are extended; all switch/match expressions over categories get a new branch.

**Tech Stack:** Next.js 14 App Router (TS), Supabase (PostgreSQL), local JSON fallback store (`@/data/products.ts`, `products-db.json`), framer-motion, animejs, Tailwind + custom CSS variables.

---

## Pre-flight: Codebase Audit Findings

The platform has 4 distinct category axes that all need to be updated in lockstep:

1. **TypeScript literal types** — `app/src/types/index.ts`
   - `Category = "kurtis" | "dresses" | "tunic-tops"`
   - `ProductType = "kurti" | "tunic_top" | "dress"`
2. **PostgreSQL schema** — `app/supabase_schema.sql`
   - `category TEXT NOT NULL` with comment `'kurtis' | 'dresses'`
   - `product_type TEXT NOT NULL` with comment `'kurti' | 'tunic_top' | 'dress'`
3. **Category pages** — `app/src/app/{kurtis,dresses,tunic-tops}/page.tsx` (need a `one-piece` sibling)
4. **Header navigation & homepage category cards** — `app/src/components/header.tsx`, `app/src/components/lookbook-catalog.tsx`, `app/src/app/page.tsx`

Files that must be touched (audited from grep across `app/src/**`):

- `app/src/types/index.ts` — union types, optional new fields
- `app/supabase_schema.sql` — enum/comment + new columns
- `app/src/data/products.ts` — seed One Piece products
- `app/src/data/products-db.json` — sync (auto-derived)
- `app/src/lib/db-products.ts` — map new fields to/from DB
- `app/src/lib/db-orders.ts` — analytics (category-grouped revenue)
- `app/src/lib/db-cms.ts` — homepage CMS references
- `app/src/lib/db-reviews.ts` — category filter
- `app/src/lib/store.ts` — product count helpers
- `app/src/context/shop-context.tsx` — category list & helpers
- `app/src/components/header.tsx` — desktop nav, mobile drawer
- `app/src/components/lookbook-catalog.tsx` — tab list, filter, hero copy
- `app/src/components/hero-section.tsx` — homepage category reference
- `app/src/components/PageTransition.tsx` — transition copy
- `app/src/components/product-card.tsx` — category display
- `app/src/components/mobile-ethnic-collection.tsx` — mobile category list
- `app/src/components/mobile-first-experience.tsx` — mobile category list
- `app/src/components/admin/product-form.tsx` — dropdowns, form fields
- `app/src/components/layout/Footer.tsx` — footer nav
- `app/src/components/ui/skeleton.tsx` — category references
- `app/src/app/page.tsx` — homepage category section
- `app/src/app/products/page.tsx` — all-products filter
- `app/src/app/products/[slug]/page.tsx` — detail page
- `app/src/app/kurtis/page.tsx` — sibling pattern (for `one-piece`)
- `app/src/app/dresses/page.tsx` — sibling pattern
- `app/src/app/tunic-tops/page.tsx` — sibling pattern
- `app/src/app/collections/page.tsx` — lookbook tabs
- `app/src/app/new-arrivals/page.tsx` — filter
- `app/src/app/journal/page.tsx` — copy
- `app/src/app/contact/page.tsx` — copy
- `app/src/app/about/page.tsx` — copy
- `app/src/app/cart/page.tsx` — category reference
- `app/src/app/checkout/page.tsx` — category reference
- `app/src/app/returns/page.tsx` — copy
- `app/src/app/auth/signup/page.tsx` — copy
- `app/src/app/dashboard/products/page.tsx` — admin table
- `app/src/app/dashboard/products/new/page.tsx` — uses `<ProductForm />`
- `app/src/app/dashboard/products/edit/[id]/page.tsx` — uses `<ProductForm />`
- `app/src/app/dashboard/cms/page.tsx` — homepage CMS
- `app/src/app/seller/inventory/page.tsx` — inventory table
- `app/src/app/api/admin/products/route.ts` — server validation
- `app/src/app/api/admin/products/[id]/route.ts` — server validation
- `app/src/app/api/admin/cms/route.ts` — server validation
- `app/src/app/api/admin/settings/route.ts` — server validation
- `app/src/app/api/admin/stats/route.ts` — analytics
- `app/src/app/sitemap.ts` (if present) — SEO
- `app/src/middleware.ts` — category route auth

---

## Decision: New Type & Route Slugs

| Surface | Value |
|---|---|
| `Category` literal | `"one-piece"` |
| `ProductType` literal | `"one_piece"` |
| `category` (DB) | `"one-piece"` |
| `product_type` (DB) | `"one_piece"` |
| `subcategory` example | `"Designer One Piece"`, `"Casual One Piece"`, etc. |
| Nav label (desktop) | `One Piece` |
| Page route | `/one-piece` |
| Collection/lookbook route | `/collections/one-piece` |
| URL slug (product) | `/products/floral-maxi-one-piece` |

We use `one-piece` (kebab) for `Category` and `one_piece` (snake) for `ProductType` — both follow the existing pattern of `tunic-tops` / `tunic_top`.

---

## Task 1: Update TypeScript Type System

**Files:**
- Modify: `app/src/types/index.ts`

**Step 1: Extend `Category` and `ProductType` unions, add One Piece optional fields to `Product`**

```ts
export type Category = "kurtis" | "dresses" | "tunic-tops" | "one-piece";
export type ProductType = "kurti" | "tunic_top" | "dress" | "one_piece";

export interface Product {
  id: string;
  slug: string;
  title: string;
  category: Category;
  productType: ProductType;
  subcategory: string;
  description: string;
  fabric: string;
  sleeveType: string;
  color: string;
  price: number;
  compareAtPrice?: number;
  sizes: string[];
  images: string[];
  stock: number;
  rating: number;
  reviews: number;
  isNew?: boolean;
  colorVariants?: ColorVariant[];
  // One Piece specific attributes (optional; only meaningful for one-piece category)
  length?: "Mini" | "Above Knee" | "Knee Length" | "Midi" | "Maxi" | "Floor Length";
  fitType?: "Regular" | "A-Line" | "Fit & Flare" | "Bodycon" | "Straight Fit" | "Oversized";
  neckType?: "Round Neck" | "V Neck" | "Square Neck" | "Boat Neck" | "Collar Neck" | "Sweetheart Neck";
  occasion?: "Casual Wear" | "Office Wear" | "Party Wear" | "Festive Wear" | "Vacation Wear" | "Evening Wear";
}
```

**Step 2: Verify no TypeScript errors**

Run: `cd app && npx tsc --noEmit`
Expected: Existing code may show errors in switch statements — they are addressed in later tasks. Note the count; do not fix yet.

**Step 3: Commit**

```bash
git add app/src/types/index.ts
git commit -m "feat(types): add one-piece category, one_piece product type, and One Piece attribute fields"
```

---

## Task 2: Update Supabase Schema

**Files:**
- Modify: `app/supabase_schema.sql`

**Step 1: Add `one-piece` to category comment, `one_piece` to product_type comment, add new columns for One Piece attributes, add CHECK constraints**

The `products` table currently has:
- `category TEXT NOT NULL` (no CHECK)
- `product_type TEXT NOT NULL` (no CHECK)
- No columns for `length`, `fit_type`, `neck_type`, `occasion`

Add a migration block at the end of the schema file (idempotent with `IF NOT EXISTS`):

```sql
-- ============================================================
-- Migration: Add "One Piece" category + attribute columns
-- ============================================================

-- Add new columns if they don't exist
ALTER TABLE public.products
    ADD COLUMN IF NOT EXISTS length TEXT,
    ADD COLUMN IF NOT EXISTS fit_type TEXT,
    ADD COLUMN IF NOT EXISTS neck_type TEXT,
    ADD COLUMN IF NOT EXISTS occasion TEXT;

-- Add CHECK constraint for category (drop first to allow re-run)
ALTER TABLE public.products DROP CONSTRAINT IF EXISTS products_category_check;
ALTER TABLE public.products
    ADD CONSTRAINT products_category_check
    CHECK (category IN ('kurtis', 'dresses', 'tunic-tops', 'one-piece'));

-- Add CHECK constraint for product_type
ALTER TABLE public.products DROP CONSTRAINT IF EXISTS products_product_type_check;
ALTER TABLE public.products
    ADD CONSTRAINT products_product_type_check
    CHECK (product_type IN ('kurti', 'tunic_top', 'dress', 'one_piece'));

-- Optional: index for fast filtering on the new category
CREATE INDEX IF NOT EXISTS idx_products_category ON public.products (category);
```

**Step 2: Update the inline comment on `category` and `product_type` in the `CREATE TABLE` block**

Change:
```sql
category TEXT NOT NULL,                           -- 'kurtis' | 'dresses'
product_type TEXT NOT NULL,                       -- 'kurti' | 'tunic_top' | 'dress'
```

To:
```sql
category TEXT NOT NULL,                           -- 'kurtis' | 'dresses' | 'tunic-tops' | 'one-piece'
product_type TEXT NOT NULL,                       -- 'kurti' | 'tunic_top' | 'dress' | 'one_piece'
```

**Step 3: Commit**

```bash
git add app/supabase_schema.sql
git commit -m "feat(db): add one-piece category CHECK constraints and One Piece attribute columns"
```

---

## Task 3: Update db-products Mapper to Read/Write New Fields

**Files:**
- Modify: `app/src/lib/db-products.ts`

**Step 1: Extend the `DbProductRow` interface and the field mapping**

Inside `getProducts()`, update `DbProductRow` to include the new columns:

```ts
interface DbProductRow {
  id: string | number;
  slug: string;
  title: string;
  category: string;
  product_type: string;
  subcategory?: string;
  description: string;
  fabric?: string;
  sleeve_type?: string;
  color?: string;
  price: number;
  compare_at_price?: number;
  sizes: string | string[];
  images: string | string[];
  stock: number;
  rating?: number;
  reviews?: number;
  is_new?: boolean;
  color_variants?: string | { color: string; hex: string; slug: string }[];
  length?: string | null;
  fit_type?: string | null;
  neck_type?: string | null;
  occasion?: string | null;
}
```

And add the new fields to the mapped return:

```ts
length: item.length ?? undefined,
fitType: item.fit_type ?? undefined,
neckType: item.neck_type ?? undefined,
occasion: item.occasion ?? undefined,
```

**Step 2: Extend `createProduct` insert payload**

In the `supabaseAdmin.from("products").insert([...])` block, add:

```ts
length: newProduct.length ?? null,
fit_type: newProduct.fitType ?? null,
neck_type: newProduct.neckType ?? null,
occasion: newProduct.occasion ?? null,
```

**Step 3: Extend `updateProduct` dbUpdates block**

```ts
if (updates.length !== undefined) dbUpdates.length = updates.length;
if (updates.fitType !== undefined) dbUpdates.fit_type = updates.fitType;
if (updates.neckType !== undefined) dbUpdates.neck_type = updates.neckType;
if (updates.occasion !== undefined) dbUpdates.occasion = updates.occasion;
```

**Step 4: Commit**

```bash
git add app/src/lib/db-products.ts
git commit -m "feat(db-products): persist One Piece length/fit/neck/occasion attributes"
```

---

## Task 4: Add Seed One Piece Products

**Files:**
- Modify: `app/src/data/products.ts`

**Step 1: Append three One Piece entries to the existing `products` array**

Add at the bottom of the array (use real product copy following the existing style):

```ts
{
  id: "op-001",
  slug: "floral-maxi-one-piece",
  title: "Aurora Floral Maxi One Piece",
  category: "one-piece",
  productType: "one_piece",
  subcategory: "Floral One Piece",
  description: "Floor-grazing maxi one piece drenched in a soft watercolor floral print. Lightweight viscose falls in a fluid A-line silhouette, ideal for vacation days and sunset dinners.",
  fabric: "Viscose",
  sleeveType: "Short Sleeve",
  color: "Dusty Rose",
  price: 3499,
  compareAtPrice: 4499,
  sizes: ["XS", "S", "M", "L", "XL", "XXL"],
  images: ["/one-piece/aurora-floral-1.jpg", "/one-piece/aurora-floral-2.jpg"],
  stock: 24,
  rating: 4.8,
  reviews: 32,
  isNew: true,
  length: "Maxi",
  fitType: "A-Line",
  neckType: "Round Neck",
  occasion: "Vacation Wear",
},
{
  id: "op-002",
  slug: "midi-bodycon-one-piece",
  title: "Noir Sculpted Midi One Piece",
  category: "one-piece",
  productType: "one_piece",
  subcategory: "Statement One Piece",
  description: "Sleek bodycon midi one piece in deep noir, engineered with stretch ponte for an effortlessly sculpted fit. Square neckline and statement sleeves.",
  fabric: "Ponte Knit",
  sleeveType: "Puff Sleeve",
  color: "Black",
  price: 4299,
  sizes: ["XS", "S", "M", "L", "XL"],
  images: ["/one-piece/noir-midi-1.jpg", "/one-piece/noir-midi-2.jpg"],
  stock: 18,
  rating: 4.7,
  reviews: 21,
  isNew: true,
  length: "Midi",
  fitType: "Bodycon",
  neckType: "Square Neck",
  occasion: "Party Wear",
},
{
  id: "op-003",
  slug: "fit-and-flare-festive-one-piece",
  title: "Zara Festive Fit & Flare One Piece",
  category: "one-piece",
  productType: "one_piece",
  subcategory: "Festive One Piece",
  description: "Festive fit & flare one piece with delicate hand-embroidery along the bodice. Knee-length hem and sweetheart neckline make it a standout for celebrations.",
  fabric: "Silk Blend",
  sleeveType: "3/4 Sleeve",
  color: "Emerald",
  price: 5499,
  compareAtPrice: 6499,
  sizes: ["S", "M", "L", "XL", "XXL"],
  images: ["/one-piece/zara-festive-1.jpg", "/one-piece/zara-festive-2.jpg"],
  stock: 12,
  rating: 4.9,
  reviews: 14,
  length: "Knee Length",
  fitType: "Fit & Flare",
  neckType: "Sweetheart Neck",
  occasion: "Festive Wear",
},
```

**Step 2: Commit**

```bash
git add app/src/data/products.ts
git commit -m "feat(seed): add three One Piece seed products with all attribute fields"
```

---

## Task 5: Update Shop Context — Category List & Helpers

**Files:**
- Modify: `app/src/context/shop-context.tsx`

**Step 1: Find every `CATEGORIES` / `category` array in this file and add `"one-piece"`**

Look for patterns like:
- `const CATEGORIES = [...]`
- `const categoryList = [...]`
- `["kurtis", "tunic-tops", "dresses"]`

Add `"one-piece"` to each literal. If there is a display-label map, add `{ value: "one-piece", label: "One Piece" }`.

**Step 2: Find any `categoryFilter` / `getProductsByCategory` helper that has a switch or if-chain and add an `"one-piece"` branch**

Pattern to look for:
```ts
if (cat === "kurtis") return ...
if (cat === "dresses") return ...
if (cat === "tunic-tops") return ...
```

Add:
```ts
if (cat === "one-piece") return ...
```

**Step 3: Commit**

```bash
git add app/src/context/shop-context.tsx
git commit -m "feat(shop-context): add one-piece to category list and helpers"
```

---

## Task 6: Update Header Navigation (Desktop + Mobile Drawer)

**Files:**
- Modify: `app/src/components/header.tsx`

**Step 1: Add `/one-piece` to the desktop nav array (line ~144)**

Change:
```tsx
{["/kurtis", "/tunic-tops", "/dresses"].map((path, i) => (
  <Link ...>
    {["Kurtis", "Tunics", "Dresses"][i]}
  </Link>
))}
```

To:
```tsx
{["/kurtis", "/tunic-tops", "/dresses", "/one-piece"].map((path, i) => (
  <Link ...>
    {["Kurtis", "Tunics", "Dresses", "One Piece"][i]}
  </Link>
))}
```

**Step 2: Add `/one-piece` to the home-page left nav (line ~249)**

Change:
```tsx
{[
  ["/kurtis", "Kurtis"],
  ["/tunic-tops", "Tunics"],
  ["/collections", "Collections"],
].map(...)}
```

To (insert "One Piece" after "Tunics"):
```tsx
{[
  ["/kurtis", "Kurtis"],
  ["/tunic-tops", "Tunics"],
  ["/one-piece", "One Piece"],
  ["/collections", "Collections"],
].map(...)}
```

**Step 3: Add `One Piece` to the mobile drawer menu list (line ~479)**

In the `nav` array, add:
```tsx
["/one-piece", "One Piece Collection"],
```

**Step 4: Commit**

```bash
git add app/src/components/header.tsx
git commit -m "feat(header): add One Piece to desktop nav, home nav, and mobile drawer"
```

---

## Task 7: Create the `/one-piece` Page

**Files:**
- Create: `app/src/app/one-piece/page.tsx`

**Step 1: Copy the Kurtis page as a sibling and adjust**

```tsx
"use client";

import { useShop } from "@/context/shop-context";
import { ProductGridSkeleton, LuxuryTransition } from "@/components/ui/skeleton";
import PageTransition from "@/components/PageTransition";
import LookbookCatalog from "@/components/lookbook-catalog";

export default function OnePiecePage() {
  const { loading } = useShop();

  return (
    <PageTransition>
      <main className="min-h-screen bg-[#FAF7F2] text-[#3B2B28] pt-24 sm:pt-28 md:pt-32 pb-20 sm:pb-24 relative overflow-hidden soft-grain">
        {/* BACKGROUND DECORATIVE GLOWS */}
        <div className="absolute top-[12%] right-[-10%] w-[45vw] h-[45vw] rounded-full bg-[#F4D7CF] opacity-25 filter blur-[140px] pointer-events-none" />
        <div className="absolute bottom-[25%] left-[-15%] w-[50vw] h-[50vw] rounded-full bg-[#E7C2B8] opacity-25 filter blur-[150px] pointer-events-none" />

        <LuxuryTransition isLoading={loading} fallback={
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-8">
            <ProductGridSkeleton count={4} />
          </div>
        }>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <LookbookCatalog initialTab="One Piece" />
          </div>
        </LuxuryTransition>
      </main>
    </PageTransition>
  );
}
```

**Step 2: Commit**

```bash
git add app/src/app/one-piece/page.tsx
git commit -m "feat(pages): add /one-piece route mirroring kurtis page"
```

---

## Task 8: Create the `/collections/one-piece` Route

**Files:**
- Read first: `app/src/app/collections/page.tsx` (to understand pattern)
- Create: `app/src/app/collections/one-piece/page.tsx`

**Step 1: If `/collections/[slug]` dynamic route already exists, no new file is needed** — verify by reading the `app/src/app/collections/` directory. If only `page.tsx` exists, create the static page:

```tsx
import LookbookCatalog from "@/components/lookbook-catalog";
import PageTransition from "@/components/PageTransition";

export const metadata = {
  title: "One Piece Collection | Manasvi Fashion",
  description: "Discover elegant One Piece dresses from Manasvi Fashion. Shop stylish casual, festive, party and everyday wear collections.",
};

export default function OnePieceCollectionPage() {
  return (
    <PageTransition>
      <main className="min-h-screen bg-[#FAF7F2] text-[#3B2B28] pt-24 sm:pt-28 md:pt-32 pb-20 sm:pb-24 relative overflow-hidden soft-grain">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <LookbookCatalog initialTab="One Piece" />
        </div>
      </main>
    </PageTransition>
  );
}
```

If `/collections/[slug]/page.tsx` exists, add `"one-piece"` to its accepted slugs.

**Step 2: Commit**

```bash
git add app/src/app/collections/
git commit -m "feat(collections): add /collections/one-piece route with SEO metadata"
```

---

## Task 9: Update `lookbook-catalog.tsx` to Add the "One Piece" Tab & Filters

**Files:**
- Modify: `app/src/components/lookbook-catalog.tsx`

This is the largest single touchpoint. The component renders tab buttons and a filter rail.

**Step 1: Find the `TABS` / `tabList` array and add "One Piece"**

```ts
const TABS = ["Kurtis", "Tunics", "Dresses", "One Piece"];
```

**Step 2: Find the `categoryToFilter` switch and add a branch for One Piece**

Look for a pattern like:
```ts
case "Tunics":
case "Dresses":
case "Kurtis":
```

Add:
```ts
case "One Piece":
  return products.filter(p => p.category === "one-piece");
```

**Step 3: Find the `sleeveType` / `neckType` / `occasion` filter logic and make sure it applies to One Piece products**

If the filter currently hides these for non-Dress categories, ensure the One Piece products also expose the new attributes.

**Step 4: Find the page hero / `EditorialCopy` block referencing "Kurtis", "Tunics", "Dresses" and add an "One Piece" copy variant**

```ts
const HERO_COPY: Record<string, { title: string; subtitle: string }> = {
  "Kurtis": { title: "Kurtis, Reimagined", subtitle: "..." },
  "Tunics": { title: "Tunics & Tops", subtitle: "..." },
  "Dresses": { title: "Dresses, Draped", subtitle: "..." },
  "One Piece": {
    title: "One Piece, Endlessly Wearable",
    subtitle: "From brunch to ballroom — discover one pieces tailored for every moment.",
  },
};
```

**Step 5: Commit**

```bash
git add app/src/components/lookbook-catalog.tsx
git commit -m "feat(lookbook): add One Piece tab, filter, and hero copy"
```

---

## Task 10: Update `homepage` to Show the One Piece Category Card

**Files:**
- Modify: `app/src/app/page.tsx`
- Possibly: `app/src/components/hero-section.tsx`

**Step 1: Find the category card grid (typically a `CATEGORIES` constant or JSX array)**

Add an entry like:
```ts
{
  slug: "one-piece",
  title: "One Piece",
  description: "Effortless silhouettes for every occasion.",
  image: "/one-piece/hero.jpg",
  href: "/collections/one-piece",
}
```

**Step 2: Ensure the new card renders in the same grid layout (3 or 4 columns). If 4-up, just add. If 3-up, change to 4-up or re-balance.**

**Step 3: Commit**

```bash
git add app/src/app/page.tsx
git commit -m "feat(homepage): add One Piece category card to homepage"
```

---

## Task 11: Update Admin Product Form

**Files:**
- Modify: `app/src/components/admin/product-form.tsx`

This is the second-largest touchpoint.

**Step 1: Find the category dropdown `<select>` and add a "One Piece" option**

```tsx
<option value="one-piece">One Piece</option>
```

**Step 2: Find the productType dropdown (if separate) and add**

```tsx
<option value="one_piece">One Piece</option>
```

**Step 3: Find the `productType === "dress" ? "Boutique Dress" : ...` ternary chains and add an "one_piece" branch**

```tsx
selectedProduct.productType === "kurti" ? "Standard Kurti"
  : selectedProduct.productType === "tunic_top" ? "Comfort Tunic"
  : selectedProduct.productType === "one_piece" ? "Designer One Piece"
  : "Boutique Dress"
```

**Step 4: Add One Piece attribute fields (Length, Fit Type, Neck Type, Occasion) to the form, conditionally shown when `category === "one-piece"`**

```tsx
{category === "one-piece" && (
  <div className="space-y-4 border-t border-[#E7C2B8]/20 pt-4 mt-4">
    <h3 className="font-[var(--font-cormorant)] text-lg italic text-[#8B6B61]">
      One Piece Attributes
    </h3>
    {/* Length */}
    <label>
      <span>Length</span>
      <select value={length} onChange={e => setLength(e.target.value as any)}>
        <option value="">Select length</option>
        <option>Mini</option>
        <option>Above Knee</option>
        <option>Knee Length</option>
        <option>Midi</option>
        <option>Maxi</option>
        <option>Floor Length</option>
      </select>
    </label>
    {/* Fit Type */}
    <label>
      <span>Fit Type</span>
      <select value={fitType} onChange={e => setFitType(e.target.value as any)}>
        <option value="">Select fit</option>
        <option>Regular</option>
        <option>A-Line</option>
        <option>Fit & Flare</option>
        <option>Bodycon</option>
        <option>Straight Fit</option>
        <option>Oversized</option>
      </select>
    </label>
    {/* Neck Type */}
    <label>
      <span>Neck Type</span>
      <select value={neckType} onChange={e => setNeckType(e.target.value as any)}>
        <option value="">Select neck</option>
        <option>Round Neck</option>
        <option>V Neck</option>
        <option>Square Neck</option>
        <option>Boat Neck</option>
        <option>Collar Neck</option>
        <option>Sweetheart Neck</option>
      </select>
    </label>
    {/* Occasion */}
    <label>
      <span>Occasion</span>
      <select value={occasion} onChange={e => setOccasion(e.target.value as any)}>
        <option value="">Select occasion</option>
        <option>Casual Wear</option>
        <option>Office Wear</option>
        <option>Party Wear</option>
        <option>Festive Wear</option>
        <option>Vacation Wear</option>
        <option>Evening Wear</option>
      </select>
    </label>
  </div>
)}
```

**Step 5: In the form's submit handler, include the new fields in the payload**

```ts
const payload = {
  ...,
  length,
  fitType,
  neckType,
  occasion,
};
```

**Step 6: Commit**

```bash
git add app/src/components/admin/product-form.tsx
git commit -m "feat(admin): add One Piece to category dropdowns and One Piece attribute fields"
```

---

## Task 12: Update Admin Products Table Filter

**Files:**
- Modify: `app/src/app/dashboard/products/page.tsx`

**Step 1: Find the category filter dropdown and add "One Piece"**

```tsx
<option value="one-piece">One Piece</option>
```

**Step 2: Commit**

```bash
git add app/src/app/dashboard/products/page.tsx
git commit -m "feat(dashboard): add One Piece to admin products filter"
```

---

## Task 13: Update API Validation (Server-Side)

**Files:**
- Modify: `app/src/app/api/admin/products/route.ts`
- Modify: `app/src/app/api/admin/products/[id]/route.ts`
- Modify: `app/src/app/api/admin/cms/route.ts`
- Modify: `app/src/app/api/admin/settings/route.ts`

**Step 1: In each file, find the Zod schema / `if` validator that restricts `category` and add `"one-piece"`**

Pattern (typical):
```ts
const ALLOWED_CATEGORIES = ["kurtis", "dresses", "tunic-tops"];
```

Change to:
```ts
const ALLOWED_CATEGORIES = ["kurtis", "dresses", "tunic-tops", "one-piece"];
```

Same for `productType`:
```ts
const ALLOWED_PRODUCT_TYPES = ["kurti", "tunic_top", "dress", "one_piece"];
```

**Step 2: For the products endpoints, extend the optional fields validator to accept `length`, `fitType`, `neckType`, `occasion` as optional strings**

**Step 3: Commit per file (or one combined commit)**

```bash
git add app/src/app/api/
git commit -m "feat(api): allow one-piece category, one_piece product type, and One Piece attributes in server validation"
```

---

## Task 14: Update Analytics & Stats

**Files:**
- Modify: `app/src/app/api/admin/stats/route.ts`
- Modify: `app/src/lib/db-orders.ts`
- Modify: `app/src/app/seller/analytics/page.tsx` (if exists)

**Step 1: Find every `revenueByCategory` / `categoryBreakdown` aggregator and add a `one-piece` entry**

```ts
const revenueByCategory = {
  kurtis: 0,
  dresses: 0,
  "tunic-tops": 0,
  "one-piece": 0,
};
```

**Step 2: In the seller analytics page, add a stat card for "One Piece Revenue" / "One Piece Orders"**

**Step 3: Commit**

```bash
git add app/src/app/api/admin/stats/route.ts app/src/lib/db-orders.ts app/src/app/seller/
git commit -m "feat(analytics): include One Piece in category revenue and order breakdowns"
```

---

## Task 15: Update Footer

**Files:**
- Modify: `app/src/components/layout/Footer.tsx`

**Step 1: Find the "Shop" link list in the footer and add `/one-piece` → "One Piece"**

**Step 2: Commit**

```bash
git add app/src/components/layout/Footer.tsx
git commit -m "feat(footer): add One Piece to Shop nav"
```

---

## Task 16: Update Mobile-First Components

**Files:**
- Modify: `app/src/components/mobile-ethnic-collection.tsx`
- Modify: `app/src/components/mobile-first-experience.tsx`

**Step 1: In each, find the category list array and add the One Piece entry (matching the visual treatment used for Dresses / Tunic Tops)**

**Step 2: Commit per file**

```bash
git add app/src/components/mobile-ethnic-collection.tsx app/src/components/mobile-first-experience.tsx
git commit -m "feat(mobile): surface One Piece category on mobile-first experience and ethnic collection"
```

---

## Task 17: Update Product Card & Detail Page

**Files:**
- Modify: `app/src/components/product-card.tsx`
- Modify: `app/src/app/products/[slug]/page.tsx`

**Step 1: In `product-card.tsx`, find the place that renders the category badge / link and add a branch for `category === "one-piece"` → label `"One Piece"`, href `"/one-piece"`**

**Step 2: In `products/[slug]/page.tsx`, render the One Piece attributes when present**

```tsx
{product.length && <SpecRow label="Length" value={product.length} />}
{product.fitType && <SpecRow label="Fit" value={product.fitType} />}
{product.neckType && <SpecRow label="Neck" value={product.neckType} />}
{product.occasion && <SpecRow label="Occasion" value={product.occasion} />}
```

**Step 3: Commit**

```bash
git add app/src/components/product-card.tsx app/src/app/products/[slug]/page.tsx
git commit -m "feat(pdp): show One Piece attributes on product card and detail page"
```

---

## Task 18: Update Search & Filters

**Files:**
- Modify: `app/src/app/products/page.tsx`
- Possibly: `app/src/components/lookbook-catalog.tsx` (already updated in Task 9 — confirm filters cascade)

**Step 1: Find the category filter in the all-products page and add `One Piece`**

**Step 2: If the page renders a `MobileFilterDrawer`, ensure the drawer shows the One Piece option**

**Step 3: Commit**

```bash
git add app/src/app/products/page.tsx
git commit -m "feat(search): add One Piece to product filters"
```

---

## Task 19: Update Inventory Page

**Files:**
- Modify: `app/src/app/seller/inventory/page.tsx`

**Step 1: Find the category filter / grouping and add One Piece**

**Step 2: Commit**

```bash
git add app/src/app/seller/inventory/page.tsx
git commit -m "feat(inventory): add One Piece to seller inventory filter"
```

---

## Task 20: Update Sitemap and Robots

**Files:**
- Modify: `app/src/app/sitemap.ts` (if exists)
- Possibly: `app/src/app/robots.ts` (if exists)

**Step 1: Add `/one-piece` and `/collections/one-piece` to the static sitemap entries**

**Step 2: Commit**

```bash
git add app/src/app/sitemap.ts app/src/app/robots.ts
git commit -m "feat(seo): add One Piece routes to sitemap"
```

---

## Task 21: Update Reviews, CMS, and Remaining API Touchpoints

**Files:**
- Modify: `app/src/lib/db-reviews.ts` (category filter)
- Modify: `app/src/lib/db-cms.ts` (homepage CMS hero references)
- Modify: `app/src/app/dashboard/cms/page.tsx` (UI)
- Modify: `app/src/app/api/admin/cms/route.ts` (already in Task 13 — confirm)

**Step 1: In `db-reviews.ts`, allow `category === "one-piece"` in any filter**

**Step 2: In `db-cms.ts` and `dashboard/cms/page.tsx`, if the hero / category card schema lists categories, add One Piece**

**Step 3: Commit**

```bash
git add app/src/lib/db-reviews.ts app/src/lib/db-cms.ts app/src/app/dashboard/cms/page.tsx
git commit -m "feat(cms,reviews): add One Piece to CMS schema and reviews category filter"
```

---

## Task 22: Update Copy-Only Pages (About, Journal, Contact, Returns, Auth)

**Files:**
- Modify: `app/src/app/about/page.tsx`
- Modify: `app/src/app/journal/page.tsx`
- Modify: `app/src/app/contact/page.tsx`
- Modify: `app/src/app/returns/page.tsx`
- Modify: `app/src/app/auth/signup/page.tsx`
- Modify: `app/src/app/cart/page.tsx`
- Modify: `app/src/app/checkout/page.tsx`
- Modify: `app/src/app/new-arrivals/page.tsx`
- Modify: `app/src/components/PageTransition.tsx`
- Modify: `app/src/components/hero-section.tsx`
- Modify: `app/src/components/ui/skeleton.tsx`
- Modify: `app/src/lib/store.ts` (helpers)

**Step 1: In each file, search for `Kurti`, `Dress`, `Tunic` near each other. Add `One Piece` to keep the platform consistent.**

The task is intentionally non-breaking — these are copy changes only, no logic.

**Step 2: Commit as a single batched change**

```bash
git add app/src/app/about app/src/app/journal app/src/app/contact app/src/app/returns app/src/app/auth/signup app/src/app/cart app/src/app/checkout app/src/app/new-arrivals app/src/components/PageTransition.tsx app/src/components/hero-section.tsx app/src/components/ui/skeleton.tsx app/src/lib/store.ts
git commit -m "chore(copy): reference One Piece in static copy across remaining pages"
```

---

## Task 23: Build & Verify

**Step 1: Run TypeScript check**

Run: `cd app && npx tsc --noEmit`
Expected: 0 errors.

**Step 2: Run the Next.js build**

Run: `cd app && npm run build`
Expected: Build succeeds.

**Step 3: Run the dev server and manually verify**

```bash
cd app && npm run dev
```

Open in browser:
- `/` — homepage should show a One Piece category card
- `/one-piece` — should list One Piece products
- `/collections/one-piece` — should render the lookbook with the One Piece tab active
- `/products/floral-maxi-one-piece` — should show the product detail with the four One Piece attribute rows
- `/dashboard/products` — admin filter should include One Piece
- `/dashboard/products/new` — form should show One Piece in the category dropdown and the four new attribute fields

**Step 4: Run any existing tests**

Run: `cd app && npm test 2>/dev/null || echo "no test script"`
Expected: no regressions.

**Step 5: Final commit (if any fixes were needed)**

```bash
git add -A
git commit -m "chore: build-verification fixes"
```

---

## Risk & Rollback

- **Risk:** The DB CHECK constraints in Task 2 will reject any existing rows whose `category` is not in the new list. The current data uses only `kurtis | dresses | tunic-tops`, so the migration is safe — but verify with `SELECT DISTINCT category, product_type FROM products;` before applying.
- **Rollback:** Each task is a single commit. `git revert HEAD~N..HEAD` to undo a task. The Supabase migration is idempotent (`IF NOT EXISTS`, `DROP IF EXISTS` on constraints) so it can be re-run safely.
- **Feature flag:** No flag — the change is additive and the new category is empty until products are created. The seed data in Task 4 ensures the new category has content on first load.

---

## Definition of Done

- [ ] All 23 tasks committed
- [ ] `npx tsc --noEmit` passes
- [ ] `npm run build` passes
- [ ] `/one-piece` page renders with the seed products
- [ ] `/collections/one-piece` renders with the One Piece tab active
- [ ] A One Piece product can be created in `/dashboard/products/new` with all four new attribute fields
- [ ] The created product appears in `/one-piece` and on `/`
- [ ] Search and filter across the site include One Piece
- [ ] Analytics dashboard shows a One Piece revenue / order breakdown
- [ ] Sitemap includes `/one-piece` and `/collections/one-piece`
- [ ] No regressions on the existing Kurti / Dress / Tunic flows
