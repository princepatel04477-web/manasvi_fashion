export type Category = "kurtis" | "dresses" | "tunic-tops" | "one-piece";
export type ProductType = "kurti" | "tunic_top" | "dress" | "one_piece";

export interface ColorVariant {
  name: string;
  hex: string;
  image?: string;
  modelImage?: string;
  sku?: string;
  stock?: number;
  priceAdjustment?: number;
  frontImage?: string;
  backImage?: string;
}

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

export interface CartItem {
  productId: string;
  size: string;
  qty: number;
  title?: string;
  image?: string;
  price?: number;
  slug?: string;
}
