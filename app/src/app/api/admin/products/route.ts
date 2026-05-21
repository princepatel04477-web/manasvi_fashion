import { NextRequest, NextResponse } from "next/server";
import { createProduct } from "@/lib/db-products";
import { z } from "zod";

const colorVariantSchema = z.object({
  name: z.string().min(1, "Color name is required."),
  hex: z.string().regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, "Valid hex color code is required."),
  image: z.string().min(1, "Variant image is required.")
});

const productInputSchema = z.object({
  title: z.string().min(2, "Title must be at least 2 characters."),
  slug: z.string().min(2, "Slug must be at least 2 characters.").regex(/^[a-z0-9-]+$/, "Slug must only contain lowercase alphanumeric characters and hyphens."),
  description: z.string().min(10, "Description must be at least 10 characters."),
  category: z.enum(["kurtis", "dresses"]),
  productType: z.enum(["kurti", "tunic_top", "dress"]),
  subcategory: z.string().min(2, "Subcategory is required."),
  fabric: z.string().min(2, "Fabric details are required."),
  sleeveType: z.string().min(2, "Sleeve type is required."),
  color: z.string().min(2, "Primary color name is required."),
  price: z.number().positive("Price must be greater than 0."),
  compareAtPrice: z.number().positive().optional(),
  sizes: z.array(z.string()).min(1, "At least one size must be selected."),
  images: z.array(z.string()).min(1, "At least one product image is required."),
  stock: z.number().int().nonnegative("Stock cannot be negative."),
  isNew: z.boolean().optional(),
  colorVariants: z.array(colorVariantSchema).optional()
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validatedData = productInputSchema.parse(body);

    const product = await createProduct({
      title: validatedData.title,
      slug: validatedData.slug,
      description: validatedData.description,
      category: validatedData.category,
      productType: validatedData.productType,
      subcategory: validatedData.subcategory,
      fabric: validatedData.fabric,
      sleeveType: validatedData.sleeveType,
      color: validatedData.color,
      price: validatedData.price,
      compareAtPrice: validatedData.compareAtPrice,
      sizes: validatedData.sizes,
      images: validatedData.images,
      stock: validatedData.stock,
      isNew: !!validatedData.isNew,
      colorVariants: validatedData.colorVariants || []
    });

    return NextResponse.json({
      success: true,
      message: "Product created successfully.",
      product
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

    console.error("[admin-products-api] POST error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to create product. Server error." },
      { status: 500 }
    );
  }
}
