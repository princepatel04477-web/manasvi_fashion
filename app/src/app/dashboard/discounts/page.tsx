"use client";

import React, { useEffect, useState } from "react";
import { Plus, Ticket, Trash2, Calendar, ShieldCheck, IndianRupee, Layers } from "lucide-react";
import { Coupon } from "@/lib/db-coupons";

export default function DiscountCouponsPage() {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Coupon Form Fields
  const [code, setCode] = useState("");
  const [discountType, setDiscountType] = useState<"percentage" | "fixed">("percentage");
  const [discountValue, setDiscountValue] = useState<number | "">("");
  const [expiryDate, setExpiryDate] = useState("");
  const [usageLimit, setUsageLimit] = useState<number | "">("");
  const [minOrderValue, setMinOrderValue] = useState<number | "">("");

  // Submitting / action states
  const [submitting, setSubmitting] = useState(false);
  const [actioningCode, setActioningCode] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<Array<{ field: string; message: string }>>([]);

  async function fetchCoupons() {
    try {
      const res = await fetch("/api/admin/coupons");
      const data = await res.json();
      if (data.success && Array.isArray(data.coupons)) {
        setCoupons(data.coupons);
      } else {
        setError("Failed to parse coupon list.");
      }
    } catch (err) {
      setError("Failed to fetch coupons from server.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchCoupons();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function showSuccess(msg: string) {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(null), 4000);
  }

  // Handle active/inactive toggle
  async function handleToggleActive(couponCode: string, currentActive: boolean) {
    setActioningCode(couponCode);
    const targetState = !currentActive;
    try {
      const res = await fetch(`/api/admin/coupons/${couponCode}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ active: targetState })
      });
      const data = await res.json();
      if (data.success) {
        setCoupons(prev => prev.map(c => c.code === couponCode ? { ...c, active: targetState } : c));
        showSuccess(`Coupon ${couponCode} ${targetState ? "activated" : "deactivated"}.`);
      } else {
        alert(data.message || "Failed to toggle status.");
      }
    } catch (err) {
      alert("Network error. Please try again.");
    } finally {
      setActioningCode(null);
    }
  }

  // Handle Coupon delete
  async function handleDeleteCoupon(couponCode: string) {
    if (!confirm(`Are you sure you want to permanently delete coupon "${couponCode}"?`)) return;
    setActioningCode(couponCode);
    try {
      const res = await fetch(`/api/admin/coupons/${couponCode}`, {
        method: "DELETE"
      });
      const data = await res.json();
      if (data.success) {
        setCoupons(prev => prev.filter(c => c.code !== couponCode));
        showSuccess(`Coupon ${couponCode} deleted.`);
      } else {
        alert(data.message || "Failed to delete coupon.");
      }
    } catch (err) {
      alert("Network error deleting coupon.");
    } finally {
      setActioningCode(null);
    }
  }

  // Add Coupon form handler
  async function handleAddCoupon(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setValidationErrors([]);
    setError(null);

    const payload = {
      code: code.trim().toUpperCase(),
      discountType,
      discountValue: Number(discountValue),
      expiryDate,
      usageLimit: usageLimit ? Number(usageLimit) : null,
      minOrderValue: minOrderValue ? Number(minOrderValue) : null,
      active: true
    };

    try {
      const res = await fetch("/api/admin/coupons", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      
      if (data.success) {
        setCoupons(prev => [...prev, data.coupon]);
        showSuccess(`New coupon code "${payload.code}" published.`);
        
        // Reset form fields
        setCode("");
        setDiscountValue("");
        setExpiryDate("");
        setUsageLimit("");
        setMinOrderValue("");
      } else {
        if (data.errors) {
          setValidationErrors(data.errors);
        } else {
          setError(data.message || "Failed to create coupon.");
        }
      }
    } catch (err) {
      setError("Failed to create coupon. Server error.");
    } finally {
      setSubmitting(false);
    }
  }

  function getFieldError(fieldName: string) {
    return validationErrors.find(e => e.field === fieldName)?.message || null;
  }

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header section */}
      <div className="border-b border-[#d9a58f22] pb-6">
        <h1 className="font-[var(--font-bodoni)] text-3xl md:text-4xl text-[#2a1d19]">Boutique Promotions</h1>
        <p className="font-[var(--font-cormorant)] text-sm italic text-[#8b6b61] tracking-wider mt-1">
          Manage promotional coupon codes, percentage/fixed checkout discounts, and validation limits.
        </p>
      </div>

      {successMsg && (
        <div className="p-4 rounded-xl border border-green-200 bg-green-50 text-sm text-green-800 flex items-center gap-2">
          <ShieldCheck size={16} className="text-green-600" />
          {successMsg}
        </div>
      )}

      {error && (
        <div className="p-4 rounded-xl border border-red-200 bg-red-50 text-sm text-red-800">
          {error}
        </div>
      )}

      <div className="grid gap-6 md:grid-cols-3">
        {/* Add Coupon Form (Left 1 col) */}
        <div className="md:col-span-1">
          <div className="rounded-2xl border border-[#d9a58f22] bg-white p-6 space-y-4 sticky top-6 shadow-xs">
            <h3 className="font-serif text-lg text-[#2a1d19] border-b border-[#d9a58f11] pb-3 mb-2 flex items-center gap-2">
              <Plus size={16} className="text-[#6e2b38]" />
              Publish Promo Code
            </h3>

            <form onSubmit={handleAddCoupon} className="space-y-4">
              {/* Code */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#8b6b61] mb-1">
                  Coupon Code
                </label>
                <input
                  type="text"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  placeholder="WELCOME20"
                  className={`w-full rounded-xl border px-3.5 py-2 text-sm uppercase font-semibold text-[#2a1d19] focus:outline-none focus:border-[#6e2b38] ${
                    getFieldError("code") ? "border-red-500" : "border-[#d9a58f44]"
                  }`}
                  required
                />
                {getFieldError("code") && (
                  <p className="mt-1 text-[10px] text-red-600">{getFieldError("code")}</p>
                )}
              </div>

              {/* Type selector */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#8b6b61] mb-1">
                  Discount Method
                </label>
                <div className="flex bg-[#faf7f2] rounded-xl p-1 border border-[#d9a58f22]">
                  <button
                    type="button"
                    onClick={() => setDiscountType("percentage")}
                    className={`flex-1 px-3 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all ${
                      discountType === "percentage"
                        ? "bg-white text-[#6e2b38] shadow-xs"
                        : "text-[#5c4a44] hover:text-[#2a1d19]"
                    }`}
                  >
                    Percentage
                  </button>
                  <button
                    type="button"
                    onClick={() => setDiscountType("fixed")}
                    className={`flex-1 px-3 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all ${
                      discountType === "fixed"
                        ? "bg-white text-[#6e2b38] shadow-xs"
                        : "text-[#5c4a44] hover:text-[#2a1d19]"
                    }`}
                  >
                    Flat Rate
                  </button>
                </div>
              </div>

              {/* Discount Value */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#8b6b61] mb-1">
                  {discountType === "percentage" ? "Percentage Off (%)" : "Flat Discount (₹)"}
                </label>
                <input
                  type="number"
                  min="1"
                  max={discountType === "percentage" ? 100 : undefined}
                  value={discountValue}
                  onChange={(e) => setDiscountValue(e.target.value ? parseFloat(e.target.value) : "")}
                  placeholder={discountType === "percentage" ? "e.g., 20" : "e.g., 500"}
                  className={`w-full rounded-xl border px-3.5 py-2 text-sm text-[#2a1d19] focus:outline-none focus:border-[#6e2b38] ${
                    getFieldError("discountValue") ? "border-red-500" : "border-[#d9a58f44]"
                  }`}
                  required
                />
                {getFieldError("discountValue") && (
                  <p className="mt-1 text-[10px] text-red-600">{getFieldError("discountValue")}</p>
                )}
              </div>

              {/* Expiry Date */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#8b6b61] mb-1">
                  Expiration Date
                </label>
                <input
                  type="date"
                  value={expiryDate}
                  onChange={(e) => setExpiryDate(e.target.value)}
                  className={`w-full rounded-xl border px-3.5 py-2 text-xs text-[#2a1d19] focus:outline-none focus:border-[#6e2b38] ${
                    getFieldError("expiryDate") ? "border-red-500" : "border-[#d9a58f44]"
                  }`}
                  required
                />
              </div>

              {/* Min Order Value */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#8b6b61] mb-1">
                  Minimum Order (₹) <span className="text-[10px] text-stone-400 font-normal">(Optional)</span>
                </label>
                <input
                  type="number"
                  min="0"
                  value={minOrderValue}
                  onChange={(e) => setMinOrderValue(e.target.value ? parseFloat(e.target.value) : "")}
                  placeholder="e.g., 1999"
                  className="w-full rounded-xl border border-[#d9a58f44] px-3.5 py-2 text-sm text-[#2a1d19] focus:outline-none"
                />
              </div>

              {/* Usage Limit */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#8b6b61] mb-1">
                  Max Redemptions <span className="text-[10px] text-stone-400 font-normal">(Optional)</span>
                </label>
                <input
                  type="number"
                  min="1"
                  value={usageLimit}
                  onChange={(e) => setUsageLimit(e.target.value ? parseInt(e.target.value) : "")}
                  placeholder="e.g., 100"
                  className="w-full rounded-xl border border-[#d9a58f44] px-3.5 py-2 text-sm text-[#2a1d19] focus:outline-none"
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full rounded-xl bg-[#6e2b38] hover:bg-[#521e28] text-white py-3 text-xs font-semibold uppercase tracking-widest transition-all mt-2"
              >
                {submitting ? "Publishing Promo..." : "Publish Promo Code"}
              </button>
            </form>
          </div>
        </div>

        {/* Coupons List Table (Right 2 cols) */}
        <div className="md:col-span-2">
          {loading ? (
            <div className="flex h-64 items-center justify-center bg-white border border-[#d9a58f22] rounded-2xl">
              <div className="h-6 w-6 animate-spin rounded-full border-2 border-[#8b6b61] border-t-transparent"></div>
            </div>
          ) : coupons.length === 0 ? (
            <div className="text-center py-20 bg-white border border-[#d9a58f22] rounded-2xl">
              <Ticket size={48} className="mx-auto text-[#d9a58f66] mb-4" />
              <h3 className="font-serif text-lg text-[#2a1d19]">No coupon codes have been configured.</h3>
              <p className="text-sm text-[#8b6b61] mt-1">Publish coupon codes to incentivize buyers.</p>
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-[#d9a58f22] overflow-hidden shadow-xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-[#5c4a44]">
                  <thead>
                    <tr className="border-b border-[#d9a58f22] bg-[#faf7f2]/50 text-xs font-semibold uppercase tracking-widest text-[#8b6b61]">
                      <th className="py-3.5 px-5">Promo Code</th>
                      <th className="py-3.5 px-5">Discount Details</th>
                      <th className="py-3.5 px-5">Requirements</th>
                      <th className="py-3.5 px-5">Performance</th>
                      <th className="py-3.5 px-5">Status</th>
                      <th className="py-3.5 px-5 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#d9a58f11]">
                    {coupons.map((coupon) => {
                      const isActioning = actioningCode === coupon.code;
                      const hasExpired = new Date(coupon.expiryDate) < new Date();
                      
                      return (
                        <tr key={coupon.code} className="hover:bg-[#faf7f2]/40 transition-colors duration-150">
                          {/* Code */}
                          <td className="py-4 px-5">
                            <span className="font-mono font-bold text-xs bg-[#faf7f2] border border-[#d9a58f33] px-2.5 py-1 rounded text-[#6e2b38]">
                              {coupon.code}
                            </span>
                            {hasExpired && (
                              <span className="text-[9px] bg-red-50 text-red-600 border border-red-200 px-1.5 py-0.5 rounded ml-1.5 font-bold uppercase tracking-wider">
                                Expired
                              </span>
                            )}
                          </td>

                          {/* Discount value */}
                          <td className="py-4 px-5">
                            <span className="font-medium text-[#2a1d19] font-serif text-base">
                              {coupon.discountType === "percentage" 
                                ? `${coupon.discountValue}% Off` 
                                : `₹${coupon.discountValue} Off`}
                            </span>
                          </td>

                          {/* Minimum requirements */}
                          <td className="py-4 px-5 text-xs">
                            {coupon.minOrderValue ? (
                              <span>Min order: ₹{coupon.minOrderValue}</span>
                            ) : (
                              <span className="text-stone-400 italic">None</span>
                            )}
                            <div className="flex items-center gap-1 text-[10px] text-[#8b6b61] mt-0.5">
                              <Calendar size={11} />
                              Exp: {new Date(coupon.expiryDate).toLocaleDateString("en-IN", { month: "short", day: "2-digit" })}
                            </div>
                          </td>

                          {/* Redemptions count */}
                          <td className="py-4 px-5 text-xs">
                            <div className="font-semibold text-[#2a1d19]">
                              {coupon.usedCount} used
                            </div>
                            {coupon.usageLimit ? (
                              <div className="text-[10px] text-[#8b6b61]">
                                Limit: {coupon.usageLimit}
                              </div>
                            ) : (
                              <div className="text-[10px] text-stone-400 italic">
                                Unlimited
                              </div>
                            )}
                          </td>

                          {/* Toggle Switch */}
                          <td className="py-4 px-5">
                            <label className="relative inline-flex items-center cursor-pointer">
                              <input
                                type="checkbox"
                                checked={coupon.active}
                                disabled={isActioning || hasExpired}
                                onChange={() => handleToggleActive(coupon.code, coupon.active)}
                                className="sr-only peer"
                              />
                              <div className="w-9 h-5 bg-stone-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#6e2b38] peer-disabled:opacity-40"></div>
                            </label>
                          </td>

                          {/* Actions */}
                          <td className="py-4 px-5 text-right">
                            <button
                              onClick={() => handleDeleteCoupon(coupon.code)}
                              disabled={isActioning}
                              className="rounded-lg p-2 text-red-600 hover:bg-red-50 transition-colors"
                              title="Delete Coupon"
                            >
                              <Trash2 size={15} />
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
