"use client";

import { FormEvent, useState } from "react";
import { useShop } from "@/context/shop-context";
import { formatINR } from "@/lib/store";

export default function CheckoutPage() {
  const { cartTotal, clearCart } = useShop();
  const [status, setStatus] = useState("");

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    const res = await fetch("/api/checkout", { method: "POST" });
    const data = await res.json();
    setStatus(`Order placed: ${data.orderId}`);
    clearCart();
  };

  return (
    <main className="mx-auto max-w-4xl px-6 py-16">
      <h1 className="font-serif text-4xl">Checkout</h1>
      <form onSubmit={submit} className="mt-8 space-y-4 rounded-xl border border-[#d9a58f66] bg-white/70 p-6">
        <input required placeholder="Full Name" className="w-full rounded-md border p-3" />
        <input required placeholder="Address" className="w-full rounded-md border p-3" />
        <div className="grid gap-4 md:grid-cols-2"><input required placeholder="City" className="rounded-md border p-3" /><input required placeholder="PIN" className="rounded-md border p-3" /></div>
        <select className="w-full rounded-md border p-3"><option>UPI</option><option>Razorpay</option><option>Stripe Card</option></select>
        <p className="text-lg">Order Total: {formatINR(cartTotal)}</p>
        <button className="luxury-btn w-full rounded-lg py-3">Place Order</button>
        {status && <p className="text-sm text-[#6e2b38]">{status}</p>}
      </form>
    </main>
  );
}
