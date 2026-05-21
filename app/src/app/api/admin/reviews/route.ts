import { NextRequest, NextResponse } from "next/server";
import { getReviews } from "@/lib/db-reviews";

export async function GET() {
  try {
    const reviews = await getReviews();
    return NextResponse.json({ success: true, reviews });
  } catch (error) {
    console.error("[api-admin-reviews] GET error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch reviews." },
      { status: 500 }
    );
  }
}

export const dynamic = "force-dynamic";
