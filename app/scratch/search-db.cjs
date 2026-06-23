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
  console.log(`Searching through ${data.length} total products in database:`);
  
  const matches = data.filter(p => {
    const text = `${p.title} ${p.category} ${p.product_type} ${p.subcategory}`.toLowerCase();
    return text.includes('one') || text.includes('piece') || text.includes('dress');
  });

  console.log(`Found ${matches.length} matching products:`);
  matches.forEach(p => {
    console.log(`ID: ${p.id}`);
    console.log(`  Title: ${p.title}`);
    console.log(`  Category: "${p.category}"`);
    console.log(`  Product Type: "${p.product_type}"`);
    console.log(`  Subcategory: "${p.subcategory}"`);
    console.log(`  Occasion/Neck/Fit/Length: ${p.occasion} / ${p.neck_type} / ${p.fit_type} / ${p.length}`);
  });
}

main();
