import { NextRequest, NextResponse } from "next/server";
import { 
  deleteVariantImage, 
  updateVariantImage, 
  updateImageOrder, 
  deleteColorVariant,
  addVariantImage
} from "@/lib/db-products";
import { z } from "zod";

const variantActionSchema = z.object({
  action: z.enum(["delete-image", "replace-image", "reorder-images", "delete-variant", "add-image"]),
  variantId: z.string().optional(),
  imageId: z.string().optional(),
  newImageUrl: z.string().optional(),
  reorderedImages: z.array(
    z.object({
      id: z.string(),
      order: z.number().int()
    })
  ).optional(),
  image: z.object({
    id: z.string(),
    type: z.enum(["front", "back", "side", "closeup", "gallery"]),
    url: z.string().min(1)
  }).optional()
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validatedData = variantActionSchema.parse(body);

    const { action, variantId, imageId, newImageUrl, reorderedImages, image } = validatedData;

    switch (action) {
      case "delete-image": {
        if (!imageId) {
          return NextResponse.json({ success: false, message: "Missing imageId for deletion." }, { status: 400 });
        }
        const success = await deleteVariantImage(imageId);
        if (success) {
          return NextResponse.json({ success: true, message: "Image deleted successfully." });
        }
        return NextResponse.json({ success: false, message: "Image not found." }, { status: 404 });
      }

      case "replace-image": {
        if (!imageId || !newImageUrl) {
          return NextResponse.json({ success: false, message: "Missing imageId or newImageUrl for replacement." }, { status: 400 });
        }
        const success = await updateVariantImage(imageId, newImageUrl);
        if (success) {
          return NextResponse.json({ success: true, message: "Image replaced successfully." });
        }
        return NextResponse.json({ success: false, message: "Image not found." }, { status: 404 });
      }

      case "reorder-images": {
        if (!variantId || !reorderedImages) {
          return NextResponse.json({ success: false, message: "Missing variantId or reorderedImages list." }, { status: 400 });
        }
        const success = await updateImageOrder(variantId, reorderedImages);
        if (success) {
          return NextResponse.json({ success: true, message: "Image order updated successfully." });
        }
        return NextResponse.json({ success: false, message: "Variant not found." }, { status: 404 });
      }

      case "delete-variant": {
        if (!variantId) {
          return NextResponse.json({ success: false, message: "Missing variantId for deletion." }, { status: 400 });
        }
        const success = await deleteColorVariant(variantId);
        if (success) {
          return NextResponse.json({ success: true, message: "Color variant deleted successfully." });
        }
        return NextResponse.json({ success: false, message: "Color variant not found." }, { status: 404 });
      }

      case "add-image": {
        if (!variantId || !image) {
          return NextResponse.json({ success: false, message: "Missing variantId or image details." }, { status: 400 });
        }
        const success = await addVariantImage(variantId, image);
        if (success) {
          return NextResponse.json({ success: true, message: "Photo added successfully." });
        }
        return NextResponse.json({ success: false, message: "Variant not found." }, { status: 404 });
      }

      default:
        return NextResponse.json({ success: false, message: "Invalid action." }, { status: 400 });
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          success: false,
          message: "Validation failed.",
          errors: error.issues.map(err => ({
            field: err.path[0],
            message: err.message
          }))
        },
        { status: 400 }
      );
    }

    console.error("[admin-variants-api] POST error:", error);
    return NextResponse.json(
      { success: false, message: "Server error occurred during photo management action." },
      { status: 500 }
    );
  }
}
