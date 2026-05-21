import { NextRequest, NextResponse } from "next/server";
import { getOrders } from "@/lib/db-orders";

export async function GET() {
  try {
    const orders = await getOrders();
    return NextResponse.json({ success: true, orders });
  } catch (error) {
    console.error("[api-admin-orders] GET error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch orders." },
      { status: 500 }
    );
  }
}

export const dynamic = "force-dynamic";
