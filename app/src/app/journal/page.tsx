const posts = [
  "How to Style Printed Kurtis for Work",
  "Floral Dresses for Summer Events",
  "Modern Women\'s Fashion: Soft Luxe Trends",
  "Seasonal Kurti Color Stories",
];

export default function JournalPage() {
  return (
    <main className="mx-auto max-w-6xl px-6 py-16"><h1 className="font-serif text-5xl">Fashion Journal</h1><div className="mt-8 grid gap-6 md:grid-cols-2">{posts.map((post) => <article key={post} className="editorial-card rounded-2xl p-6"><p className="text-sm text-[#6e2b38]">Editorial</p><h2 className="mt-2 font-serif text-2xl">{post}</h2></article>)}</div></main>
  );
}
