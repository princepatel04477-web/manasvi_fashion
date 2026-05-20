import { products } from "@/data/products";
import ProductCard from "@/components/product-card";

export function ProductSection({ title, filter }: { title: string; filter?: (p: (typeof products)[number]) => boolean }) {
  const list = filter ? products.filter(filter) : products;
  return (
    <section className="mx-auto max-w-7xl px-6 py-16">
      <h2 className="mb-8 font-serif text-4xl">{title}</h2>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">{list.map((p) => <ProductCard key={p.id} product={p} />)}</div>
    </section>
  );
}
