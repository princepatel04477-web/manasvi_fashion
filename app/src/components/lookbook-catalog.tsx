"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useShop } from "@/context/shop-context";
import { Product } from "@/types";
import { formatINR } from "@/lib/store";
import { 
  X, 
  Heart, 
  ChevronLeft, 
  ChevronRight, 
  Check, 
  Loader2, 
  Sparkles 
} from "lucide-react";
import Link from "next/link";

interface LookbookCatalogProps {
  initialTab?: "Summer Collection" | "Festive Collection" | "Cotton Roots" | "Tunics" | "Kurtis" | "New Arrivals";
}

export default function LookbookCatalog({ initialTab = "Summer Collection" }: LookbookCatalogProps) {
  const { products, wishlist, toggleWishlist, addToCart } = useShop();

  const [activeTab, setActiveTab] = useState(initialTab);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [activeImgIndex, setActiveImgIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [isAdding, setIsAdding] = useState(false);
  const [addSuccess, setAddSuccess] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const itemsPerPage = 8; // 2 rows of 4 on desktop, 4 rows of 2 on mobile

  // Horizontal collections tabs definition
  const collections = useMemo(() => [
    "Summer Collection",
    "Festive Collection",
    "Cotton Roots",
    "Tunics",
    "Kurtis",
    "New Arrivals"
  ] as const, []);

  // Categorize products dynamically
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const title = p.title.toLowerCase();
      const desc = p.description.toLowerCase();
      const fabric = (p.fabric || "").toLowerCase();
      const subcat = (p.subcategory || "").toLowerCase();
      const cat = (p.category || "").toLowerCase();

      switch (activeTab) {
        case "Summer Collection":
          return (
            subcat.includes("summer") ||
            title.includes("summer") ||
            desc.includes("summer") ||
            fabric.includes("cotton") ||
            fabric.includes("khadi") ||
            fabric.includes("linen") ||
            cat === "tunic-tops"
          );
        case "Festive Collection":
          return (
            subcat.includes("festive") ||
            title.includes("festive") ||
            desc.includes("festive") ||
            title.includes("regal") ||
            fabric.includes("silk") ||
            fabric.includes("chanderi") ||
            fabric.includes("georgette") ||
            fabric.includes("satin") ||
            p.price > 1500
          );
        case "Cotton Roots":
          return (
            fabric.includes("cotton") ||
            fabric.includes("khadi") ||
            title.includes("cotton") ||
            desc.includes("cotton")
          );
        case "Tunics":
          return p.productType === "tunic_top" || cat === "tunic-tops" || subcat.includes("tunic");
        case "Kurtis":
          return p.productType === "kurti" || cat === "kurtis" || subcat.includes("kurti");
        case "New Arrivals":
          return !!p.isNew;
        default:
          return true;
      }
    });
  }, [products, activeTab]);

  // Reset page when tab changes
  useEffect(() => {
    setCurrentPage(1);
  }, [activeTab]);

  // Lock background body scroll when drawer is open
  useEffect(() => {
    if (selectedProduct) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [selectedProduct]);

  // Pagination calculation
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage) || 1;
  
  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredProducts.slice(start, start + itemsPerPage);
  }, [filteredProducts, currentPage]);

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
      scrollToTop();
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prev) => prev + 1);
      scrollToTop();
    }
  };

  const scrollToTop = () => {
    if (containerRef.current) {
      containerRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  // Open drawer modal
  const openDrawer = (product: Product) => {
    setSelectedProduct(product);
    setActiveImgIndex(0);
    setSelectedSize(product.sizes[0] || "");
    setAddSuccess(false);
  };

  // Close drawer modal
  const closeDrawer = () => {
    setSelectedProduct(null);
  };

  // Quick Add to Cart
  const handleAddToCart = async () => {
    if (!selectedProduct || !selectedSize) return;
    setIsAdding(true);
    addToCart(selectedProduct.id, selectedSize);
    await new Promise((resolve) => setTimeout(resolve, 850));
    setIsAdding(false);
    setAddSuccess(true);
    setTimeout(() => setAddSuccess(false), 2500);
  };

  // WhatsApp Inquiry prefills
  const getWhatsAppLink = (product: Product) => {
    const message = `Hi! I am browsing the ${activeTab} lookbook on Manasvi Fashion and absolutely love the "${product.title}" (${formatINR(product.price)}).\n\nCould you please let me know about its availability and sizing options?\n\nImage link: ${product.images[0] || ""}`;
    return `https://wa.me/919099369035?text=${encodeURIComponent(message)}`;
  };

  return (
    <div ref={containerRef} className="w-full space-y-12">
      {/* 1. HORIZONTAL COLLECTION SLIDER */}
      <div className="w-full overflow-x-auto no-scrollbar border-b border-[#E7C2B8]/30 pb-4">
        <div className="flex gap-4 md:gap-6 px-1 min-w-max justify-start md:justify-center">
          {collections.map((tab) => {
            const isActive = activeTab === tab;
            return (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`relative py-2 px-4 font-cormorant text-sm md:text-base tracking-[0.15em] uppercase transition-all duration-300 cursor-pointer ${
                  isActive 
                    ? "text-[#3B2B28] font-bold" 
                    : "text-[#8B6B61]/75 hover:text-[#3B2B28]"
                }`}
              >
                <span>{tab}</span>
                {isActive && (
                  <motion.div 
                    layoutId="activeTabUnderline"
                    className="absolute bottom-0 left-4 right-4 h-[1px] bg-[#C98E87]"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. SECTION HEADER & COUNTER */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-[#E7C2B8]/20 pb-6">
        <div>
          <span className="font-inter text-[10px] tracking-[0.25em] text-[#C98E87] uppercase font-semibold block mb-2">
            Manasvi Lookbook Selection
          </span>
          <h2 className="font-serif text-3xl md:text-4xl italic font-light text-[#3B2B28] tracking-wide leading-tight">
            {activeTab}
          </h2>
        </div>

        {/* Catalog Navigation Controls */}
        <div className="flex items-center gap-6 font-inter text-xs tracking-widest text-[#8B6B61] self-start md:self-auto">
          <button
            onClick={handlePrevPage}
            disabled={currentPage === 1}
            className="p-2 -m-2 hover:text-[#3B2B28] disabled:opacity-30 disabled:hover:text-[#8B6B61] transition-colors cursor-pointer"
            aria-label="Previous Page"
          >
            <ChevronLeft className="w-5 h-5 stroke-[1.25]" />
          </button>
          
          <span className="font-cormorant text-base italic text-[#3B2B28] select-none min-w-[64px] text-center">
            {currentPage} / {totalPages}
          </span>
          
          <button
            onClick={handleNextPage}
            disabled={currentPage === totalPages}
            className="p-2 -m-2 hover:text-[#3B2B28] disabled:opacity-30 disabled:hover:text-[#8B6B61] transition-colors cursor-pointer"
            aria-label="Next Page"
          >
            <ChevronRight className="w-5 h-5 stroke-[1.25]" />
          </button>

          <span className="text-[10px] uppercase font-light text-[#8B6B61]/60">
            ({filteredProducts.length} Looks)
          </span>
        </div>
      </div>

      {/* 3. PRODUCT CATALOG GRID */}
      <motion.div 
        layout
        className="grid grid-cols-2 lg:grid-cols-4 gap-x-4 gap-y-10 sm:gap-x-6 sm:gap-y-12"
      >
        <AnimatePresence mode="popLayout">
          {paginatedProducts.map((product, idx) => {
            const isLiked = wishlist.includes(product.id);
            return (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -30 }}
                transition={{ 
                  duration: 0.5, 
                  ease: [0.16, 1, 0.3, 1],
                  delay: (idx % 4) * 0.05 
                }}
                className="group relative flex flex-col justify-between overflow-hidden cursor-pointer"
                onClick={() => openDrawer(product)}
              >
                {/* 90% Card Image Frame */}
                <div className="relative aspect-[3/4] w-full overflow-hidden rounded-none bg-[#f6eee2] mb-3">
                  <motion.img
                    src={product.images[0]}
                    alt={product.title}
                    className="h-full w-full object-cover transition-transform duration-[800ms] group-hover:scale-103"
                    loading="lazy"
                  />

                  {/* Subtle heart overlay (desktop hover / mobile default overlay) */}
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      toggleWishlist(product.id);
                    }}
                    className="absolute top-3 right-3 z-10 w-8 h-8 flex items-center justify-center rounded-full bg-white/70 backdrop-blur-sm shadow-sm transition-transform active:scale-90 hover:scale-105 cursor-pointer border border-[#E7C2B8]/30"
                    aria-label="Toggle Wishlist"
                  >
                    <Heart
                      size={14}
                      fill={isLiked ? "#6e2b38" : "none"}
                      className={isLiked ? "text-[#6e2b38] scale-110" : "text-[#8B6B61]"}
                    />
                  </button>

                  <div className="absolute inset-0 bg-[#3B2B28]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                </div>

                {/* Minimal card details */}
                <div className="flex flex-col gap-1.5 px-0.5">
                  <div className="flex justify-between items-baseline gap-2">
                    <h3 className="font-serif text-sm sm:text-base text-[#3B2B28] font-medium leading-tight truncate">
                      {product.title}
                    </h3>
                    <span className="font-serif text-xs font-light text-[#3B2B28]/90 whitespace-nowrap">
                      {formatINR(product.price)}
                    </span>
                  </div>

                  <div className="flex justify-between items-center text-[10px] tracking-wider uppercase text-[#8B6B61]/80 font-light">
                    <span>{product.subcategory || activeTab}</span>
                    {product.isNew && (
                      <span className="text-[#C98E87] font-semibold text-[8px] tracking-[0.2em] flex items-center gap-0.5">
                        <Sparkles className="w-2.5 h-2.5" />
                        New
                      </span>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </motion.div>

      {/* Pagination progress indicator below grid */}
      <div className="flex justify-center pt-4 font-inter text-[10px] tracking-widest text-[#8B6B61]/60 uppercase">
        Showing {(currentPage - 1) * itemsPerPage + 1} - {Math.min(currentPage * itemsPerPage, filteredProducts.length)} of {filteredProducts.length} Looks
      </div>

      {/* 4. LOOKBOOK CATALOG PRODUCT DRAWER (MODAL) */}
      <AnimatePresence>
        {selectedProduct && (
          <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center">
            {/* Dark blur backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeDrawer}
              className="absolute inset-0 bg-[#3B2B28]/60 backdrop-blur-[3px] cursor-pointer"
            />

            {/* Premium lookbook catalog modal container */}
            <motion.div
              initial={
                window.innerWidth < 640 
                  ? { y: "100%" } 
                  : { opacity: 0, scale: 0.95 }
              }
              animate={
                window.innerWidth < 640 
                  ? { y: 0 } 
                  : { opacity: 1, scale: 1 }
              }
              exit={
                window.innerWidth < 640 
                  ? { y: "100%" } 
                  : { opacity: 0, scale: 0.95 }
              }
              transition={{ type: "spring", damping: 25, stiffness: 220 }}
              className="relative w-full max-w-4xl h-[90vh] sm:h-auto sm:max-h-[85vh] bg-[#FAF7F2] rounded-t-3xl sm:rounded-2xl border border-[#E7C2B8]/40 shadow-2xl overflow-hidden z-10 flex flex-col md:flex-row"
            >
              {/* Close Icon button */}
              <button
                onClick={closeDrawer}
                className="absolute top-4 right-4 z-20 p-2.5 rounded-full bg-white/85 border border-[#E7C2B8]/30 text-[#8B6B61] hover:text-[#3B2B28] transition-colors cursor-pointer hover:scale-105"
                aria-label="Close Look"
              >
                <X className="w-5 h-5 stroke-[1.5]" />
              </button>

              {/* LEFT/UPPER: Swipe lookbook image gallery */}
              <div className="relative w-full md:w-1/2 aspect-[4/5] md:aspect-auto md:h-[80vh] bg-[#f6eee2] overflow-hidden flex-shrink-0">
                <AnimatePresence mode="wait">
                  <motion.img
                    key={activeImgIndex}
                    src={selectedProduct.images[activeImgIndex] || selectedProduct.images[0]}
                    alt={`${selectedProduct.title} look`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.4 }}
                    className="w-full h-full object-cover"
                  />
                </AnimatePresence>

                {/* Sub-gallery image select indicators */}
                {selectedProduct.images.length > 1 && (
                  <div className="absolute bottom-4 left-0 right-0 z-10 flex justify-center gap-2 px-4">
                    {selectedProduct.images.map((_, i) => (
                      <button
                        key={i}
                        onClick={() => setActiveImgIndex(i)}
                        className={`w-2.5 h-2.5 rounded-full transition-all duration-300 border border-[#FAF7F2]/40 cursor-pointer ${
                          activeImgIndex === i 
                            ? "bg-white scale-120 shadow-sm" 
                            : "bg-white/40 hover:bg-white/70"
                        }`}
                        aria-label={`Show image ${i + 1}`}
                      />
                    ))}
                  </div>
                )}

                {/* Image Navigation Controls */}
                {selectedProduct.images.length > 1 && (
                  <>
                    <button
                      onClick={() => setActiveImgIndex((prev) => (prev > 0 ? prev - 1 : selectedProduct.images.length - 1))}
                      className="absolute left-3 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full bg-white/70 backdrop-blur-sm text-[#8B6B61] hover:text-[#3B2B28] cursor-pointer hover:scale-105 border border-[#E7C2B8]/20 transition-all"
                      aria-label="Previous Look Image"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setActiveImgIndex((prev) => (prev < selectedProduct.images.length - 1 ? prev + 1 : 0))}
                      className="absolute right-3 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full bg-white/70 backdrop-blur-sm text-[#8B6B61] hover:text-[#3B2B28] cursor-pointer hover:scale-105 border border-[#E7C2B8]/20 transition-all"
                      aria-label="Next Look Image"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </>
                )}
              </div>

              {/* RIGHT/LOWER: Look information and checkout interactions */}
              <div className="w-full md:w-1/2 p-6 sm:p-8 md:p-10 flex flex-col justify-between overflow-y-auto max-h-[50vh] md:max-h-[80vh] border-t md:border-t-0 md:border-l border-[#E7C2B8]/30">
                <div className="space-y-6">
                  {/* Category, Title and Price */}
                  <div className="space-y-2">
                    <div className="flex justify-between items-center text-[10px] tracking-[0.25em] text-[#C98E87] uppercase font-semibold">
                      <span>{selectedProduct.subcategory || selectedProduct.category}</span>
                      <span className="font-light text-[#8B6B61]/80">{activeTab}</span>
                    </div>
                    <h3 className="font-serif text-2xl sm:text-3xl text-[#3B2B28] font-light italic leading-tight">
                      {selectedProduct.title}
                    </h3>
                    <div className="font-serif text-lg font-light text-[#3B2B28] pt-1">
                      {formatINR(selectedProduct.price)}
                    </div>
                  </div>

                  {/* Description */}
                  <div className="space-y-2">
                    <span className="block text-[9px] uppercase tracking-widest text-[#8B6B61] font-semibold">Description</span>
                    <p className="font-inter text-xs text-[#8B6B61] leading-relaxed font-light">
                      {selectedProduct.description}
                    </p>
                  </div>

                  {/* Fabrics, Colors, Attributes */}
                  <div className="grid grid-cols-2 gap-4 font-inter text-xs text-[#8B6B61] font-light border-t border-b border-[#E7C2B8]/20 py-4">
                    <div>
                      <span className="block text-[8px] uppercase tracking-widest text-[#8B6B61]/70 font-semibold mb-1">Fabric</span>
                      <strong className="font-medium text-[#3B2B28]">{selectedProduct.fabric || "Bespoke blend"}</strong>
                    </div>
                    <div>
                      <span className="block text-[8px] uppercase tracking-widest text-[#8B6B61]/70 font-semibold mb-1">Sleeve Type</span>
                      <strong className="font-medium text-[#3B2B28]">{selectedProduct.sleeveType || "Complimentary Drape"}</strong>
                    </div>
                    <div>
                      <span className="block text-[8px] uppercase tracking-widest text-[#8B6B61]/70 font-semibold mb-1">Color Shade</span>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <span 
                          className="w-3.5 h-3.5 rounded-full border border-black/10 inline-block shadow-sm"
                          style={{ backgroundColor: selectedProduct.colorVariants?.[0]?.hex || "#d9a58f" }}
                        />
                        <strong className="font-medium text-[#3B2B28]">{selectedProduct.color}</strong>
                      </div>
                    </div>
                    <div>
                      <span className="block text-[8px] uppercase tracking-widest text-[#8B6B61]/70 font-semibold mb-1">Style Silhouette</span>
                      <strong className="font-medium text-[#3B2B28]">{selectedProduct.productType === "kurti" ? "Standard Kurti" : selectedProduct.productType === "tunic_top" ? "Comfort Tunic" : "Boutique Dress"}</strong>
                    </div>
                  </div>

                  {/* Size selectors */}
                  <div className="space-y-3">
                    <span className="block text-[9px] uppercase tracking-widest text-[#8B6B61] font-semibold">Select Drape Size</span>
                    <div className="flex gap-2 flex-wrap">
                      {selectedProduct.sizes.map((sz) => {
                        const isSizeSelected = selectedSize === sz;
                        return (
                          <button
                            key={sz}
                            onClick={() => {
                              setSelectedSize(sz);
                              setAddSuccess(false);
                            }}
                            className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl border flex items-center justify-center font-inter text-xs font-bold transition-all duration-300 cursor-pointer ${
                              isSizeSelected 
                                ? "bg-[#3B2B28] text-[#FAF7F2] border-[#3B2B28] shadow-sm scale-105" 
                                : "bg-white border-[#E7C2B8]/40 text-[#3B2B28] hover:border-[#3B2B28]"
                            }`}
                          >
                            {sz}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Purchase and WhatsApp Inquiries Buttons */}
                <div className="space-y-3 pt-8 md:pt-6">
                  <div className="flex flex-col sm:flex-row gap-3">
                    {/* Add to Cart CTA */}
                    <button
                      onClick={handleAddToCart}
                      disabled={isAdding || addSuccess}
                      className="flex-1 py-3.5 bg-[#3B2B28] text-[#FAF7F2] border border-[#3B2B28] rounded-xl font-cormorant text-xs uppercase tracking-widest font-semibold hover:bg-[#8B6B61] hover:border-[#8B6B61] active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-85 disabled:cursor-not-allowed"
                    >
                      {isAdding ? (
                        <>
                          <Loader2 className="w-3.5 h-3.5 animate-spin text-[#C98E87]" />
                          <span>Curating Piece...</span>
                        </>
                      ) : addSuccess ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-[#C98E87]" />
                          <span>Piece Curated in Cart</span>
                        </>
                      ) : (
                        <span>Acquire and Add to Cart</span>
                      )}
                    </button>

                    {/* WhatsApp Inquire button */}
                    <a
                      href={getWhatsAppLink(selectedProduct)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 py-3.5 border border-[#8B6B61]/40 text-[#3B2B28] rounded-xl font-cormorant text-xs uppercase tracking-widest font-semibold hover:bg-white hover:border-[#3B2B28] active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="15"
                        height="15"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="text-[#E7C2B8] fill-emerald-600 border-none"
                      >
                        <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
                      </svg>
                      <span>Inquire via WhatsApp</span>
                    </a>
                  </div>
                </div>

              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
