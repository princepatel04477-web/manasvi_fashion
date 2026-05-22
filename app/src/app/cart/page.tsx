"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useShop } from "@/context/shop-context";
import { useSession } from "next-auth/react";
import { formatINR } from "@/lib/store";
import { 
  ShoppingBag, 
  Trash2, 
  Plus, 
  Minus, 
  Heart, 
  ArrowRight, 
  Tag, 
  X, 
  RotateCcw, 
  Sparkles, 
  Truck, 
  ShieldCheck, 
  Gift, 
  ChevronRight 
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Coupon {
  code: string;
  discountType: "percentage" | "fixed";
  discountValue: number;
  minOrderValue: number;
}

const AVAILABLE_COUPONS: Coupon[] = [
  { code: "WELCOME10", discountType: "percentage", discountValue: 10, minOrderValue: 1999 },
  { code: "FESTIVE500", discountType: "fixed", discountValue: 500, minOrderValue: 4999 }
];

interface RemovedItem {
  productId: string;
  size: string;
  qty: number;
  title: string;
  price: number;
  image?: string;
  slug?: string;
}

export default function CartPage() {
  const { 
    cart, 
    updateQty, 
    removeFromCart, 
    cartCount,
    cartTotal, 
    products, 
    wishlist, 
    toggleWishlist, 
    addToCart 
  } = useShop();

  const { data: session } = useSession();
  const checkoutUrl = session ? "/checkout" : "/auth/signin?callbackUrl=/checkout";

  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const [couponInput, setCouponInput] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);
  const [couponError, setCouponError] = useState<string | null>(null);
  const [couponSuccess, setCouponSuccess] = useState<string | null>(null);

  // Undo removal state
  const [lastRemovedItem, setLastRemovedItem] = useState<RemovedItem | null>(null);
  const [showUndoToast, setShowUndoToast] = useState(false);
  const undoTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Map cart items with their product details
  const cartItems = cart
    .map((item) => {
      const product = products.find((p) => p.id === item.productId);
      return {
        ...item,
        title: item.title || product?.title || "Premium Apparel",
        price: item.price ?? product?.price ?? 0,
        category: product?.subcategory || product?.category || "Women's Fashion",
        image: item.image ?? product?.images[0],
        hoverImage: product?.images[1] ?? product?.images[0],
        color: product?.color || "Custom Palette",
        slug: item.slug ?? product?.slug ?? "",
      };
    })
    .filter((item) => item.title);

  // Automatically recalculate or remove coupon if cart value drops below threshold
  useEffect(() => {
    if (appliedCoupon && cartTotal < appliedCoupon.minOrderValue) {
      setAppliedCoupon(null);
      setCouponSuccess(null);
      setCouponError(
        `Coupon "${appliedCoupon.code}" removed. Minimum order value of ${formatINR(
          appliedCoupon.minOrderValue
        )} is no longer met.`
      );
    }
  }, [cartTotal, appliedCoupon]);

  // Handle coupon application
  const applyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    setCouponError(null);
    setCouponSuccess(null);

    const formattedCode = couponInput.trim().toUpperCase();
    if (!formattedCode) {
      setCouponError("Please reveal a coupon code.");
      return;
    }

    const coupon = AVAILABLE_COUPONS.find((c) => c.code === formattedCode);

    if (!coupon) {
      setCouponError("This coupon code is not active in our atelier.");
      return;
    }

    if (cartTotal < coupon.minOrderValue) {
      setCouponError(
        `This code requires a minimum selection value of ${formatINR(
          coupon.minOrderValue
        )}. Add ${formatINR(coupon.minOrderValue - cartTotal)} more to unlock.`
      );
      return;
    }

    setAppliedCoupon(coupon);
    setCouponSuccess(`Coupon "${coupon.code}" successfully applied to your wardrobe.`);
    setCouponInput("");
  };

  // Remove coupon code
  const removeCoupon = () => {
    setAppliedCoupon(null);
    setCouponSuccess(null);
    setCouponError(null);
  };

  // Calculate discounts & totals
  const discountAmount = appliedCoupon
    ? appliedCoupon.discountType === "percentage"
      ? Math.round(cartTotal * (appliedCoupon.discountValue / 100))
      : appliedCoupon.discountValue
    : 0;

  const shippingCost = cartTotal === 0 ? 0 : cartTotal >= 1999 ? 0 : 150;
  const finalTotal = Math.max(0, cartTotal - discountAmount + shippingCost);

  // Save for Later (wishlist sync)
  const saveForLater = (productId: string, size: string) => {
    const item = cartItems.find((i) => i.productId === productId && i.size === size);
    if (item) {
      if (!wishlist.includes(productId)) {
        toggleWishlist(productId);
      }
      removeFromCart(productId, size);
      
      // Floating notice
      setCouponSuccess(`"${item.title}" saved securely for later.`);
      setTimeout(() => setCouponSuccess(null), 3000);
    }
  };

  // Handle custom removal with Undo option
  const handleRemoveItem = (productId: string, size: string) => {
    const item = cartItems.find((i) => i.productId === productId && i.size === size);
    if (item) {
      // Clear previous timeout
      if (undoTimeoutRef.current) {
        clearTimeout(undoTimeoutRef.current);
      }

      setLastRemovedItem({
        productId,
        size,
        qty: item.qty,
        title: item.title,
        price: item.price,
        image: item.image,
        slug: item.slug
      });
      setShowUndoToast(true);

      // Perform removal
      removeFromCart(productId, size);

      // Auto-hide toast after 5s
      undoTimeoutRef.current = setTimeout(() => {
        setShowUndoToast(false);
        setLastRemovedItem(null);
      }, 5000);
    }
  };

  // Undo remove handler
  const handleUndoRemove = () => {
    if (lastRemovedItem) {
      if (undoTimeoutRef.current) {
        clearTimeout(undoTimeoutRef.current);
      }

      // Add item back
      addToCart(lastRemovedItem.productId, lastRemovedItem.size);
      // Restore its exact quantity
      updateQty(lastRemovedItem.productId, lastRemovedItem.size, lastRemovedItem.qty);

      // Clear states
      setShowUndoToast(false);
      setLastRemovedItem(null);
    }
  };

  // Curated product recommendations (excludes items already in cart)
  const recommendedProducts = products
    .filter((p) => !cart.some((c) => c.productId === p.id))
    .slice(0, 4);

  return (
    <main className="min-h-screen bg-[#FAF7F2] text-[#3B2B28] pt-24 sm:pt-28 md:pt-32 pb-32 md:pb-36 px-4 md:px-6 relative overflow-hidden soft-grain">
      {/* BACKGROUND DECORATIVE GLOWS */}
      <div className="absolute top-[8%] left-[-15%] w-[50vw] h-[50vw] rounded-full bg-[#F4D7CF] opacity-20 filter blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[20%] right-[-10%] w-[45vw] h-[45vw] rounded-full bg-[#E7C2B8] opacity-20 filter blur-[130px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* HERO SECTION */}
        <div className="max-w-3xl mb-12 md:mb-16 flex flex-col gap-3">
          <h1 className="font-cormorant text-3xl sm:text-4xl md:text-5xl font-light italic leading-tight">
            Your Selection
          </h1>
          <div className="w-16 h-[1px] bg-[#C98E87] my-1" />
          <p className="font-inter text-sm sm:text-base text-[#8B6B61] tracking-wide font-light">
            Thoughtfully chosen pieces, ready for your wardrobe.
          </p>
        </div>

        <AnimatePresence mode="wait">
          {cartItems.length === 0 ? (
            /* BEAUTIFUL EMPTY STATE */
            <motion.div
              key="empty-cart"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="flex flex-col items-center justify-center text-center py-16 md:py-24 max-w-xl mx-auto"
            >
              <div className="relative mb-8 w-48 h-48 sm:w-60 sm:h-60 rounded-full overflow-hidden border border-[#E7C2B8]/40 warm-shadow group">
                <div className="absolute inset-0 bg-[#3B2B28]/10 mix-blend-overlay z-10" />
                <img 
                  src="/photos/8dcce96683276500c2236556084f5d2ec0b2c695b15201a77821204c1030c309.png" 
                  alt="Manasvi Studio Lookbook" 
                  className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                />
              </div>
              <h2 className="font-cormorant text-3xl sm:text-4xl font-light italic mb-4">
                Your wardrobe awaits.
              </h2>
              <p className="font-inter text-sm text-[#8B6B61] leading-relaxed font-light mb-8 max-w-sm">
                Discover timeless garments and signature silhouettes crafted for everyday elegance and luxury appeal.
              </p>
              <Link 
                href="/collections" 
                className="px-10 py-4 bg-[#3B2B28] text-[#FAF7F2] rounded-xl font-cormorant text-xs uppercase tracking-[0.2em] font-semibold transition-all duration-300 hover:bg-[#8B6B61] hover:shadow-lg shadow-md flex items-center gap-2 group"
              >
                <span>Continue Shopping</span>
                <ChevronRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </motion.div>
          ) : (
            /* CINEMATIC SPLIT LAYOUT */
            <motion.div
              key="cart-layout"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid gap-12 lg:grid-cols-12 items-start"
            >
              {/* LEFT SIDE: CART ITEMS */}
              <div className="lg:col-span-8 space-y-6">
                <div className="flex justify-between items-center pb-4 border-b border-[#E7C2B8]/30">
                  <span className="font-cormorant text-lg italic text-[#8B6B61]">
                    Apparel In Atelier ({cartCount} {cartCount === 1 ? "item" : "items"})
                  </span>
                </div>

                <div className="space-y-6">
                  <AnimatePresence initial={false}>
                    {cartItems.map((item) => (
                      <motion.div
                        key={`${item.productId}-${item.size}`}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, height: 0, marginBottom: 0, y: -20 }}
                        transition={{ duration: 0.5 }}
                        className="overflow-hidden"
                      >
                        <div className="editorial-card relative bg-white/80 backdrop-blur-md rounded-2xl border border-[#E7C2B8]/40 p-4 md:p-6 warm-shadow flex flex-col sm:flex-row gap-4 sm:gap-6 transition-all duration-300 hover:shadow-md">
                          
                          {/* Image Box with hover alternate */}
                          <div 
                            className="relative w-full sm:w-28 h-36 rounded-xl overflow-hidden bg-[#FAF7F2] border border-[#E7C2B8]/20 flex-shrink-0 cursor-pointer"
                            onMouseEnter={() => setHoveredItem(`${item.productId}-${item.size}`)}
                            onMouseLeave={() => setHoveredItem(null)}
                          >
                            <Link href={`/products/${item.slug}`}>
                              <img 
                                src={item.image} 
                                alt={item.title} 
                                className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                              />
                              <AnimatePresence>
                                {hoveredItem === `${item.productId}-${item.size}` && item.hoverImage && (
                                  <motion.img
                                    key="hover-image"
                                    src={item.hoverImage}
                                    alt={`${item.title} alternate`}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    transition={{ duration: 0.4 }}
                                    className="absolute inset-0 w-full h-full object-cover pointer-events-none"
                                  />
                                )}
                              </AnimatePresence>
                            </Link>
                          </div>

                          {/* Product details */}
                          <div className="flex-1 flex flex-col justify-between gap-4">
                            <div>
                              <div className="flex justify-between items-start gap-3">
                                <div>
                                  <span className="font-inter text-[11px] sm:text-[10px] tracking-widest text-[#C98E87] uppercase font-semibold">
                                    {item.category}
                                  </span>
                                  <h3 className="font-cormorant text-lg sm:text-xl font-medium text-[#3B2B28] hover:text-[#8B6B61] transition-colors mt-0.5">
                                    <Link href={`/products/${item.slug}`}>
                                      {item.title}
                                    </Link>
                                  </h3>
                                </div>
                                <span className="font-cormorant text-lg font-light text-[#3B2B28]">
                                  {formatINR(item.price)}
                                </span>
                              </div>

                              {/* Attributes */}
                              <div className="flex flex-wrap gap-4 mt-3">
                                <div className="flex items-center gap-1.5 bg-[#FAF7F2] px-2.5 py-1 rounded-full border border-[#E7C2B8]/30">
                                  <span className="font-inter text-[11px] sm:text-[10px] text-[#8B6B61] font-medium">Size:</span>
                                  <span className="font-inter text-[11px] sm:text-[10px] text-[#3B2B28] font-bold uppercase">{item.size}</span>
                                </div>
                                <div className="flex items-center gap-1.5 bg-[#FAF7F2] px-2.5 py-1 rounded-full border border-[#E7C2B8]/30">
                                  <span className="font-inter text-[11px] sm:text-[10px] text-[#8B6B61] font-medium">Fabric:</span>
                                  <span className="font-inter text-[11px] sm:text-[10px] text-[#3B2B28] font-bold">{item.color}</span>
                                </div>
                              </div>
                            </div>

                            {/* Actions / Quantity */}
                            <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
                              {/* Quantity Selector */}
                              <div className="flex items-center border border-[#8B6B61]/20 rounded-full px-2 py-1 bg-[#FAF7F2]">
                                <button 
                                  onClick={() => updateQty(item.productId, item.size, item.qty - 1)}
                                  className="w-7 h-7 rounded-full flex items-center justify-center text-[#8B6B61] hover:bg-[#E7C2B8]/20 transition-colors"
                                >
                                  <Minus className="w-3.5 h-3.5" />
                                </button>
                                <span className="w-8 text-center font-inter text-xs font-medium text-[#3B2B28]">
                                  {item.qty}
                                </span>
                                <button 
                                  onClick={() => updateQty(item.productId, item.size, item.qty + 1)}
                                  className="w-7 h-7 rounded-full flex items-center justify-center text-[#8B6B61] hover:bg-[#E7C2B8]/20 transition-colors"
                                >
                                  <Plus className="w-3.5 h-3.5" />
                                </button>
                              </div>

                              {/* Remove & Save buttons */}
                              <div className="flex gap-4">
                                <button 
                                  onClick={() => saveForLater(item.productId, item.size)}
                                  className="font-inter text-[11px] sm:text-xs text-[#8B6B61] hover:text-[#3B2B28] transition-colors flex items-center gap-1 border-b border-transparent hover:border-[#3B2B28]/20 pb-0.5"
                                >
                                  <Heart className="w-3.5 h-3.5" />
                                  <span>Save for Later</span>
                                </button>
                                <button 
                                  onClick={() => handleRemoveItem(item.productId, item.size)}
                                  className="font-inter text-[11px] sm:text-xs text-[#C98E87] hover:text-[#3B2B28] transition-colors flex items-center gap-1 border-b border-transparent hover:border-[#3B2B28]/20 pb-0.5"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                  <span>Remove</span>
                                </button>
                              </div>
                            </div>
                          </div>

                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </div>

              {/* RIGHT SIDE: ORDER SUMMARY */}
              <div className="lg:col-span-4 lg:sticky lg:top-28">
                <div className="editorial-card bg-white/80 backdrop-blur-md rounded-3xl border border-[#E7C2B8]/40 p-6 md:p-8 warm-shadow space-y-6">
                  <h3 className="font-cormorant text-2xl font-light italic pb-3 border-b border-[#E7C2B8]/30">
                    Order Summary
                  </h3>

                  {/* Price breakdown */}
                  <div className="space-y-3 font-inter text-xs md:text-sm text-[#8B6B61] font-light">
                    <div className="flex justify-between">
                      <span>Subtotal</span>
                      <span className="text-[#3B2B28]">{formatINR(cartTotal)}</span>
                    </div>

                    {appliedCoupon && (
                      <div className="flex justify-between items-center text-[#C98E87]">
                        <span className="flex items-center gap-1">
                          <Tag className="w-3.5 h-3.5" />
                          <span>Discount ({appliedCoupon.code})</span>
                        </span>
                        <span className="flex items-center gap-2 font-medium">
                          -{formatINR(discountAmount)}
                          <button 
                            onClick={removeCoupon}
                            className="text-[#8B6B61] hover:text-[#3B2B28] p-0.5 rounded-full hover:bg-[#FAF7F2] transition-colors"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </span>
                      </div>
                    )}

                    <div className="flex justify-between">
                      <span>Estimated Shipping</span>
                      <span className="text-[#3B2B28]">
                        {shippingCost === 0 ? (
                          <span className="text-[#C98E87] font-medium tracking-wide uppercase text-[10px]">Free</span>
                        ) : (
                          formatINR(shippingCost)
                        )}
                      </span>
                    </div>

                    <div className="h-[1px] bg-[#E7C2B8]/30 my-4" />

                    <div className="flex justify-between items-baseline pt-2">
                      <span className="font-cormorant text-xl text-[#3B2B28] italic">Total</span>
                      <span className="font-cormorant text-2xl font-medium text-[#3B2B28]">
                        {formatINR(finalTotal)}
                      </span>
                    </div>
                  </div>

                  {/* Coupon System Input */}
                  <form onSubmit={applyCoupon} className="pt-2">
                    <label htmlFor="coupon" className="block font-cormorant text-xs uppercase tracking-[0.1em] font-bold text-[#8B6B61] mb-2">
                      Studio Coupon Code
                    </label>
                    <div className="flex gap-2">
                      <input 
                        id="coupon"
                        type="text"
                        placeholder="e.g. WELCOME10"
                        value={couponInput}
                        onChange={(e) => setCouponInput(e.target.value)}
                        className="luxury-input flex-1 py-2 text-xs font-inter uppercase placeholder-[#8B6B61]/40"
                      />
                      <button 
                        type="submit"
                        className="px-4 py-2 border border-[#8B6B61]/30 hover:border-[#3B2B28] rounded-lg font-cormorant text-xs uppercase tracking-wider font-semibold transition-all hover:bg-[#FAF7F2] cursor-pointer"
                      >
                        Apply
                      </button>
                    </div>
                    
                    {/* Coupon Messages */}
                    {couponError && (
                      <p className="font-cormorant text-xs italic text-[#C98E87] mt-2 flex items-center gap-1">
                        <Sparkles className="w-3.5 h-3.5 flex-shrink-0" />
                        {couponError}
                      </p>
                    )}
                    {couponSuccess && (
                      <p className="font-cormorant text-xs italic text-[#8B6B61] mt-2 flex items-center gap-1">
                        <Sparkles className="w-3.5 h-3.5 flex-shrink-0" />
                        {couponSuccess}
                      </p>
                    )}
                  </form>

                  {/* Checkout Action Button */}
                  <div className="pt-4">
                    <Link 
                      href={checkoutUrl}
                      className="w-full py-4 bg-[#3B2B28] text-[#FAF7F2] rounded-xl font-cormorant text-xs uppercase tracking-[0.25em] font-semibold transition-all duration-400 hover:bg-[#8B6B61] cursor-pointer shadow-md hover:shadow-lg hover:translate-y-[-1px] flex items-center justify-center gap-3 relative overflow-hidden group"
                    >
                      <span>Proceed to Checkout</span>
                      <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
                    </Link>
                  </div>

                  {/* Reassurance blocks */}
                  <div className="space-y-3.5 pt-4 border-t border-[#E7C2B8]/30">
                    <div className="flex gap-3 items-start">
                      <Truck className="w-4 h-4 text-[#8B6B61] mt-0.5 flex-shrink-0" />
                      <p className="font-inter text-[11px] text-[#8B6B61] leading-relaxed">
                        {cartTotal >= 1999 ? (
                          <>Complimentary boutique delivery active for this wardrobe selection.</>
                        ) : (
                          <>Spend {formatINR(1999 - cartTotal)} more to qualify for <strong>free shipping</strong>.</>
                        )}
                      </p>
                    </div>

                    <div className="flex gap-3 items-start">
                      <ShieldCheck className="w-4 h-4 text-[#8B6B61] mt-0.5 flex-shrink-0" />
                      <p className="font-inter text-[11px] text-[#8B6B61] leading-relaxed">
                        Estimated delivery within <strong>4–6 business days</strong>. Express handling secure.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* RECOMMENDED PRODUCTS SECTION */}
        {recommendedProducts.length > 0 && (
          <div className="mt-24 md:mt-32 pt-16 border-t border-[#E7C2B8]/40">
            <div className="max-w-3xl mb-10 flex flex-col gap-2">
              <h2 className="font-cormorant text-3xl md:text-4xl font-light italic leading-tight">
                You May Also Like
              </h2>
              <p className="font-inter text-xs text-[#8B6B61] tracking-wide font-light">
                Curated boutique items tailored perfectly for kurtis, dresses, and tunic collections.
              </p>
            </div>

            {/* Horizontal Product Grid */}
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {recommendedProducts.map((p) => {
                const isLiked = wishlist.includes(p.id);
                return (
                  <div 
                    key={p.id} 
                    className="editorial-card group overflow-hidden rounded-2xl p-3 transition-all duration-500 hover:shadow-lg hover:-translate-y-1 bg-white/70"
                  >
                    <Link href={`/products/${p.slug}`}>
                      <div className="relative h-64 sm:h-72 md:h-80 overflow-hidden rounded-xl bg-[#f6eee2]">
                        <img 
                          src={p.images[0]} 
                          alt={p.title} 
                          className="h-full w-full object-cover transition-transform duration-1000 group-hover:scale-105" 
                        />
                      </div>
                    </Link>
                    
                    <div className="mt-4 flex items-start justify-between gap-3 px-1">
                      <div>
                        <span className="font-inter text-[9px] tracking-widest text-[#C98E87] uppercase font-semibold">
                          {p.subcategory || p.category}
                        </span>
                        <h3 className="font-cormorant text-base font-medium text-[#3B2B28] mt-0.5 line-clamp-1">
                          <Link href={`/products/${p.slug}`}>
                            {p.title}
                          </Link>
                        </h3>
                        <p className="font-cormorant text-sm font-light text-[#8B6B61] mt-1">
                          {formatINR(p.price)}
                        </p>
                      </div>
                      <button 
                        onClick={() => toggleWishlist(p.id)} 
                        className="rounded-full border border-[#E7C2B8]/40 p-2 text-[#8B6B61] hover:text-[#3B2B28] transition-colors"
                      >
                        <Heart size={14} fill={isLiked ? "#C98E87" : "none"} className={isLiked ? "text-[#C98E87]" : ""} />
                      </button>
                    </div>

                    <button 
                      onClick={() => addToCart(p.id, p.sizes[0])} 
                      className="luxury-btn mt-4 w-full rounded-xl py-3 text-[11px] sm:text-[10px] uppercase font-semibold tracking-wider font-cormorant cursor-pointer flex items-center justify-center gap-1 bg-[#3B2B28] text-white"
                    >
                      <Gift className="w-3.5 h-3.5" />
                      <span>Quick Add</span>
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* FLOATING UNDO REMOVAL TOAST */}
      <AnimatePresence>
        {showUndoToast && lastRemovedItem && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.95 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-[#3B2B28] text-[#FAF7F2] px-6 py-4 rounded-2xl warm-shadow border border-[#E7C2B8]/20 flex items-center gap-4 text-xs md:text-sm font-inter font-light"
          >
            <span>
              Removed <strong>{lastRemovedItem.title}</strong> (Size {lastRemovedItem.size})
            </span>
            <button 
              onClick={handleUndoRemove}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-[#FAF7F2]/10 hover:bg-[#FAF7F2]/20 border border-[#FAF7F2]/20 rounded-lg text-[#FAF7F2] font-semibold transition-all hover:scale-[1.02] cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5 animate-spin-reverse" />
              <span>Undo</span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* MOBILE STICKY FOOTER ACTION */}
      {cartItems.length > 0 && (
        <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-[#FAF7F2]/90 backdrop-blur-md border-t border-[#E7C2B8]/40 p-4 z-40 flex items-center justify-between gap-4 shadow-xl">
          <div>
            <span className="font-inter text-[11px] text-[#8B6B61] tracking-wider uppercase block">Total Selection</span>
            <span className="font-cormorant text-xl font-bold text-[#3B2B28]">{formatINR(finalTotal)}</span>
          </div>
          <Link 
            href={checkoutUrl}
            className="px-6 py-3.5 bg-[#3B2B28] text-[#FAF7F2] rounded-xl font-cormorant text-xs uppercase tracking-widest font-semibold transition-colors hover:bg-[#8B6B61] shadow-md flex items-center gap-2"
          >
            <span>Checkout</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      )}
    </main>
  );
}
