import { NextRequest, NextResponse } from "next/server";
import { updateProduct, deleteProduct, getProductById } from "@/lib/db-products";
import { z } from "zod";

const colorVariantSchema = z.object({
  name: z.string().min(1),
  hex: z.string().regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/),
  image: z.string().min(1)
});

const productUpdateSchema = z.object({
  title: z.string().min(2).optional(),
  slug: z.string().min(2).regex(/^[a-z0-9-]+$/).optional(),
  description: z.string().min(10).optional(),
  category: z.enum(["kurtis", "dresses"]).optional(),
  productType: z.enum(["kurti", "tunic_top", "dress"]).optional(),
  subcategory: z.string().min(2).optional(),
  fabric: z.string().min(2).optional(),
  sleeveType: z.string().min(2).optional(),
  color: z.string().min(2).optional(),
  price: z.number().positive().optional(),
  compareAtPrice: z.number().positive().optional().nullable(),
  sizes: z.array(z.string()).min(1).optional(),
  images: z.array(z.string()).min(1).optional(),
  stock: z.number().int().nonnegative().optional(),
  isNew: z.boolean().optional(),
  colorVariants: z.array(colorVariantSchema).optional()
});

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function PUT(req: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const body = await req.json();

    // Find the product first
    const existing = await getProductById(id);
    if (!existing) {
      return NextResponse.json(
        { success: false, message: "Product not found." },
        { status: 404 }
      );
    }

    const validatedData = productUpdateSchema.parse(body);

    const updated = await updateProduct(id, {
      ...validatedData,
      compareAtPrice: validatedData.compareAtPrice === null ? undefined : validatedData.compareAtPrice
    });

    return NextResponse.json({
      success: true,
      message: "Product updated successfully.",
      product: updated
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

    console.error("[admin-products-id-api] PUT error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to update product. Server error." },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;

    const existing = await getProductById(id);
    if (!existing) {
      return NextResponse.json(
        { success: false, message: "Product not found." },
        { status: 404 }
      );
    }

    const success = await deleteProduct(id);
    if (success) {
      return NextResponse.json({
        success: true,
        message: "Product deleted successfully."
      });
    }

    return NextResponse.json(
      { success: false, message: "Failed to delete product." },
      { status: 500 }
    );
  } catch (error) {
    console.error("[admin-products-id-api] DELETE error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to delete product. Server error." },
      { status: 500 }
    );
  }
}
