import { NextRequest, NextResponse } from "next/server";
import { registerUser, getUserByEmail } from "@/lib/db-users";
import { z } from "zod";

const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),
  email: z.string().email("Please enter a valid email address."),
  password: z.string().min(6, "Password must be at least 6 characters."),
  phone: z.string().optional().or(z.literal("")),
  shippingAddress: z.string().optional().or(z.literal("")),
  city: z.string().optional().or(z.literal("")),
  postalCode: z.string().optional().or(z.literal(""))
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validatedData = registerSchema.parse(body);

    // Check if user already exists
    const existingUser = await getUserByEmail(validatedData.email);
    if (existingUser) {
      return NextResponse.json(
        { success: false, message: "An account with this email address already exists." },
        { status: 400 }
      );
    }

    // Register user
    const user = await registerUser(
      validatedData.name,
      validatedData.email,
      validatedData.password,
      validatedData.phone,
      validatedData.shippingAddress,
      validatedData.city,
      validatedData.postalCode
    );

    return NextResponse.json({
      success: true,
      message: "Account registered successfully.",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });

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

    console.error("[register-api] Registration error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to register account. Please try again." },
      { status: 500 }
    );
  }
}
