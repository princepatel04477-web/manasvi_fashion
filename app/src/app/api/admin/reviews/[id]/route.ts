import { NextRequest, NextResponse } from "next/server";
import { approveReview, deleteReview } from "@/lib/db-reviews";
import { z } from "zod";

const reviewUpdateSchema = z.object({
  approved: z.boolean()
});

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function PUT(req: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const body = await req.json();
    const validatedData = reviewUpdateSchema.parse(body);

    const success = await approveReview(id, validatedData.approved);
    if (!success) {
      return NextResponse.json(
        { success: false, message: "Review not found." },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: `Review ${validatedData.approved ? "approved" : "disapproved"} successfully.`
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, message: "Invalid parameters.", errors: error.issues },
        { status: 400 }
      );
    }

    console.error("[api-admin-reviews-id] PUT error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to update review status." },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const success = await deleteReview(id);
    if (!success) {
      return NextResponse.json(
        { success: false, message: "Review not found." },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Review deleted successfully."
    });
  } catch (error) {
    console.error("[api-admin-reviews-id] DELETE error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to delete review." },
      { status: 500 }
    );
  }
}
