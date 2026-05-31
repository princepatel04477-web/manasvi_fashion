"use client";

import ProductCard from "@/components/product-card";
import { Product } from "@/types";

export default function EditorialProductCard({
  product,
}: {
  product: Product;
  aspectRatio?: string;
}) {
  return <ProductCard product={product} />;
}
