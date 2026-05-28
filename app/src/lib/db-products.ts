import { supabaseAdmin } from "./supabase";
import { readJson, writeJson } from "./db-helper";
import { products as defaultProducts } from "@/data/products";
import { Product } from "@/types";

const PRODUCTS_FILE = "products-db.json";

// Initialize/seed products local database if not present
async function getLocalProducts(): Promise<Product[]> {
  return readJson<Product[]>(PRODUCTS_FILE, defaultProducts);
}

async function saveLocalProducts(products: Product[]): Promise<void> {
  await writeJson<Product[]>(PRODUCTS_FILE, products);
}

export async function getProducts(): Promise<Product[]> {
  if (supabaseAdmin) {
    try {
      const { data, error } = await supabaseAdmin
        .from("products")
        .select("*")
        .order("created_at", { ascending: false });

      if (!error && data) {
        // Map database fields to typescript types if needed
        interface DbProductRow {
          id: string | number;
          slug: string;
          title: string;
          category: string;
          product_type: string;
          subcategory?: string;
          description: string;
          fabric?: string;
          sleeve_type?: string;
          color?: string;
          price: number;
          compare_at_price?: number;
          sizes: string | string[];
          images: string | string[];
          stock: number;
          rating?: number;
          reviews?: number;
          is_new?: boolean;
          color_variants?: string | { color: string; hex: string; slug: string }[];
        }
        return (data as unknown as DbProductRow[]).map((item) => ({
          id: String(item.id),
          slug: item.slug,
          title: item.title,
          category: item.category,
          productType: item.product_type,
          subcategory: item.subcategory,
          description: item.description,
          fabric: item.fabric,
          sleeveType: item.sleeve_type,
          color: item.color,
          price: Number(item.price),
          compareAtPrice: item.compare_at_price ? Number(item.compare_at_price) : undefined,
          sizes: Array.isArray(item.sizes) ? item.sizes : JSON.parse((item.sizes as string) || "[]"),
          images: Array.isArray(item.images) ? item.images : JSON.parse((item.images as string) || "[]"),
          stock: Number(item.stock),
          rating: Number(item.rating || 5),
          reviews: Number(item.reviews || 0),
          isNew: !!item.is_new,
          colorVariants: Array.isArray(item.color_variants) 
            ? item.color_variants 
            : JSON.parse((item.color_variants as string) || "[]")
        })) as Product[];
      }
      console.warn("[db-products] Supabase select failed:", error?.message);
    } catch (err) {
      console.warn("[db-products] Supabase get error:", err);
    }
  }

  // Fallback to local JSON file
  return getLocalProducts();
}

export async function getProductById(id: string): Promise<Product | undefined> {
  const all = await getProducts();
  return all.find((p) => p.id === id);
}

export async function getProductBySlug(slug: string): Promise<Product | undefined> {
  const all = await getProducts();
  return all.find((p) => p.slug === slug);
}

export async function createProduct(input: Omit<Product, "id" | "rating" | "reviews">): Promise<Product> {
  const newProduct: Product = {
    ...input,
    id: `p-${Date.now()}`,
    rating: 5.0,
    reviews: 0,
  };

  if (supabaseAdmin) {
    try {
      const { data, error } = await supabaseAdmin
        .from("products")
        .insert([
          {
            slug: newProduct.slug,
            title: newProduct.title,
            category: newProduct.category,
            product_type: newProduct.productType,
            subcategory: newProduct.subcategory,
            description: newProduct.description,
            fabric: newProduct.fabric,
            sleeve_type: newProduct.sleeveType,
            color: newProduct.color,
            price: newProduct.price,
            compare_at_price: newProduct.compareAtPrice || null,
            sizes: JSON.stringify(newProduct.sizes),
            images: JSON.stringify(newProduct.images),
            stock: newProduct.stock,
            rating: newProduct.rating,
            reviews: newProduct.reviews,
            is_new: !!newProduct.isNew,
            color_variants: JSON.stringify(newProduct.colorVariants || [])
          }
        ])
        .select();

      if (!error && data && data.length > 0) {
        console.log("[db-products] Product created in Supabase:", data[0].id);
        return { ...newProduct, id: String(data[0].id) };
      }
      console.warn("[db-products] Supabase insert failed:", error?.message);
    } catch (err) {
      console.warn("[db-products] Supabase create error:", err);
    }
  }

  // Fallback
  const all = await getLocalProducts();
  all.push(newProduct);
  await saveLocalProducts(all);
  return newProduct;
}

export async function updateProduct(id: string, updates: Partial<Product>): Promise<Product | undefined> {
  if (supabaseAdmin) {
    try {
      const dbUpdates: Record<string, string | number | boolean | undefined> = {};
      if (updates.slug !== undefined) dbUpdates.slug = updates.slug;
      if (updates.title !== undefined) dbUpdates.title = updates.title;
      if (updates.category !== undefined) dbUpdates.category = updates.category;
      if (updates.productType !== undefined) dbUpdates.product_type = updates.productType;
      if (updates.subcategory !== undefined) dbUpdates.subcategory = updates.subcategory;
      if (updates.description !== undefined) dbUpdates.description = updates.description;
      if (updates.fabric !== undefined) dbUpdates.fabric = updates.fabric;
      if (updates.sleeveType !== undefined) dbUpdates.sleeve_type = updates.sleeveType;
      if (updates.color !== undefined) dbUpdates.color = updates.color;
      if (updates.price !== undefined) dbUpdates.price = updates.price;
      if (updates.compareAtPrice !== undefined) dbUpdates.compare_at_price = updates.compareAtPrice;
      if (updates.sizes !== undefined) dbUpdates.sizes = JSON.stringify(updates.sizes);
      if (updates.images !== undefined) dbUpdates.images = JSON.stringify(updates.images);
      if (updates.stock !== undefined) dbUpdates.stock = updates.stock;
      if (updates.isNew !== undefined) dbUpdates.is_new = updates.isNew;
      if (updates.colorVariants !== undefined) dbUpdates.color_variants = JSON.stringify(updates.colorVariants);

      const { data, error } = await supabaseAdmin
        .from("products")
        .update(dbUpdates)
        .eq("id", id)
        .select();

      if (!error && data && data.length > 0) {
        console.log("[db-products] Product updated in Supabase:", id);
      } else {
        console.warn("[db-products] Supabase update failed:", error?.message);
      }
    } catch (err) {
      console.warn("[db-products] Supabase update error:", err);
    }
  }

  // Sync to local fallback regardless of Supabase state to maintain robustness
  const all = await getLocalProducts();
  const index = all.findIndex((p) => p.id === id);
  if (index === -1) return undefined;

  const updatedProduct = {
    ...all[index],
    ...updates,
  };

  all[index] = updatedProduct;
  await saveLocalProducts(all);
  return updatedProduct;
}

export async function deleteProduct(id: string): Promise<boolean> {
  let success = false;
  if (supabaseAdmin) {
    try {
      const { error } = await supabaseAdmin
        .from("products")
        .delete()
        .eq("id", id);

      if (!error) {
        console.log("[db-products] Product deleted from Supabase:", id);
        success = true;
      } else {
        console.warn("[db-products] Supabase delete failed:", error.message);
      }
    } catch (err) {
      console.warn("[db-products] Supabase delete error:", err);
    }
  }

  // Fallback/Local delete
  const all = await getLocalProducts();
  const filtered = all.filter((p) => p.id !== id);
  if (filtered.length < all.length) {
    await saveLocalProducts(filtered);
    success = true;
  }
  return success;
}
