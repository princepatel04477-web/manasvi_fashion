import { supabase } from "./supabase";
import { readJson, writeJson } from "./db-helper";

export interface Review {
  id: string;
  productId: string;
  productTitle: string;
  customerName: string;
  customerEmail: string;
  rating: number;
  comment: string;
  approved: boolean;
  createdAt: string;
}

const REVIEWS_FILE = "reviews-db.json";

const defaultReviews: Review[] = [
  {
    id: "rev-1",
    productId: "p1",
    productTitle: "Elara Signature Kurti",
    customerName: "Kareena Kapoor",
    customerEmail: "kareena@example.com",
    rating: 5,
    comment: "The fabric quality of this Kurti is absolutely outstanding. Fits perfectly and looks incredibly premium. Highly recommend!",
    approved: true,
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: "rev-2",
    productId: "p3",
    productTitle: "Myra Classic Dress",
    customerName: "Alia Bhatt",
    customerEmail: "alia@example.com",
    rating: 5,
    comment: "Stunning dress! The drape is gorgeous and the design feels very luxury editorial. Will purchase again.",
    approved: false,
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
  }
];

export async function getReviews(): Promise<Review[]> {
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from("reviews")
        .select("*")
        .order("created_at", { ascending: false });

      if (!error && data) {
        interface DbReviewRow {
          id: string | number;
          product_id: string;
          product_title: string;
          customer_name: string;
          customer_email: string;
          rating: number;
          comment: string;
          approved: boolean;
          created_at: string;
          createdAt?: string;
        }
        return (data as unknown as DbReviewRow[]).map((item) => ({
          id: String(item.id),
          productId: item.product_id,
          productTitle: item.product_title,
          customerName: item.customer_name,
          customerEmail: item.customer_email,
          rating: Number(item.rating),
          comment: item.comment,
          approved: !!item.approved,
          createdAt: item.created_at || item.createdAt
        })) as Review[];
      }
      console.warn("[db-reviews] Supabase select failed:", error?.message);
    } catch (err) {
      console.warn("[db-reviews] Supabase get error:", err);
    }
  }

  return readJson<Review[]>(REVIEWS_FILE, defaultReviews);
}

export async function createReview(review: Omit<Review, "id" | "createdAt">): Promise<Review> {
  const newReview: Review = {
    ...review,
    id: `rev-${Date.now()}`,
    createdAt: new Date().toISOString()
  };

  if (supabase) {
    try {
      const { error } = await supabase
        .from("reviews")
        .insert([
          {
            id: newReview.id,
            product_id: newReview.productId,
            product_title: newReview.productTitle,
            customer_name: newReview.customerName,
            customer_email: newReview.customerEmail,
            rating: newReview.rating,
            comment: newReview.comment,
            approved: newReview.approved
          }
        ]);

      if (!error) {
        console.log("[db-reviews] Review created in Supabase:", newReview.id);
        return newReview;
      }
      console.warn("[db-reviews] Supabase insert failed:", error.message);
    } catch (err) {
      console.warn("[db-reviews] Supabase create error:", err);
    }
  }

  const all = await readJson<Review[]>(REVIEWS_FILE, defaultReviews);
  all.unshift(newReview);
  await writeJson<Review[]>(REVIEWS_FILE, all);
  return newReview;
}

export async function approveReview(id: string, approved: boolean): Promise<boolean> {
  if (supabase) {
    try {
      const { error } = await supabase
        .from("reviews")
        .update({ approved })
        .eq("id", id);

      if (!error) {
        console.log("[db-reviews] Review approval status updated in Supabase:", id);
      } else {
        console.warn("[db-reviews] Supabase update status failed:", error.message);
      }
    } catch (err) {
      console.warn("[db-reviews] Supabase update approval error:", err);
    }
  }

  const all = await readJson<Review[]>(REVIEWS_FILE, defaultReviews);
  const index = all.findIndex((r) => r.id === id);
  if (index === -1) return false;

  all[index].approved = approved;
  await writeJson<Review[]>(REVIEWS_FILE, all);
  return true;
}

export async function deleteReview(id: string): Promise<boolean> {
  if (supabase) {
    try {
      const { error } = await supabase
        .from("reviews")
        .delete()
        .eq("id", id);

      if (!error) {
        console.log("[db-reviews] Review deleted from Supabase:", id);
      } else {
        console.warn("[db-reviews] Supabase delete failed:", error.message);
      }
    } catch (err) {
      console.warn("[db-reviews] Supabase delete error:", err);
    }
  }

  const all = await readJson<Review[]>(REVIEWS_FILE, defaultReviews);
  const filtered = all.filter((r) => r.id !== id);
  if (filtered.length < all.length) {
    await writeJson<Review[]>(REVIEWS_FILE, filtered);
    return true;
  }
  return false;
}
