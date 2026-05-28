import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: "./.env" });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "";

console.log("Raw Supabase URL:", supabaseUrl);
// Clean the URL (remove /rest/v1/ if present)
const cleanUrl = supabaseUrl.replace(/\/rest\/v1\/?$/, "");
console.log("Cleaned Supabase URL:", cleanUrl);

async function run() {
  const clientRaw = createClient(supabaseUrl, supabaseServiceKey || supabaseAnonKey);
  const clientClean = createClient(cleanUrl, supabaseServiceKey || supabaseAnonKey);

  console.log("\n--- Testing Raw URL client ---");
  try {
    const { data, error } = await clientRaw.from("products").select("id").limit(1);
    if (error) console.log("Raw URL Error:", error.message);
    else console.log("Raw URL Success! Data:", data);
  } catch (err) {
    console.error("Raw URL exception:", err);
  }

  console.log("\n--- Testing Clean URL client ---");
  try {
    const { data, error } = await clientClean.from("products").select("id").limit(1);
    if (error) console.log("Clean URL Error (might mean table doesn't exist):", error.message);
    else console.log("Clean URL Success! Data:", data);
  } catch (err) {
    console.error("Clean URL exception:", err);
  }
}

run();
