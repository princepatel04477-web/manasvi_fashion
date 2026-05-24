"use client";

import { FormEvent, useState, useEffect } from "react";
import { useShop } from "@/context/shop-context";
import { formatINR } from "@/lib/store";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { CheckoutSkeleton, LuxuryTransition } from "@/components/ui/skeleton";
import { Lock, Ticket, Trash2, Loader2, Sparkles, ChevronRight } from "lucide-react";
import Link from "next/link";

export default function CheckoutPage() {
  const { data: session, status: sessionStatus } = useSession();
  const router = useRouter();
  const { cart, cartTotal, clearCart, products, loading: productsLoading } = useShop();

  // Loading & Processing States
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Shipping & Contact Details
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [pin, setPin] = useState("");

  // Coupon Engine states
  const [couponInput, setCouponInput] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);
  const [discountAmount, setDiscountAmount] = useState(0);
  const [couponError, setCouponError] = useState("");
  const [couponSuccess, setCouponSuccess] = useState("");

  interface SessionUser {
    name?: string;
    email?: string;
    phone?: string;
    shippingAddress?: string;
    city?: string;
    postalCode?: string;
  }

  // Pre-populate details from next-auth session profile
  useEffect(() => {
    if (session?.user) {
      const u = session.user as SessionUser;
      setTimeout(() => {
        if (u.name) setName(u.name);
        if (u.email) setEmail(u.email);
        if (u.phone) setPhone(u.phone);
        if (u.shippingAddress) setAddress(u.shippingAddress);
        if (u.city) setCity(u.city);
        if (u.postalCode) setPin(u.postalCode);
      }, 0);
    }
  }, [session]);

  // Protect Checkout Route - authentication required
  useEffect(() => {
    if (sessionStatus === "unauthenticated") {
      router.push("/auth/signin?callbackUrl=/checkout");
    }
  }, [sessionStatus, router]);

  // Resolve cart items with detailed attributes from database
  const resolvedItems = cart.map((item) => {
    const dbProduct = products.find((p) => p.id === item.productId);
    return {
      ...item,
      title: item.title || dbProduct?.title || "Boutique Garment",
      image: item.image || dbProduct?.images[0] || "",
      price: item.price || dbProduct?.price || 0,
      slug: item.slug || dbProduct?.slug || ""
    };
  });

  const subtotal = cartTotal;
  const shippingCharge = 0; // Complimentary free delivery for luxury purchases
  const grandTotal = Math.max(0, subtotal - discountAmount + shippingCharge);

  // Validate coupon codes on client side
  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    setCouponError("");
    setCouponSuccess("");

    const code = couponInput.trim().toUpperCase();

    if (!code) {
      setCouponError("Please enter a coupon code");
      return;
    }

    if (code === "WELCOME10") {
      if (subtotal < 1999) {
        setCouponError("Minimum purchase value is ₹1,999 for WELCOME10");
        return;
      }
      const discount = Math.floor(subtotal * 0.1);
      setDiscountAmount(discount);
      setAppliedCoupon("WELCOME10");
      setCouponSuccess("WELCOME10 (10% Off) applied successfully!");
    } else if (code === "FESTIVE500") {
      if (subtotal < 4999) {
        setCouponError("Minimum purchase value is ₹4,999 for FESTIVE500");
        return;
      }
      setDiscountAmount(500);
      setAppliedCoupon("FESTIVE500");
      setCouponSuccess("FESTIVE500 (₹500 Off) applied successfully!");
    } else {
      setCouponError("Invalid coupon code");
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setDiscountAmount(0);
    setCouponInput("");
    setCouponSuccess("");
    setCouponError("");
  };

  // Helper to load Razorpay modal checkout script dynamically
  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.async = true;
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  // Handle Checkout Order placement
  const handleCheckoutSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    setIsProcessing(true);

    if (cart.length === 0) {
      setErrorMessage("Your cart is empty. Add items to checkout.");
      setIsProcessing(false);
      return;
    }

    try {
      // 1. Dynamic injection of Razorpay SDK Script
      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        throw new Error("Razorpay SDK failed to load. Please check your internet connection.");
      }

      // 2. Call backend CREATE ORDER API
      const orderRes = await fetch("/api/checkout/razorpay/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: cart.map((i) => ({ productId: i.productId, qty: i.qty, size: i.size })),
          couponCode: appliedCoupon,
          shippingDetails: { name, email, phone, address, city, pin }
        })
      });

      const orderData = await orderRes.json();
      if (!orderRes.ok || orderData.error) {
        throw new Error(orderData.error || "Failed to generate payment transaction");
      }

      // 3. Configure standard Razorpay checkout options
      const options = {
        key: orderData.keyId,
        amount: orderData.amount,
        currency: orderData.currency,
        name: "MANASVI FASHION",
        description: "Secured Boutique Acquisition",
        image: "https://wvldvvllasjezbffwbft.supabase.co/storage/v1/object/public/products/052081f1262d42453b2864b2120581c84be1200dd8a51d24744a6d9c4abb5992.png",
        order_id: orderData.id,
        handler: async function (response: {
          razorpay_order_id: string;
          razorpay_payment_id: string;
          razorpay_signature: string;
        }) {
          try {
            // Call VERIFY API upon successful capture in the modal
            const verifyRes = await fetch("/api/checkout/razorpay/verify", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                shippingDetails: { name, email, phone, address, city, pin },
                cartItems: resolvedItems,
                couponCode: appliedCoupon
              })
            });

            const verifyData = await verifyRes.json();
            if (verifyRes.ok && verifyData.ok) {
              clearCart();
              router.push(`/checkout/success?orderId=${verifyData.orderId}`);
            } else {
              router.push(`/checkout/failure?error=${encodeURIComponent(verifyData.error || "Verification failed")}`);
            }
          } catch (err) {
            const msg = err instanceof Error ? err.message : "ConnectionError";
            router.push(`/checkout/failure?error=${encodeURIComponent(msg)}`);
          }
        },
        prefill: {
          name: name,
          email: email,
          contact: phone
        },
        notes: {
          address: `${address}, ${city} - ${pin}`
        },
        theme: {
          color: "#3B2B28" // Luxury charcoal theme matching MANASVI boutique
        },
        modal: {
          ondismiss: function () {
            setIsProcessing(false);
          }
        }
      };

      // 4. Open Razorpay modal overlay
      const rzpInstance = new (window as unknown as { Razorpay: new (opts: unknown) => { on: (event: string, cb: (res: { error: { description: string } }) => void) => void; open: () => void } }).Razorpay(options);
      rzpInstance.on("payment.failed", function (response: { error: { description: string } }) {
        router.push(
          `/checkout/failure?error=${encodeURIComponent(
            response.error.description || "Payment failed at checkout modal"
          )}`
        );
      });
      rzpInstance.open();

    } catch (err) {
      console.error("[Checkout Page] Order Placement Failure:", err);
      const msg = err instanceof Error ? err.message : "Checkout initialization failed. Please try again.";
      setErrorMessage(msg);
      setIsProcessing(false);
    }
  };

  const isLoading = sessionStatus === "loading" || productsLoading;

  if (!isLoading && !session) {
    return null;
  }

  return (
    <main className="min-h-screen bg-[#FAF7F2] text-[#3B2B28] pt-24 sm:pt-28 md:pt-32 pb-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden soft-grain">
      {/* Dynamic Background Accents */}
      <div className="absolute top-[8%] left-[-15%] w-[50vw] h-[50vw] rounded-full bg-[#F4D7CF] opacity-20 filter blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[20%] right-[-10%] w-[45vw] h-[45vw] rounded-full bg-[#E7C2B8] opacity-20 filter blur-[130px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Breadcrumb Navigation */}
        <div className="mb-8 font-inter text-[10px] text-[#8B6B61] tracking-widest uppercase flex items-center gap-1.5 font-light">
          <Link href="/" className="hover:text-[#3B2B28] transition-colors">Atelier</Link>
          <ChevronRight className="w-3 h-3 text-[#E7C2B8]" />
          <Link href="/cart" className="hover:text-[#3B2B28] transition-colors">Shopping Cart</Link>
          <ChevronRight className="w-3 h-3 text-[#E7C2B8]" />
          <span className="text-[#3B2B28] font-medium">Checkout</span>
        </div>

        {/* Header Title */}
        <div className="max-w-3xl mb-12 flex flex-col gap-3">
          <h1 className="font-cormorant text-4xl sm:text-5xl font-light italic leading-tight">
            Checkout Studio
          </h1>
          <div className="w-16 h-[1.5px] bg-[#C98E87]" />
          <p className="font-inter text-sm text-[#8B6B61] tracking-wide font-light">
            Secure your selected boutique items. Fill your delivery details and choose standard options to place your order.
          </p>
        </div>

        <LuxuryTransition isLoading={isLoading} fallback={<CheckoutSkeleton />}>
          {cart.length === 0 ? (
            <div className="text-center py-20 bg-white/60 backdrop-blur-md rounded-3xl border border-[#E7C2B8]/30 max-w-2xl mx-auto">
              <Sparkles className="w-8 h-8 mx-auto text-[#C98E87] mb-4 stroke-1 animate-pulse" />
              <h2 className="font-cormorant text-2xl italic text-[#3B2B28] mb-3">Your wardrobe cart is currently empty.</h2>
              <p className="font-inter text-xs text-[#8B6B61] mb-6">Explore our curated signature Kurtis and premium Dresses.</p>
              <Link
                href="/collections"
                className="inline-block py-3.5 px-8 bg-[#3B2B28] text-[#FAF7F2] rounded-xl font-cormorant text-[10px] tracking-[0.25em] uppercase hover:bg-[#8B6B61] transition-all duration-300 shadow-md hover:shadow-lg active:scale-98"
              >
                Return to Collections
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* LEFT COLUMN: Shipping details and submit */}
              <form onSubmit={handleCheckoutSubmit} className="lg:col-span-7 space-y-6">
                <div className="rounded-2xl border border-[#E7C2B8]/40 bg-white/80 backdrop-blur-md p-6 sm:p-8 warm-shadow space-y-6">
                  <h2 className="font-cormorant text-2xl font-light italic text-[#3B2B28]">
                    Shipping Details
                  </h2>
                  <div className="w-12 h-[1px] bg-[#C98E87]" />
                  
                  <div className="space-y-4 font-inter text-sm">
                    {/* Full Name */}
                    <div>
                      <label className="block text-[10px] uppercase tracking-widest text-[#8B6B61] font-semibold mb-2">Customer Name</label>
                      <input 
                        required 
                        type="text"
                        autoCapitalize="words"
                        placeholder="e.g. Aishwarya Rai" 
                        value={name} 
                        onChange={(e) => setName(e.target.value)} 
                        className="w-full rounded-xl border border-[#E7C2B8]/40 bg-[#FAF7F2]/50 p-4 font-inter placeholder-[#8B6B61]/40 focus:outline-none focus:border-[#8B6B61]/60 focus:bg-white transition-all text-[#3B2B28] tracking-wider" 
                      />
                    </div>

                    {/* Email and Phone */}
                    <div className="grid gap-4 md:grid-cols-2">
                      <div>
                        <label className="block text-[10px] uppercase tracking-widest text-[#8B6B61] font-semibold mb-2">Email Address</label>
                        <input 
                          required 
                          type="email"
                          placeholder="e.g. aishwarya@example.com" 
                          value={email} 
                          onChange={(e) => setEmail(e.target.value)} 
                          className="w-full rounded-xl border border-[#E7C2B8]/40 bg-[#FAF7F2]/50 p-4 font-inter placeholder-[#8B6B61]/40 focus:outline-none focus:border-[#8B6B61]/60 focus:bg-white transition-all text-[#3B2B28] tracking-wider" 
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] uppercase tracking-widest text-[#8B6B61] font-semibold mb-2">Contact Number</label>
                        <input 
                          required 
                          type="tel"
                          pattern="[0-9]*"
                          placeholder="e.g. 9988776655" 
                          value={phone} 
                          onChange={(e) => setPhone(e.target.value)} 
                          className="w-full rounded-xl border border-[#E7C2B8]/40 bg-[#FAF7F2]/50 p-4 font-inter placeholder-[#8B6B61]/40 focus:outline-none focus:border-[#8B6B61]/60 focus:bg-white transition-all text-[#3B2B28] tracking-wider" 
                        />
                      </div>
                    </div>

                    {/* Shipping Address */}
                    <div>
                      <label className="block text-[10px] uppercase tracking-widest text-[#8B6B61] font-semibold mb-2">Physical Address</label>
                      <input 
                        required 
                        type="text"
                        placeholder="Suite, Street, and Locality" 
                        value={address} 
                        onChange={(e) => setAddress(e.target.value)} 
                        className="w-full rounded-xl border border-[#E7C2B8]/40 bg-[#FAF7F2]/50 p-4 font-inter placeholder-[#8B6B61]/40 focus:outline-none focus:border-[#8B6B61]/60 focus:bg-white transition-all text-[#3B2B28] tracking-wider" 
                      />
                    </div>

                    {/* City and PIN Code */}
                    <div className="grid gap-4 md:grid-cols-2">
                      <div>
                        <label className="block text-[10px] uppercase tracking-widest text-[#8B6B61] font-semibold mb-2">City</label>
                        <input 
                          required 
                          type="text"
                          autoCapitalize="words"
                          placeholder="e.g. Mumbai" 
                          value={city} 
                          onChange={(e) => setCity(e.target.value)} 
                          className="w-full rounded-xl border border-[#E7C2B8]/40 bg-[#FAF7F2]/50 p-4 font-inter placeholder-[#8B6B61]/40 focus:outline-none focus:border-[#8B6B61]/60 focus:bg-white transition-all text-[#3B2B28] tracking-wider" 
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] uppercase tracking-widest text-[#8B6B61] font-semibold mb-2">PIN Code</label>
                        <input 
                          required 
                          type="text"
                          inputMode="numeric"
                          pattern="[0-9]{6}"
                          maxLength={6}
                          placeholder="e.g. 400049" 
                          value={pin} 
                          onChange={(e) => setPin(e.target.value)} 
                          className="w-full rounded-xl border border-[#E7C2B8]/40 bg-[#FAF7F2]/50 p-4 font-inter placeholder-[#8B6B61]/40 focus:outline-none focus:border-[#8B6B61]/60 focus:bg-white transition-all text-[#3B2B28] tracking-wider" 
                        />
                      </div>
                    </div>

                    {/* Selected payment system */}
                    <div>
                      <label className="block text-[10px] uppercase tracking-widest text-[#8B6B61] font-semibold mb-2">Payment Gateway</label>
                      <select className="w-full rounded-xl border border-[#E7C2B8]/40 bg-[#FAF7F2]/50 p-4 font-inter focus:outline-none focus:border-[#8B6B61]/60 focus:bg-white transition-all text-[#3B2B28] cursor-pointer min-h-[52px] tracking-wider font-light">
                        <option>Razorpay Secure Checkout (UPI, Card, NetBanking)</option>
                      </select>
                    </div>
                  </div>
                </div>

                {errorMessage && (
                  <div className="p-4 bg-red-50 border border-red-200/50 rounded-xl text-red-700 font-inter text-xs tracking-wide">
                    {errorMessage}
                  </div>
                )}

                {/* Submitting CTA Button */}
                <button
                  type="submit"
                  disabled={isProcessing}
                  className="w-full py-4.5 bg-[#3B2B28] text-[#FAF7F2] rounded-xl font-cormorant text-xs uppercase tracking-[0.25em] font-semibold transition-all duration-300 hover:bg-[#8B6B61] hover:translate-y-[-1px] shadow-md hover:shadow-lg active:scale-98 cursor-pointer flex items-center justify-center gap-2.5 disabled:opacity-75 disabled:cursor-not-allowed"
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-[#C98E87]" />
                      <span>Opening Secure Gateway...</span>
                    </>
                  ) : (
                    <>
                      <Lock className="w-3.5 h-3.5 text-[#C98E87] stroke-[2px]" />
                      <span>Proceed to Secure Payment</span>
                    </>
                  )}
                </button>
              </form>

              {/* RIGHT COLUMN: Cinematic Order Summary Panel */}
              <div className="lg:col-span-5 space-y-6">
                
                {/* Product Summary Panel */}
                <div className="rounded-2xl border border-[#E7C2B8]/40 bg-white/80 backdrop-blur-md p-6 warm-shadow space-y-6">
                  <h2 className="font-cormorant text-2xl font-light italic text-[#3B2B28]">
                    Order Summary
                  </h2>
                  <div className="w-12 h-[1px] bg-[#C98E87]" />

                  {/* Cart Items List */}
                  <div className="divide-y divide-[#E7C2B8]/30 max-h-[380px] overflow-y-auto pr-1">
                    {resolvedItems.map((item, idx) => {
                      // Separate color suffix from title if present
                      const titleParts = item.title.split(" - ");
                      const displayTitle = titleParts[0];
                      const displayColor = titleParts[1] || "Bespoke";

                      return (
                        <div key={`${item.productId}-${item.size}-${idx}`} className="py-4 flex gap-4 items-center">
                          <div className="w-16 h-20 relative rounded-lg overflow-hidden bg-[#FAF7F2] border border-[#E7C2B8]/20 flex-shrink-0">
                            {item.image && (
                              <img
                                src={item.image}
                                alt={displayTitle}
                                className="w-full h-full object-cover"
                              />
                            )}
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <h3 className="font-cormorant text-base font-semibold text-[#3B2B28] truncate leading-tight">
                              {displayTitle}
                            </h3>
                            <div className="font-inter text-[11px] text-[#8B6B61] tracking-wide mt-1 flex flex-wrap gap-x-3 font-light">
                              <span>Size: <strong className="font-normal text-[#3B2B28]">{item.size}</strong></span>
                              <span>Color: <strong className="font-normal text-[#3B2B28]">{displayColor}</strong></span>
                              <span>Qty: <strong className="font-normal text-[#3B2B28]">{item.qty}</strong></span>
                            </div>
                          </div>

                          <div className="text-right flex-shrink-0">
                            <span className="font-cormorant text-base font-medium text-[#3B2B28]">
                              {formatINR(item.price * item.qty)}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Interactive Coupon Box */}
                  <div className="pt-4 border-t border-[#E7C2B8]/30 space-y-3">
                    <label className="block font-inter text-[10px] uppercase tracking-widest text-[#8B6B61] font-semibold">
                      Have a Promo Code?
                    </label>
                    
                    {!appliedCoupon ? (
                      <form onSubmit={handleApplyCoupon} className="flex gap-2">
                        <input
                          type="text"
                          placeholder="e.g. WELCOME10"
                          value={couponInput}
                          onChange={(e) => setCouponInput(e.target.value)}
                          className="flex-1 rounded-lg border border-[#E7C2B8]/40 bg-[#FAF7F2]/50 px-3 py-2.5 font-inter text-xs tracking-wider placeholder-[#8B6B61]/40 uppercase focus:outline-none focus:border-[#8B6B61]/60 focus:bg-white text-[#3B2B28]"
                        />
                        <button
                          type="submit"
                          className="px-5 py-2.5 bg-[#3B2B28] text-[#FAF7F2] rounded-lg font-cormorant text-[10px] tracking-widest uppercase hover:bg-[#8B6B61] transition-colors cursor-pointer"
                        >
                          Apply
                        </button>
                      </form>
                    ) : (
                      <div className="flex justify-between items-center bg-[#FAF7F2] border border-[#E7C2B8]/30 rounded-xl px-4 py-2.5">
                        <div className="flex items-center gap-2">
                          <Ticket className="w-3.5 h-3.5 text-[#C98E87]" />
                          <span className="font-inter text-xs font-semibold text-[#3B2B28] tracking-wider uppercase">
                            {appliedCoupon}
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={handleRemoveCoupon}
                          className="text-[#8B6B61] hover:text-red-700 transition-colors p-1"
                          aria-label="Remove coupon"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}

                    {couponError && (
                      <p className="font-inter text-[11px] text-red-600 italic">
                        {couponError}
                      </p>
                    )}
                    {couponSuccess && (
                      <p className="font-inter text-[11px] text-emerald-600 font-medium">
                        {couponSuccess}
                      </p>
                    )}
                  </div>

                  {/* Financial Invoice Details */}
                  <div className="pt-6 border-t border-[#E7C2B8]/30 space-y-3 font-inter text-xs text-[#8B6B61] tracking-wide">
                    <div className="flex justify-between">
                      <span className="font-light">Subtotal</span>
                      <span className="text-[#3B2B28]">{formatINR(subtotal)}</span>
                    </div>
                    {discountAmount > 0 && (
                      <div className="flex justify-between text-emerald-600 font-medium">
                        <span>Coupon Discount</span>
                        <span>-{formatINR(discountAmount)}</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span className="font-light">Complementary Shipping</span>
                      <span className="text-emerald-600 font-light italic">Free</span>
                    </div>
                    
                    <div className="pt-4 border-t border-[#E7C2B8]/30 flex justify-between items-baseline">
                      <span className="font-cormorant text-xl text-[#3B2B28] italic">Order Total</span>
                      <span className="font-cormorant text-2xl font-medium text-[#3B2B28]">
                        {formatINR(grandTotal)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Concierge trust text */}
                <div className="p-5 border border-[#E7C2B8]/20 bg-white/40 rounded-2xl text-center space-y-2">
                  <p className="font-cormorant text-xs italic text-[#8B6B61]">
                    &ldquo;Atelier acquisitions are backed by our secure checkout encryption.&rdquo;
                  </p>
                  <p className="font-inter text-[10px] text-[#8B6B61]/80 leading-relaxed font-light">
                    Transactions are processed securely in INR. Handcrafted tailoring takes 2-4 days before shipment.
                  </p>
                </div>
              </div>
            </div>
          )}
        </LuxuryTransition>
      </div>
    </main>
  );
}
