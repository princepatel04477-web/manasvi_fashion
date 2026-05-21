"use client";

import { useEffect, useState } from "react";
import { MessageSquare, Check, X, Trash2, Star, User } from "lucide-react";
import { Review } from "@/lib/db-reviews";

export default function ReviewsModerationPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "pending" | "approved">("pending");
  const [actioningId, setActioningId] = useState<string | null>(null);
  const [notification, setNotification] = useState<{ type: "success" | "error"; text: string } | null>(null);

  async function fetchReviews() {
    try {
      const res = await fetch("/api/admin/reviews");
      const data = await res.json();
      if (data.success && Array.isArray(data.reviews)) {
        setReviews(data.reviews);
      } else {
        showNotification("error", "Failed to retrieve reviews registry.");
      }
    } catch (err) {
      showNotification("error", "Error connecting to servers.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchReviews();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function showNotification(type: "success" | "error", text: string) {
    setNotification({ type, text });
    setTimeout(() => setNotification(null), 4000);
  }

  async function handleToggleApproval(reviewId: string, currentApproved: boolean) {
    setActioningId(reviewId);
    const targetState = !currentApproved;
    try {
      const res = await fetch(`/api/admin/reviews/${reviewId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ approved: targetState })
      });
      const data = await res.json();
      if (data.success) {
        setReviews(prev => prev.map(r => r.id === reviewId ? { ...r, approved: targetState } : r));
        showNotification("success", `Review ${targetState ? "approved and made live" : "disapproved and hidden"}.`);
      } else {
        showNotification("error", data.message || "Failed to update review.");
      }
    } catch (err) {
      showNotification("error", "Network error. Try again.");
    } finally {
      setActioningId(null);
    }
  }

  async function handleDeleteReview(reviewId: string) {
    if (!confirm("Are you sure you want to permanently delete this customer review?")) return;
    setActioningId(reviewId);
    try {
      const res = await fetch(`/api/admin/reviews/${reviewId}`, {
        method: "DELETE"
      });
      const data = await res.json();
      if (data.success) {
        setReviews(prev => prev.filter(r => r.id !== reviewId));
        showNotification("success", "Review deleted successfully.");
      } else {
        showNotification("error", data.message || "Failed to delete review.");
      }
    } catch (err) {
      showNotification("error", "Server communication failure.");
    } finally {
      setActioningId(null);
    }
  }

  const filteredReviews = reviews.filter(review => {
    if (filter === "pending") return !review.approved;
    if (filter === "approved") return review.approved;
    return true;
  });

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header section */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-[#d9a58f22] pb-6">
        <div>
          <h1 className="font-[var(--font-bodoni)] text-3xl md:text-4xl text-[#2a1d19]">Reviews Moderation</h1>
          <p className="font-[var(--font-cormorant)] text-sm italic text-[#8b6b61] tracking-wider mt-1">
            Approve genuine buyer testimonials and moderate spam from product detail pages.
          </p>
        </div>
      </div>

      {notification && (
        <div className={`p-4 rounded-xl border text-sm transition-all duration-300 ${
          notification.type === "success" 
            ? "bg-green-50 border-green-200 text-green-800" 
            : "bg-red-50 border-red-200 text-red-800"
        }`}>
          {notification.text}
        </div>
      )}

      {/* Tabs / Filters bar */}
      <div className="flex items-center gap-3.5 bg-white p-4 rounded-2xl border border-[#d9a58f22]">
        <span className="text-xs font-bold uppercase tracking-wider text-[#8b6b61]">Filter:</span>
        <div className="flex bg-[#faf7f2] rounded-xl p-1 border border-[#d9a58f22]">
          {([
            { id: "pending", label: "Pending Approval" },
            { id: "approved", label: "Approved Live" },
            { id: "all", label: "All Reviews" }
          ] as const).map(tab => (
            <button
              key={tab.id}
              onClick={() => setFilter(tab.id)}
              className={`px-4 py-2 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all ${
                filter === tab.id
                  ? "bg-white text-[#6e2b38] shadow-xs"
                  : "text-[#5c4a44] hover:text-[#2a1d19]"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Reviews items board */}
      {loading ? (
        <div className="flex h-64 items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#8b6b61] border-t-transparent"></div>
        </div>
      ) : filteredReviews.length === 0 ? (
        <div className="text-center py-20 bg-white border border-[#d9a58f22] rounded-2xl">
          <MessageSquare size={48} className="mx-auto text-[#d9a58f66] mb-4" />
          <h3 className="font-serif text-lg text-[#2a1d19]">No reviews found.</h3>
          <p className="text-sm text-[#8b6b61] mt-1">
            {filter === "pending" ? "Great job! All customer reviews have been moderated." : "No buyer feedback matches the selection."}
          </p>
        </div>
      ) : (
        <div className="grid gap-5 md:grid-cols-2">
          {filteredReviews.map((review) => (
            <div 
              key={review.id} 
              className={`rounded-2xl border bg-white p-6 transition-all hover:shadow-md flex flex-col justify-between ${
                review.approved ? "border-[#d9a58f22]" : "border-amber-200 bg-amber-50/10"
              }`}
            >
              <div className="space-y-3">
                {/* Product Title Banner */}
                <div className="flex items-center justify-between border-b border-[#d9a58f11] pb-3">
                  <div className="min-w-0">
                    <span className="text-[10px] uppercase font-bold tracking-widest text-[#8b6b61]">For Product:</span>
                    <h4 className="font-serif text-base text-[#2a1d19] font-medium truncate mt-0.5">{review.productTitle}</h4>
                  </div>
                  <div className="flex items-center gap-0.5 text-amber-500 flex-shrink-0">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star 
                        key={i} 
                        size={12} 
                        fill={i < review.rating ? "currentColor" : "none"} 
                        className={i < review.rating ? "text-amber-500" : "text-stone-300"}
                      />
                    ))}
                  </div>
                </div>

                {/* Comment details */}
                <p className="text-xs text-[#5c4a44] italic leading-relaxed py-1">
                  &ldquo;{review.comment}&rdquo;
                </p>

                {/* Customer Details */}
                <div className="flex items-center gap-2.5 pt-2">
                  <div className="h-8 w-8 rounded-full bg-[#faf7f2] border border-[#d9a58f44] flex items-center justify-center text-[#8b6b61]">
                    <User size={14} />
                  </div>
                  <div className="text-[11px]">
                    <p className="font-semibold text-[#2a1d19]">{review.customerName}</p>
                    <p className="text-[#8b6b61] font-mono">{review.customerEmail}</p>
                  </div>
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex items-center justify-end gap-2 border-t border-[#d9a58f11] pt-4 mt-5">
                <button
                  onClick={() => handleDeleteReview(review.id)}
                  disabled={actioningId === review.id}
                  className="rounded-xl border border-red-100 hover:bg-red-50 p-2 text-red-600 transition-all flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider"
                  title="Delete review"
                >
                  <Trash2 size={13} />
                  Remove
                </button>
                
                {review.approved ? (
                  <button
                    onClick={() => handleToggleApproval(review.id, review.approved)}
                    disabled={actioningId === review.id}
                    className="rounded-xl border border-[#d9a58f44] hover:bg-stone-50 p-2 text-[#5c4a44] transition-all flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider"
                  >
                    <X size={13} />
                    Reject
                  </button>
                ) : (
                  <button
                    onClick={() => handleToggleApproval(review.id, review.approved)}
                    disabled={actioningId === review.id}
                    className="rounded-xl bg-green-600 hover:bg-green-700 p-2 text-white transition-all flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider px-3.5"
                  >
                    <Check size={13} />
                    Approve Live
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
