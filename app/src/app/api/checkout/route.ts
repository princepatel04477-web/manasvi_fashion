import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json({ ok: true, orderId: `MN${Date.now().toString().slice(-8)}` });
}
