"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";

interface SkeletonProps {
  className?: string;
  variant?: "nude" | "cream" | "cocoa";
  circle?: boolean;
}

export function Skeleton({ className = "", variant = "nude", circle = false }: SkeletonProps) {
  const shimmerClass = 
    variant === "cream" 
      ? "shimmer-luxury-cream" 
      : variant === "cocoa" 
        ? "shimmer-luxury-cocoa" 
        : "shimmer-luxury-nude";

  return (
    <div 
      className={`relative overflow-hidden ${circle ? "rounded-full" : "rounded-xl"} ${shimmerClass} ${className}`}
    />
  );
}

// LUXURY TRANSITION CROSS-FADE WRAPPER
export function LuxuryTransition({
  isLoading,
  fallback,
  children,
  className = ""
}: {
  isLoading: boolean;
  fallback: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <AnimatePresence mode="wait">
      {isLoading ? (
        <motion.div
          key="skeleton"
          initial={{ opacity: 1, filter: "blur(0px)", scale: 1 }}
          exit={{ opacity: 0, filter: "blur(8px)", scale: 0.98 }}
          transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
          className={`w-full ${className}`}
        >
          {fallback}
        </motion.div>
      ) : (
        <motion.div
          key="content"
          initial={{ opacity: 0, filter: "blur(8px)", scale: 1.02 }}
          animate={{ opacity: 1, filter: "blur(0px)", scale: 1 }}
          transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
          className={`w-full ${className}`}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// 1. NAVBAR SKELETON
export function NavbarSkeleton() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#FAF7F2]/90 backdrop-blur-md border-b border-[#E7C2B8]/20 px-4 py-3 sm:px-6 md:px-8">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Left Nav links (Desktop) */}
        <div className="hidden md:flex items-center gap-6">
          <Skeleton className="h-4 w-16" variant="cream" />
          <Skeleton className="h-4 w-20" variant="cream" />
          <Skeleton className="h-4 w-14" variant="cream" />
        </div>
        {/* Mobile menu trigger */}
        <div className="md:hidden">
          <Skeleton className="h-8 w-8 rounded-lg" variant="cream" />
        </div>

        {/* Logo */}
        <div className="flex flex-col items-center">
          <Skeleton className="h-6 w-32 mb-1" variant="nude" />
          <Skeleton className="h-3 w-16" variant="cream" />
        </div>

        {/* Right Nav Icons */}
        <div className="flex items-center gap-4">
          <Skeleton className="h-5 w-5 rounded-full" variant="cream" />
          <Skeleton className="h-5 w-5 rounded-full" variant="cream" />
          <Skeleton className="h-8 w-8 rounded-full" variant="nude" />
        </div>
      </div>
    </header>
  );
}

// 2. HERO SKELETON
export function HeroSkeleton() {
  return (
    <div className="relative h-[90vh] md:h-screen w-full bg-[#FAF7F2] overflow-hidden flex flex-col justify-end p-8 md:p-16">
      {/* Background Campaign placeholder */}
      <Skeleton className="absolute inset-0 rounded-none h-full w-full" variant="nude" />
      
      {/* Editorial Text Overlay */}
      <div className="relative z-10 max-w-4xl space-y-6 md:space-y-8 animate-pulse">
        <div className="space-y-3">
          <Skeleton className="h-3 w-28 md:w-36 uppercase tracking-[0.25em]" variant="cream" />
          <Skeleton className="h-14 sm:h-20 md:h-28 w-2/3 md:w-1/2 rounded-2xl" variant="cream" />
          <Skeleton className="h-4 sm:h-6 w-1/3 rounded-lg" variant="cream" />
        </div>
        
        <div className="w-16 h-[1px] bg-[#FAF7F2]/40" />

        <div className="flex gap-4">
          <Skeleton className="h-12 w-36 sm:w-44 rounded-full" variant="cream" />
          <Skeleton className="h-12 w-12 rounded-full" variant="cream" />
        </div>
      </div>
    </div>
  );
}

// 3. PRODUCT CARD SKELETON
export function ProductCardSkeleton({ aspectRatio = "aspect-[3/4]" }: { aspectRatio?: string }) {
  return (
    <div className="group relative flex flex-col bg-[#FAF7F2]/40 rounded-3xl border border-[#E7C2B8]/20 p-3 w-full">
      {/* Wishlist button top-right */}
      <div className="absolute top-5 right-5 z-25">
        <Skeleton className="w-9 h-9 rounded-full" variant="cream" />
      </div>

      {/* Campaign image blurred container */}
      <div className={`relative ${aspectRatio} w-full overflow-hidden rounded-2xl`}>
        <Skeleton className="w-full h-full rounded-none" variant="nude" />
      </div>

      {/* Info details */}
      <div className="mt-4 flex-1 flex flex-col justify-between px-1 space-y-3">
        <div className="space-y-2">
          {/* Subcategory */}
          <Skeleton className="h-3 w-20" variant="cream" />
          {/* Title */}
          <Skeleton className="h-5 w-3/4" variant="nude" />
          {/* Price */}
          <Skeleton className="h-4 w-24" variant="cream" />
        </div>

        {/* Divider line */}
        <div className="h-[1px] bg-[#E7C2B8]/20" />

        <div className="space-y-3">
          {/* Swatches label and dots */}
          <div className="flex items-center justify-between">
            <Skeleton className="h-3 w-10" variant="cream" />
            <div className="flex gap-1">
              <Skeleton className="h-4 w-4 rounded-full" variant="cream" />
              <Skeleton className="h-4 w-4 rounded-full" variant="cream" />
              <Skeleton className="h-4 w-4 rounded-full" variant="cream" />
            </div>
          </div>

          {/* Sizes and Add buttons */}
          <div className="flex items-center justify-between gap-2">
            <Skeleton className="h-3 w-16" variant="cream" />
            <div className="flex gap-1.5">
              <Skeleton className="w-7 h-7 rounded-lg" variant="cream" />
              <Skeleton className="w-7 h-7 rounded-lg" variant="cream" />
              <Skeleton className="w-7 h-7 rounded-lg" variant="cream" />
            </div>
          </div>

          {/* Quick Add CTA */}
          <Skeleton className="h-10 w-full rounded-xl" variant="cocoa" />
        </div>
      </div>
    </div>
  );
}

// 4. PRODUCT GRID SKELETON
export function ProductGridSkeleton({ count = 6 }: { count?: number }) {
  const items = Array.from({ length: count });

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 max-w-7xl mx-auto w-full">
      {items.map((_, idx) => {
        // Apply different heights on desk to simulate lookbook flow
        const cardConfig = [
          { pad: "pt-0", aspect: "aspect-[3/4]" },
          { pad: "md:pb-12", aspect: "aspect-[4/5]" },
          { pad: "md:pt-16", aspect: "aspect-[3/4]" }
        ];
        const config = cardConfig[idx % cardConfig.length];

        return (
          <div key={idx} className={`${config.pad} w-full`}>
            <ProductCardSkeleton aspectRatio={config.aspect} />
          </div>
        );
      })}
    </div>
  );
}

// 5. PRODUCT DETAIL PAGE SKELETON
export function ProductDetailSkeleton() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10 w-full">
      {/* Breadcrumb skeleton */}
      <div className="mb-8 flex items-center gap-2">
        <Skeleton className="h-3.5 w-16" variant="cream" />
        <span className="text-[#8B6B61]/40 text-xs">/</span>
        <Skeleton className="h-3.5 w-24" variant="cream" />
        <span className="text-[#8B6B61]/40 text-xs">/</span>
        <Skeleton className="h-3.5 w-32" variant="nude" />
      </div>

      <div className="grid gap-12 lg:grid-cols-12 items-start">
        {/* Left: Product Images Gallery */}
        <div className="lg:col-span-7 grid gap-4">
          {/* Main Large Image frame */}
          <div className="aspect-[3/4] sm:aspect-[4/5] rounded-3xl overflow-hidden border border-[#E7C2B8]/20 relative">
            <Skeleton className="w-full h-full rounded-none" variant="nude" />
          </div>
          
          {/* Thumbnail list below */}
          <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-none">
            <Skeleton className="w-20 h-24 rounded-xl shrink-0" variant="cream" />
            <Skeleton className="w-20 h-24 rounded-xl shrink-0" variant="cream" />
            <Skeleton className="w-20 h-24 rounded-xl shrink-0" variant="cream" />
            <Skeleton className="w-20 h-24 rounded-xl shrink-0" variant="cream" />
          </div>
        </div>

        {/* Right: Product Details Information */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          <div className="space-y-3">
            <Skeleton className="h-4 w-32" variant="cream" />
            <Skeleton className="h-9 w-5/6 rounded-lg" variant="nude" />
            <Skeleton className="h-4 w-28" variant="cream" />
          </div>

          <div className="editorial-line" />

          {/* Pricing detail */}
          <div className="flex items-baseline gap-3">
            <Skeleton className="h-8 w-24" variant="nude" />
            <Skeleton className="h-5 w-16" variant="cream" />
          </div>

          {/* Short description */}
          <div className="space-y-2">
            <Skeleton className="h-3.5 w-full" variant="cream" />
            <Skeleton className="h-3.5 w-5/6" variant="cream" />
            <Skeleton className="h-3.5 w-4/5" variant="cream" />
          </div>

          {/* Color options */}
          <div className="space-y-2">
            <Skeleton className="h-3.5 w-20" variant="cream" />
            <div className="flex gap-2">
              <Skeleton className="h-8 w-8 rounded-full" variant="cream" />
              <Skeleton className="h-8 w-8 rounded-full" variant="cream" />
              <Skeleton className="h-8 w-8 rounded-full" variant="cream" />
            </div>
          </div>

          {/* Size selections */}
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <Skeleton className="h-3.5 w-24" variant="cream" />
              <Skeleton className="h-3.5 w-16" variant="cream" />
            </div>
            <div className="flex gap-2.5">
              <Skeleton className="h-10 w-12 rounded-xl" variant="cream" />
              <Skeleton className="h-10 w-12 rounded-xl" variant="cream" />
              <Skeleton className="h-10 w-12 rounded-xl" variant="cream" />
              <Skeleton className="h-10 w-12 rounded-xl" variant="cream" />
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex flex-col gap-3.5 mt-2">
            <div className="flex gap-3">
              <Skeleton className="h-14 flex-1 rounded-2xl" variant="cocoa" />
              <Skeleton className="h-14 w-14 rounded-2xl" variant="cream" />
            </div>
            <Skeleton className="h-12 w-full rounded-2xl" variant="nude" />
          </div>

          {/* Product Accordion rows */}
          <div className="mt-6 border-t border-[#E7C2B8]/30 pt-4 space-y-4">
            <div className="flex justify-between items-center py-2">
              <Skeleton className="h-4.5 w-36" variant="cream" />
              <Skeleton className="h-4 w-4" variant="cream" />
            </div>
            <div className="flex justify-between items-center py-2 border-t border-[#E7C2B8]/20">
              <Skeleton className="h-4.5 w-40" variant="cream" />
              <Skeleton className="h-4 w-4" variant="cream" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// 6. COLLECTION BANNER SKELETON
export function CollectionBannerSkeleton() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8 w-full">
      <div className="max-w-3xl mb-12 flex flex-col gap-3">
        <Skeleton className="h-3.5 w-28" variant="cream" />
        <Skeleton className="h-10 sm:h-12 w-2/3 rounded-xl" variant="nude" />
        <div className="w-16 h-[1px] bg-[#C98E87]/60 my-1" />
        <Skeleton className="h-5 w-4/5 rounded-md" variant="cream" />
        <Skeleton className="h-5 w-3/4 rounded-md" variant="cream" />
      </div>
    </div>
  );
}

// 7. CART PAGE SKELETON
export function CartSkeleton() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8 relative z-10 w-full">
      <div className="mb-10 flex flex-col gap-2">
        <Skeleton className="h-12 w-48 rounded-xl" variant="nude" />
        <Skeleton className="h-4 w-64" variant="cream" />
      </div>

      <div className="grid gap-8 lg:grid-cols-12 items-start">
        {/* Left: Cart Items List */}
        <div className="lg:col-span-8 space-y-4">
          {Array.from({ length: 3 }).map((_, idx) => (
            <div 
              key={idx} 
              className="bg-white/60 backdrop-blur-sm border border-[#E7C2B8]/30 rounded-2xl p-4 flex gap-4 items-center"
            >
              {/* Product thumb */}
              <Skeleton className="w-20 h-24 sm:w-24 sm:h-32 rounded-xl shrink-0" variant="cream" />
              
              {/* Product Info */}
              <div className="flex-1 space-y-2">
                <Skeleton className="h-3 w-16" variant="cream" />
                <Skeleton className="h-5 w-2/3" variant="nude" />
                <Skeleton className="h-4 w-20" variant="cream" />
                
                {/* Quantity incrementer placeholder */}
                <div className="flex items-center gap-2 pt-2">
                  <Skeleton className="w-6 h-6 rounded-md" variant="cream" />
                  <Skeleton className="w-8 h-4 rounded-md" variant="cream" />
                  <Skeleton className="w-6 h-6 rounded-md" variant="cream" />
                </div>
              </div>

              {/* Action delete & price */}
              <div className="flex flex-col items-end gap-6 shrink-0 justify-between h-20 sm:h-28">
                <Skeleton className="h-8 w-8 rounded-full" variant="cream" />
                <Skeleton className="h-5 w-16" variant="nude" />
              </div>
            </div>
          ))}
        </div>

        {/* Right: Summary panel */}
        <div className="lg:col-span-4 bg-white/70 backdrop-blur-md border border-[#E7C2B8]/40 rounded-2xl p-6 space-y-6">
          <Skeleton className="h-6 w-32" variant="nude" />
          
          <div className="space-y-3 pt-2">
            <div className="flex justify-between">
              <Skeleton className="h-4 w-20" variant="cream" />
              <Skeleton className="h-4 w-16" variant="cream" />
            </div>
            <div className="flex justify-between">
              <Skeleton className="h-4 w-24" variant="cream" />
              <Skeleton className="h-4 w-12" variant="cream" />
            </div>
            <div className="h-[1px] bg-[#E7C2B8]/30 my-2" />
            <div className="flex justify-between">
              <Skeleton className="h-5 w-16" variant="nude" />
              <Skeleton className="h-6 w-24" variant="nude" />
            </div>
          </div>

          {/* Coupon inputs */}
          <div className="flex gap-2">
            <Skeleton className="h-11 flex-1 rounded-xl" variant="cream" />
            <Skeleton className="h-11 w-20 rounded-xl" variant="cream" />
          </div>

          {/* Checkout CTA */}
          <Skeleton className="h-12 w-full rounded-xl" variant="cocoa" />
        </div>
      </div>
    </div>
  );
}

// 8. CHECKOUT SKELETON
export function CheckoutSkeleton() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-8 relative z-10 w-full">
      <div className="mb-10 flex flex-col gap-2">
        <Skeleton className="h-10 w-44 rounded-xl" variant="nude" />
        <Skeleton className="h-4 w-60" variant="cream" />
      </div>

      <div className="space-y-6 rounded-2xl border border-[#E7C2B8]/40 bg-white/80 backdrop-blur-md p-6 sm:p-8">
        <div className="space-y-4">
          <Skeleton className="h-12 w-full rounded-xl" variant="cream" />
          <Skeleton className="h-12 w-full rounded-xl" variant="cream" />
          
          <div className="grid gap-4 md:grid-cols-2">
            <Skeleton className="h-12 w-full rounded-xl" variant="cream" />
            <Skeleton className="h-12 w-full rounded-xl" variant="cream" />
          </div>
        </div>

        <div className="border-t border-[#E7C2B8]/30 pt-6">
          <div className="flex justify-between items-center mb-6">
            <div className="space-y-1">
              <Skeleton className="h-4.5 w-24" variant="cream" />
              <Skeleton className="h-3 w-36" variant="cream" />
            </div>
            <Skeleton className="h-6 w-28" variant="nude" />
          </div>

          <Skeleton className="h-14 w-full rounded-xl" variant="cocoa" />
        </div>
      </div>
    </div>
  );
}

// 9. DASHBOARD SKELETON
export function DashboardSkeleton() {
  return (
    <div className="w-full space-y-8">
      {/* Header segment */}
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between border-b border-[#d9a58f22] pb-6">
        <div className="space-y-2">
          <Skeleton className="h-8 w-40 rounded-lg" variant="nude" />
          <Skeleton className="h-4 w-64" variant="cream" />
        </div>
        <Skeleton className="h-10 w-36 rounded-xl" variant="cream" />
      </div>

      {/* Grid of cards */}
      <div className="grid gap-5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 3 }).map((_, idx) => (
          <div key={idx} className="bg-white border border-[#E7C2B8]/30 rounded-2xl p-5 space-y-4">
            <div className="flex justify-between items-center">
              <Skeleton className="h-3.5 w-24" variant="cream" />
              <Skeleton className="h-8 w-8 rounded-full" variant="cream" />
            </div>
            <Skeleton className="h-8 w-32" variant="nude" />
            <Skeleton className="h-3 w-40" variant="cream" />
          </div>
        ))}
      </div>

      {/* Two columns layout (Table & Graph) */}
      <div className="grid gap-6 lg:grid-cols-12">
        {/* Table placeholder */}
        <div className="lg:col-span-8 bg-white border border-[#E7C2B8]/30 rounded-2xl p-6 space-y-6">
          <div className="flex justify-between items-center">
            <Skeleton className="h-5 w-32" variant="nude" />
            <Skeleton className="h-4 w-16" variant="cream" />
          </div>
          
          <div className="space-y-4 pt-2">
            {Array.from({ length: 4 }).map((_, idx) => (
              <div key={idx} className="flex justify-between items-center py-2 border-b border-[#FAF7F2]">
                <div className="space-y-1 flex-1">
                  <Skeleton className="h-4 w-1/3" variant="cream" />
                  <Skeleton className="h-3 w-1/4" variant="cream" />
                </div>
                <Skeleton className="h-4.5 w-20" variant="nude" />
              </div>
            ))}
          </div>
        </div>

        {/* Small Analytics placeholder */}
        <div className="lg:col-span-4 bg-white border border-[#E7C2B8]/30 rounded-2xl p-6 space-y-6">
          <Skeleton className="h-5 w-36" variant="nude" />
          
          {/* Chart visual representation */}
          <div className="h-48 flex items-end justify-between gap-2.5 px-4 pt-4 border-b border-[#E7C2B8]/20">
            <Skeleton className="w-7 h-16 rounded-t-lg shrink-0" variant="cream" />
            <Skeleton className="w-7 h-28 rounded-t-lg shrink-0" variant="nude" />
            <Skeleton className="w-7 h-36 rounded-t-lg shrink-0" variant="cream" />
            <Skeleton className="w-7 h-20 rounded-t-lg shrink-0" variant="nude" />
            <Skeleton className="w-7 h-32 rounded-t-lg shrink-0" variant="cream" />
          </div>
          
          <Skeleton className="h-3 w-full" variant="cream" />
        </div>
      </div>
    </div>
  );
}

// 10. SEARCH SKELETON
export function SearchSkeleton() {
  return (
    <div className="w-full space-y-8 max-w-7xl mx-auto px-4 py-8">
      {/* Category Pills */}
      <div className="flex gap-2.5 flex-wrap">
        <Skeleton className="h-9 w-24 rounded-full" variant="cream" />
        <Skeleton className="h-9 w-28 rounded-full" variant="cream" />
        <Skeleton className="h-9 w-20 rounded-full" variant="cream" />
      </div>

      {/* Grid count summary */}
      <Skeleton className="h-4 w-36" variant="cream" />

      {/* Predictive item previews */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <ProductCardSkeleton />
        <ProductCardSkeleton />
        <ProductCardSkeleton />
      </div>
    </div>
  );
}

// 11. WISHLIST SKELETON
export function WishlistSkeleton() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8 w-full">
      <div className="max-w-3xl mb-12 flex flex-col gap-3">
        <Skeleton className="h-12 w-48 rounded-xl" variant="nude" />
        <Skeleton className="h-4 w-60" variant="cream" />
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <ProductCardSkeleton />
        <ProductCardSkeleton />
        <ProductCardSkeleton />
      </div>
    </div>
  );
}

// 12. FASHION JOURNAL / BLOG SKELETON
export function JournalSkeleton() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8 w-full space-y-8">
      <div className="max-w-3xl mb-12 flex flex-col gap-3">
        <Skeleton className="h-12 w-52 rounded-xl" variant="nude" />
        <Skeleton className="h-4 w-64" variant="cream" />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {Array.from({ length: 4 }).map((_, idx) => (
          <div key={idx} className="bg-white/60 border border-[#E7C2B8]/30 rounded-2xl p-6 space-y-4">
            <Skeleton className="h-3 w-16" variant="cream" />
            <Skeleton className="h-6 w-3/4 rounded-md" variant="nude" />
            <div className="space-y-2 pt-2">
              <Skeleton className="h-3.5 w-full" variant="cream" />
              <Skeleton className="h-3.5 w-5/6" variant="cream" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// 13. ORDER HISTORY SKELETON
export function OrderHistorySkeleton() {
  return (
    <div className="w-full space-y-4">
      {Array.from({ length: 2 }).map((_, idx) => (
        <div key={idx} className="bg-white/60 border border-[#E7C2B8]/30 rounded-2xl p-5 space-y-4">
          <div className="flex justify-between items-center flex-wrap gap-2">
            <div className="space-y-1">
              <Skeleton className="h-4 w-32" variant="cream" />
              <Skeleton className="h-3 w-24" variant="cream" />
            </div>
            <Skeleton className="h-6 w-20 rounded-full" variant="nude" />
          </div>
          <div className="h-[1px] bg-[#E7C2B8]/20" />
          <div className="flex items-center gap-3">
            <Skeleton className="w-12 h-16 rounded-lg shrink-0" variant="cream" />
            <div className="space-y-1.5 flex-1">
              <Skeleton className="h-4 w-1/3" variant="cream" />
              <Skeleton className="h-3.5 w-16" variant="cream" />
            </div>
            <Skeleton className="h-5 w-16" variant="nude" />
          </div>
        </div>
      ))}
    </div>
  );
}

// 14. REVIEWS SKELETON
export function ReviewsSkeleton() {
  return (
    <div className="space-y-6 w-full">
      {Array.from({ length: 2 }).map((_, idx) => (
        <div key={idx} className="border-b border-[#E7C2B8]/20 pb-5 space-y-2.5">
          <div className="flex items-center gap-1.5">
            {Array.from({ length: 5 }).map((_, s) => (
              <Skeleton key={s} className="w-3.5 h-3.5 rounded-full" variant="cream" />
            ))}
          </div>
          <Skeleton className="h-4 w-36" variant="nude" />
          <div className="space-y-1.5">
            <Skeleton className="h-3.5 w-full" variant="cream" />
            <Skeleton className="h-3.5 w-4/5" variant="cream" />
          </div>
          <Skeleton className="h-3 w-20" variant="cream" />
        </div>
      ))}
    </div>
  );
}

// 15. RECOMMENDATIONS SKELETON
export function RecommendationsSkeleton() {
  return (
    <div className="space-y-6 w-full">
      <Skeleton className="h-6 w-44 rounded-lg" variant="nude" />
      <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-none">
        <div className="w-64 shrink-0">
          <ProductCardSkeleton aspectRatio="aspect-[3/4]" />
        </div>
        <div className="w-64 shrink-0">
          <ProductCardSkeleton aspectRatio="aspect-[3/4]" />
        </div>
        <div className="w-64 shrink-0">
          <ProductCardSkeleton aspectRatio="aspect-[3/4]" />
        </div>
      </div>
    </div>
  );
}
