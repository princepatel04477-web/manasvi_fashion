import { NextRequest, NextResponse } from "next/server";
import { updateProduct } from "@/lib/db-products";

export async function POST(req: NextRequest) {
  try {
    const { id, stock } = await req.json();

    if (!id || stock === undefined || stock === null) {
      return NextResponse.json({ error: "Missing product ID or stock count" }, { status: 400 });
    }

    const numericStock = parseInt(stock);
    if (isNaN(numericStock) || numericStock < 0) {
      return NextResponse.json({ error: "Invalid stock count" }, { status: 400 });
    }

    const updated = await updateProduct(id, { stock: numericStock });
    if (!updated) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, product: updated });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Failed to update inventory" }, { status: 500 });
  }
}
