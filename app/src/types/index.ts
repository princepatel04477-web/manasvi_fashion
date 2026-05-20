export type Category = "kurtis" | "dresses";
export type ProductType = "kurti" | "tunic_top" | "dress";

export interface ColorVariant {
  name: string;
  hex: string;
  image: string;
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
