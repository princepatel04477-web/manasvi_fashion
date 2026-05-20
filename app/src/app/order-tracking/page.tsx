"use client";

import { useState } from "react";

export default function TrackPage() {
  const [id, setId] = useState("");
  const [status, setStatus] = useState("");

  const track = async () => {
    const res = await fetch(`/api/track?id=${id}`);
    const data = await res.json();
    setStatus(data.status);
  };

  return (
    <main className="mx-auto max-w-4xl px-6 py-16"><h1 className="font-serif text-4xl">Order Tracking</h1><div className="mt-8 flex gap-3"><input value={id} onChange={(e) => setId(e.target.value)} placeholder="Order ID" className="flex-1 rounded-md border p-3" /><button onClick={track} className="luxury-btn rounded-lg px-5">Track</button></div>{status && <p className="mt-4">Status: {status}</p>}</main>
  );
}
