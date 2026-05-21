import { NextRequest, NextResponse } from "next/server";
import { toggleCouponActive, deleteCoupon } from "@/lib/db-coupons";
import { z } from "zod";

const couponToggleSchema = z.object({
  active: z.boolean()
});

interface RouteParams {
  params: Promise<{ code: string }>;
}

export async function PUT(req: NextRequest, { params }: RouteParams) {
  try {
    const { code } = await params;
    const body = await req.json();
    const validatedData = couponToggleSchema.parse(body);

    const success = await toggleCouponActive(code.toUpperCase(), validatedData.active);
    if (!success) {
      return NextResponse.json(
        { success: false, message: "Coupon not found." },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: `Coupon ${validatedData.active ? "activated" : "deactivated"} successfully.`
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, message: "Invalid parameters.", errors: error.issues },
        { status: 400 }
      );
    }

    console.error("[api-admin-coupons-code] PUT error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to update coupon status." },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest, { params }: RouteParams) {
  try {
    const { code } = await params;
    const success = await deleteCoupon(code.toUpperCase());
    if (!success) {
      return NextResponse.json(
        { success: false, message: "Coupon not found." },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Coupon deleted successfully."
    });
  } catch (error) {
    console.error("[api-admin-coupons-code] DELETE error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to delete coupon." },
      { status: 500 }
    );
  }
}
