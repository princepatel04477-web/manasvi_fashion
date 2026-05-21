"use client";

import ProductForm from "@/components/admin/product-form";

export default function NewProductPage() {
  return (
    <div className="space-y-6">
      <div className="border-b border-[#d9a58f22] pb-6">
        <h1 className="font-[var(--font-bodoni)] text-3xl md:text-4xl text-[#2a1d19]">New Design Release</h1>
        <p className="font-[var(--font-cormorant)] text-sm italic text-[#8b6b61] tracking-wider mt-1">
          Publish a new elegant garment to the Manasvi Fashion online catalogue.
        </p>
      </div>

      <ProductForm isEdit={false} />
    </div>
  );
}
