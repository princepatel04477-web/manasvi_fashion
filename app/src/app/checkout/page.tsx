"use client";

import { useState, useEffect, Suspense } from "react";
import { useShop } from "@/context/shop-context";
import { useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { CheckoutSkeleton, LuxuryTransition } from "@/components/ui/skeleton";
import { ArrowLeft, ShoppingBag, Truck, Smartphone, CreditCard, Banknote, ShieldCheck, ChevronDown, Ticket, Trash2, Loader2, Sparkles, CheckCircle } from "lucide-react";
import Link from "next/link";
import PageTransition from "@/components/PageTransition";
import { Libre_Caslon_Text, Hanken_Grotesk } from "next/font/google";

const libreCaslon = Libre_Caslon_Text({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-libre-caslon",
  display: "swap",
});

const hankenGrotesk = Hanken_Grotesk({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-hanken-grotesk",
  display: "swap",
});

function CheckoutFormContent() {
  const { data: session, status: sessionStatus } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const rawCallbackUrl = searchParams.get("callbackUrl");
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

  // UI state variables
  const [isEditingAddress, setIsEditingAddress] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<"upi" | "card" | "cod">("upi");
  const [isSummaryOpen, setIsSummaryOpen] = useState(false);

  // Coupon Engine states
  const [couponInput, setCouponInput] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);
  const [discountAmount, setDiscountAmount] = useState(0);
  const [couponError, setCouponError] = useState("");
  const [couponSuccess, setCouponSuccess] = useState("");

  // Sandbox Simulator states
  const [showMockModal, setShowMockModal] = useState(false);
  const [mockPaymentStatus, setMockPaymentStatus] = useState<"idle" | "processing" | "success" | "failure">("idle");
  const canUseMockCheckout =
    typeof window !== "undefined" &&
    ["localhost", "127.0.0.1"].includes(window.location.hostname);

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
  const shippingCharge = subtotal > 0 ? 150 : 0; // Standard boutique delivery charge
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

  // Handle simulated payment verification from our sandbox overlay
  const handleSimulatedPayment = async (success: boolean) => {
    if (!success) {
      setShowMockModal(false);
      setIsProcessing(false);
      router.push(`/checkout/failure?error=${encodeURIComponent("Payment declined by customer on secure sandbox")}`);
      return;
    }

    setMockPaymentStatus("processing");
    try {
      console.log("[Sandbox Payment Simulator] Simulating verification API call...");
      const verifyRes = await fetch("/api/checkout/razorpay/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          razorpay_order_id: `mock_order_${Date.now()}`,
          razorpay_payment_id: `pay_mock_${Math.random().toString(36).substring(2, 12)}`,
          razorpay_signature: "mock_sig",
          shippingDetails: { name, email, phone, address, city, pin },
          cartItems: resolvedItems,
          couponCode: appliedCoupon,
          isMock: true
        })
      });

      const verifyData = await verifyRes.json();
      console.log("[Sandbox Payment Simulator] Verify API response:", verifyData);

      if (verifyRes.ok && verifyData.ok) {
        setMockPaymentStatus("success");
        setTimeout(() => {
          clearCart();
          setShowMockModal(false);
          setMockPaymentStatus("idle");
          router.push(`/checkout/success?orderId=${verifyData.orderId}`);
        }, 1500);
      } else {
        setMockPaymentStatus("failure");
        setTimeout(() => {
          setShowMockModal(false);
          setMockPaymentStatus("idle");
          setIsProcessing(false);
          router.push(`/checkout/failure?error=${encodeURIComponent(verifyData.error || "Verification failed")}`);
        }, 1500);
      }
    } catch (err) {
      console.error("[Sandbox Payment Simulator] Unexpected error during verification:", err);
      setMockPaymentStatus("failure");
      setTimeout(() => {
        setShowMockModal(false);
        setMockPaymentStatus("idle");
        setIsProcessing(false);
        const msg = err instanceof Error ? err.message : "ConnectionError";
        router.push(`/checkout/failure?error=${encodeURIComponent(msg)}`);
      }, 1500);
    }
  };

  // Handle Checkout Order placement
  const handleCheckoutSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    setIsProcessing(true);

    if (cart.length === 0) {
      setErrorMessage("Your cart is empty. Add items to checkout.");
      setIsProcessing(false);
      return;
    }

    if (!name || !email || !phone || !address || !city || !pin) {
      setErrorMessage("Please complete your shipping address details first.");
      setIsProcessing(false);
      setIsEditingAddress(true);
      return;
    }

    // A. Cash on Delivery Flow
    if (paymentMethod === "cod") {
      try {
        console.log("[Checkout Page] Placing Cash on Delivery Order...");
        const verifyRes = await fetch("/api/checkout/razorpay/verify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            razorpay_order_id: `cod_${Date.now()}`,
            razorpay_payment_id: `pay_cod_${Math.random().toString(36).substring(2, 12)}`,
            razorpay_signature: "mock_sig",
            shippingDetails: {
              name,
              email,
              phone,
              address: `${address} \n[Payment Method: Cash on Delivery]`,
              city,
              pin
            },
            cartItems: resolvedItems,
            couponCode: appliedCoupon,
            isMock: true // Bypass Razorpay verification for standard COD
          })
        });

        const verifyData = await verifyRes.json();
        console.log("[Checkout Page] COD verify API response:", verifyData);

        if (verifyRes.ok && verifyData.ok) {
          clearCart();
          router.push(`/checkout/success?orderId=${verifyData.orderId}`);
        } else {
          router.push(`/checkout/failure?error=${encodeURIComponent(verifyData.error || "Failed to place Cash on Delivery order")}`);
        }
      } catch (err) {
        console.error("[Checkout Page] COD placement error:", err);
        router.push(`/checkout/failure?error=${encodeURIComponent("Connection error. Please try again.")}`);
      } finally {
        setIsProcessing(false);
      }
      return;
    }

    // B. Razorpay checkout flow (UPI / Card)
    try {
      // 1. Dynamic injection of Razorpay SDK Script
      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        throw new Error("Razorpay SDK failed to load. Please check your internet connection.");
      }

      // 2. Call backend CREATE ORDER API
      let orderData: any;
      let isSandbox = false;
      try {
        const orderRes = await fetch("/api/checkout/razorpay/order", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            items: cart.map((i) => ({ productId: i.productId, qty: i.qty, size: i.size })),
            couponCode: appliedCoupon,
            shippingDetails: { name, email, phone, address, city, pin }
          })
        });

        orderData = await orderRes.json();
        if (!orderRes.ok || orderData.error) {
          throw new Error(orderData.error || "Failed to generate payment transaction");
        }
      } catch (err) {
        console.warn("Backend order creation failed:", err);
        if (!canUseMockCheckout) {
          throw err;
        }

        console.warn("Switching to local sandbox checkout mode.");
        isSandbox = true;
        orderData = {
          keyId: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
          amount: Math.round(grandTotal * 100),
          currency: "INR",
          id: null
        };
      }

      // If we are in sandbox/test mode (API keys incorrect), bypass loading standard Razorpay SDK modal
      if (isSandbox) {
        setShowMockModal(true);
        return;
      }

      if (!orderData.keyId) {
        throw new Error("Razorpay public key is missing. Add NEXT_PUBLIC_RAZORPAY_KEY_ID.");
      }

      // 3. Configure standard Razorpay checkout options
      const options: any = {
        key: orderData.keyId,
        amount: orderData.amount,
        currency: orderData.currency,
        name: "MANASVI FASHION",
        description: "Secured Boutique Acquisition",
        image: "https://wvldvvllasjezbffwbft.supabase.co/storage/v1/object/public/products/052081f1262d42453b2864b2120581c84be1200dd8a51d24744a6d9c4abb5992.png",
        handler: async function (response: {
          razorpay_order_id?: string;
          razorpay_payment_id: string;
          razorpay_signature?: string;
        }) {
          console.log("[Razorpay Success Handler] Callback values received:", response);
          try {
            console.log("[Razorpay Success Handler] Calling verify API...");
            const verifyRes = await fetch("/api/checkout/razorpay/verify", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id || `mock_order_${Date.now()}`,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature || "mock_sig",
                shippingDetails: { name, email, phone, address, city, pin },
                cartItems: resolvedItems,
                couponCode: appliedCoupon,
                isMock: isSandbox
              })
            });

            const verifyData = await verifyRes.json();
            console.log("[Razorpay Success Handler] Verify API response:", verifyData);

            if (verifyRes.ok && verifyData.ok) {
              clearCart();
              router.push(`/checkout/success?orderId=${verifyData.orderId}`);
            } else {
              router.push(`/checkout/failure?error=${encodeURIComponent(verifyData.error || "Verification failed")}`);
            }
          } catch (err) {
            console.error("[Razorpay Success Handler] Unexpected error during verification:", err);
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
          color: "#3B2B28"
        },
        modal: {
          ondismiss: function () {
            setIsProcessing(false);
          }
        }
      };

      if (orderData.id) {
        options.order_id = orderData.id;
      }

      // 4. Open Razorpay modal overlay
      const rzpInstance = new (window as unknown as { Razorpay: new (opts: unknown) => { on: (event: string, cb: (res: { error: { description: string } }) => void) => void; open: () => void } }).Razorpay(options);
      rzpInstance.on("payment.failed", function (response: { error: any }) {
        console.error("[Razorpay Payment Failed Event] Modal event error object:", response.error);
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
    <>
      <LuxuryTransition isLoading={isLoading} fallback={<CheckoutSkeleton />}>
      {cart.length === 0 ? (
        <div className="text-center py-16 bg-surface-container-lowest/60 backdrop-blur-md border border-deep-maroon/10 max-w-2xl mx-auto px-4">
          <Sparkles className="w-8 h-8 mx-auto text-soft-rose mb-4 stroke-1 animate-pulse" />
          <h2 className="font-headline-md text-2xl italic text-primary mb-3 font-light">Your cart is currently empty.</h2>
          <p className="font-body-md text-xs text-primary/60 mb-6 font-light">Explore our curated signature Kurtis and premium Dresses.</p>
          <Link
            href="/collections"
            className="inline-block py-3.5 px-8 bg-deep-maroon text-ivory-cream font-label-sm text-label-sm tracking-[0.25em] uppercase hover:bg-heritage-gold transition-all duration-300 shadow-md hover:shadow-lg active:scale-98"
          >
            Return to Collections
          </Link>
        </div>
      ) : (
        <div className="space-y-8">
          {/* Checkout Progress (Subtle) */}
          <div className="flex items-center justify-between py-2 text-primary/60 border-b border-deep-maroon/5 mb-6">
            <span className="font-label-sm text-label-sm uppercase tracking-widest text-heritage-gold font-bold">Shipping</span>
            <span className="text-primary/20">/</span>
            <span className="font-label-sm text-label-sm uppercase tracking-widest">Payment</span>
            <span className="text-primary/20">/</span>
            <span className="font-label-sm text-label-sm uppercase tracking-widest">Confirm</span>
          </div>

          {/* 1. Shipping Address Section */}
          <section>
            <div className="flex justify-between items-end mb-4">
              <h2 className="font-headline-md text-headline-md text-primary">Shipping Address</h2>
              {!isEditingAddress && address ? (
                <button
                  type="button"
                  onClick={() => setIsEditingAddress(true)}
                  className="font-label-sm text-label-sm uppercase text-heritage-gold tracking-widest border-b border-heritage-gold pb-0.5 cursor-pointer"
                >
                  Change
                </button>
              ) : (
                address && (
                  <button
                    type="button"
                    onClick={() => setIsEditingAddress(false)}
                    className="font-label-sm text-label-sm uppercase text-heritage-gold tracking-widest border-b border-heritage-gold pb-0.5 cursor-pointer"
                  >
                    Cancel
                  </button>
                )
              )}
            </div>

            {isEditingAddress || !address ? (
              <div className="p-4 border border-deep-maroon/10 bg-ivory-cream space-y-4 text-xs">
                <div>
                  <label className="block text-[10px] uppercase tracking-widest text-primary/60 font-semibold mb-1">Customer Name</label>
                  <input 
                    required 
                    type="text" 
                    placeholder="e.g. Amara Singh" 
                    value={name} 
                    onChange={(e) => setName(e.target.value)} 
                    className="w-full border border-deep-maroon/10 bg-surface-container-lowest p-3 font-body-md placeholder-primary/30 focus:outline-none focus:border-heritage-gold transition-all text-primary text-xs" 
                  />
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <label className="block text-[10px] uppercase tracking-widest text-primary/60 font-semibold mb-1">Email Address</label>
                    <input 
                      required 
                      type="email" 
                      placeholder="e.g. amara@example.com" 
                      value={email} 
                      onChange={(e) => setEmail(e.target.value)} 
                      className="w-full border border-deep-maroon/10 bg-surface-container-lowest p-3 font-body-md placeholder-primary/30 focus:outline-none focus:border-heritage-gold transition-all text-primary text-xs" 
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase tracking-widest text-primary/60 font-semibold mb-1">Contact Number</label>
                    <input 
                      required 
                      type="tel" 
                      placeholder="e.g. 98450 12345" 
                      value={phone} 
                      onChange={(e) => setPhone(e.target.value)} 
                      className="w-full border border-deep-maroon/10 bg-surface-container-lowest p-3 font-body-md placeholder-primary/30 focus:outline-none focus:border-heritage-gold transition-all text-primary text-xs" 
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] uppercase tracking-widest text-primary/60 font-semibold mb-1">Physical Address</label>
                  <input 
                    required 
                    type="text" 
                    placeholder="Suite, Street, and Locality Address" 
                    value={address} 
                    onChange={(e) => setAddress(e.target.value)} 
                    className="w-full border border-deep-maroon/10 bg-surface-container-lowest p-3 font-body-md placeholder-primary/30 focus:outline-none focus:border-heritage-gold transition-all text-primary text-xs" 
                  />
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <label className="block text-[10px] uppercase tracking-widest text-primary/60 font-semibold mb-1">City</label>
                    <input 
                      required 
                      type="text" 
                      placeholder="e.g. Hyderabad" 
                      value={city} 
                      onChange={(e) => setCity(e.target.value)} 
                      className="w-full border border-deep-maroon/10 bg-surface-container-lowest p-3 font-body-md placeholder-primary/30 focus:outline-none focus:border-heritage-gold transition-all text-primary text-xs" 
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase tracking-widest text-primary/60 font-semibold mb-1">PIN Code</label>
                    <input 
                      required 
                      type="text" 
                      inputMode="numeric"
                      pattern="[0-9]{6}"
                      maxLength={6}
                      placeholder="e.g. 500033" 
                      value={pin} 
                      onChange={(e) => setPin(e.target.value)} 
                      className="w-full border border-deep-maroon/10 bg-surface-container-lowest p-3 font-body-md placeholder-primary/30 focus:outline-none focus:border-heritage-gold transition-all text-primary text-xs" 
                    />
                  </div>
                </div>
                {address && (
                  <button
                    type="button"
                    onClick={() => setIsEditingAddress(false)}
                    className="w-full py-3.5 bg-deep-maroon hover:bg-heritage-gold text-ivory-cream uppercase tracking-widest font-semibold transition-colors cursor-pointer"
                  >
                    Save Address
                  </button>
                )}
              </div>
            ) : (
              /* Saved Address Card */
              <label className="block relative p-4 border border-deep-maroon/10 bg-ivory-cream cursor-pointer transition-all hover:border-heritage-gold">
                <input checked readOnly className="absolute top-4 right-4 text-heritage-gold focus:ring-heritage-gold border border-deep-maroon/10" name="address" type="radio" />
                <div className="pr-8">
                  <p className="font-headline-md text-title-lg text-primary mb-1">{name}</p>
                  <p className="text-on-surface-variant/85 font-body-md leading-relaxed">
                    {address}<br />
                    {city}, {pin}<br />
                    India
                  </p>
                  <p className="mt-2 text-primary font-body-md font-medium">{phone}</p>
                </div>
                <div className="mt-4 flex gap-4">
                  <span className="px-2 py-1 bg-muted-teal/10 text-muted-teal text-[10px] uppercase tracking-wider font-bold">Home</span>
                  <span className="px-2 py-1 bg-soft-rose/10 text-soft-rose text-[10px] uppercase tracking-wider font-bold">Default</span>
                </div>
              </label>
            )}
          </section>

          {/* 2. Delivery Method Section */}
          <section className="pt-4">
            <h2 className="font-headline-md text-headline-md text-primary mb-4">Delivery Method</h2>
            <div className="p-4 border border-deep-maroon/10 bg-ivory-cream flex justify-between items-center">
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-primary">local_shipping</span>
                <div>
                  <p className="font-title-lg text-body-lg text-primary font-bold">Standard Delivery</p>
                  <p className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-widest">3-5 Business Days</p>
                </div>
              </div>
              <p className="font-title-lg text-title-lg text-primary">₹150</p>
            </div>
          </section>

          {/* 3. Payment Method Section */}
          <section className="pt-4">
            <h2 className="font-headline-md text-headline-md text-primary mb-4">Payment Method</h2>
            <div className="space-y-3">
              {/* UPI Option */}
              <div className="relative">
                <input 
                  checked={paymentMethod === "upi"} 
                  onChange={() => setPaymentMethod("upi")}
                  className="hidden payment-radio" 
                  id="pay_upi" 
                  name="payment" 
                  type="radio" 
                />
                <label className="flex items-center justify-between p-4 border border-deep-maroon/10 bg-ivory-cream cursor-pointer transition-all" htmlFor="pay_upi">
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-primary">contactless</span>
                    <span className="font-title-lg text-body-lg text-primary font-medium">UPI (GPay / PhonePe)</span>
                  </div>
                  <span className="check-icon opacity-0 transition-opacity material-symbols-outlined text-heritage-gold">check_circle</span>
                </label>
              </div>
              {/* Cards Option */}
              <div className="relative">
                <input 
                  checked={paymentMethod === "card"} 
                  onChange={() => setPaymentMethod("card")}
                  className="hidden payment-radio" 
                  id="pay_card" 
                  name="payment" 
                  type="radio" 
                />
                <label className="flex items-center justify-between p-4 border border-deep-maroon/10 bg-ivory-cream cursor-pointer transition-all" htmlFor="pay_card">
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-primary">credit_card</span>
                    <span className="font-title-lg text-body-lg text-primary font-medium">Credit / Debit Card</span>
                  </div>
                  <span className="check-icon opacity-0 transition-opacity material-symbols-outlined text-heritage-gold">check_circle</span>
                </label>
              </div>
              {/* COD Option */}
              <div className="relative">
                <input 
                  checked={paymentMethod === "cod"} 
                  onChange={() => setPaymentMethod("cod")}
                  className="hidden payment-radio" 
                  id="pay_cod" 
                  name="payment" 
                  type="radio" 
                />
                <label className="flex items-center justify-between p-4 border border-deep-maroon/10 bg-ivory-cream cursor-pointer transition-all" htmlFor="pay_cod">
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-primary">payments</span>
                    <span className="font-title-lg text-body-lg text-primary font-medium">Cash on Delivery</span>
                  </div>
                  <span className="check-icon opacity-0 transition-opacity material-symbols-outlined text-heritage-gold">check_circle</span>
                </label>
              </div>
            </div>
            <div className="mt-4 flex items-center gap-2 px-2">
              <span className="material-symbols-outlined text-muted-teal text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>verified_user</span>
              <p className="font-label-sm text-[10px] text-muted-teal uppercase tracking-widest font-semibold">Payments secured by Razorpay</p>
            </div>
          </section>

          {/* Order Summary Toggle Section */}
          <section className="pt-8 pb-12">
            <div className="cursor-pointer border-t border-deep-maroon/10 pt-6" id="summary-toggle" onClick={() => setIsSummaryOpen(!isSummaryOpen)}>
              <div className="flex justify-between items-center">
                <h2 className="font-headline-md text-title-lg text-primary uppercase tracking-widest">Order Summary</h2>
                <span className={`material-symbols-outlined transition-transform duration-300 ${isSummaryOpen ? "rotate-180" : ""}`} id="summary-icon">expand_more</span>
              </div>
              <div className={`overflow-hidden transition-all duration-300 ease-in-out ${isSummaryOpen ? "max-h-[1000px] opacity-100 animate-fade-in" : "max-h-0 opacity-0"}`} id="summary-content">
                <div className="py-6 space-y-4">
                  {/* Item */}
                  {resolvedItems.map((item, idx) => (
                    <div key={`${item.productId}-${idx}`} className="flex gap-4">
                      <div className="w-16 h-20 bg-surface-container relative">
                        {item.image && (
                          <img alt={item.title} className="w-full h-full object-cover grayscale-[0.2]" src={item.image} />
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="font-title-lg text-body-md text-primary font-semibold">{item.title}</p>
                        <p className="text-label-sm text-soft-rose uppercase tracking-widest font-semibold">Size: {item.size} • Qty: {item.qty}</p>
                        <p className="text-primary font-medium mt-1">₹{item.price.toLocaleString("en-IN")}</p>
                      </div>
                    </div>
                  ))}

                  {/* Promo Code input inside Accordion */}
                  <div className="pt-4 border-t border-deep-maroon/5 space-y-3">
                    <label className="block font-body-md text-[10px] uppercase tracking-widest text-primary/60 font-semibold">
                      Have a Promo Code?
                    </label>
                    
                    {!appliedCoupon ? (
                      <div className="flex gap-2">
                        <input
                          type="text"
                          placeholder="e.g. WELCOME10"
                          value={couponInput}
                          onChange={(e) => setCouponInput(e.target.value)}
                          className="flex-1 border border-deep-maroon/10 bg-surface-container-lowest px-3 py-2.5 font-body-md text-xs tracking-wider placeholder-primary/30 uppercase focus:outline-none focus:border-heritage-gold text-primary"
                        />
                        <button
                          type="button"
                          onClick={handleApplyCoupon}
                          className="px-5 py-2.5 bg-deep-maroon text-ivory-cream font-label-sm text-label-sm tracking-widest uppercase hover:bg-heritage-gold transition-colors cursor-pointer"
                        >
                          Apply
                        </button>
                      </div>
                    ) : (
                      <div className="flex justify-between items-center bg-ivory-cream border border-deep-maroon/10 px-4 py-2">
                        <div className="flex items-center gap-2">
                          <span className="material-symbols-outlined text-soft-rose text-sm">confirmation_number</span>
                          <span className="font-body-md text-xs font-semibold text-primary tracking-wider uppercase">
                            {appliedCoupon}
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={handleRemoveCoupon}
                          className="text-primary/60 hover:text-red-700 transition-colors p-1 cursor-pointer"
                          aria-label="Remove coupon"
                        >
                          <span className="material-symbols-outlined text-sm">delete</span>
                        </button>
                      </div>
                    )}

                    {couponError && <p className="font-body-md text-[11px] text-error italic">{couponError}</p>}
                    {couponSuccess && <p className="font-body-md text-[11px] text-muted-teal font-medium">{couponSuccess}</p>}
                  </div>

                  {/* Calculations */}
                  <div className="space-y-2 pt-4 border-t border-deep-maroon/5 font-label-sm text-label-sm uppercase tracking-widest">
                    <div className="flex justify-between text-on-surface-variant">
                      <span>Subtotal</span>
                      <span>₹{subtotal.toLocaleString("en-IN")}</span>
                    </div>
                    {discountAmount > 0 && (
                      <div className="flex justify-between text-muted-teal font-semibold">
                        <span>Discount</span>
                        <span>-₹{discountAmount.toLocaleString("en-IN")}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-on-surface-variant">
                      <span>Shipping</span>
                      <span>₹{shippingCharge.toLocaleString("en-IN")}</span>
                    </div>
                    <div className="flex justify-between text-muted-teal">
                      <span>GST (Included)</span>
                      <span>₹{Math.round((subtotal - discountAmount) * 0.12).toLocaleString("en-IN")}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Sticky Footer Order Button */}
          <div className="fixed bottom-0 left-0 w-full bg-surface/90 backdrop-blur-md p-margin-mobile border-t border-deep-maroon/5 z-50">
            <div className="max-w-md mx-auto flex items-center justify-between mb-4">
              <div>
                <p className="font-label-sm text-[10px] text-on-surface-variant uppercase tracking-widest">Total Payable</p>
                <p className="font-headline-md text-headline-md text-primary leading-none mt-1">₹{grandTotal.toLocaleString("en-IN")}</p>
              </div>
              <div className="text-right">
                <p className="font-label-sm text-[10px] text-soft-rose uppercase tracking-widest">Final amount</p>
              </div>
            </div>

            {errorMessage && (
              <div className="mb-4 p-3 bg-error-container border border-error/20 rounded text-error font-body-md text-xs tracking-wide text-center">
                {errorMessage}
              </div>
            )}

            <button 
              onClick={handleCheckoutSubmit}
              disabled={isProcessing || !address}
              className={`w-full py-5 bg-deep-maroon text-ivory-cream font-label-sm text-label-sm uppercase tracking-[0.2em] font-bold hover:bg-heritage-gold transition-colors duration-300 active:scale-95 flex items-center justify-center gap-2 ${(!address || isProcessing) ? "opacity-60 cursor-not-allowed" : "cursor-pointer"}`}
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-soft-rose" />
                  <span>Processing Order...</span>
                </>
              ) : !address ? (
                "Please Add Address"
              ) : (
                "Place Order"
              )}
            </button>
          </div>
        </div>
      )}
    </LuxuryTransition>

      {/* Premium Sandbox Payment Simulator Modal */}
      {showMockModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm transition-opacity duration-300 animate-fadeIn">
          <div className="bg-[#FAF7F2] border border-[#E7C2B8]/40 rounded-3xl p-8 max-w-md w-full mx-4 shadow-2xl relative overflow-hidden soft-grain text-[#3B2B28] flex flex-col gap-6 animate-scaleIn">
            
            {/* Elegant Background Accents */}
            <div className="absolute top-[-10%] right-[-10%] w-32 h-32 bg-[#F4D7CF] opacity-30 rounded-full filter blur-2xl pointer-events-none" />
            <div className="absolute bottom-[-10%] left-[-10%] w-32 h-32 bg-[#E7C2B8] opacity-30 rounded-full filter blur-2xl pointer-events-none" />

            <div className="text-center relative z-10 space-y-2">
              <span className="font-inter text-[9px] uppercase tracking-[0.3em] text-[#C98E87] font-semibold bg-[#FAF7F2] border border-[#E7C2B8]/40 px-3 py-1 rounded-full">
                Sandbox Simulator
              </span>
              <h3 className="font-cormorant text-2xl italic font-light text-[#3B2B28] pt-2">
                Secured Test Gateway
              </h3>
              <p className="font-inter text-[11px] text-[#8B6B61] tracking-wide font-light">
                Simulating secure Razorpay checkout integration
              </p>
            </div>

            <div className="w-full h-[1px] bg-[#E7C2B8]/30 relative z-10" />

            {/* Order & Payment Summary Details */}
            <div className="space-y-4 font-inter text-xs text-[#8B6B61] relative z-10">
              <div className="flex justify-between items-center bg-white/60 p-3.5 rounded-xl border border-[#E7C2B8]/20">
                <span className="font-light">Client Name</span>
                <span className="font-semibold text-[#3B2B28]">{name}</span>
              </div>
              <div className="flex justify-between items-center bg-white/60 p-3.5 rounded-xl border border-[#E7C2B8]/20">
                <span className="font-light">Acquisition Email</span>
                <span className="font-semibold text-[#3B2B28] truncate max-w-[180px]">{email}</span>
              </div>
              <div className="flex justify-between items-baseline bg-[#3B2B28]/5 p-4 rounded-xl border border-[#E7C2B8]/30">
                <span className="font-cormorant text-sm italic text-[#3B2B28]">Acquisition Total</span>
                <span className="font-cormorant text-xl font-semibold text-[#3B2B28]">
                  ₹{grandTotal.toLocaleString("en-IN")}
                </span>
              </div>
            </div>

            {/* Conditional Status Render */}
            <div className="relative z-10 flex flex-col items-center justify-center min-h-[80px]">
              {mockPaymentStatus === "idle" && (
                <p className="text-center font-inter text-[11px] text-[#8B6B61] leading-relaxed italic">
                  Select payment outcome below to verify database, email notifications, and stock updates.
                </p>
              )}
              {mockPaymentStatus === "processing" && (
                <div className="flex flex-col items-center gap-3">
                  <Loader2 className="w-7 h-7 animate-spin text-[#C98E87]" />
                  <p className="font-cormorant text-sm italic text-[#3B2B28] animate-pulse">
                    Processing secure acquisition...
                  </p>
                </div>
              )}
              {mockPaymentStatus === "success" && (
                <div className="text-center text-emerald-700 font-inter text-xs font-medium space-y-1">
                  <p className="font-cormorant text-base italic">✓ Authorization Confirmed</p>
                  <p className="font-light text-[10px] text-emerald-600">Redirecting to success page...</p>
                </div>
              )}
              {mockPaymentStatus === "failure" && (
                <div className="text-center text-red-700 font-inter text-xs font-medium space-y-1">
                  <p className="font-cormorant text-base italic">✕ Transaction Declined</p>
                  <p className="font-light text-[10px] text-red-600">Reverting to checkout...</p>
                </div>
              )}
            </div>

            {/* Simulated payment outcome actions */}
            <div className="relative z-10 flex gap-3.5 pt-2">
              <button
                type="button"
                disabled={mockPaymentStatus !== "idle"}
                onClick={() => handleSimulatedPayment(true)}
                className="flex-1 py-3 bg-[#3B2B28] text-[#FAF7F2] rounded-xl font-cormorant text-[10px] uppercase tracking-widest font-semibold hover:bg-[#8B6B61] transition-all duration-300 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                Authorize
              </button>
              <button
                type="button"
                disabled={mockPaymentStatus !== "idle"}
                onClick={() => handleSimulatedPayment(false)}
                className="flex-1 py-3 border border-[#C98E87] text-[#3B2B28] rounded-xl font-cormorant text-[10px] uppercase tracking-widest font-semibold hover:bg-white hover:border-[#8B6B61] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                Decline
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default function CheckoutPage() {
  const router = useRouter();
  
  return (
    <PageTransition>
      <div className={`${libreCaslon.variable} ${hankenGrotesk.variable} min-h-screen bg-surface font-body-md text-body-md overflow-x-hidden pb-32`}>
        {/* TopAppBar */}
        <nav className="flex justify-between items-center px-margin-mobile h-16 w-full fixed top-0 z-50 bg-surface border-b border-deep-maroon/10">
          <button onClick={() => router.back()} className="cursor-pointer active:opacity-70 transition-opacity flex items-center">
            <span className="material-symbols-outlined text-primary">arrow_back</span>
          </button>
          <div className="font-headline-lg-mobile text-headline-lg-mobile tracking-widest uppercase text-primary text-center font-headline-lg">
            Manasvi
          </div>
          <Link href="/cart" className="cursor-pointer active:opacity-70 transition-opacity flex items-center">
            <span className="material-symbols-outlined text-primary">shopping_bag</span>
          </Link>
        </nav>

        <Suspense
          fallback={
            <div className="flex flex-col items-center justify-center p-12 text-primary min-h-[50vh] mt-20">
              <Loader2 className="w-6 h-6 animate-spin text-heritage-gold" />
              <p className="mt-4 font-headline-lg-mobile text-sm font-light">Loading checkout...</p>
            </div>
          }
        >
          <main className="mt-20 px-margin-mobile max-w-md mx-auto space-y-8">
            <CheckoutFormContent />
          </main>
        </Suspense>
      </div>
    </PageTransition>
  );
}
