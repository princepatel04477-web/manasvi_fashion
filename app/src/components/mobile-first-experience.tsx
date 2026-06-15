"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ShoppingBag, Search, MessageCircle, Heart, Plus, Minus, ArrowRight } from "lucide-react";
import { useShop } from "@/context/shop-context";
import { Product, ColorVariant } from "@/types";
import { formatINR } from "@/lib/store";
import Link from "next/link";

// Modeless image directory mapping
const K = "/photo modeless/kurti";
const T = "/photo modeless/tunic";

// Helper to map product images to their modeless counterparts
function getModelessImages(product: Product): string[] {
  const slug = product.slug;
  if (slug === "embroidered-tassel-kurti-set") {
    return [
      `${K}/7991032735d4941dd872e07f4fbe08e9b26d6ab69dd81479a7c1782d6be2067c.png`,
      `${K}/a2160073ca5a0516fa6601f8080a04d1aabe78848f023fa689ec1a79a265d7c3.png`,
      `${K}/cbced159d300f0054a98f6dfc484470966caffb38e10e3395b2a02acefafd358.png`
    ];
  }
  if (slug === "embroidered--cotton-tunic-top") {
    return [
      `${T}/1a57ec8ae5b15aafb40257774faae515db435e4d98dc03cec0e42340e40d44ac.png`,
      `${T}/2695abdce623423aabb428d773ea217263d408c1b14f325daac1e972114e3bd3.png`,
      `${T}/9734ac5480510f0d7c814c0dfc2a086593ce447ec96e6b844520dacfe40c7945.png`,
      `${T}/8dcce96683276500c2236556084f5d2ec0b2c695b15201a77821204c1030c309.png`
    ];
  }
  if (slug === "chikankari-inspired-embroidered--cotton-tunic") {
    return [
      `${T}/94e518b39edefcb348371c6f19423d43c5ff6a608d9060c90e9213b2c8fd30df.png`,
      `${T}/ec9fac511794673e59f113d66686de499e3323184d10b72fe55da77ada9619c4.png`,
      `${T}/eaa09b74a57f958619ee031523d47e4a70b8999f5066e556febe0c05c139362e.png`
    ];
  }
  if (slug === "embroidered-pocket-tunic") {
    return [
      `${T}/6f3b4324572536e1c644bea8fb930139f703830c3430d24d5b047a122dbb7417.png`,
      `${T}/f655dfe697c9665cbf991262939d41b341203af8c792f879663c652577e7c1a8.png`,
      `${T}/94f3f6fc103aa131653afadd4cdac362e00cf2d1d796568db0627351611b10c5.png`,
      `${T}/052081f1262d42453b2864b2120581c84be1200dd8a51d24744a6d9c4abb5992.png`
    ];
  }
  if (slug === "floral-embroidered-tunic-top") {
    return [
      `${T}/298a7d7ca464b6cebeb9831bbc04b2b30be7f8d60df05f982bda5a28edd8cf9c.png`
    ];
  }
  if (slug === "floral-printed--cotton-tunic") {
    return [
      `${T}/80fbbfbd292675e4ae8718dcfceb5508a4dcd142263ab0ae213e89e5d89124fe.png`,
      `${T}/816c6089e5f370b4f7e924323c04f9bf9b7be89a94a0bc7ab44e32d3e2b0218e.png`,
      `${T}/c7f207181a46b01ee387c4bbf41a6d965c5475211be3b1b05f886056f3ce1072.png`,
      `${T}/tunic.jpeg`,
      `${T}/d3339d21e82764759c48de6e70c5538ca313423a0752582698c82fe4fcb663f4.png`
    ];
  }
  if (slug === "ivory-floral-embroidered-cotton-kurti") {
    return [
      `${K}/30d97ad77e93ea942815e38bb52e9a50afb83be88dcfd62ece7199044bdc6c91.png`
    ];
  }
  if (slug === "embroidered-rayon-short-kurti") {
    return [
      `${T}/16325f0d65e848239ec5c846ee373d6111ab99cbf22dd64c36b5ef807cf47342.png`
    ];
  }
  if (slug === "ira-embroidered-khadi-kurti") {
    return [
      `${K}/b0a5ec56bc902575b46e9d0d7697624ef2ef93927e83e7f40cde9a330c9d749a.png`
    ];
  }
  if (slug === "geometric-embroidered-cotton-tunic-kurti") {
    return [
      `${T}/33e487078704a681b64d3ed522344381e872d85ad370d1f7ac2c462f0ecf6fe6.png`
    ];
  }

  // Fallbacks for static dev list
  if (product.id === "p1") {
    return [
      `${T}/052081f1262d42453b2864b2120581c84be1200dd8a51d24744a6d9c4abb5992.png`,
      `${T}/6f3b4324572536e1c644bea8fb930139f703830c3430d24d5b047a122dbb7417.png`,
      `${T}/80a8ba805434a5c22ef64bc2313ae280404e5e50c301a4cdf674d4b15ad4b233.png`
    ];
  }
  if (product.id === "p2") {
    return [
      `${T}/16325f0d65e848239ec5c846ee373d6111ab99cbf22dd64c36b5ef807cf47342.png`,
      `${T}/33e487078704a681b64d3ed522344381e872d85ad370d1f7ac2c462f0ecf6fe6.png`
    ];
  }
  if (product.id === "p5") {
    return [
      `${K}/7991032735d4941dd872e07f4fbe08e9b26d6ab69dd81479a7c1782d6be2067c.png`,
      `${K}/a2160073ca5a0516fa6601f8080a04d1aabe78848f023fa689ec1a79a265d7c3.png`
    ];
  }
  if (product.id === "p6") {
    return [`${K}/b0a5ec56bc902575b46e9d0d7697624ef2ef93927e83e7f40cde9a330c9d749a.png`];
  }
  if (product.id === "p9") {
    return [`${K}/30d97ad77e93ea942815e38bb52e9a50afb83be88dcfd62ece7199044bdc6c91.png`];
  }

  // General fallback
  return product.productType === "kurti" 
    ? [`${K}/cbced159d300f0054a98f6dfc484470966caffb38e10e3395b2a02acefafd358.png`]
    : [`${T}/80a8ba805434a5c22ef64bc2313ae280404e5e50c301a4cdf674d4b15ad4b233.png`];
}

// Helper to get mobile product images prioritizing actual database images & variant images
function getProductMobileImages(product: Product, activeVariant?: ColorVariant | null): string[] {
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

  // Fallback to product images (filtering AI images)
  const realImages = (product.images || []).filter(
    (img) => !img.includes("Gemini_Generated_") && !img.includes("ai-generated")
  );

  if (realImages.length > 0) {
    return realImages;
  }

  // Finally fallback to modeless helper
  return getModelessImages(product);
}

// Helper to format/retrieve design numbers uniquely based on product id
function getDesignNumber(product: Product): string {
  if (product.id.startsWith("p-17")) {
    const numPart = product.id.replace("p-", "").split(".")[0];
    const shortNum = numPart.substring(numPart.length - 5);
    return `DS-${shortNum}`;
  }
  const match = product.id.match(/\d+/);
  if (match) {
    return `DS-100${match[0]}`;
  }
  return `DS-${product.slug.substring(0, 3).toUpperCase()}`;
}

export default function MobileFirstExperience() {
  const { products, loading, addCustomToCart, cartCount, wishlist, toggleWishlist } = useShop();

  // Navigation state
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Product interaction state
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedSize, setSelectedSize] = useState("M");
  const [quantity, setQuantity] = useState(1);
  const [activeImageIdx, setActiveImageIdx] = useState(0);
  const [selectedColorIdx, setSelectedColorIdx] = useState(0);
  const drawerGalleryRef = useRef<HTMLDivElement>(null);
  const [toastMessage, setToastMessage] = useState("");
  const [showToast, setShowToast] = useState(false);
  const [fullscreenImage, setFullscreenImage] = useState<string | null>(null);

  const activeVariant = useMemo(() => {
    if (!selectedProduct || !selectedProduct.colorVariants) return null;
    return selectedProduct.colorVariants[selectedColorIdx] || null;
  }, [selectedProduct, selectedColorIdx]);

  const currentImagesList = useMemo(() => {
    if (!selectedProduct) return [];
    return getProductMobileImages(selectedProduct, activeVariant);
  }, [selectedProduct, activeVariant]);

  const currentPrice = useMemo(() => {
    if (!selectedProduct) return 0;
    return selectedProduct.price + (activeVariant?.priceAdjustment || 0);
  }, [selectedProduct, activeVariant]);

  const currentCompareAtPrice = useMemo(() => {
    if (!selectedProduct) return undefined;
    if (!selectedProduct.compareAtPrice) return undefined;
    return selectedProduct.compareAtPrice + (activeVariant?.priceAdjustment || 0);
  }, [selectedProduct, activeVariant]);

  const handleDrawerGalleryScroll = (e: React.UIEvent<HTMLDivElement>) => {
    if (!selectedProduct) return;
    const container = e.currentTarget;
    const scrollPosition = container.scrollLeft;
    const width = container.clientWidth;
    if (width > 0) {
      const index = Math.round(scrollPosition / width);
      if (index !== activeImageIdx && index >= 0 && index < currentImagesList.length) {
        setActiveImageIdx(index);
      }
    }
  };

  // Carousel highlight state
  const [carouselIdx, setCarouselIdx] = useState(0);
  
  // Custom brand carousel slides using local modeless files
  const carouselSlides = [
    {
      img: `${K}/7991032735d4941dd872e07f4fbe08e9b26d6ab69dd81479a7c1782d6be2067c.png`,
      title: "Surat Premium Kurtis",
      subtitle: "Artisanal prints & classic silhouettes"
    },
    {
      img: `${T}/052081f1262d42453b2864b2120581c84be1200dd8a51d24744a6d9c4abb5992.png`,
      title: "Contemporary Tunic Tops",
      subtitle: "Tailored comfortable cotton fusion wear"
    },
    {
      img: `${K}/cbced159d300f0054a98f6dfc484470966caffb38e10e3395b2a02acefafd358.png`,
      title: "Heritage Collection",
      subtitle: "Intricate detailed neck embroideries"
    },
    {
      img: `${T}/16325f0d65e848239ec5c846ee373d6111ab99cbf22dd64c36b5ef807cf47342.png`,
      title: "Bespoke Ethnic Styles",
      subtitle: "Rich, premium textures & silhouettes"
    }
  ];

  // Auto-slide carousel
  useEffect(() => {
    const timer = setInterval(() => {
      setCarouselIdx((prev) => (prev + 1) % carouselSlides.length);
    }, 4500);
    return () => clearInterval(timer);
  }, []);

  // Reset selected color & image index when selected product changes
  useEffect(() => {
    setSelectedColorIdx(0);
    setActiveImageIdx(0);
    const container = drawerGalleryRef.current;
    if (container) {
      try {
        if (typeof container.scrollTo === "function") {
          container.scrollTo({
            left: 0,
          });
        } else {
          container.scrollLeft = 0;
        }
      } catch (e) {
        container.scrollLeft = 0;
      }
    }
  }, [selectedProduct]);

  // Reset active image index and scroll gallery to beginning when selected color variant changes
  useEffect(() => {
    setActiveImageIdx(0);
    const container = drawerGalleryRef.current;
    if (container) {
      try {
        if (typeof container.scrollTo === "function") {
          container.scrollTo({
            left: 0,
            behavior: "smooth"
          });
        } else {
          container.scrollLeft = 0;
        }
      } catch (e) {
        container.scrollLeft = 0;
      }
    }
  }, [selectedColorIdx]);

  // Filter products by type
  const kurtiListings = products.filter(p => p.productType === "kurti");
  const tunicListings = products.filter(p => p.productType === "tunic_top");

  // Search filtered products
  const searchedProducts = products.filter(p => 
    p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (p.subcategory || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
    (p.fabric || "").toLowerCase().includes(searchQuery.toLowerCase())
  );

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2200);
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    if (!selectedProduct) return;
    const colorName = activeVariant?.name || selectedProduct.color;
    const activeImage = currentImagesList[activeImageIdx] || currentImagesList[0] || "";
    
    addCustomToCart({
      productId: selectedProduct.id,
      title: `${selectedProduct.title} - ${colorName}`,
      image: activeImage,
      price: currentPrice,
      size: selectedSize,
      slug: selectedProduct.slug
    });
    triggerToast(`Added ${selectedProduct.title} - ${colorName} to bag!`);
  };

  const handleDrawerClose = () => {
    setSelectedProduct(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F7F3EE] flex flex-col items-center justify-center p-6">
        <div className="w-8 h-8 border-2 border-[#B8924A] border-t-transparent rounded-full animate-spin mb-4" />
        <span className="font-serif italic text-sm text-[#0D0906]/60 tracking-wider">Curating Manasvi Atelier...</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F7F3EE] text-[#0D0906] flex flex-col font-sans antialiased relative">
      <style jsx global>{`
        /* Infinite Marquee Styles */
        @keyframes marquee-ltr {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee-infinite {
          display: flex;
          width: max-content;
          animation: marquee-ltr var(--speed, 20s) linear infinite;
        }
        .animate-marquee-infinite:hover {
          animation-play-state: paused;
        }
        .scrollbar-none::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-none {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .glass-header {
          background: rgba(247, 243, 238, 0.82);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
        }
      `}</style>

      {/* ─── STICKY HEADER ──────────────────────────── */}
      <header className="sticky top-0 z-40 glass-header border-b border-[#B8924A]/10 shadow-xs">
        <div className="flex items-center justify-between px-4 py-3 h-14">
          {/* Hamburger Menu */}
          <button 
            onClick={() => setIsMenuOpen(true)}
            className="p-1.5 text-[#0D0906] hover:text-[#B8924A] active:scale-95 transition-transform"
            aria-label="Open navigation menu"
          >
            <Menu size={20} strokeWidth={1.5} />
          </button>

          {/* Centered Logo */}
          <Link href="/" className="flex flex-col items-center select-none">
            <span className="font-[var(--font-grance)] text-[1.1rem] tracking-[0.06em] leading-none text-[#0D0906] font-semibold uppercase">
              MANASVI
            </span>
            <span className="font-[var(--font-cormorant)] italic text-[8px] tracking-[0.3em] text-[#B8924A] uppercase leading-none font-bold">
              Fashion
            </span>
          </Link>

          {/* Right controls */}
          <div className="flex items-center gap-1.5">
            {/* Search Trigger */}
            <button 
              onClick={() => setIsSearchOpen(true)}
              className="p-1.5 text-[#0D0906] hover:text-[#B8924A] active:scale-95 transition-transform"
              aria-label="Search catalog"
            >
              <Search size={19} strokeWidth={1.5} />
            </button>

            {/* Global Shopping Bag */}
            <Link href="/cart" className="p-1.5 text-[#0D0906] hover:text-[#B8924A] relative active:scale-95 transition-transform">
              <ShoppingBag size={19} strokeWidth={1.5} />
              {cartCount > 0 && (
                <span className="absolute top-0 right-0 bg-[#991B1B] text-white text-[7.5px] font-bold w-4 h-4 rounded-full flex items-center justify-center border border-[#F7F3EE]">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* WhatsApp Direct Header Link */}
            <a 
              href="https://wa.me/919099369035" 
              target="_blank" 
              rel="noopener noreferrer"
              className="p-1.5 text-[#128C7E] hover:text-[#075E54] active:scale-95 transition-transform"
              aria-label="Contact via WhatsApp"
            >
              <MessageCircle size={19} strokeWidth={1.8} fill="rgba(18,140,126,0.15)" />
            </a>
          </div>
        </div>
      </header>

      {/* ─── HERO SECTION ───────────────────────────── */}
      <section className="w-full flex flex-col bg-white">
        
        {/* Section 1: Hero Carousel */}
        <div className="relative w-full h-[465px] overflow-hidden bg-[#FAF7F2] select-none">
          {/* Slides Container */}
          <div className="w-full h-full relative">
            <AnimatePresence mode="wait">
              <motion.div
                key={carouselIdx}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
                className="absolute inset-0 w-full h-full"
              >
                <img 
                  src={carouselSlides[carouselIdx].img} 
                  alt={carouselSlides[carouselIdx].title}
                  className="w-full h-full object-cover"
                  loading="eager"
                />
                
                {/* Vignette Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent" />

                {/* Content Overlay */}
                <div className="absolute bottom-12 left-0 right-0 px-6 flex flex-col items-center text-center text-[#FAF7F2] z-20 pointer-events-none">
                  <h2 className="font-cormorant font-light text-3xl tracking-wide mb-2 leading-tight text-white drop-shadow-sm">
                    {carouselSlides[carouselIdx].title}
                  </h2>
                  <p className="font-jost font-normal text-xs text-[#FAF7F2]/90 tracking-wider max-w-xs mb-5 leading-relaxed">
                    {carouselSlides[carouselIdx].subtitle}
                  </p>
                  <Link 
                    href="/collections" 
                    className="pointer-events-auto inline-flex items-center justify-center px-6 py-2.5 bg-white hover:bg-[#FAF7F2] text-[#0D0906] font-inter font-normal text-[10px] tracking-[0.2em] uppercase rounded-xs transition-all duration-300 shadow-md active:scale-95"
                  >
                    Shop Now
                  </Link>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Carousel Drag Handle overlay for Swipe support */}
          <motion.div 
            className="absolute inset-0 z-10 cursor-grab active:cursor-grabbing"
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            onDragEnd={(event, info) => {
              const swipeThreshold = 50;
              if (info.offset.x < -swipeThreshold) {
                // Swipe Left (Next)
                setCarouselIdx((prev) => (prev + 1) % carouselSlides.length);
              } else if (info.offset.x > swipeThreshold) {
                // Swipe Right (Prev)
                setCarouselIdx((prev) => (prev - 1 + carouselSlides.length) % carouselSlides.length);
              }
            }}
          />

          {/* Dots Pagination */}
          <div className="absolute bottom-4 left-0 right-0 z-20 flex justify-center gap-1.5 pointer-events-none">
            {carouselSlides.map((_, i) => (
              <button
                key={i}
                onClick={() => setCarouselIdx(i)}
                className={`w-1.5 h-1.5 rounded-full pointer-events-auto transition-all duration-300 ${
                  carouselIdx === i ? "bg-[#B8924A] w-3" : "bg-white/40"
                }`}
                aria-label={`Go to slide ${i + 1}`}
              />
            ))}
          </div>
        </div>

        {/* Section 2: Product Marquees */}
        <div className="w-full bg-[#FAF7F2] py-6 border-y border-[#B8924A]/10 overflow-hidden flex flex-col gap-5">
          
          {/* Kurti Marquee */}
          <div className="flex flex-col">
            <div className="px-4 mb-2 flex items-center justify-between">
              <h3 className="font-cormorant font-light text-lg tracking-wide text-[#0D0906]">Kurti Collection</h3>
              <span className="font-inter font-normal text-[8px] uppercase tracking-widest text-[#B8924A] font-bold">Infinite Scroll</span>
            </div>
            
            <div className="relative w-full overflow-hidden py-1.5 flex select-none">
              <div 
                className="animate-marquee-infinite flex gap-3.5 pr-3.5"
                style={{ "--speed": "22s" } as React.CSSProperties}
              >
                {/* Render two copies of items for seamless loop */}
                {[...kurtiListings, ...kurtiListings].map((item, idx) => (
                  <div 
                    key={`${item.id}-${idx}`}
                    onClick={() => setSelectedProduct(item)}
                    className="w-[125px] flex-shrink-0 bg-white rounded-xl overflow-hidden border border-[#B8924A]/5 p-2 shadow-xs cursor-pointer active:scale-97 transition-all flex flex-col justify-between"
                  >
                    <div className="aspect-[3/4] w-full bg-[#F7F3EE] rounded-lg overflow-hidden relative mb-2">
                      <img 
                        src={getProductMobileImages(item)[0]} 
                        alt={item.title}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    </div>
                    <div className="flex flex-col gap-0.5">
                      <h4 className="font-jost font-normal text-[11px] text-[#0D0906] truncate leading-tight">
                        {item.title}
                      </h4>
                      <div className="flex justify-between items-center text-[9px] text-gray-500 font-medium">
                        <span className="font-inter font-normal text-[#B8924A] text-[7.5px] uppercase font-bold tracking-wider">
                          {getDesignNumber(item)}
                        </span>
                        <span className="font-inter font-bold text-[#991B1B]">₹{item.price}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Tunic Marquee */}
          <div className="flex flex-col">
            <div className="px-4 mb-2 flex items-center justify-between">
              <h3 className="font-cormorant font-light text-lg tracking-wide text-[#0D0906]">Tunic Collection</h3>
              <span className="font-inter font-normal text-[8px] uppercase tracking-widest text-[#B8924A] font-bold">Infinite Scroll</span>
            </div>
            
            <div className="relative w-full overflow-hidden py-1.5 flex select-none">
              <div 
                className="animate-marquee-infinite flex gap-3.5 pr-3.5"
                style={{ "--speed": "26s" } as React.CSSProperties}
              >
                {/* Render two copies of items for seamless loop */}
                {[...tunicListings, ...tunicListings].map((item, idx) => (
                  <div 
                    key={`${item.id}-${idx}`}
                    onClick={() => setSelectedProduct(item)}
                    className="w-[125px] flex-shrink-0 bg-white rounded-xl overflow-hidden border border-[#B8924A]/5 p-2 shadow-xs cursor-pointer active:scale-97 transition-all flex flex-col justify-between"
                  >
                    <div className="aspect-[3/4] w-full bg-[#F7F3EE] rounded-lg overflow-hidden relative mb-2">
                      <img 
                        src={getProductMobileImages(item)[0]} 
                        alt={item.title}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    </div>
                    <div className="flex flex-col gap-0.5">
                      <h4 className="font-jost font-normal text-[11px] text-[#0D0906] truncate leading-tight">
                        {item.title}
                      </h4>
                      <div className="flex justify-between items-center text-[9px] text-gray-500 font-medium">
                        <span className="font-inter font-normal text-[#B8924A] text-[7.5px] uppercase font-bold tracking-wider">
                          {getDesignNumber(item)}
                        </span>
                        <span className="font-inter font-bold text-[#991B1B]">₹{item.price}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* ─── ETHNIC COLLECTION GRIDS ────────────────── */}
      <div className="w-full flex flex-col py-8 px-4 gap-10">
        
        {/* Kurti Collection Section (2x2 Grid) */}
        <section className="flex flex-col">
          <div className="mb-5 flex flex-col">
            <span className="font-jost font-normal text-[9px] uppercase tracking-[0.2em] text-[#B8924A] font-bold mb-1 block">
              TRADITIONAL ARTISTRY
            </span>
            <h2 className="font-cormorant font-light text-2xl tracking-wide text-[#0D0906] flex items-center gap-2">
              Kurti Collection
            </h2>
            <div className="w-10 h-[1.5px] bg-[#B8924A] mt-1.5" />
          </div>

          <div className="grid grid-cols-2 gap-3.5">
            {kurtiListings.slice(0, 4).map((product) => (
              <div 
                key={product.id}
                onClick={() => setSelectedProduct(product)}
                className="bg-white rounded-2xl overflow-hidden border border-[#B8924A]/5 p-2.5 shadow-xs cursor-pointer active:scale-97 transition-all flex flex-col justify-between"
              >
                <div className="aspect-[3/4] w-full bg-[#F7F3EE] rounded-xl overflow-hidden relative mb-2.5">
                  <img 
                    src={getProductMobileImages(product)[0]} 
                    alt={product.title}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                  {product.isNew && (
                    <span className="font-inter font-bold absolute top-2 left-2 bg-[#B8924A] text-white text-[7px] uppercase tracking-wider px-1.5 py-0.5 rounded-full">
                      New
                    </span>
                  )}
                </div>
                <div className="flex flex-col gap-0.5 px-0.5">
                  <h3 className="font-jost font-normal text-xs text-[#0D0906] leading-snug truncate">
                    {product.title}
                  </h3>
                  <div className="flex justify-between items-baseline gap-1 mt-1">
                    <span className="font-inter font-normal text-[#B8924A] text-[8px] uppercase tracking-widest font-bold">
                      {getDesignNumber(product)}
                    </span>
                    <span className="font-inter font-bold text-xs text-[#991B1B]">₹{product.price}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-5 flex justify-center">
            <Link 
              href="/kurtis"
              className="w-full text-center py-3 bg-white text-[#0D0906] border border-[#0D0906]/15 hover:border-[#0D0906] font-inter font-normal text-[10px] tracking-[0.2em] uppercase rounded-xl transition-all duration-300 shadow-xs active:scale-95"
            >
              View All
            </Link>
          </div>
        </section>

        {/* Tunic Collection Section (2x2 Grid) */}
        <section className="flex flex-col">
          <div className="mb-5 flex flex-col">
            <span className="font-jost font-normal text-[9px] uppercase tracking-[0.2em] text-[#B8924A] font-bold mb-1 block">
              CASUAL ELEGANCE
            </span>
            <h2 className="font-cormorant font-light text-2xl tracking-wide text-[#0D0906] flex items-center gap-2">
              Tunic Collection
            </h2>
            <div className="w-10 h-[1.5px] bg-[#B8924A] mt-1.5" />
          </div>

          <div className="grid grid-cols-2 gap-3.5">
            {tunicListings.slice(0, 4).map((product) => (
              <div 
                key={product.id}
                onClick={() => setSelectedProduct(product)}
                className="bg-white rounded-2xl overflow-hidden border border-[#B8924A]/5 p-2.5 shadow-xs cursor-pointer active:scale-97 transition-all flex flex-col justify-between"
              >
                <div className="aspect-[3/4] w-full bg-[#F7F3EE] rounded-xl overflow-hidden relative mb-2.5">
                  <img 
                    src={getProductMobileImages(product)[0]} 
                    alt={product.title}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                  {product.isNew && (
                    <span className="font-inter font-bold absolute top-2 left-2 bg-[#B8924A] text-white text-[7px] uppercase tracking-wider px-1.5 py-0.5 rounded-full">
                      New
                    </span>
                  )}
                </div>
                <div className="flex flex-col gap-0.5 px-0.5">
                  <h3 className="font-jost font-normal text-xs text-[#0D0906] leading-snug truncate">
                    {product.title}
                  </h3>
                  <div className="flex justify-between items-baseline gap-1 mt-1">
                    <span className="font-inter font-normal text-[#B8924A] text-[8px] uppercase tracking-widest font-bold">
                      {getDesignNumber(product)}
                    </span>
                    <span className="font-inter font-bold text-xs text-[#991B1B]">₹{product.price}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-5 flex justify-center">
            <Link 
              href="/tunic-tops"
              className="w-full text-center py-3 bg-white text-[#0D0906] border border-[#0D0906]/15 hover:border-[#0D0906] font-inter font-normal text-[10px] tracking-[0.2em] uppercase rounded-xl transition-all duration-300 shadow-xs active:scale-95"
            >
              View All
            </Link>
          </div>
        </section>

      </div>

      {/* ─── SIDEBAR / MENU DRAWER ──────────────────── */}
      <AnimatePresence>
        {isMenuOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMenuOpen(false)}
              className="fixed inset-0 z-50 bg-black/45 backdrop-blur-xs"
            />
            
            <motion.div 
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 220 }}
              className="fixed top-0 bottom-0 left-0 w-[270px] bg-[#FAF7F2] z-50 p-6 flex flex-col justify-between border-r border-[#B8924A]/10 shadow-2xl"
            >
              <div className="flex flex-col gap-8">
                {/* Drawer Close */}
                <div className="flex justify-between items-center border-b border-[#B8924A]/10 pb-4">
                  <div className="flex flex-col">
                    <span className="font-[var(--font-grance)] text-lg tracking-[0.06em] text-[#0D0906]">MANASVI</span>
                    <span className="font-[var(--font-cormorant)] text-[8px] tracking-[0.25em] text-[#B8924A] uppercase leading-none font-bold">Fashion</span>
                  </div>
                  <button onClick={() => setIsMenuOpen(false)} className="p-1.5 text-gray-500 hover:text-black">
                    <X size={20} />
                  </button>
                </div>

                {/* Nav items */}
                <nav className="flex flex-col gap-5">
                  {[
                    { label: "Home", href: "/" },
                    { label: "Kurtis Collection", href: "/kurtis" },
                    { label: "Tunic Collection", href: "/tunic-tops" },
                    { label: "Boutique Lookbook", href: "/collections" },
                    { label: "About Us", href: "/about" },
                    { label: "Contact Atelier", href: "/contact" }
                  ].map((item) => (
                    <Link 
                      key={item.label}
                      href={item.href}
                      onClick={() => setIsMenuOpen(false)}
                      className="font-jost font-normal text-[13px] tracking-widest text-[#0D0906] uppercase hover:text-[#B8924A] transition-colors py-1.5 flex items-center justify-between group"
                    >
                      <span>{item.label}</span>
                      <ArrowRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity text-[#B8924A]" />
                    </Link>
                  ))}
                </nav>
              </div>

              {/* Drawer footer info */}
              <div className="flex flex-col gap-3 border-t border-[#B8924A]/10 pt-4">
                <a 
                  href="https://wa.me/919099369035" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-full py-2.5 bg-[#128C7E] hover:bg-[#075E54] text-white rounded-lg flex items-center justify-center gap-2 font-inter font-normal text-[10px] tracking-widest uppercase shadow-xs active:scale-95 transition-all"
                >
                  <MessageCircle size={14} /> WhatsApp Support
                </a>
                <span className="font-inter font-normal text-[8px] tracking-wider text-gray-400 text-center uppercase font-medium">
                  © 2026 Manasvi Fashion Surat
                </span>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ─── FULLSCREEN SEARCH OVERLAY ──────────────── */}
      <AnimatePresence>
        {isSearchOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-[#F7F3EE] p-6 flex flex-col gap-6"
          >
            {/* Header / Dismiss */}
            <div className="flex items-center justify-between">
              <span className="font-jost font-normal tracking-wide text-sm text-[#0D0906]">Search Catalogue</span>
              <button 
                onClick={() => { setIsSearchOpen(false); setSearchQuery(""); }} 
                className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center text-gray-500 hover:text-black"
              >
                <X size={16} />
              </button>
            </div>

            {/* Input */}
            <div className="relative flex items-center border-b border-[#B8924A]/30 focus-within:border-[#B8924A]">
              <Search className="absolute left-1 text-gray-400" size={18} />
              <input 
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search Kurtis, Tunics, fabrics..."
                className="w-full bg-transparent pl-8 py-3 focus:outline-none font-jost font-normal text-sm tracking-wide"
                autoFocus
              />
            </div>

            {/* Results list */}
            <div className="flex-1 overflow-y-auto scrollbar-none flex flex-col gap-3">
              {searchQuery.trim() === "" ? (
                <div className="flex flex-col items-center justify-center py-20 text-gray-400 gap-1.5">
                  <Search size={24} className="opacity-50" />
                  <span className="font-jost font-normal text-xs uppercase tracking-widest font-light">Type to search collection</span>
                </div>
              ) : searchedProducts.length === 0 ? (
                <span className="font-jost font-normal text-center text-xs text-gray-500 py-10 font-medium">
                  No matching designs found in catalogue.
                </span>
              ) : (
                searchedProducts.map((p) => (
                  <div 
                    key={p.id}
                    onClick={() => { setSelectedProduct(p); setIsSearchOpen(false); setSearchQuery(""); }}
                    className="flex gap-3 bg-white p-2.5 rounded-xl border border-gray-100 items-center cursor-pointer active:scale-98 transition-transform"
                  >
                    <div className="w-12 h-16 rounded-lg overflow-hidden bg-gray-50 flex-shrink-0">
                      <img src={getProductMobileImages(p)[0]} alt={p.title} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex flex-col flex-1">
                      <span className="font-jost font-normal text-xs text-[#0D0906] line-clamp-1">{p.title}</span>
                      <span className="font-inter font-normal text-[9px] text-[#B8924A] uppercase font-bold tracking-wider mt-0.5">{getDesignNumber(p)}</span>
                    </div>
                    <span className="font-inter font-bold text-xs text-[#991B1B] pr-2">₹{p.price}</span>
                  </div>
                ))
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ─── PREMIUM BOTTOM SHEET DRAWER (MODAL) ────── */}
      <AnimatePresence>
        {selectedProduct && (
          <div className="fixed inset-0 z-50 flex justify-center items-end pointer-events-none">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={handleDrawerClose}
              className="absolute inset-0 bg-black/60 pointer-events-auto"
            />

            {/* Bottom Sheet Sheet Content */}
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 26, stiffness: 220 }}
              className="fixed bottom-0 left-0 right-0 w-full h-[88vh] bg-[#F7F3EE] shadow-2xl flex flex-col pointer-events-auto rounded-t-3xl overflow-hidden border-t border-[#B8924A]/10"
            >
              {/* Drag bar indicator */}
              <div className="w-full flex justify-center py-3 sticky top-0 bg-[#F7F3EE] z-20 shrink-0">
                <div className="w-10 h-1 bg-gray-300 rounded-full" />
              </div>

              {/* Close Button */}
              <button
                onClick={handleDrawerClose}
                className="absolute top-2.5 right-4 w-7 h-7 flex items-center justify-center rounded-full bg-white text-gray-500 shadow-sm z-30"
              >
                <X size={15} />
              </button>

              {/* Body scroll */}
              <div className="flex-1 overflow-y-auto px-5 pb-10 space-y-5 scrollbar-none">
                {/* Horizontal image gallery */}
                <div className="relative -mx-5 -mt-3">
                  <div 
                    ref={drawerGalleryRef}
                    onScroll={handleDrawerGalleryScroll}
                    className="flex overflow-x-auto snap-x snap-mandatory scrollbar-none w-full h-[280px]"
                  >
                    {currentImagesList.map((imgSrc, idx) => (
                      <img
                        key={idx}
                        src={imgSrc}
                        alt={selectedProduct.title}
                        onClick={() => setFullscreenImage(imgSrc)}
                        className="w-full h-full object-cover shrink-0 snap-start cursor-zoom-in active:opacity-90 transition-opacity"
                      />
                    ))}
                  </div>
                  {/* Subtle Zoom Indicator */}
                  <div className="absolute top-3 right-3 bg-black/45 backdrop-blur-xs text-[#FAF7F2] p-1.5 rounded-full pointer-events-none shadow-xs">
                    <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" x2="16.65" y1="21" y2="16.65"/><line x1="11" x2="11" y1="8" y2="14"/><line x1="8" x2="14" y1="11" y2="11"/></svg>
                  </div>
                  {/* Gallery Dots */}
                  {currentImagesList.length > 1 && (
                    <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-1.5">
                      {currentImagesList.map((_, idx) => (
                        <div
                          key={idx}
                          className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                            idx === activeImageIdx ? "bg-[#B8924A] w-3" : "bg-white/40"
                          }`}
                        />
                      ))}
                    </div>
                  )}
                </div>

                {/* Details heading */}
                <div className="flex flex-col gap-1.5">
                  <div className="flex justify-between items-baseline gap-2">
                    <span className="text-[#B8924A] text-[9px] uppercase tracking-widest font-bold font-inter">
                      {getDesignNumber(selectedProduct)}
                    </span>
                    <span className="text-xs font-semibold text-teal-600 bg-teal-50 px-2 py-0.5 rounded-full uppercase tracking-wider scale-90">
                      In Catalog
                    </span>
                  </div>
                  <h3 className="font-jost font-normal text-lg text-[#0D0906] tracking-wide leading-snug">
                    {selectedProduct.title}
                  </h3>
                  <div className="flex items-center gap-3">
                    <span className="font-inter font-bold text-lg text-[#991B1B]">₹{currentPrice}</span>
                    {currentCompareAtPrice && (
                      <span className="font-inter font-normal text-xs text-gray-400 line-through">₹{currentCompareAtPrice}</span>
                    )}
                  </div>
                </div>

                <hr className="border-[#B8924A]/10" />

                {/* Specs list */}
                <div className="grid grid-cols-2 gap-3 text-[11px] text-gray-600 font-inter">
                  <div className="flex flex-col">
                    <span className="font-inter font-normal text-[8px] uppercase tracking-wider text-gray-400 mb-0.5">Fabric Blend</span>
                    <span className="font-inter font-normal text-[#0D0906]">{selectedProduct.fabric || "Premium Fabric"}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="font-inter font-normal text-[8px] uppercase tracking-wider text-gray-400 mb-0.5">Sleeve Fit</span>
                    <span className="font-inter font-normal text-[#0D0906]">{selectedProduct.sleeveType || "Standard Sleves"}</span>
                  </div>
                </div>

                {/* Description */}
                <div className="flex flex-col gap-1">
                  <span className="font-inter font-normal text-[8px] uppercase tracking-wider text-gray-400 font-bold">Design Story</span>
                  <p className="font-jost font-normal text-[11px] text-gray-600 leading-relaxed">
                    {selectedProduct.description}
                  </p>
                </div>

                {/* Color select */}
                {selectedProduct.colorVariants && selectedProduct.colorVariants.length > 0 && (
                  <div className="flex flex-col gap-2.5">
                    <span className="font-inter font-normal text-[8px] uppercase tracking-wider text-gray-400 font-bold">Select Colorway</span>
                    <div className="flex flex-wrap gap-2">
                      {selectedProduct.colorVariants.map((variant, idx) => (
                        <button
                          key={variant.name + '-' + idx}
                          onClick={() => setSelectedColorIdx(idx)}
                          className={`h-9 px-3 rounded-xl border flex items-center gap-2 transition-all duration-300 cursor-pointer ${
                            selectedColorIdx === idx 
                              ? "bg-[#0D0906] border-[#0D0906] text-white shadow-sm scale-102" 
                              : "bg-white border-gray-200 text-gray-600 hover:border-gray-400"
                          }`}
                        >
                          <span 
                            className="w-4 h-4 rounded-full border border-black/10 flex-shrink-0" 
                            style={{ backgroundColor: variant.hex || '#000' }}
                          />
                          <span className="font-inter text-xs font-semibold">{variant.name}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Size select */}
                <div className="flex flex-col gap-2.5">
                  <span className="font-inter font-normal text-[8px] uppercase tracking-wider text-gray-400 font-bold">Select Size</span>
                  <div className="flex gap-2">
                    {selectedProduct.sizes.map((sz) => (
                      <button
                        key={sz}
                        onClick={() => setSelectedSize(sz)}
                        className={`w-9 h-9 rounded-xl border flex items-center justify-center font-inter font-normal text-xs transition-all ${
                          selectedSize === sz
                            ? "bg-[#0D0906] text-white border-[#0D0906] shadow-sm scale-103"
                            : "bg-white border-gray-200 text-gray-600"
                        }`}
                      >
                        {sz}
                      </button>
                    ))}
                  </div>
                </div>

                <hr className="border-[#B8924A]/10" />

                {/* CTAs */}
                <div className="flex flex-col gap-3 pt-1">
                  {/* WhatsApp Direct Inquiry */}
                  <a
                    href={`https://wa.me/919099369035?text=${encodeURIComponent(`Hi, I would like to inquire about "${selectedProduct.title}" (${getDesignNumber(selectedProduct)}) in color "${activeVariant?.name || selectedProduct.color}" and size "${selectedSize}" (Price: ₹${currentPrice}).`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-3 bg-[#128C7E] hover:bg-[#075E54] text-white rounded-xl font-inter font-normal text-[10px] tracking-widest uppercase flex items-center justify-center gap-2 shadow-xs active:scale-97 transition-all duration-300"
                  >
                    <MessageCircle size={15} /> WhatsApp Catalog Inquiry
                  </a>

                  {/* Add to Bag */}
                  <button
                    onClick={handleAddToCart}
                    className="w-full py-3 bg-white text-[#0D0906] border border-[#0D0906] rounded-xl font-inter font-normal text-[10px] tracking-widest uppercase shadow-xs active:scale-97 transition-all hover:bg-[#0D0906] hover:text-white transition-colors duration-300"
                  >
                    Add to Cart Bag
                  </button>

                  {/* View Full Product Details Page */}
                  <Link
                    href={`/products/${selectedProduct.slug}`}
                    onClick={handleDrawerClose}
                    className="w-full py-3 bg-[#0D0906] text-white rounded-xl font-inter font-normal text-[10px] tracking-widest uppercase text-center flex items-center justify-center gap-1.5 shadow-sm active:scale-97 transition-all duration-300"
                  >
                    Open Product Page <ArrowRight size={13} />
                  </Link>
                </div>

              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ─── FULLSCREEN IMAGE VIEWER ────────────────── */}
      <AnimatePresence>
        {fullscreenImage && (
          <div className="fixed inset-0 z-55 flex items-center justify-center bg-black/95">
            {/* Close trigger backdrop */}
            <div className="absolute inset-0" onClick={() => setFullscreenImage(null)} />
            
            {/* Close Button */}
            <button
              onClick={() => setFullscreenImage(null)}
              className="absolute top-4 right-4 z-55 w-10 h-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white transition-all shadow-md active:scale-95"
            >
              <X size={20} />
            </button>

            {/* Fullscreen Image */}
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="relative max-w-full max-h-full p-2 flex items-center justify-center pointer-events-none"
            >
              <img
                src={fullscreenImage}
                alt="Product Full View"
                className="max-w-[95vw] max-h-[85vh] object-contain rounded-lg shadow-2xl pointer-events-auto"
              />
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ─── TOAST NOTIFICATION ─────────────────────── */}
      <AnimatePresence>
        {showToast && (
          <motion.div
            initial={{ bottom: 12, opacity: 0, scale: 0.9 }}
            animate={{ bottom: 32, opacity: 1, scale: 1 }}
            exit={{ bottom: 12, opacity: 0, scale: 0.9 }}
            className="fixed left-1/2 -translate-x-1/2 z-50 bg-[#0D0906] text-[#FAF7F2] px-4 py-2.5 rounded-full text-[10px] font-sans font-semibold tracking-wide shadow-md flex items-center gap-1.5 border border-[#B8924A]/15 pointer-events-none"
          >
            <span className="text-[#B8924A]">✓</span> {toastMessage}
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
