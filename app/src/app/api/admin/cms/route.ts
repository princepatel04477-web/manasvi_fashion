import { NextRequest, NextResponse } from "next/server";
import { saveCmsConfig } from "@/lib/db-cms";
import { z } from "zod";

const cmsSchema = z.object({
  heroBanner: z.string().url("Hero banner must be a valid URL or path."),
  heroTitle: z.string().min(1, "Hero title is required."),
  heroSubtitle: z.string().min(1, "Hero subtitle is required."),
  sectionTunicImage: z.string().min(1, "Tunic image path is required."),
  sectionTunicLink: z.string().min(1, "Tunic page link is required."),
  sectionTunicAlt: z.string().min(1, "Tunic accessibility text is required."),
  sectionKurtiImage: z.string().min(1, "Kurti image path is required."),
  sectionKurtiLink: z.string().min(1, "Kurti page link is required."),
  sectionKurtiAlt: z.string().min(1, "Kurti accessibility text is required.")
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validatedData = cmsSchema.parse(body);

    await saveCmsConfig(validatedData);

    return NextResponse.json({
      success: true,
      message: "Homepage CMS configurations synced successfully."
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          success: false,
          message: "Please correct the invalid fields.",
          errors: error.issues.map(err => ({
            field: err.path[0],
            message: err.message
          }))
        },
        { status: 400 }
      );
    }

    console.error("[admin-cms-api] Save error:", error);
    return NextResponse.json(
      { success: false, message: "Server failed to update CMS settings." },
      { status: 500 }
    );
  }
}
