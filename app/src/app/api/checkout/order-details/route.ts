import { NextRequest, NextResponse } from "next/server";
import { getOrders } from "@/lib/db-orders";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const orderId = searchParams.get("orderId");

    if (!orderId) {
      return NextResponse.json(
        { error: "Missing orderId parameter" },
        { status: 400 }
      );
    }

    const orders = await getOrders();
    const order = orders.find((o) => o.id === orderId);

    if (!order) {
      return NextResponse.json(
        { error: "Order not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, order });
  } catch (error) {
    console.error("[api-checkout-order-details] GET error:", error);
    const message = error instanceof Error ? error.message : "Failed to retrieve order details";
    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}

export const dynamic = "force-dynamic";
