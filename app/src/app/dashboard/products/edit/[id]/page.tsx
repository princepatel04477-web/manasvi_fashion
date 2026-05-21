"use client";

import { useEffect, useState, use } from "react";
import ProductForm from "@/components/admin/product-form";
import { Product } from "@/types";

interface EditProductPageProps {
  params: Promise<{ id: string }>;
}

export default function EditProductPage({ params }: EditProductPageProps) {
  const { id } = use(params);
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchProduct() {
      try {
        const res = await fetch("/api/products");
        const data = await res.json();
        if (Array.isArray(data)) {
          const found = data.find((p) => p.id === id);
          if (found) {
            setProduct(found);
          } else {
            setError("Product not found in current catalog.");
          }
        } else {
          setError("Failed to fetch product registry.");
        }
      } catch (err) {
        setError("Failed to load product. Network error.");
      } finally {
        setLoading(false);
      }
    }
    fetchProduct();
  }, [id]);

  if (loading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#8b6b61] border-t-transparent mx-auto"></div>
          <p className="mt-4 font-serif text-sm tracking-widest uppercase text-[#5c4a44]">Retrieving Design Blueprint...</p>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-red-800">
        <h3 className="font-serif text-lg font-semibold">Editing Error</h3>
        <p className="mt-2 text-sm">{error || "Unable to retrieve design details."}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="border-b border-[#d9a58f22] pb-6">
        <h1 className="font-[var(--font-bodoni)] text-3xl md:text-4xl text-[#2a1d19]">Modify Design Details</h1>
        <p className="font-[var(--font-cormorant)] text-sm italic text-[#8b6b61] tracking-wider mt-1">
          Adjust the visual, pricing, and variant details of &quot;{product.title}&quot;.
        </p>
      </div>

      <ProductForm initialData={product} isEdit={true} />
    </div>
  );
}
