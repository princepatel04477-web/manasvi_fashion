import { NextRequest, NextResponse } from "next/server";
import { updateOrderStatus } from "@/lib/db-orders";
import { z } from "zod";

const orderUpdateSchema = z.object({
  status: z.enum(["pending", "processing", "shipped", "delivered", "returned", "cancelled"]),
  paymentStatus: z.enum(["paid", "unpaid", "failed", "refunded"]).optional()
});

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function PUT(req: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const body = await req.json();
    const validatedData = orderUpdateSchema.parse(body);

    const updated = await updateOrderStatus(id, validatedData.status, validatedData.paymentStatus);
    if (!updated) {
      return NextResponse.json(
        { success: false, message: "Order not found." },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Order status updated successfully.",
      order: updated
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, message: "Invalid status parameters.", errors: error.issues },
        { status: 400 }
      );
    }

    console.error("[api-admin-orders-id] PUT error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to update order status." },
      { status: 500 }
    );
  }
}
