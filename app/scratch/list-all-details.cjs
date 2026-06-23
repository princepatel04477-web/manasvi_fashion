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
  const { data, error } = await supabase.from('products').select('*').order('created_at', { ascending: false });
  if (error) {
    console.error("Error fetching products:", error);
    return;
  }
  console.log(`Fetched all ${data.length} products:`);
  data.forEach((p, idx) => {
    console.log(`${idx + 1}. ID: ${p.id}`);
    console.log(`   Title: "${p.title}"`);
    console.log(`   Slug: "${p.slug}"`);
    console.log(`   Category: "${p.category}"`);
    console.log(`   Product Type: "${p.product_type}"`);
    console.log(`   Subcategory: "${p.subcategory}"`);
    console.log(`   Fabric/Sleeve/Color: ${p.fabric} / ${p.sleeve_type} / ${p.color}`);
  });
}

main();
