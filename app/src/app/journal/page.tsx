const posts = [
  "How to Style Printed Kurtis for Work",
  "Floral Dresses for Summer Events",
  "Modern Women\'s Fashion: Soft Luxe Trends",
  "Seasonal Kurti Color Stories",
];

export default function JournalPage() {
  return (
    <main className="min-h-screen bg-[#FAF7F2] text-[#3B2B28] pt-32 pb-24 px-4 md:px-6 relative overflow-hidden soft-grain">
      {/* BACKGROUND DECORATIVE GLOWS */}
      <div className="absolute top-[8%] left-[-15%] w-[50vw] h-[50vw] rounded-full bg-[#F4D7CF] opacity-20 filter blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[20%] right-[-10%] w-[45vw] h-[45vw] rounded-full bg-[#E7C2B8] opacity-20 filter blur-[130px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* HERO SECTION */}
        <div className="max-w-3xl mb-12 md:mb-16 flex flex-col gap-3 animate-slide-in">
          <h1 className="font-cormorant text-4xl sm:text-5xl md:text-6xl font-light italic leading-tight">
            Fashion Journal
          </h1>
          <div className="w-16 h-[1px] bg-[#C98E87] my-1" />
          <p className="font-inter text-xs sm:text-sm text-[#8B6B61] tracking-wide font-light">
            Stories, styling notes, and seasonal inspirations from our atelier.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {posts.map((post) => (
            <article 
              key={post} 
              className="editorial-card bg-white/70 backdrop-blur-md rounded-2xl p-6 border border-[#E7C2B8]/40 hover:shadow-md hover:translate-y-[-2px] transition-all duration-300 warm-shadow"
            >
              <p className="font-inter text-[10px] tracking-widest text-[#C98E87] uppercase font-semibold">
                Editorial
              </p>
              <h2 className="mt-3 font-cormorant text-2xl font-light text-[#3B2B28] leading-snug">
                {post}
              </h2>
            </article>
          ))}
        </div>
      </div>
    </main>
  );
}
