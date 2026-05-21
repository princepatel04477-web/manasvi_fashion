import { NextResponse } from "next/server";
import { getProducts } from "@/lib/db-products";

export async function GET() {
  try {
    const products = await getProducts();
    return NextResponse.json(products);
  } catch (error) {
    console.error("[api-products] GET error:", error);
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 }
    );
  }
}
export const dynamic = "force-dynamic";
