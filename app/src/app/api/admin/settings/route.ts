import { NextRequest, NextResponse } from "next/server";
import { readJson, writeJson } from "@/lib/db-helper";
import { z } from "zod";

export interface AppSettings {
  storefrontOpen: boolean;
  freeShippingThreshold: number;
  gstRate: number;
  contactEmail: string;
  supportPhone: string;
  announcementText: string;
}

const SETTINGS_FILE = "settings-db.json";

const defaultSettings: AppSettings = {
  storefrontOpen: true,
  freeShippingThreshold: 2999,
  gstRate: 5,
  contactEmail: "care@manasvifashion.com",
  supportPhone: "+91 99887 76655",
  announcementText: "Festive Collection Live — Free Shipping Above ₹2,999!"
};

const settingsSchema = z.object({
  storefrontOpen: z.boolean(),
  freeShippingThreshold: z.number().nonnegative(),
  gstRate: z.number().nonnegative().max(100),
  contactEmail: z.string().email(),
  supportPhone: z.string().min(8),
  announcementText: z.string()
});

export async function GET() {
  try {
    const settings = await readJson<AppSettings>(SETTINGS_FILE, defaultSettings);
    return NextResponse.json({ success: true, settings });
  } catch (error) {
    console.error("[api-admin-settings] GET error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch settings." },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validatedData = settingsSchema.parse(body);

    await writeJson<AppSettings>(SETTINGS_FILE, validatedData);

    return NextResponse.json({
      success: true,
      message: "Boutique global configuration saved.",
      settings: validatedData
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, message: "Invalid parameters.", errors: error.issues },
        { status: 400 }
      );
    }

    console.error("[api-admin-settings] POST error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to save settings." },
      { status: 500 }
    );
  }
}

export const dynamic = "force-dynamic";
