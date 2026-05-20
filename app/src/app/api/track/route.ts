import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({ status: "Packed and ready to ship" });
}
