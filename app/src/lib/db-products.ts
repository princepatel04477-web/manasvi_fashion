import { supabaseAdmin } from "./supabase";
import { readJson, writeJson } from "./db-helper";
import { products as defaultProducts } from "@/data/products";
import { Product, VariantImage, ColorVariant } from "@/types";

const PRODUCTS_FILE = "products-db.json";

export function migrateProductVariants(product: Product): Product {
  if (!product.colorVariants || !Array.isArray(product.colorVariants)) {
    return { ...product, colorVariants: [] };
  }

  const migrated = product.colorVariants.map((v, vIdx) => {
    const varId = v.id || `var_${product.id}_${vIdx}`;
    let images = v.images ? [...v.images] : [];
    
    if (images.length === 0) {
      if (v.frontImage) {
        images.push({
          id: `img_${varId}_front`,
          type: "front",
          url: v.frontImage,
          order: 1
        });
      }
      if (v.modelImage) {
        images.push({
          id: `img_${varId}_model`,
          type: "back",
          url: v.modelImage,
          order: 2
        });
      }
      if (v.backImage && v.backImage !== v.frontImage && v.backImage !== v.modelImage) {
        images.push({
          id: `img_${varId}_back`,
          type: "back",
          url: v.backImage,
          order: 3
        });
      }
    }

    // Sort images by order
    images.sort((a, b) => (a.order || 0) - (b.order || 0));

    // Keep legacy frontImage and modelImage in sync with images array
    const frontImg = images.find(img => img.type === "front")?.url || images[0]?.url || "";
    const modelImg = images.find(img => img.type === "back" || img.type === "closeup" || img.type === "gallery")?.url || "";

    return {
      ...v,
      id: varId,
      images,
      frontImage: v.frontImage || frontImg,
      modelImage: v.modelImage || modelImg
    };
  });

  return {
    ...product,
    colorVariants: migrated
  };
}

// Initialize/seed products local database if not present
async function getLocalProducts(): Promise<Product[]> {
  const local = await readJson<Product[]>(PRODUCTS_FILE, defaultProducts);
  return local.map(p => migrateProductVariants(p));
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

      if (!error && data && data.length > 0) {
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
          length?: string;
          fit_type?: string;
          neck_type?: string;
          occasion?: string;
        }
        const list = (data as unknown as DbProductRow[]).map((item) => ({
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
            : JSON.parse((item.color_variants as string) || "[]"),
          length: item.length,
          fitType: item.fit_type,
          neckType: item.neck_type,
          occasion: item.occasion,
        })) as Product[];
        return list.map(p => migrateProductVariants(p));
      }
      if (!error && Array.isArray(data) && data.length === 0) {
        console.warn("[db-products] Supabase returned 0 products. Falling back to local JSON data.");
      } else {
        console.warn("[db-products] Supabase select failed:", error?.message);
      }
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
            color_variants: JSON.stringify(newProduct.colorVariants || []),
            // One Piece specific attributes
            length: newProduct.length || null,
            fit_type: newProduct.fitType || null,
            neck_type: newProduct.neckType || null,
            occasion: newProduct.occasion || null,
          }
        ])
        .select();

      if (!error && data && data.length > 0) {
        console.log("[db-products] Product created in Supabase:", data[0].id);
        const createdProduct = { ...newProduct, id: String(data[0].id) };
        await syncVariantsToDatabase(createdProduct);
        return createdProduct;
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
      // One Piece specific attributes
      if (updates.length !== undefined) dbUpdates.length = updates.length;
      if (updates.fitType !== undefined) dbUpdates.fit_type = updates.fitType;
      if (updates.neckType !== undefined) dbUpdates.neck_type = updates.neckType;
      if (updates.occasion !== undefined) dbUpdates.occasion = updates.occasion;

      const { data, error } = await supabaseAdmin
        .from("products")
        .update(dbUpdates)
        .eq("id", id)
        .select();

      if (!error && data && data.length > 0) {
        console.log("[db-products] Product updated in Supabase:", id);
        const fullProduct = await getProductById(id);
        if (fullProduct) {
          await syncVariantsToDatabase(fullProduct);
        }
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

// ============================================================
// Variant and Photo Management System Operations
// ============================================================

export async function deleteStorageFileByUrl(url: string): Promise<void> {
  if (!supabaseAdmin) return;
  try {
    const bucketMarker = "/storage/v1/object/public/products/";
    const markerIndex = url.indexOf(bucketMarker);
    if (markerIndex !== -1) {
      const filePath = url.slice(markerIndex + bucketMarker.length);
      const decodedPath = decodeURIComponent(filePath);
      const { error } = await supabaseAdmin.storage
        .from("products")
        .remove([decodedPath]);
      if (error) {
        console.error("[deleteStorageFileByUrl] Storage delete error:", error.message);
      } else {
        console.log("[deleteStorageFileByUrl] Deleted storage file:", decodedPath);
      }
    }
  } catch (err) {
    console.error("[deleteStorageFileByUrl] Error removing storage object:", err);
  }
}

export async function syncVariantsToDatabase(product: Product): Promise<void> {
  if (!supabaseAdmin) return;

  try {
    const { colorVariants, id: productId } = product;
    if (!colorVariants || !Array.isArray(colorVariants)) return;

    // 1. Fetch current variants in database for this product
    const { data: dbVariants, error: fetchError } = await supabaseAdmin
      .from("product_variants")
      .select("id, sku, color_name")
      .eq("product_id", productId);

    if (fetchError) {
      console.warn("[syncVariantsToDatabase] Relational table check failed (ignoring, tables might not exist):", fetchError.message);
      return;
    }

    const variantIdsToKeep = new Set<string>();

    for (const v of colorVariants) {
      let variantId: string;
      if (v.id) {
        variantId = v.id;
      } else {
        const match = dbVariants?.find(dbV => dbV.sku === v.sku || dbV.color_name === v.name);
        variantId = match ? match.id : `var_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
        v.id = variantId;
      }

      variantIdsToKeep.add(variantId);

      const variantData = {
        id: variantId,
        product_id: productId,
        color_name: v.name,
        hex_code: v.hex,
        sku: v.sku || "",
        stock: v.stock || 0,
        price_adjustment: v.priceAdjustment || 0
      };

      const { error: upsertVarError } = await supabaseAdmin
        .from("product_variants")
        .upsert([variantData]);

      if (upsertVarError) {
        console.error("[syncVariantsToDatabase] Error upserting variant:", upsertVarError.message);
        continue;
      }

      if (v.images && Array.isArray(v.images)) {
        const imageIdsToKeep = new Set<string>();

        for (const img of v.images) {
          imageIdsToKeep.add(img.id);

          const imageData = {
            id: img.id,
            variant_id: variantId,
            image_type: img.type,
            image_url: img.url,
            image_order: img.order || 0
          };

          await supabaseAdmin
            .from("product_variant_images")
            .upsert([imageData]);
        }

        // Delete removed images
        const { data: dbImages } = await supabaseAdmin
          .from("product_variant_images")
          .select("id")
          .eq("variant_id", v.id);
        
        if (dbImages) {
          const imagesToDelete = dbImages
            .map(img => img.id)
            .filter(id => !imageIdsToKeep.has(id));
          
          if (imagesToDelete.length > 0) {
            await supabaseAdmin
              .from("product_variant_images")
              .delete()
              .in("id", imagesToDelete);
          }
        }
      }
    }

    // Delete removed variants
    if (dbVariants) {
      const variantsToDelete = dbVariants
        .map(v => v.id)
        .filter(id => !variantIdsToKeep.has(id));
      
      if (variantsToDelete.length > 0) {
        await supabaseAdmin
          .from("product_variants")
          .delete()
          .in("id", variantsToDelete);
      }
    }
  } catch (err) {
    console.error("[syncVariantsToDatabase] Error during sync:", err);
  }
}

export async function deleteVariantImage(imageId: string): Promise<boolean> {
  const all = await getProducts();
  let foundProduct: Product | undefined;
  
  for (const p of all) {
    const migratedP = migrateProductVariants(p);
    if (migratedP.colorVariants) {
      for (const v of migratedP.colorVariants) {
        if (v.images) {
          const index = v.images.findIndex(img => img.id === imageId);
          if (index !== -1) {
            const [deletedImage] = v.images.splice(index, 1);
            if (deletedImage && deletedImage.url) {
              await deleteStorageFileByUrl(deletedImage.url);
            }
            v.frontImage = v.images.find(img => img.type === "front")?.url || v.images[0]?.url || "";
            v.modelImage = v.images.find(img => img.type === "back" || img.type === "closeup" || img.type === "gallery")?.url || "";
            foundProduct = migratedP;
            break;
          }
        }
      }
    }
    if (foundProduct) break;
  }

  if (foundProduct) {
    await updateProduct(foundProduct.id, { colorVariants: foundProduct.colorVariants });
    if (supabaseAdmin) {
      try {
        await supabaseAdmin
          .from("product_variant_images")
          .delete()
          .eq("id", imageId);
      } catch (err) {
        console.warn("[deleteVariantImage] Relational table update failed or ignored:", err);
      }
    }
    return true;
  }
  return false;
}

export async function updateVariantImage(imageId: string, newImageUrl: string): Promise<boolean> {
  const all = await getProducts();
  let foundProduct: Product | undefined;
  
  for (const p of all) {
    const migratedP = migrateProductVariants(p);
    if (migratedP.colorVariants) {
      for (const v of migratedP.colorVariants) {
        if (v.images) {
          const img = v.images.find(i => i.id === imageId);
          if (img) {
            img.url = newImageUrl;
            v.frontImage = v.images.find(i => i.type === "front")?.url || v.images[0]?.url || "";
            v.modelImage = v.images.find(i => i.type === "back" || i.type === "closeup" || i.type === "gallery")?.url || "";
            foundProduct = migratedP;
            break;
          }
        }
      }
    }
    if (foundProduct) break;
  }

  if (foundProduct) {
    await updateProduct(foundProduct.id, { colorVariants: foundProduct.colorVariants });
    if (supabaseAdmin) {
      try {
        await supabaseAdmin
          .from("product_variant_images")
          .update({ image_url: newImageUrl })
          .eq("id", imageId);
      } catch (err) {
        console.warn("[updateVariantImage] Relational table update failed or ignored:", err);
      }
    }
    return true;
  }
  return false;
}

export async function updateImageOrder(variantId: string, reorderedImages: { id: string; order: number }[]): Promise<boolean> {
  const all = await getProducts();
  let foundProduct: Product | undefined;
  
  for (const p of all) {
    const migratedP = migrateProductVariants(p);
    if (migratedP.colorVariants) {
      const v = migratedP.colorVariants.find(varItem => varItem.id === variantId);
      if (v && v.images) {
        v.images.forEach(img => {
          const update = reorderedImages.find(u => u.id === img.id);
          if (update) {
            img.order = update.order;
          }
        });
        v.images.sort((a, b) => (a.order || 0) - (b.order || 0));
        v.frontImage = v.images.find(i => i.type === "front")?.url || v.images[0]?.url || "";
        v.modelImage = v.images.find(i => i.type === "back" || i.type === "closeup" || i.type === "gallery")?.url || "";
        foundProduct = migratedP;
        break;
      }
    }
    if (foundProduct) break;
  }

  if (foundProduct) {
    await updateProduct(foundProduct.id, { colorVariants: foundProduct.colorVariants });
    if (supabaseAdmin) {
      try {
        for (const update of reorderedImages) {
          await supabaseAdmin
            .from("product_variant_images")
            .update({ image_order: update.order })
            .eq("id", update.id);
        }
      } catch (err) {
        console.warn("[updateImageOrder] Relational table updates failed or ignored:", err);
      }
    }
    return true;
  }
  return false;
}

export async function deleteColorVariant(variantId: string): Promise<boolean> {
  const all = await getProducts();
  let foundProduct: Product | undefined;
  
  for (const p of all) {
    const migratedP = migrateProductVariants(p);
    if (migratedP.colorVariants) {
      const index = migratedP.colorVariants.findIndex(v => v.id === variantId);
      if (index !== -1) {
        const [deletedVariant] = migratedP.colorVariants.splice(index, 1);
        if (deletedVariant && deletedVariant.images) {
          for (const img of deletedVariant.images) {
            if (img.url) {
              await deleteStorageFileByUrl(img.url);
            }
          }
        }
        foundProduct = migratedP;
        break;
      }
    }
    if (foundProduct) break;
  }

  if (foundProduct) {
    await updateProduct(foundProduct.id, { colorVariants: foundProduct.colorVariants });
    if (supabaseAdmin) {
      try {
        await supabaseAdmin
          .from("product_variants")
          .delete()
          .eq("id", variantId);
      } catch (err) {
        console.warn("[deleteColorVariant] Relational table update failed or ignored:", err);
      }
    }
    return true;
  }
  return false;
}

export async function addVariantImage(variantId: string, image: Omit<VariantImage, "order"> & { order?: number }): Promise<boolean> {
  const all = await getProducts();
  let foundProduct: Product | undefined;
  
  for (const p of all) {
    const migratedP = migrateProductVariants(p);
    if (migratedP.colorVariants) {
      const v = migratedP.colorVariants.find(varItem => varItem.id === variantId);
      if (v) {
        if (!v.images) v.images = [];
        
        const maxOrder = v.images.reduce((max, img) => Math.max(max, img.order || 0), 0);
        const order = image.order !== undefined ? image.order : maxOrder + 1;

        const newImage: VariantImage = {
          id: image.id || `img_${Date.now()}_${Math.random().toString(36).substring(2, 5)}`,
          type: image.type,
          url: image.url,
          order
        };

        v.images.push(newImage);
        v.images.sort((a, b) => (a.order || 0) - (b.order || 0));

        v.frontImage = v.images.find(i => i.type === "front")?.url || v.images[0]?.url || "";
        v.modelImage = v.images.find(i => i.type === "back" || i.type === "closeup" || i.type === "gallery")?.url || "";

        foundProduct = migratedP;
        break;
      }
    }
    if (foundProduct) break;
  }

  if (foundProduct) {
    await updateProduct(foundProduct.id, { colorVariants: foundProduct.colorVariants });
    if (supabaseAdmin) {
      try {
        const maxOrder = image.order !== undefined ? image.order : 0;
        await supabaseAdmin
          .from("product_variant_images")
          .insert([{
            id: image.id,
            variant_id: variantId,
            image_type: image.type,
            image_url: image.url,
            image_order: maxOrder
          }]);
      } catch (err) {
        console.warn("[addVariantImage] Relational table insert failed or ignored:", err);
      }
    }
    return true;
  }
  return false;
}
