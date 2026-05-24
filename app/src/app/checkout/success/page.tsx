"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { formatINR } from "@/lib/store";
import { Check, Sparkles, ShoppingBag, ArrowRight, Printer, MapPin, Calendar } from "lucide-react";
import Link from "next/link";

interface OrderItem {
  productId: string;
  title: string;
  price: number;
  qty: number;
  size: string;
  image?: string;
  slug?: string;
}

interface Order {
  id: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  items: OrderItem[];
  totalAmount: number;
  status: string;
  paymentStatus: string;
  shippingAddress: string;
  createdAt: string;
}

function SuccessContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!orderId) {
      setTimeout(() => {
        setError("No order identifier provided.");
        setLoading(false);
      }, 0);
      return;
    }

    const fetchOrder = async () => {
      try {
        const res = await fetch(`/api/checkout/order-details?orderId=${orderId}`);
        const data = await res.json();
        
        if (res.ok && data.success) {
          setOrder(data.order);
        } else {
          setError(data.error || "Failed to load order details");
        }
      } catch (err) {
        console.error("Error loading order:", err);
        const errMsg = err instanceof Error ? err.message : "A connection error occurred while loading your receipt.";
        setError(errMsg);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId]);

  // Clean shipping address display (remove signature notes if they exist)
  const getCleanAddress = (addressString: string) => {
    if (!addressString) return "";
    return addressString.split("\n[Razorpay")[0];
  };

  const getDeliveryWindow = (createdAtStr?: string) => {
    const baseDate = createdAtStr ? new Date(createdAtStr) : new Date();
    const options: Intl.DateTimeFormatOptions = { month: "long", day: "numeric" };
    
    const minDelivery = new Date(baseDate);
    minDelivery.setDate(baseDate.getDate() + 3);
    
    const maxDelivery = new Date(baseDate);
    maxDelivery.setDate(baseDate.getDate() + 5);
    
    return `${minDelivery.toLocaleDateString("en-US", options)} – ${maxDelivery.toLocaleDateString("en-US", options)}, ${maxDelivery.getFullYear()}`;
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 min-h-[50vh]">
        <div className="relative mb-6">
          <div className="w-16 h-16 rounded-full border border-[#E7C2B8]/40 border-t-[#C98E87] animate-spin" />
          <Sparkles className="w-6 h-6 absolute inset-0 m-auto text-[#C98E87] animate-pulse" />
        </div>
        <p className="font-cormorant text-xl italic text-[#3B2B28]">Authenticating boutique checkout record...</p>
        <p className="font-inter text-[11px] text-[#8B6B61]/80 tracking-wider mt-2">Please wait while we compile your invoice</p>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="max-w-md mx-auto text-center py-16 px-4 bg-white/60 backdrop-blur-md rounded-3xl border border-[#E7C2B8]/30 warm-shadow">
        <div className="w-12 h-12 bg-amber-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-amber-200/40">
          <Sparkles className="w-6 h-6 text-[#C98E87]" />
        </div>
        <h2 className="font-cormorant text-2xl italic text-[#3B2B28] mb-3">Invoice Details Unresolved</h2>
        <p className="font-inter text-xs text-[#8B6B61] mb-6 leading-relaxed">
          {error || "We could not find matching order details, but your acquisition may still have processed successfully. Please check your email or contact support."}
        </p>
        <div className="flex flex-col gap-3">
          <Link
            href="/dashboard/orders"
            className="w-full py-3 bg-[#3B2B28] text-[#FAF7F2] rounded-xl font-cormorant text-[10px] tracking-[0.2em] uppercase hover:bg-[#8B6B61] transition-all duration-300"
          >
            Check Order History
          </Link>
          <Link
            href="/collections"
            className="w-full py-3 border border-[#E7C2B8]/60 text-[#3B2B28] hover:bg-[#FAF7F2] rounded-xl font-cormorant text-[10px] tracking-[0.2em] uppercase transition-all duration-300"
          >
            Return to Atelier
          </Link>
        </div>
      </div>
    );
  }

  // Calculate pricing values
  const total = order.totalAmount;
  // Fallback calculations for subtotal and discount display
  const itemsSubtotal = order.items.reduce((sum, item) => sum + item.price * item.qty, 0);
  const discount = Math.max(0, itemsSubtotal - total);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      
      {/* LEFT COLUMN: Success Badge, Shipping Address, Delivery window */}
      <div className="lg:col-span-7 space-y-6">
        
        {/* Cinematic Announcement Card */}
        <div className="rounded-2xl border border-[#E7C2B8]/40 bg-white/80 backdrop-blur-md p-8 sm:p-10 warm-shadow text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#F4D7CF]/10 rounded-full filter blur-2xl pointer-events-none" />
          
          {/* Animated luxury check icon */}
          <div className="w-16 h-16 bg-[#FAF7F2] rounded-full border border-[#E7C2B8]/50 flex items-center justify-center mx-auto mb-6 relative shadow-sm">
            <div className="absolute inset-0.5 rounded-full border border-[#C98E87]/30 animate-ping opacity-35" />
            <Check className="w-6 h-6 text-[#C98E87] stroke-[2px]" />
          </div>

          <span className="font-inter text-[10px] uppercase tracking-[0.35em] text-[#C98E87] font-semibold">Atelier Confirmed</span>
          <h2 className="font-cormorant text-3xl sm:text-4xl font-light italic text-[#3B2B28] mt-3 mb-4 leading-tight">
            Your Order Has Been Placed
          </h2>
          <div className="w-12 h-[1px] bg-[#C98E87]/60 mx-auto mb-5" />
          <p className="font-inter text-xs text-[#8B6B61] leading-relaxed max-w-md mx-auto font-light">
            Thank you for shopping with <strong className="font-semibold text-[#3B2B28]">MANASVI FASHION</strong>. We have registered your acquisition under Order ID <span className="font-medium text-[#3B2B28]">{order.id}</span>. A receipt has been dispatched to <span className="font-medium text-[#3B2B28]">{order.customerEmail}</span>.
          </p>
        </div>

        {/* Fulfillment Estimate & Shipping Info */}
        <div className="rounded-2xl border border-[#E7C2B8]/40 bg-white/80 backdrop-blur-md p-6 sm:p-8 warm-shadow space-y-6">
          <h3 className="font-cormorant text-xl font-light italic text-[#3B2B28]">
            Delivery & Delivery Details
          </h3>
          <div className="w-10 h-[1px] bg-[#C98E87]/60" />
          
          <div className="grid gap-6 md:grid-cols-2 font-inter text-xs text-[#8B6B61]">
            
            {/* Delivery Timeline */}
            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-xl bg-[#FAF7F2] border border-[#E7C2B8]/40 flex items-center justify-center text-[#C98E87] flex-shrink-0">
                <Calendar className="w-4 h-4 stroke-[1.5px]" />
              </div>
              <div className="space-y-1.5">
                <span className="text-[10px] uppercase tracking-widest text-[#8B6B61]/80 block">Estimated Arrival</span>
                <strong className="text-sm font-semibold text-[#3B2B28] font-cormorant italic block">
                  {getDeliveryWindow(order.createdAt)}
                </strong>
                <span className="text-[10px] text-[#8B6B61] font-light block leading-normal">Includes handcrafted preparation (2-4 days) & complimentary delivery.</span>
              </div>
            </div>

            {/* Shipping Address */}
            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-xl bg-[#FAF7F2] border border-[#E7C2B8]/40 flex items-center justify-center text-[#C98E87] flex-shrink-0">
                <MapPin className="w-4 h-4 stroke-[1.5px]" />
              </div>
              <div className="space-y-1.5 leading-relaxed font-light">
                <span className="text-[10px] uppercase tracking-widest text-[#8B6B61]/80 block">Acquisition Destination</span>
                <strong className="text-xs font-semibold text-[#3B2B28] block">{order.customerName}</strong>
                <span className="text-[#8B6B61]">{getCleanAddress(order.shippingAddress)}</span>
                {order.customerPhone && <span className="block mt-0.5 text-[#8B6B61]">Tel: {order.customerPhone}</span>}
              </div>
            </div>

          </div>
        </div>

        {/* Action CTAs */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Link
            href="/collections"
            className="flex-1 py-4 bg-[#3B2B28] text-[#FAF7F2] rounded-xl font-cormorant text-xs uppercase tracking-[0.25em] font-semibold text-center hover:bg-[#8B6B61] hover:translate-y-[-1px] transition-all duration-300 shadow-md hover:shadow-lg flex items-center justify-center gap-2"
          >
            <ShoppingBag className="w-3.5 h-3.5 text-[#C98E87]" />
            <span>Continue Shopping</span>
          </Link>
          <Link
            href="/dashboard/orders"
            className="flex-1 py-4 border border-[#E7C2B8] text-[#3B2B28] rounded-xl font-cormorant text-xs uppercase tracking-[0.25em] font-semibold text-center hover:bg-white hover:border-[#8B6B61] transition-all duration-300 flex items-center justify-center gap-2"
          >
            <span>Track Order Status</span>
            <ArrowRight className="w-3.5 h-3.5 text-[#C98E87]" />
          </Link>
        </div>

      </div>

      {/* RIGHT COLUMN: Order summary details card */}
      <div className="lg:col-span-5 space-y-6">
        
        {/* Receipt card */}
        <div className="rounded-2xl border border-[#E7C2B8]/40 bg-white/80 backdrop-blur-md p-6 warm-shadow space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="font-cormorant text-2xl font-light italic text-[#3B2B28]">
              Wardrobe Invoice
            </h3>
            <button 
              onClick={() => typeof window !== "undefined" && window.print()} 
              className="text-[#8B6B61] hover:text-[#3B2B28] transition-colors p-1.5 rounded-lg hover:bg-[#FAF7F2] cursor-pointer"
              aria-label="Print receipt"
            >
              <Printer className="w-4 h-4 stroke-[1.5px]" />
            </button>
          </div>
          <div className="w-12 h-[1px] bg-[#C98E87]/60" />

          {/* Items bought */}
          <div className="divide-y divide-[#E7C2B8]/20 max-h-[360px] overflow-y-auto pr-1">
            {order.items.map((item, idx) => {
              const titleParts = item.title.split(" - ");
              const displayTitle = titleParts[0];
              const displayColor = titleParts[1] || "Bespoke";

              return (
                <div key={`${item.productId}-${item.size}-${idx}`} className="py-3.5 flex gap-4 items-center">
                  <div className="w-12 h-16 relative rounded-lg overflow-hidden bg-[#FAF7F2] border border-[#E7C2B8]/20 flex-shrink-0">
                    {item.image ? (
                      <img
                        src={item.image}
                        alt={displayTitle}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-[#FAF7F2] flex items-center justify-center">
                        <ShoppingBag className="w-4 h-4 text-[#C98E87]/40" />
                      </div>
                    )}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <h4 className="font-cormorant text-sm font-semibold text-[#3B2B28] truncate leading-tight">
                      {displayTitle}
                    </h4>
                    <div className="font-inter text-[10px] text-[#8B6B61] mt-1 flex flex-wrap gap-x-2 font-light">
                      <span>Sz: <strong className="font-normal text-[#3B2B28]">{item.size}</strong></span>
                      <span>Col: <strong className="font-normal text-[#3B2B28]">{displayColor}</strong></span>
                      <span>Qty: <strong className="font-normal text-[#3B2B28]">{item.qty}</strong></span>
                    </div>
                  </div>

                  <div className="text-right flex-shrink-0">
                    <span className="font-cormorant text-sm font-medium text-[#3B2B28]">
                      {formatINR(item.price * item.qty)}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Pricing breakdowns */}
          <div className="pt-4 border-t border-[#E7C2B8]/30 space-y-2.5 font-inter text-xs text-[#8B6B61] tracking-wide">
            <div className="flex justify-between">
              <span className="font-light">Subtotal</span>
              <span className="text-[#3B2B28]">{formatINR(itemsSubtotal)}</span>
            </div>
            {discount > 0 && (
              <div className="flex justify-between text-emerald-600 font-medium">
                <span>Tailoring Deductions</span>
                <span>-{formatINR(discount)}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="font-light">Premium Delivery</span>
              <span className="text-emerald-600 font-light italic">Complimentary</span>
            </div>
            
            <div className="pt-4 border-t border-[#E7C2B8]/30 flex justify-between items-baseline">
              <span className="font-cormorant text-lg text-[#3B2B28] italic">Amount Paid</span>
              <span className="font-cormorant text-2xl font-medium text-[#3B2B28]">
                {formatINR(total)}
              </span>
            </div>
          </div>

          {/* Razorpay transaction tag */}
          <div className="p-4 rounded-xl bg-[#FAF7F2] border border-[#E7C2B8]/20 flex items-center justify-between text-[10px] font-inter text-[#8B6B61]">
            <span>Payment Method</span>
            <span className="font-medium text-[#3B2B28]">Razorpay Secured Gateway</span>
          </div>

        </div>

      </div>

    </div>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <main className="min-h-screen bg-[#FAF7F2] text-[#3B2B28] pt-24 sm:pt-28 md:pt-32 pb-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden soft-grain">
      {/* Dynamic luxury gradient filters */}
      <div className="absolute top-[8%] left-[-15%] w-[50vw] h-[50vw] rounded-full bg-[#F4D7CF] opacity-20 filter blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[20%] right-[-10%] w-[45vw] h-[45vw] rounded-full bg-[#E7C2B8] opacity-20 filter blur-[130px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Title Studio Header */}
        <div className="max-w-3xl mb-12 flex flex-col gap-3">
          <h1 className="font-cormorant text-4xl sm:text-5xl font-light italic leading-tight">
            Order Confirmation
          </h1>
          <div className="w-16 h-[1.5px] bg-[#C98E87]" />
        </div>

        {/* Suspense Wrapper to protect useSearchParams */}
        <Suspense
          fallback={
            <div className="flex flex-col items-center justify-center py-20 min-h-[50vh]">
              <div className="w-12 h-12 rounded-full border border-[#E7C2B8]/40 border-t-[#C98E87] animate-spin mb-4" />
              <p className="font-cormorant text-lg italic text-[#8B6B61]">Preparing signature atelier access...</p>
            </div>
          }
        >
          <SuccessContent />
        </Suspense>

      </div>
    </main>
  );
}
