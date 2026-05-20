import { products } from "@/data/products";
import { Product } from "@/types";

export const formatINR = (value: number) =>
  new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(value);

export const getProductBySlug = (slug: string): Product | undefined => products.find((p) => p.slug === slug);
export const getProductById = (id: string): Product | undefined => products.find((p) => p.id === id);
