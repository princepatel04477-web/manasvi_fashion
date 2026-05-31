"use client";

import { useParams } from "next/navigation";
import { useState, useEffect, useRef, useMemo } from "react";
import { formatINR } from "@/lib/store";
import { useShop } from "@/context/shop-context";
import { Heart, ShoppingBag, Check, Sparkles, ShieldCheck, ChevronRight, ChevronLeft } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { ProductDetailSkeleton, LuxuryTransition } from "@/components/ui/skeleton";
import StickyCartBar from "@/components/StickyCartBar";
import TrustBadges from "@/components/TrustBadges";
import SizeGuideModal from "@/components/SizeGuideModal";
import PageTransition from "@/components/PageTransition";

export default function PDP() {
  const slugParams = useParams();
  const slug = slugParams?.slug as string;
  const { addCustomToCart, toggleWishlist, wishlist, products, loading } = useShop();
  const product = products.find((p) => p.slug === slug);

  const [size, setSize] = useState("S");
  const [selectedColor, setSelectedColor] = useState(0);
  const [isAdding, setIsAdding] = useState(false);
  const [addedSuccess, setAddedSuccess] = useState(false);
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false);

  const colorVariants = product ? (product.colorVariants || []) : [];
  const activeVariant = colorVariants[selectedColor] || null;

  // Combined list of images (active variant images or fallback to main product images)
  const imagesList = useMemo(() => {
    if (!product) return [];
    
    if (activeVariant) {
      const list: string[] = [];
      if (activeVariant.frontImage) list.push(activeVariant.frontImage);
      if (activeVariant.backImage) list.push(activeVariant.backImage);
      
      // Legacy compatibility fallbacks
      if (list.length === 0 && activeVariant.image) {
        list.push(activeVariant.image);
      }
      if (activeVariant.modelImage) {
        list.push(activeVariant.modelImage);
      }
      
      if (list.length > 0) {
        return list;
      }
    }
    
    return product.images || [];
  }, [product, activeVariant]);

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const galleryScrollRef = useRef<HTMLDivElement>(null);

  const activeImage = useMemo(() => {
    if (imagesList.length === 0) return product ? product.images[0] : "";
    const index = activeImageIndex >= imagesList.length ? 0 : activeImageIndex;
    return imagesList[index] || "";
  }, [imagesList, activeImageIndex, product]);

  const scrollMobileGalleryToIndex = (index: number) => {
    const container = galleryScrollRef.current;
    if (!container) return;
    container.scrollTo({
      left: index * container.clientWidth,
      behavior: "smooth"
    });
  };

  const goToImage = (index: number) => {
    if (imagesList.length === 0) return;
    const safeIndex = ((index % imagesList.length) + imagesList.length) % imagesList.length;
    setActiveImageIndex(safeIndex);
    scrollMobileGalleryToIndex(safeIndex);
  };

  const goToPrevImage = () => {
    if (imagesList.length <= 1) return;
    goToImage(activeImageIndex - 1);
  };

  const goToNextImage = () => {
    if (imagesList.length <= 1) return;
    goToImage(activeImageIndex + 1);
  };

  const displayPrice = useMemo(() => {
    if (!product) return 0;
    const basePrice = product.price;
    const adjustment = activeVariant?.priceAdjustment || 0;
    return basePrice + adjustment;
  }, [product, activeVariant]);

  const displayCompareAtPrice = useMemo(() => {
    if (!product) return undefined;
    if (!product.compareAtPrice) return undefined;
    const baseCompare = product.compareAtPrice;
    const adjustment = activeVariant?.priceAdjustment || 0;
    return baseCompare + adjustment;
  }, [product, activeVariant]);

  // Reset activeImageIndex when color changes
  useEffect(() => {
      goToImage(0);
  }, [selectedColor]);

  const liked = product ? wishlist.includes(product.id) : false;

  // Set default size dynamically when product loads
  useEffect(() => {
    if (product && product.sizes?.length > 0) {
      setSize(product.sizes[0]);
    }
  }, [product]);

  // Sync mobile scroll position when activeImageIndex changes
  useEffect(() => {
    if (galleryScrollRef.current) {
      const container = galleryScrollRef.current;
      setTimeout(() => {
        if (container) {
          scrollMobileGalleryToIndex(activeImageIndex);
        }
      }, 50);
    }
  }, [activeImageIndex]);

  // Track gallery scroll for dots indicator on mobile
  const handleGalleryScroll = (e: React.UIEvent<HTMLDivElement>) => {
    if (!product) return;
    const container = e.currentTarget;
    const scrollPosition = container.scrollLeft;
    const width = container.clientWidth;
    if (width > 0) {
      const index = Math.round(scrollPosition / width);
      if (index !== activeImageIndex && index >= 0 && index < imagesList.length) {
        setActiveImageIndex(index);
      }
    }
  };

  // Intersection Observer has been replaced by GSAP ScrollTrigger inside StickyCartBar

  const handleAddToCart = async () => {
    if (!product) return;
    setIsAdding(true);
    const colorName = activeVariant?.name || product.color;
    
    // Add custom cart entry with specific color name details
    addCustomToCart({
      productId: product.id,
      title: `${product.title} - ${colorName}`,
      image: activeImage,
      price: displayPrice,
      size: size,
      slug: product.slug
    });

    await new Promise((resolve) => setTimeout(resolve, 800));
    setIsAdding(false);
    setAddedSuccess(true);
    setTimeout(() => setAddedSuccess(false), 2500);
  };

  return (
    <PageTransition>
      <main className="min-h-screen bg-[#FAF7F2] text-[#3B2B28] pt-24 sm:pt-28 md:pt-32 pb-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden soft-grain">
        {/* BACKGROUND DECORATIVE GLOWS */}
        <div className="absolute top-[10%] left-[-15%] z-0 w-[50vw] h-[50vw] rounded-full bg-[#F4D7CF] opacity-20 filter blur-[130px] pointer-events-none" />
        <div className="absolute bottom-[20%] right-[-10%] z-0 w-[45vw] h-[45vw] rounded-full bg-[#E7C2B8] opacity-20 filter blur-[120px] pointer-events-none" />

        <LuxuryTransition isLoading={loading} fallback={<ProductDetailSkeleton />}>
        {!product ? (
          <div className="text-center py-20 max-w-7xl mx-auto relative z-10">
            <h1 className="font-cormorant text-3xl italic text-[#8B6B61]">Garment not found in our studio.</h1>
            <Link href="/collections" className="mt-4 inline-block text-xs uppercase tracking-widest text-[#3B2B28] underline">
              Return to Collection
            </Link>
          </div>
        ) : (
          <>
            <div className="max-w-7xl mx-auto relative z-10">
            
            {/* BREADCRUMB */}
            <div className="mb-8 font-inter text-[11px] sm:text-[10px] text-[#8B6B61] tracking-wider uppercase flex items-center gap-1.5 font-light">
              <Link href="/" className="hover:text-[#3B2B28]">Atelier</Link>
              <ChevronRight className="w-3 h-3" />
              <Link href={`/${product.category}`} className="hover:text-[#3B2B28]">{product.category}</Link>
              <ChevronRight className="w-3 h-3" />
              <span className="text-[#3B2B28] font-medium">{product.title}</span>
            </div>

        {/* DETAILS GRID */}
        <div className="grid gap-12 lg:grid-cols-12 items-start">
          
          {/* LEFT: GALLERY VIEWER WITH RESPONSIVE SWIPING */}
          <div className="lg:col-span-7 space-y-4">
            
            {/* Mobile swipe-friendly gallery */}
            <div className="lg:hidden space-y-4">
              <div className="relative">
                <div 
                  ref={galleryScrollRef}
                  onScroll={handleGalleryScroll}
                  className="flex overflow-x-auto snap-x snap-mandatory scrollbar-none w-full aspect-[3/4] rounded-3xl bg-white border border-[#E7C2B8]/30 warm-shadow"
                >
                  {imagesList.map((img: string, idx: number) => (
                    <div key={img} className="w-full h-full flex-shrink-0 snap-center relative aspect-[3/4]">
                      <div className="absolute inset-0 bg-[#3B2B28]/5 mix-blend-overlay z-10" />
                      <img
                        src={img}
                        alt={`${product.title} View ${idx + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>

                {imagesList.length > 1 && (
                  <>
                    <button
                      onClick={goToPrevImage}
                      aria-label="Previous photo"
                      className="absolute left-2 top-1/2 -translate-y-1/2 z-20 h-9 w-9 rounded-full bg-white/90 border border-[#E7C2B8]/50 text-[#3B2B28] flex items-center justify-center shadow-sm"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <button
                      onClick={goToNextImage}
                      aria-label="Next photo"
                      className="absolute right-2 top-1/2 -translate-y-1/2 z-20 h-9 w-9 rounded-full bg-white/90 border border-[#E7C2B8]/50 text-[#3B2B28] flex items-center justify-center shadow-sm"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </>
                )}
              </div>
              
              {/* Swipe indicator dots */}
              {imagesList.length > 1 && (
                <div className="flex justify-center gap-2 pt-1">
                  {imagesList.map((_: string, idx: number) => (
                    <button
                      key={idx}
                      onClick={() => {
                        goToImage(idx);
                      }}
                      className={`h-1.5 rounded-full transition-all duration-300 ${activeImageIndex === idx ? "w-6 bg-[#3B2B28]" : "w-1.5 bg-[#8B6B61]/40"}`}
                      aria-label={`Go to slide ${idx + 1}`}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Desktop large static preview with thumbnails */}
            <div className="hidden lg:block space-y-4">
              <div className="relative aspect-[3/4] w-full rounded-3xl overflow-hidden bg-white border border-[#E7C2B8]/30 warm-shadow group cursor-zoom-in">
                <div className="absolute inset-0 bg-[#3B2B28]/5 mix-blend-overlay z-10" />
                
                <AnimatePresence mode="wait">
                  <motion.img
                    key={activeImage}
                    src={activeImage}
                    alt={`${product.title} Display View`}
                    initial={{ opacity: 0, scale: 1.04 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.98 }}
                    transition={{ duration: 0.5, ease: "easeInOut" }}
                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-[1.03]"
                  />
                </AnimatePresence>

                {imagesList.length > 1 && (
                  <>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        goToPrevImage();
                      }}
                      aria-label="Previous photo"
                      className="absolute left-3 top-1/2 -translate-y-1/2 z-20 h-10 w-10 rounded-full bg-white/90 border border-[#E7C2B8]/50 text-[#3B2B28] flex items-center justify-center shadow-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        goToNextImage();
                      }}
                      aria-label="Next photo"
                      className="absolute right-3 top-1/2 -translate-y-1/2 z-20 h-10 w-10 rounded-full bg-white/90 border border-[#E7C2B8]/50 text-[#3B2B28] flex items-center justify-center shadow-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </>
                )}

                {/* Desktop View Switcher Overlay */}
                {activeVariant && (
                  <div className="absolute bottom-4 left-4 z-20 flex gap-1 bg-white/90 backdrop-blur-sm p-1 rounded-xl border border-[#E7C2B8]/40 shadow-sm">
                    {activeVariant.frontImage && activeVariant.backImage ? (
                      <>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            goToImage(0);
                          }}
                          className={`px-3 py-1.5 rounded-lg text-[9px] font-semibold uppercase tracking-wider transition-all duration-300 ${activeImageIndex === 0 ? "bg-[#3B2B28] text-white" : "text-[#5C4A44] hover:bg-[#FAF7F2]"}`}
                        >
                          Front View
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            goToImage(1);
                          }}
                          className={`px-3 py-1.5 rounded-lg text-[9px] font-semibold uppercase tracking-wider transition-all duration-300 ${activeImageIndex === 1 ? "bg-[#3B2B28] text-white" : "text-[#5C4A44] hover:bg-[#FAF7F2]"}`}
                        >
                          Back View
                        </button>
                        {activeVariant.modelImage && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              goToImage(2);
                            }}
                            className={`px-3 py-1.5 rounded-lg text-[9px] font-semibold uppercase tracking-wider transition-all duration-300 ${activeImageIndex === 2 ? "bg-[#3B2B28] text-white" : "text-[#5C4A44] hover:bg-[#FAF7F2]"}`}
                          >
                            On Model
                          </button>
                        )}
                      </>
                    ) : (
                      <>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            goToImage(0);
                          }}
                          className={`px-3 py-1.5 rounded-lg text-[9px] font-semibold uppercase tracking-wider transition-all duration-300 ${activeImageIndex === 0 ? "bg-[#3B2B28] text-white" : "text-[#5C4A44] hover:bg-[#FAF7F2]"}`}
                        >
                          Flat View
                        </button>
                        {imagesList.length > 1 && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              goToImage(1);
                            }}
                            className={`px-3 py-1.5 rounded-lg text-[9px] font-semibold uppercase tracking-wider transition-all duration-300 ${activeImageIndex === 1 ? "bg-[#3B2B28] text-white" : "text-[#5C4A44] hover:bg-[#FAF7F2]"}`}
                          >
                            {activeVariant.modelImage ? "On Model" : "Alternate View"}
                          </button>
                        )}
                      </>
                    )}
                  </div>
                )}
              </div>

              {/* Alternating Angle Thumbnail Previews */}
              {imagesList.length > 1 && (
                <div className="flex gap-3 justify-center">
                  {imagesList.map((img: string, idx: number) => (
                    <button
                      key={img}
                      onClick={() => {
                        goToImage(idx);
                      }}
                      className={`w-16 h-20 rounded-xl overflow-hidden border transition bg-white ${activeImageIndex === idx ? "border-[#3B2B28] ring-2 ring-[#3B2B28]/10 scale-105" : "border-[#E7C2B8]/40 hover:scale-102"}`}
                    >
                      <img src={img} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* RIGHT: DESCRIPTIONS & CONTROL SYSTEM */}
          <div className="lg:col-span-5 space-y-8">
            <div className="space-y-3">
              <span className="font-inter text-[10px] tracking-[0.25em] text-[#C98E87] uppercase font-bold flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                <span>{product.subcategory}</span>
              </span>
              
              <h1 className="font-cormorant text-3xl sm:text-4xl md:text-5xl font-light italic text-[#3B2B28] leading-tight">
                {product.title}
              </h1>
              
              <div className="flex items-baseline gap-3 pt-2">
                <span className="font-cormorant text-3xl font-medium text-[#3B2B28]">
                  {formatINR(displayPrice)}
                </span>
                {displayCompareAtPrice && displayCompareAtPrice > displayPrice && (
                  <span className="font-cormorant text-lg text-[#8B6B61] line-through">
                    {formatINR(displayCompareAtPrice)}
                  </span>
                )}
              </div>
            </div>

            {/* DESCRIPTION */}
            <p className="font-inter text-sm sm:text-base text-[#8B6B61] leading-relaxed font-light">
              {product.description}
            </p>

            {/* COLORWAY SECTOR */}
            {colorVariants.length > 0 && (
              <div className="space-y-3">
                <span className="font-inter text-xs tracking-wider text-[#8B6B61] uppercase font-light">
                  Select Colorway
                </span>
                <div className="flex flex-wrap gap-3">
                  {colorVariants.map((variant, idx) => (
                    <button
                      key={variant.name + '-' + idx}
                      onClick={() => {
                        setSelectedColor(idx);
                      }}
                      className={`h-9 px-4 rounded-xl border flex items-center gap-2 transition-all duration-300 cursor-pointer ${selectedColor === idx ? "bg-[#3B2B28] border-[#3B2B28] text-[#FAF7F2] shadow-sm scale-102" : "bg-white border-[#E7C2B8]/40 text-[#3B2B28] hover:border-[#3B2B28]"}`}
                    >
                      <span 
                        className="w-4 h-4 rounded-full border border-black/10 flex-shrink-0" 
                        style={{ backgroundColor: variant.hex || '#000' }}
                      />
                      <span className="font-inter text-xs font-semibold text-[#3B2B28] group-hover:text-white transition-colors duration-300">{variant.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* SIZING SECTOR */}
            <div className="space-y-3">
              <div className="flex justify-between items-center text-xs">
                <div className="flex items-center gap-2">
                  <span className="font-inter tracking-wider text-[#8B6B61] uppercase font-light">
                    Select Size
                  </span>
                  <span className="font-inter font-bold text-[#3B2B28]">
                    ({size})
                  </span>
                </div>
                <button
                  onClick={() => setIsSizeGuideOpen(true)}
                  className="font-inter text-[10px] sm:text-xs text-[#C98E87] hover:text-[#8B6B61] underline uppercase tracking-wider font-semibold cursor-pointer"
                >
                  Size Guide
                </button>
              </div>
              
              <div className="flex flex-wrap gap-2">
                {product.sizes.map((sz) => (
                  <button
                    key={sz}
                    onClick={() => setSize(sz)}
                    className={`h-12 w-12 rounded-xl border flex items-center justify-center font-inter text-xs font-bold transition-all duration-200 cursor-pointer ${size === sz ? "bg-[#3B2B28] border-[#3B2B28] text-[#FAF7F2] shadow-sm scale-102" : "bg-white border-[#E7C2B8]/40 text-[#3B2B28] hover:border-[#3B2B28]"}`}
                  >
                    {sz}
                  </button>
                ))}
              </div>
            </div>

            {/* ACTION CTAS */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 pt-4">
              <button 
                onClick={handleAddToCart}
                disabled={isAdding || addedSuccess}
                className="main-add-to-cart-btn sm:col-span-3 py-4 bg-[#3B2B28] text-[#FAF7F2] rounded-2xl font-cormorant text-xs uppercase tracking-[0.2em] font-semibold transition-all duration-300 hover:bg-[#8B6B61] hover:shadow-lg shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-90 disabled:cursor-not-allowed"
              >
                {isAdding ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Adding to Cart...</span>
                  </>
                ) : addedSuccess ? (
                  <>
                    <Check className="w-4 h-4 text-white" />
                    <span>Added to Wardrobe</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-4 h-4" />
                    <span>Add to Cart</span>
                  </>
                )}
              </button>

              <button 
                onClick={() => toggleWishlist(product.id)}
                className="py-4 border border-[#3B2B28]/20 hover:border-[#3B2B28] hover:bg-[#FAF7F2] rounded-2xl flex items-center justify-center text-[#3B2B28] transition-all duration-300 shadow-sm"
                aria-label="Toggle wishlist"
              >
                <Heart size={16} fill={liked ? "#C98E87" : "none"} className={liked ? "text-[#C98E87] scale-110" : "text-[#8B6B61]"} />
              </button>
            </div>

            <TrustBadges />

            {/* SPECIFICATIONS & REASSURANCE */}
            <div className="rounded-2xl border border-[#E7C2B8]/30 bg-white/50 p-6 space-y-4 text-[11px] sm:text-xs font-inter font-light text-[#8B6B61]">
              <div className="grid grid-cols-2 gap-y-2 leading-relaxed">
                <div>Fabric:</div>
                <div className="text-[#3B2B28] font-medium">{product.fabric}</div>
                
                <div>Sleeve Type:</div>
                <div className="text-[#3B2B28] font-medium">{product.sleeveType}</div>
                
                <div>Colorway:</div>
                <div className="text-[#3B2B28] font-medium">{activeVariant?.name || product.color}</div>

                {activeVariant?.sku && (
                  <>
                    <div>SKU:</div>
                    <div className="text-[#3B2B28] font-medium tracking-wider">{activeVariant.sku}</div>
                  </>
                )}

                {activeVariant?.stock !== undefined && (
                  <>
                    <div>Stock:</div>
                    <div className="text-[#3B2B28] font-medium">
                      {activeVariant.stock > 0 ? (
                        <span className="text-emerald-700 font-semibold">{activeVariant.stock} available</span>
                      ) : (
                        <span className="text-rose-700 font-semibold">Out of stock</span>
                      )}
                    </div>
                  </>
                )}
              </div>

              <div className="h-[1px] bg-[#E7C2B8]/30" />

              <div className="flex gap-3 items-start leading-relaxed">
                <ShieldCheck className="w-4 h-4 text-[#8B6B61] flex-shrink-0 mt-0.5" />
                <p className="text-[10px]">
                  Manasvi Studio Guarantee: Free alterations at our Surat showroom. Safe express delivery with elite custom packaging.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sticky Bottom Add to Cart Bar */}
      <StickyCartBar
        productName={product.title}
        price={displayPrice}
        sizes={product.sizes}
        selectedSize={size}
        setSelectedSize={setSize}
        onAddToCart={handleAddToCart}
        imageUrl={activeImage}
        isAdding={isAdding}
        addedSuccess={addedSuccess}
      />

      <SizeGuideModal
        isOpen={isSizeGuideOpen}
        onClose={() => setIsSizeGuideOpen(false)}
      />
          </>
      )}
      </LuxuryTransition>
    </main>
    </PageTransition>
  );
}
