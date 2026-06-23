import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import { products } from '../src/data/products';

dotenv.config();

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error("Missing environment variables!");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function main() {
  console.log(`Loaded ${products.length} default products from code.`);

  // Fetch existing products from DB
  const { data: dbProducts, error: fetchError } = await supabase.from('products').select('slug');
  if (fetchError) {
    console.error("Error fetching existing products:", fetchError);
    return;
  }

  const existingSlugs = new Set(dbProducts.map(p => p.slug));
  console.log(`Database has ${existingSlugs.size} products.`);

  // Find products that are missing in the DB
  const missingProducts = products.filter(p => !existingSlugs.has(p.slug));
  console.log(`Found ${missingProducts.length} missing products to seed.`);

  for (const product of missingProducts) {
    console.log(`Seeding: "${product.title}" (${product.category})`);
    
    const { data, error } = await supabase.from('products').insert([
      {
        id: product.id,
        slug: product.slug,
        title: product.title,
        category: product.category,
        product_type: product.productType,
        subcategory: product.subcategory,
        description: product.description,
        fabric: product.fabric,
        sleeve_type: product.sleeveType,
        color: product.color,
        price: product.price,
        compare_at_price: product.compareAtPrice || null,
        sizes: JSON.stringify(product.sizes),
        images: JSON.stringify(product.images),
        stock: product.stock,
        rating: product.rating,
        reviews: product.reviews,
        is_new: !!product.isNew,
        color_variants: JSON.stringify(product.colorVariants || []),
        length: product.length || null,
        fit_type: product.fitType || null,
        neck_type: product.neckType || null,
        occasion: product.occasion || null
      }
    ]).select();

    if (error) {
      console.error(`Failed to seed "${product.title}":`, error.message);
    } else {
      console.log(`Successfully seeded "${product.title}" with ID:`, data?.[0]?.id);
    }
  }

  console.log("Seeding complete!");
}

main().catch(err => {
  console.error("Unhandled error:", err);
});
