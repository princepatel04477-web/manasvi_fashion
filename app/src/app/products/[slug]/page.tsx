"use client";

import { useParams } from "next/navigation";
import { useState } from "react";
import { products } from "@/data/products";
import { formatINR } from "@/lib/store";
import { useShop } from "@/context/shop-context";

export default function PDP() {
  const { slug } = useParams<{ slug: string }>();
  const product = products.find((p) => p.slug === slug);
  const { addToCart, toggleWishlist } = useShop();
  const [size, setSize] = useState(product?.sizes[0] || "S");
  const [selectedColor, setSelectedColor] = useState(0);

  if (!product) return <main className="px-6 py-16">Product not found.</main>;

  const activeVariant = product.colorVariants?.[selectedColor];
  const activeImage = activeVariant?.image || product.images[0];

  return (
    <main className="mx-auto grid max-w-7xl gap-10 px-6 py-16 lg:grid-cols-2">
      <div>
        <div className="overflow-hidden rounded-2xl"><img src={activeImage} alt={product.title} className="h-[620px] w-full object-cover" /></div>
      </div>
      <div>
        <p className="text-sm text-[#6e2b38]">{product.subcategory}</p>
        <h1 className="mt-2 font-serif text-4xl">{product.title}</h1>
        <p className="mt-4 text-2xl">{formatINR(product.price)}</p>
        <p className="mt-4 text-[#3d2b26cc]">{product.description}</p>
        {!!product.colorVariants?.length && (
          <div className="mt-6">
            <p className="text-sm font-medium">Color: {activeVariant?.name}</p>
            <div className="mt-3 flex flex-wrap items-center gap-3">
              {product.colorVariants.map((variant, index) => (
                <button
                  key={variant.name}
                  onClick={() => setSelectedColor(index)}
                  aria-label={variant.name}
                  title={variant.name}
                  className={`relative h-12 w-12 overflow-hidden rounded-full border-2 bg-white transition ${selectedColor === index ? "scale-105 border-[#3d2b26]" : "border-[#d9a58f]"}`}
                >
                  <img src={variant.image} alt={variant.name} className="h-full w-full object-cover" />
                  <span className="absolute bottom-0 left-0 h-2 w-full" style={{ backgroundColor: variant.hex }} />
                </button>
              ))}
            </div>
          </div>
        )}
        <div className="mt-6 flex flex-wrap gap-2">{product.sizes.map((s) => <button key={s} onClick={() => setSize(s)} className={`rounded-md border px-4 py-2 ${size === s ? "bg-[#6e2b38] text-white" : "bg-white"}`}>{s}</button>)}</div>
        <div className="mt-8 grid grid-cols-2 gap-3">
          <button onClick={() => addToCart(product.id, size)} className="luxury-btn rounded-lg py-3">Add to Cart</button>
          <button onClick={() => toggleWishlist(product.id)} className="rounded-lg border border-[#6e2b38] py-3">Wishlist</button>
        </div>
        <div className="mt-10 rounded-xl border border-[#d9a58f66] p-4"><p>Fabric: {product.fabric}</p><p>Sleeve: {product.sleeveType}</p><p>Color: {activeVariant?.name || product.color}</p><p>Stock: {product.stock > 0 ? "In Stock" : "Out of Stock"}</p></div>
      </div>
    </main>
  );
}
