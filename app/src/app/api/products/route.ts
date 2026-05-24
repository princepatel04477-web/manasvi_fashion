import { NextResponse } from "next/server";
import { getProducts } from "@/lib/db-products";

export async function GET() {
  try {
    const products = await getProducts();
    console.log(`[api-products] Returning ${products.length} products (types: ${[...new Set(products.map((p) => p.productType))].join(", ")})`);
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
