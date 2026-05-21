import { NextRequest, NextResponse } from "next/server";
import { getCoupons, createCoupon } from "@/lib/db-coupons";
import { z } from "zod";

const couponInputSchema = z.object({
  code: z.string().min(3, "Coupon code must be at least 3 characters.").toUpperCase().regex(/^[A-Z0-9_-]+$/, "Code must contain only uppercase alphanumeric characters, underscores, or hyphens."),
  discountType: z.enum(["percentage", "fixed"]),
  discountValue: z.number().positive("Discount value must be greater than 0."),
  expiryDate: z.string().min(1, "Expiry date is required."),
  usageLimit: z.number().int().positive().optional().nullable(),
  minOrderValue: z.number().nonnegative().optional().nullable(),
  active: z.boolean().optional().default(true)
});

export async function GET() {
  try {
    const coupons = await getCoupons();
    return NextResponse.json({ success: true, coupons });
  } catch (error) {
    console.error("[api-admin-coupons] GET error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch coupons." },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validatedData = couponInputSchema.parse(body);

    const coupons = await getCoupons();
    if (coupons.some(c => c.code === validatedData.code)) {
      return NextResponse.json(
        { success: false, message: "A coupon with this code already exists." },
        { status: 400 }
      );
    }

    const newCoupon = await createCoupon({
      code: validatedData.code,
      discountType: validatedData.discountType,
      discountValue: validatedData.discountValue,
      expiryDate: new Date(validatedData.expiryDate).toISOString(),
      usageLimit: validatedData.usageLimit || undefined,
      usedCount: 0,
      minOrderValue: validatedData.minOrderValue || undefined,
      active: validatedData.active
    });

    return NextResponse.json({
      success: true,
      message: "Coupon created successfully.",
      coupon: newCoupon
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          success: false,
          message: "Please correct the invalid fields.",
          errors: error.issues.map(err => ({
            field: err.path[0],
            message: err.message
          }))
        },
        { status: 400 }
      );
    }

    console.error("[api-admin-coupons] POST error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to create coupon. Server error." },
      { status: 500 }
    );
  }
}

export const dynamic = "force-dynamic";
