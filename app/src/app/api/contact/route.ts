import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { supabase } from "@/lib/supabase";
import fs from "fs/promises";
import path from "path";

// Define input validation schema
const contactSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),
  email: z.string().email("Please provide a valid email address."),
  phone: z.string().optional(),
  inquiryType: z.enum(["styling", "order", "collaboration", "general"]),
  message: z.string().min(10, "Message must be at least 10 characters."),
});

// JSON fallback file path
const FALLBACK_FILE_PATH = path.join(process.cwd(), "src", "data", "submissions.json");

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    
    // Validate request body
    const validatedData = contactSchema.parse(body);

    let savedToDb = false;
    let savedToFallback = false;
    let submissionId = `SUB-${Date.now()}`;
    let dbError = "";

    // 1. Attempt to save to Supabase (PostgreSQL)
    if (supabase) {
      try {
        const { data, error } = await supabase
          .from("contact_submissions")
          .insert([
            {
              name: validatedData.name,
              email: validatedData.email,
              phone: validatedData.phone || null,
              inquiry_type: validatedData.inquiryType,
              message: validatedData.message,
            }
          ])
          .select();

        if (error) {
          throw new Error(error.message);
        }

        if (data && data.length > 0) {
          submissionId = String(data[0].id);
          savedToDb = true;
          console.log(`[Database] Submission successfully saved to Supabase with ID: ${submissionId}`);
        }
      } catch (err: unknown) {
        dbError = err instanceof Error ? err.message : String(err);
        console.warn("[Database] Supabase connection failed or errored. Falling back to local JSON file...");
      }
    } else {
      dbError = "Supabase environment variables (URL/Key) are not configured";
      console.warn(`[Database] ${dbError}. Falling back to local JSON file...`);
    }

    // 2. Fallback: Save to local JSON file if not saved to Supabase
    if (!savedToDb) {
      try {
        let submissions = [];
        try {
          const fileData = await fs.readFile(FALLBACK_FILE_PATH, "utf-8");
          submissions = JSON.parse(fileData);
        } catch {
          // File doesn't exist yet, we will start a new array
        }

        const newSubmission = {
          id: submissionId,
          ...validatedData,
          createdAt: new Date().toISOString(),
          fallback: true,
        };

        submissions.push(newSubmission);
        
        // Ensure directory exists
        await fs.mkdir(path.dirname(FALLBACK_FILE_PATH), { recursive: true });
        await fs.writeFile(FALLBACK_FILE_PATH, JSON.stringify(submissions, null, 2), "utf-8");
        savedToFallback = true;
        console.log(`[Fallback] Submission saved successfully to: ${FALLBACK_FILE_PATH}`);
      } catch (fallbackErr) {
        console.error("[Fallback] Failed to save submission to local JSON file:", fallbackErr);
      }
    }

    // 3. Email Integration Mockups
    const inquiryTypeLabels: Record<string, string> = {
      styling: "Styling Inquiry / Appointment",
      order: "Order & Boutique Support",
      collaboration: "Creative Collaboration",
      general: "General Inquiry",
    };

    const typeLabel = inquiryTypeLabels[validatedData.inquiryType];

    // Log User Confirmation Email Mock
    console.log(`
========================================================================
[EMAIL SENT] TO: ${validatedData.email} (Confirmation Email)
SUBJECT: Thank you for connecting with Manasvi Fashion
------------------------------------------------------------------------
Dear ${validatedData.name},

Thank you for reaching out to Manasvi Fashion. We have received your styling or boutique inquiry. 

Here are the details we recorded:
- Inquiry Type: ${typeLabel}
- Contact Phone: ${validatedData.phone || "Not provided"}
- Message: "${validatedData.message}"

A member of our boutique concierge team will review your message and contact you within 24-48 business hours to arrange an appointment or answer your questions.

With warm regards,
Manasvi Fashion Concierge Team
========================================================================
`);

    // Log Admin Notification Email Mock
    console.log(`
========================================================================
[EMAIL SENT] TO: manasvifashion1515@gmail.com (New Concierge Notification)
SUBJECT: New Boutique Request - ${typeLabel} - ${validatedData.name}
------------------------------------------------------------------------
New submission received:
- Name: ${validatedData.name}
- Email: ${validatedData.email}
- Phone: ${validatedData.phone || "None"}
- Type: ${typeLabel}
- Message:
"${validatedData.message}"

Database Status: ${savedToDb ? "Saved to Supabase" : savedToFallback ? `Saved to Fallback JSON (DB Error: ${dbError})` : "SAVE FAILED"}
Submission Reference: ${submissionId}
========================================================================
`);

    return NextResponse.json({
      success: true,
      message: "Your message has been received with elegance. We will connect with you soon.",
      reference: submissionId,
      status: {
        database: savedToDb ? "supabase" : savedToFallback ? "json_fallback" : "failed",
        emailSent: true,
      }
    });

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          success: false,
          message: "Please correct the highlighted fields in the form.",
          errors: error.issues.map(err => ({
            field: err.path[0],
            message: err.message
          }))
        },
        { status: 400 }
      );
    }

    console.error("Contact API Error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "An elegant whisper in our server went unheard. Please try again in a few moments."
      },
      { status: 500 }
    );
  }
}
