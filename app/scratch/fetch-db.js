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
  const { data, error } = await supabase.from('products').select('*');
  if (error) {
    console.error("Error fetching products:", error);
    return;
  }
  console.log(`Fetched ${data.length} products:`);
  data.forEach(p => {
    console.log(`ID: ${p.id} | Title: ${p.title} | Category: ${p.category} | Product Type: ${p.product_type} | Subcategory: ${p.subcategory}`);
  });
}

main();
