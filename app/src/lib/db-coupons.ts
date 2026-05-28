import { supabaseAdmin } from "./supabase";
import { readJson, writeJson } from "./db-helper";

export interface Coupon {
  code: string;
  discountType: "percentage" | "fixed";
  discountValue: number;
  expiryDate: string;
  usageLimit?: number;
  usedCount: number;
  minOrderValue?: number;
  active: boolean;
}

const COUPONS_FILE = "coupons-db.json";

const defaultCoupons: Coupon[] = [
  {
    code: "WELCOME10",
    discountType: "percentage",
    discountValue: 10,
    expiryDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString(), // 90 days from now
    usageLimit: 500,
    usedCount: 124,
    minOrderValue: 1999,
    active: true
  },
  {
    code: "FESTIVE500",
    discountType: "fixed",
    discountValue: 500,
    expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days from now
    usageLimit: 200,
    usedCount: 45,
    minOrderValue: 4999,
    active: true
  }
];

export async function getCoupons(): Promise<Coupon[]> {
  if (supabaseAdmin) {
    try {
      const { data, error } = await supabaseAdmin
        .from("coupons")
        .select("*")
        .order("code", { ascending: true });

      if (!error && data) {
        interface DbCouponRow {
          code: string;
          discount_type: "percentage" | "fixed";
          discount_value: number;
          expiry_date: string;
          usage_limit?: number;
          used_count: number;
          min_order_value?: number;
          active: boolean;
        }
        return (data as unknown as DbCouponRow[]).map((item) => ({
          code: item.code,
          discountType: item.discount_type,
          discountValue: Number(item.discount_value),
          expiryDate: item.expiry_date,
          usageLimit: item.usage_limit || undefined,
          usedCount: Number(item.used_count || 0),
          minOrderValue: item.min_order_value || undefined,
          active: !!item.active
        })) as Coupon[];
      }
      console.warn("[db-coupons] Supabase select failed:", error?.message);
    } catch (err) {
      console.warn("[db-coupons] Supabase get error:", err);
    }
  }

  return readJson<Coupon[]>(COUPONS_FILE, defaultCoupons);
}

export async function createCoupon(coupon: Coupon): Promise<Coupon> {
  if (supabaseAdmin) {
    try {
      const { error } = await supabaseAdmin
        .from("coupons")
        .insert([
          {
            code: coupon.code,
            discount_type: coupon.discountType,
            discount_value: coupon.discountValue,
            expiry_date: coupon.expiryDate,
            usage_limit: coupon.usageLimit || null,
            used_count: coupon.usedCount,
            min_order_value: coupon.minOrderValue || null,
            active: coupon.active
          }
        ]);

      if (!error) {
        console.log("[db-coupons] Coupon created in Supabase:", coupon.code);
        return coupon;
      }
      console.warn("[db-coupons] Supabase insert failed:", error.message);
    } catch (err) {
      console.warn("[db-coupons] Supabase create error:", err);
    }
  }

  const all = await readJson<Coupon[]>(COUPONS_FILE, defaultCoupons);
  all.push(coupon);
  await writeJson<Coupon[]>(COUPONS_FILE, all);
  return coupon;
}

export async function toggleCouponActive(code: string, active: boolean): Promise<boolean> {
  if (supabaseAdmin) {
    try {
      const { error } = await supabaseAdmin
        .from("coupons")
        .update({ active })
        .eq("code", code);

      if (!error) {
        console.log("[db-coupons] Coupon active toggled in Supabase:", code);
      } else {
        console.warn("[db-coupons] Supabase toggle failed:", error.message);
      }
    } catch (err) {
      console.warn("[db-coupons] Supabase toggle error:", err);
    }
  }

  const all = await readJson<Coupon[]>(COUPONS_FILE, defaultCoupons);
  const index = all.findIndex((c) => c.code === code);
  if (index === -1) return false;

  all[index].active = active;
  await writeJson<Coupon[]>(COUPONS_FILE, all);
  return true;
}

export async function deleteCoupon(code: string): Promise<boolean> {
  if (supabaseAdmin) {
    try {
      const { error } = await supabaseAdmin
        .from("coupons")
        .delete()
        .eq("code", code);

      if (!error) {
        console.log("[db-coupons] Coupon deleted from Supabase:", code);
      } else {
        console.warn("[db-coupons] Supabase delete failed:", error.message);
      }
    } catch (err) {
      console.warn("[db-coupons] Supabase delete error:", err);
    }
  }

  const all = await readJson<Coupon[]>(COUPONS_FILE, defaultCoupons);
  const filtered = all.filter((c) => c.code !== code);
  if (filtered.length < all.length) {
    await writeJson<Coupon[]>(COUPONS_FILE, filtered);
    return true;
  }
  return false;
}
