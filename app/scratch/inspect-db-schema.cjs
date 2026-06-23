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
  // We can query information_schema orpg_catalog tables to list the constraints on public.products.
  // Wait, let's run a query selecting all constraints
  const { data, error } = await supabase.rpc('inspect_table_constraints'); // If RPC exists
  if (error) {
    // If RPC doesn't exist, we can use a raw SQL query if we have an RPC like execute_sql or run_sql.
    // Let's try running a direct query. Wait! Let's check if there is an rpc function by fetching pg_constraint.
    console.log("RPC inspect_table_constraints not found. Let's try fetching pg_constraint via REST API if allowed, or we can just try inserting a test product with category 'onepiece' (no hyphen) to see if it fails!");
  }
  
  // Let's test inserting a mock product with 'onepiece' category
  console.log("Testing insert with 'onepiece' (no hyphen)...");
  try {
    const { data: insData, error: insError } = await supabase.from('products').insert([
      {
        slug: 'test-onepiece-insert-val',
        title: 'Test One Piece Insert',
        category: 'onepiece',
        product_type: 'one_piece',
        price: 999,
        sizes: JSON.stringify(['M']),
        images: JSON.stringify(['/test.jpg']),
        stock: 5
      }
    ]).select();
    
    if (insError) {
      console.log("Insert failed as expected or due to constraints:", insError.message);
    } else {
      console.log("Insert succeeded! That means the constraint 'onepiece' is NOT active or category 'onepiece' was accepted.", insData);
      // Let's clean it up
      await supabase.from('products').delete().eq('slug', 'test-onepiece-insert-val');
    }
  } catch (err) {
    console.error("Insert error:", err);
  }

  // Let's test inserting a mock product with 'one-piece' category (with hyphen)
  console.log("\nTesting insert with 'one-piece' (with hyphen)...");
  try {
    const { data: insData, error: insError } = await supabase.from('products').insert([
      {
        slug: 'test-one-piece-insert-val',
        title: 'Test One Piece Insert 2',
        category: 'one-piece',
        product_type: 'one_piece',
        price: 999,
        sizes: JSON.stringify(['M']),
        images: JSON.stringify(['/test.jpg']),
        stock: 5
      }
    ]).select();
    
    if (insError) {
      console.log("Insert failed for 'one-piece':", insError.message);
    } else {
      console.log("Insert succeeded for 'one-piece'!", insData);
      // Clean up
      await supabase.from('products').delete().eq('slug', 'test-one-piece-insert-val');
    }
  } catch (err) {
    console.error("Insert error:", err);
  }
}

main();
