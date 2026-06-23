"use client";

import { useRef, useState, useMemo } from "react";
import { useShop } from "@/context/shop-context";
import EditorialProductCard from "@/components/editorial-product-card";
import { Sparkles, SlidersHorizontal, X, ChevronDown } from "lucide-react";
import useScrollReveal from "@/hooks/useScrollReveal";
import PageTransition from "@/components/PageTransition";
import { Skeleton, ProductGridSkeleton } from "@/components/ui/skeleton";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

// One Piece specific filter options
const LENGTH_OPTIONS = ["Mini", "Above Knee", "Knee Length", "Midi", "Maxi", "Floor Length"];
const FIT_TYPE_OPTIONS = ["Regular", "A-Line", "Fit & Flare", "Bodycon", "Straight Fit", "Oversized"];
const SLEEVE_TYPE_OPTIONS = ["Sleeveless", "Short Sleeve", "3/4 Sleeve", "Full Sleeve", "Puff Sleeve"];
const NECK_TYPE_OPTIONS = ["Round Neck", "V Neck", "Square Neck", "Boat Neck", "Collar Neck", "Sweetheart Neck"];
const OCCASION_OPTIONS = ["Casual Wear", "Office Wear", "Party Wear", "Festive Wear", "Vacation Wear", "Evening Wear"];
const SORT_OPTIONS = [
  { value: "newest", label: "New Arrivals" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
];

function FilterChipGroup({
  options,
  selected,
  onToggle,
}: {
  options: string[];
  selected: string[];
  onToggle: (v: string) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2 pt-2">
      {options.map((opt) => (
        <button
          key={opt}
          onClick={() => onToggle(opt)}
          className={`px-3 py-1.5 text-[11px] rounded-full border transition-all cursor-pointer ${
            selected.includes(opt)
              ? "bg-[#3B2B28] text-white border-[#3B2B28]"
              : "bg-white text-[#8B6B61] border-[#E7C2B8]/40 hover:border-[#C98E87]"
          }`}
        >
          {opt}
        </button>
      ))}
    </div>
  );
}

function CollapsibleSection({
  title,
  id,
  openId,
  setOpenId,
  children,
}: {
  title: string;
  id: string;
  openId: string | null;
  setOpenId: (v: string | null) => void;
  children: React.ReactNode;
}) {
  const isOpen = openId === id;
  return (
    <div className="border-b border-[#E7C2B8]/20 pb-4">
      <button
        onClick={() => setOpenId(isOpen ? null : id)}
        className="flex items-center justify-between w-full py-3 text-left"
      >
        <span className="font-inter text-xs font-semibold uppercase tracking-[0.15em] text-[#3B2B28]">{title}</span>
        <ChevronDown
          className={`w-4 h-4 text-[#8B6B61] transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
        />
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function OnePiecePage() {
  const { products, loading } = useShop();
  const headerRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLElement>(null);

  useScrollReveal(headerRef, 90);
  useScrollReveal(gridRef, 90);

  // Filter states
  const [sortBy, setSortBy] = useState("newest");
  const [showFilters, setShowFilters] = useState(false);
  const [openSection, setOpenSection] = useState<string | null>("length");
  const [selectedLengths, setSelectedLengths] = useState<string[]>([]);
  const [selectedFits, setSelectedFits] = useState<string[]>([]);
  const [selectedSleeves, setSelectedSleeves] = useState<string[]>([]);
  const [selectedNecks, setSelectedNecks] = useState<string[]>([]);
  const [selectedOccasions, setSelectedOccasions] = useState<string[]>([]);

  function toggleArr<T extends string>(arr: T[], val: T, setter: (v: T[]) => void) {
    setter(arr.includes(val) ? arr.filter((x) => x !== val) : [...arr, val]);
  }

  const activeFilterCount =
    selectedLengths.length +
    selectedFits.length +
    selectedSleeves.length +
    selectedNecks.length +
    selectedOccasions.length;

  function clearAll() {
    setSelectedLengths([]);
    setSelectedFits([]);
    setSelectedSleeves([]);
    setSelectedNecks([]);
    setSelectedOccasions([]);
  }

  // Filter One Piece products
  const onePieceProducts = useMemo(() => {
    let filtered = products.filter((p) => {
      const productType = (p.productType || "").toLowerCase();
      const category = (p.category || "").toLowerCase();
      const subcategory = (p.subcategory || "").toLowerCase();
      return (
        productType === "one_piece" ||
        productType === "onepiece" ||
        category === "one-piece" ||
        category === "onepiece" ||
        category === "one_piece" ||
        category === "one_pieces" ||
        subcategory === "one piece" ||
        subcategory === "one-piece" ||
        subcategory === "onepiece"
      );
    });

    // Apply sleeve filter
    if (selectedSleeves.length > 0) {
      filtered = filtered.filter(
        (p) => !p.sleeveType || selectedSleeves.some((s) => p.sleeveType?.toLowerCase().includes(s.toLowerCase()))
      );
    }

    // Apply length filter (only if attribute exists on product)
    if (selectedLengths.length > 0) {
      filtered = filtered.filter((p) => !p.length || selectedLengths.includes(p.length));
    }

    // Apply fit type filter
    if (selectedFits.length > 0) {
      filtered = filtered.filter((p) => !p.fitType || selectedFits.includes(p.fitType));
    }

    // Apply neck type filter
    if (selectedNecks.length > 0) {
      filtered = filtered.filter((p) => !p.neckType || selectedNecks.includes(p.neckType));
    }

    // Apply occasion filter
    if (selectedOccasions.length > 0) {
      filtered = filtered.filter((p) => !p.occasion || selectedOccasions.includes(p.occasion));
    }

    // Sort
    if (sortBy === "price-asc") return [...filtered].sort((a, b) => a.price - b.price);
    if (sortBy === "price-desc") return [...filtered].sort((a, b) => b.price - a.price);
    // "newest" → isNew first
    return [...filtered].sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
  }, [products, sortBy, selectedLengths, selectedFits, selectedSleeves, selectedNecks, selectedOccasions]);

  if (loading) {
    return (
      <PageTransition>
        <main className="min-h-screen bg-[#FAF7F2] text-[#3B2B28] pt-24 sm:pt-28 md:pt-32 pb-20 sm:pb-24 relative overflow-hidden soft-grain">
          <div className="absolute top-[10%] left-[-15%] w-[55vw] h-[55vw] rounded-full bg-[#F4D7CF] opacity-20 filter blur-[150px] pointer-events-none" />
          <div className="absolute bottom-[20%] right-[-10%] w-[45vw] h-[45vw] rounded-full bg-[#E7C2B8] opacity-25 filter blur-[130px] pointer-events-none" />
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="max-w-4xl mx-auto text-center mb-12 sm:mb-20 md:mb-28 flex flex-col items-center gap-4">
              <Skeleton className="h-4 w-36 uppercase tracking-[0.25em]" variant="cream" />
              <Skeleton className="h-10 sm:h-12 w-2/3 sm:w-1/2 rounded-xl" variant="nude" />
              <div className="w-20 h-[1px] bg-[#C98E87] my-2" />
              <Skeleton className="h-4 w-5/6 sm:w-2/3 rounded-md" variant="cream" />
              <Skeleton className="h-4 w-2/3 sm:w-1/2 rounded-md" variant="cream" />
            </div>
            <ProductGridSkeleton count={4} />
          </div>
        </main>
      </PageTransition>
    );
  }

  return (
    <PageTransition>
      <main className="min-h-screen bg-[#FAF7F2] text-[#3B2B28] pt-24 sm:pt-28 md:pt-32 pb-20 sm:pb-24 relative overflow-hidden soft-grain">
        {/* Background decorative glows */}
        <div className="absolute top-[10%] left-[-15%] w-[55vw] h-[55vw] rounded-full bg-[#F4D7CF] opacity-20 filter blur-[150px] pointer-events-none" />
        <div className="absolute bottom-[20%] right-[-10%] w-[45vw] h-[45vw] rounded-full bg-[#E7C2B8] opacity-25 filter blur-[130px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

          {/* CAMPAIGN INTRODUCTION */}
          <div
            ref={headerRef}
            className="max-w-4xl mx-auto text-center mb-12 sm:mb-20 md:mb-24 flex flex-col items-center gap-4"
          >
            <span className="font-inter text-[10px] tracking-[0.3em] text-[#C98E87] uppercase font-bold flex items-center gap-1.5">
              <Sparkles className="w-3 h-3" />
              Exclusive Collection
            </span>

            <h1 className="font-cormorant text-4xl sm:text-5xl md:text-6xl font-light italic leading-[1.1] tracking-tight">
              One Piece
            </h1>

            <div className="w-20 h-[1px] bg-[#C98E87] my-2" />

            <p className="font-inter text-sm sm:text-base text-[#8B6B61] leading-relaxed max-w-xl font-light">
              Discover elegant one piece dresses by Manasvi Fashion — from breezy florals to festive silhouettes,
              crafted in premium fabrics for the contemporary Indian woman.
            </p>
          </div>

          {/* CONTROLS BAR */}
          <div className="flex flex-wrap items-center justify-between gap-3 mb-8 pb-4 border-b border-[#E7C2B8]/30">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl border text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer ${
                  showFilters || activeFilterCount > 0
                    ? "bg-[#3B2B28] text-white border-[#3B2B28]"
                    : "bg-white text-[#8B6B61] border-[#E7C2B8]/40 hover:border-[#C98E87]"
                }`}
              >
                <SlidersHorizontal className="w-3.5 h-3.5" />
                Filters {activeFilterCount > 0 && `(${activeFilterCount})`}
              </button>
              {activeFilterCount > 0 && (
                <button
                  onClick={clearAll}
                  className="flex items-center gap-1.5 text-xs text-[#C98E87] hover:text-[#8B6B61] transition-colors cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                  Clear All
                </button>
              )}
            </div>

            <div className="flex items-center gap-3">
              <span className="font-inter text-xs text-[#8B6B61]">
                {onePieceProducts.length} style{onePieceProducts.length !== 1 ? "s" : ""}
              </span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="text-xs font-inter border border-[#E7C2B8]/40 rounded-xl px-3 py-2 bg-white text-[#3B2B28] focus:outline-none focus:border-[#C98E87] cursor-pointer"
              >
                {SORT_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex gap-8">
            {/* SIDEBAR FILTERS */}
            <AnimatePresence>
              {showFilters && (
                <motion.aside
                  initial={{ opacity: 0, x: -20, width: 0 }}
                  animate={{ opacity: 1, x: 0, width: 260 }}
                  exit={{ opacity: 0, x: -20, width: 0 }}
                  transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                  className="flex-shrink-0 overflow-hidden"
                >
                  <div className="w-64 bg-white rounded-2xl border border-[#E7C2B8]/30 p-5 space-y-1 sticky top-28">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-cormorant text-lg italic text-[#3B2B28]">Refine</h3>
                      {activeFilterCount > 0 && (
                        <button onClick={clearAll} className="text-xs text-[#C98E87] hover:underline cursor-pointer">
                          Clear all
                        </button>
                      )}
                    </div>

                    <CollapsibleSection title="Length" id="length" openId={openSection} setOpenId={setOpenSection}>
                      <FilterChipGroup
                        options={LENGTH_OPTIONS}
                        selected={selectedLengths}
                        onToggle={(v) => toggleArr(selectedLengths, v, setSelectedLengths)}
                      />
                    </CollapsibleSection>

                    <CollapsibleSection title="Fit Type" id="fit" openId={openSection} setOpenId={setOpenSection}>
                      <FilterChipGroup
                        options={FIT_TYPE_OPTIONS}
                        selected={selectedFits}
                        onToggle={(v) => toggleArr(selectedFits, v, setSelectedFits)}
                      />
                    </CollapsibleSection>

                    <CollapsibleSection title="Sleeve Type" id="sleeve" openId={openSection} setOpenId={setOpenSection}>
                      <FilterChipGroup
                        options={SLEEVE_TYPE_OPTIONS}
                        selected={selectedSleeves}
                        onToggle={(v) => toggleArr(selectedSleeves, v, setSelectedSleeves)}
                      />
                    </CollapsibleSection>

                    <CollapsibleSection title="Neck Type" id="neck" openId={openSection} setOpenId={setOpenSection}>
                      <FilterChipGroup
                        options={NECK_TYPE_OPTIONS}
                        selected={selectedNecks}
                        onToggle={(v) => toggleArr(selectedNecks, v, setSelectedNecks)}
                      />
                    </CollapsibleSection>

                    <CollapsibleSection title="Occasion" id="occasion" openId={openSection} setOpenId={setOpenSection}>
                      <FilterChipGroup
                        options={OCCASION_OPTIONS}
                        selected={selectedOccasions}
                        onToggle={(v) => toggleArr(selectedOccasions, v, setSelectedOccasions)}
                      />
                    </CollapsibleSection>
                  </div>
                </motion.aside>
              )}
            </AnimatePresence>

            {/* PRODUCT GRID */}
            <div className="flex-1 min-w-0">
              {onePieceProducts.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-32 gap-6 text-center">
                  <div className="w-20 h-20 rounded-full bg-[#E7C2B8]/20 flex items-center justify-center">
                    <Sparkles className="w-8 h-8 text-[#C98E87]" />
                  </div>
                  <div>
                    <h3 className="font-cormorant text-2xl italic text-[#3B2B28] mb-2">
                      Coming Soon
                    </h3>
                    <p className="font-inter text-sm text-[#8B6B61] max-w-sm">
                      Our One Piece collection is being curated with love. Explore other categories while we prepare something special.
                    </p>
                  </div>
                  <Link
                    href="/collections"
                    className="px-6 py-3 bg-[#3B2B28] text-white font-inter text-xs uppercase tracking-widest rounded-xl hover:bg-[#8B6B61] transition-colors"
                  >
                    Explore Collections
                  </Link>
                </div>
              ) : (
                <section ref={gridRef} className="max-w-5xl mx-auto mb-20 sm:mb-28">
                  <div className="grid grid-cols-2 gap-6 sm:gap-8 md:grid-cols-3 items-stretch">
                    {onePieceProducts.map((product, index) => {
                      const isEven = index % 2 === 0;
                      const alignmentClass = isEven ? "md:translate-y-8" : "md:-translate-y-8";
                      return (
                        <div
                          key={product.id}
                          className={`product-card transition-all duration-700 ${alignmentClass} hover:translate-y-0`}
                        >
                          <EditorialProductCard product={product} aspectRatio="aspect-[3/4]" />
                        </div>
                      );
                    })}
                  </div>
                </section>
              )}
            </div>
          </div>

          {/* STORY PANEL */}
          <section className="my-20 sm:my-32 -mx-4 sm:-mx-6 lg:-mx-8 relative overflow-hidden">
            <div className="relative h-[52vh] sm:h-[65vh] w-full flex items-center justify-center">
              <div className="absolute inset-0 bg-gradient-to-b from-[#3B2B28]/95 via-[#3B2B28]/60 to-[#3B2B28]/90 z-10" />
              <img
                src="/photos/Gemini_Generated_Image_o7map6o7map6o7ma.png"
                alt="One Piece elegance"
                className="absolute inset-0 w-full h-full object-cover filter brightness-[0.8] scale-105"
              />
              <div className="max-w-2xl px-6 text-center text-[#FAF7F2] relative z-20 flex flex-col items-center gap-6">
                <span className="font-inter text-[9px] tracking-[0.3em] text-[#E7C2B8] uppercase font-bold">
                  Atelier Collection
                </span>
                <h2 className="font-cormorant text-3xl sm:text-4xl md:text-5xl font-light italic leading-tight">
                  &ldquo;Elegance in every silhouette.&rdquo;
                </h2>
                <div className="w-16 h-[1px] bg-[#E7C2B8]/60 my-1" />
                <p className="font-inter text-xs sm:text-sm text-[#FAF7F2]/80 leading-relaxed max-w-md font-light tracking-wide">
                  One piece, endless possibilities. From relaxed daywear to elevated evening styles,
                  Manasvi&apos;s curated one piece collection brings grace and confidence to every occasion.
                </p>
              </div>
            </div>
          </section>

          {/* High-Fashion Category SEO Description */}
          <div className="mt-16 border-t border-[#E7C2B8]/40 pt-16 max-w-4xl mx-auto pb-8">
            <span className="font-inter text-[9px] tracking-[0.25em] text-[#C98E87] uppercase font-bold block mb-3 text-center">
              Collection Journal
            </span>
            <h2 className="font-serif text-2xl text-[#3B2B28] text-center mb-8">
              One Piece Dresses in Surat – Contemporary Luxury
            </h2>
            <div className="w-12 h-[1px] bg-[#C98E87] mx-auto mb-8" />
            
            <div className="font-inter text-sm text-[#8B6B61] leading-relaxed font-light space-y-6 text-justify">
              <p>
                In addition to our traditional wear, we have developed a stunning range of <strong>western wear surat</strong> and <strong>designer dresses surat</strong> to suit the cosmopolitan woman. Our <strong>women dress collection surat</strong> includes elegant <strong>one piece dresses surat</strong>, fashion dresses surat, and <strong>premium dresses surat</strong> that transition seamlessly from day to night. From flowing georgette <strong>party wear dresses surat</strong> to structured cotton <strong>casual wear surat</strong>, each piece is designed with absolute attention to fit and contour. We understand that modern women clothing in surat requires versatile options, which is why our <strong>designer western wear surat</strong> combines minimalist styling with high-fashion drapes. Explore our <strong>latest dress collection surat</strong> to find everything from comfortable midi dresses and formal office wear dresses to radiant maxis that stand out at any social gathering.
              </p>
            </div>
          </div>

        </div>
      </main>
    </PageTransition>
  );
}
