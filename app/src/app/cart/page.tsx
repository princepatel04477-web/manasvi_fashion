"use client";

import Link from "next/link";
import { useShop } from "@/context/shop-context";
import { products } from "@/data/products";
import { formatINR } from "@/lib/store";

export default function CartPage() {
  const { cart, updateQty, removeFromCart, cartTotal } = useShop();
  const rows = cart
    .map((item) => {
      const product = products.find((p) => p.id === item.productId);
      return {
        ...item,
        title: item.title || product?.title || "Product",
        price: item.price ?? product?.price ?? 0,
      };
    })
    .filter((r) => r.title);
  return (
    <main className="mx-auto max-w-6xl px-6 py-16">
      <h1 className="font-serif text-4xl">Cart</h1>
      <div className="mt-8 space-y-4">{rows.map((r) => <div key={`${r.productId}-${r.size}`} className="editorial-card flex items-center justify-between rounded-xl p-4"><div><p className="font-semibold">{r.title}</p><p className="text-sm">Size {r.size}</p><p className="text-sm">{formatINR(r.price)}</p></div><div className="flex items-center gap-2"><button onClick={() => updateQty(r.productId, r.size, r.qty - 1)}>-</button><span>{r.qty}</span><button onClick={() => updateQty(r.productId, r.size, r.qty + 1)}>+</button><button onClick={() => removeFromCart(r.productId, r.size)} className="ml-3 text-[#6e2b38]">Remove</button></div></div>)}</div>
      <div className="mt-8 flex items-center justify-between"><p className="text-xl">Total: {formatINR(cartTotal)}</p><Link href="/checkout" className="luxury-btn rounded-lg px-6 py-3">Checkout</Link></div>
    </main>
  );
}
