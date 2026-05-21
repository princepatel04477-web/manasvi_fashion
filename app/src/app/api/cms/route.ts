import { NextResponse } from "next/server";
import { getCmsConfig } from "@/lib/db-cms";

export async function GET() {
  try {
    const config = await getCmsConfig();
    return NextResponse.json(config);
  } catch (error) {
    console.error("[cms-api] GET error:", error);
    return NextResponse.json(
      { error: "Failed to load homepage configuration" },
      { status: 500 }
    );
  }
}
export const dynamic = "force-dynamic";
