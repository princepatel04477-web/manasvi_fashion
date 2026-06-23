const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error("Missing environment variables!");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function main() {
  const sql = `
    ALTER TABLE public.products
        ADD COLUMN IF NOT EXISTS length TEXT,
        ADD COLUMN IF NOT EXISTS fit_type TEXT,
        ADD COLUMN IF NOT EXISTS neck_type TEXT,
        ADD COLUMN IF NOT EXISTS occasion TEXT;
  `;
  
  // Try run_sql RPC
  console.log("Trying rpc('run_sql')...");
  const { data: data1, error: error1 } = await supabase.rpc('run_sql', { sql });
  if (error1) {
    console.error("rpc('run_sql') failed:", error1.message);
  } else {
    console.log("rpc('run_sql') succeeded!", data1);
    return;
  }

  // Try exec_sql RPC
  console.log("Trying rpc('exec_sql')...");
  const { data: data2, error: error2 } = await supabase.rpc('exec_sql', { sql });
  if (error2) {
    console.error("rpc('exec_sql') failed:", error2.message);
  } else {
    console.log("rpc('exec_sql') succeeded!", data2);
    return;
  }

  // Try execute_sql RPC
  console.log("Trying rpc('execute_sql')...");
  const { data: data3, error: error3 } = await supabase.rpc('execute_sql', { query: sql });
  if (error3) {
    console.error("rpc('execute_sql') failed:", error3.message);
  } else {
    console.log("rpc('execute_sql') succeeded!", data3);
    return;
  }
}

main();
