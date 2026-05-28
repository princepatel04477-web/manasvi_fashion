"use client";

import React, { useState, useEffect } from "react";
import { Plus, Trash, ArrowLeft, Image as ImageIcon, Sparkles, Upload } from "lucide-react";
import { useRouter } from "next/navigation";
import { Product, ColorVariant, Category, ProductType } from "@/types";
import { supabase } from "@/lib/supabase";

interface ProductFormProps {
  initialData?: Product;
  isEdit?: boolean;
}

export default function ProductForm({ initialData, isEdit = false }: ProductFormProps) {
  const router = useRouter();

  // Basic Product Fields
  const [title, setTitle] = useState(initialData?.title || "");
  const [slug, setSlug] = useState(initialData?.slug || "");
  const [description, setDescription] = useState(initialData?.description || "");
  const [category, setCategory] = useState<Category>(initialData?.category || "kurtis");
  const [productType, setProductType] = useState<ProductType>(initialData?.productType || "kurti");
  const [subcategory, setSubcategory] = useState(initialData?.subcategory || "");
  const [fabric, setFabric] = useState(initialData?.fabric || "");
  const [sleeveType, setSleeveType] = useState(initialData?.sleeveType || "");
  const [color, setColor] = useState(initialData?.color || "");
  const [price, setPrice] = useState<number | "">(initialData?.price || "");
  const [compareAtPrice, setCompareAtPrice] = useState<number | "">(initialData?.compareAtPrice || "");
  const [stock, setStock] = useState<number | "">(initialData?.stock !== undefined ? initialData.stock : 10);
  const [isNew, setIsNew] = useState(initialData?.isNew !== undefined ? initialData.isNew : true);

  // Sizes List State
  const availableSizes = ["XS", "S", "M", "L", "XL", "XXL", "3XL"];
  const [sizes, setSizes] = useState<string[]>(initialData?.sizes || ["S", "M", "L", "XL"]);

  // Images List State
  const [images, setImages] = useState<string[]>(initialData?.images || []);
  const [newImageUrl, setNewImageUrl] = useState("");

  // Color Variants State
  const [colorVariants, setColorVariants] = useState<ColorVariant[]>(initialData?.colorVariants || []);
  const [varName, setVarName] = useState("");
  const [varHex, setVarHex] = useState("#ffffff");
  const [varImage, setVarImage] = useState("");

  // Form Submitting / Error States
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<Array<{ field: string; message: string }>>([]);

  // Image Uploading States
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadingVariantImage, setUploadingVariantImage] = useState(false);

  // File Upload Handler
  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>, isVariant = false) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!supabase) {
      alert("Supabase client is not initialized. Please verify your NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in your env configuration.");
      return;
    }

    const setUploading = isVariant ? setUploadingVariantImage : setUploadingImage;
    setUploading(true);

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 11)}.${fileExt}`;
      const filePath = fileName;

      const { data, error } = await supabase.storage
        .from("products")
        .upload(filePath, file, {
          cacheControl: "3600",
          upsert: false
        });

      if (error) throw error;

      // Get public URL
      const { data: urlData } = supabase.storage
        .from("products")
        .getPublicUrl(filePath);

      if (urlData?.publicUrl) {
        if (isVariant) {
          setVarImage(urlData.publicUrl);
        } else {
          setImages(prev => [...prev, urlData.publicUrl]);
        }
      }
    } catch (err: any) {
      console.error("Upload error:", err);
      alert(`Upload failed: ${err.message || "Unknown error"}. Make sure you have created the 'products' bucket in your Supabase Storage with public access policies.`);
    } finally {
      setUploading(false);
    }
  }

  // Slug auto-generated via title input change

  // Size toggler
  function handleToggleSize(size: string) {
    if (sizes.includes(size)) {
      setSizes(sizes.filter(s => s !== size));
    } else {
      setSizes([...sizes, size]);
    }
  }

  // Image adding
  function handleAddImageUrl() {
    if (newImageUrl.trim()) {
      setImages([...images, newImageUrl.trim()]);
      setNewImageUrl("");
    }
  }

  // Image deletion
  function handleRemoveImageUrl(idx: number) {
    setImages(images.filter((_, i) => i !== idx));
  }

  // Variant adding
  function handleAddVariant() {
    if (varName.trim() && varHex.trim() && varImage.trim()) {
      setColorVariants([...colorVariants, {
        name: varName.trim(),
        hex: varHex.trim(),
        image: varImage.trim()
      }]);
      setVarName("");
      setVarHex("#ffffff");
      setVarImage("");
    } else {
      alert("Please fill in all color variant fields (Name, Hex Code, and Image URL).");
    }
  }

  // Variant deletion
  function handleRemoveVariant(idx: number) {
    setColorVariants(colorVariants.filter((_, i) => i !== idx));
  }

  // Submit Handler
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setFormError(null);
    setValidationErrors([]);

    if (images.length === 0) {
      setFormError("At least one product image is required.");
      setSubmitting(false);
      return;
    }
    if (sizes.length === 0) {
      setFormError("At least one size must be selected.");
      setSubmitting(false);
      return;
    }

    const payload = {
      title,
      slug,
      description,
      category,
      productType,
      subcategory,
      fabric,
      sleeveType,
      color,
      price: Number(price),
      compareAtPrice: compareAtPrice ? Number(compareAtPrice) : undefined,
      sizes,
      images,
      stock: Number(stock),
      isNew: !!isNew,
      colorVariants
    };

    const endpoint = isEdit ? `/api/admin/products/${initialData?.id}` : "/api/admin/products";
    const method = isEdit ? "PUT" : "POST";

    try {
      const res = await fetch(endpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      const data = await res.json();

      if (data.success) {
        router.push("/dashboard/products");
        router.refresh();
      } else {
        if (data.errors) {
          setValidationErrors(data.errors);
        } else {
          setFormError(data.message || "Failed to save product.");
        }
      }
    } catch (err) {
      setFormError("Failed to communicate with the shop database.");
    } finally {
      setSubmitting(false);
    }
  }

  // Check validation field errors
  function getFieldError(fieldName: string) {
    const error = validationErrors.find(e => e.field === fieldName);
    return error ? error.message : null;
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8 animate-fadeIn max-w-5xl">
      {/* Back button */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => router.push("/dashboard/products")}
          className="group flex items-center gap-2 rounded-xl bg-white border border-[#d9a58f33] px-4 py-2.5 text-xs font-semibold uppercase tracking-wider text-[#5c4a44] hover:bg-[#faf7f2] transition-colors"
        >
          <ArrowLeft size={14} className="group-hover:-translate-x-0.5 transition-transform" />
          Back to Catalogue
        </button>
      </div>

      {formError && (
        <div className="p-4 rounded-xl border border-red-200 bg-red-50 text-sm text-red-800">
          {formError}
        </div>
      )}

      {/* Main Layout grid */}
      <div className="grid gap-6 md:grid-cols-3">
        {/* Left 2 cols: Basic details */}
        <div className="md:col-span-2 space-y-6">
          <div className="rounded-2xl border border-[#d9a58f22] bg-white p-6 space-y-5">
            <h3 className="font-serif text-lg text-[#2a1d19] border-b border-[#d9a58f11] pb-3 mb-2">
              Design Specifications
            </h3>

            {/* Title */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#8b6b61] mb-1.5">
                Product Title
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => {
                  const val = e.target.value;
                  setTitle(val);
                  if (!isEdit) {
                    const generated = val
                      .toLowerCase()
                      .replace(/[^a-z0-9]+/g, "-")
                      .replace(/(^-|-$)+/g, "");
                    setSlug(generated);
                  }
                }}
                placeholder="e.g., Elara Silk Kurti"
                className={`w-full rounded-xl border px-4 py-2.5 text-sm text-[#2a1d19] focus:outline-none focus:border-[#6e2b38] ${
                  getFieldError("title") ? "border-red-500" : "border-[#d9a58f44]"
                }`}
                required
              />
              {getFieldError("title") && (
                <p className="mt-1 text-xs text-red-600">{getFieldError("title")}</p>
              )}
            </div>

            {/* Slug */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#8b6b61] mb-1.5">
                Boutique URL Slug
              </label>
              <input
                type="text"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                placeholder="e.g., elara-silk-kurti"
                className={`w-full rounded-xl border px-4 py-2.5 text-sm font-mono text-[#2a1d19] bg-[#faf7f2]/30 focus:outline-none focus:border-[#6e2b38] ${
                  getFieldError("slug") ? "border-red-500" : "border-[#d9a58f44]"
                }`}
                required
              />
              {getFieldError("slug") && (
                <p className="mt-1 text-xs text-red-600">{getFieldError("slug")}</p>
              )}
            </div>

            {/* Description */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#8b6b61] mb-1.5">
                Story & Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe the editorial design story, craftsmanship, feel, and detailing..."
                rows={5}
                className={`w-full rounded-xl border px-4 py-3 text-sm text-[#2a1d19] focus:outline-none focus:border-[#6e2b38] leading-relaxed ${
                  getFieldError("description") ? "border-red-500" : "border-[#d9a58f44]"
                }`}
                required
              />
              {getFieldError("description") && (
                <p className="mt-1 text-xs text-red-600">{getFieldError("description")}</p>
              )}
            </div>

            {/* Specs row 1 */}
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#8b6b61] mb-1.5">
                  Subcategory
                </label>
                <input
                  type="text"
                  value={subcategory}
                  onChange={(e) => setSubcategory(e.target.value)}
                  placeholder="e.g., Silk Blend, Embroidered"
                  className={`w-full rounded-xl border px-4 py-2.5 text-sm text-[#2a1d19] focus:outline-none focus:border-[#6e2b38] ${
                    getFieldError("subcategory") ? "border-red-500" : "border-[#d9a58f44]"
                  }`}
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#8b6b61] mb-1.5">
                  Fabric Type
                </label>
                <input
                  type="text"
                  value={fabric}
                  onChange={(e) => setFabric(e.target.value)}
                  placeholder="e.g., Premium Chanderi Silk"
                  className={`w-full rounded-xl border px-4 py-2.5 text-sm text-[#2a1d19] focus:outline-none focus:border-[#6e2b38] ${
                    getFieldError("fabric") ? "border-red-500" : "border-[#d9a58f44]"
                  }`}
                  required
                />
              </div>
            </div>

            {/* Specs row 2 */}
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#8b6b61] mb-1.5">
                  Sleeve Cut
                </label>
                <input
                  type="text"
                  value={sleeveType}
                  onChange={(e) => setSleeveType(e.target.value)}
                  placeholder="e.g., 3/4 Designer Sleeve"
                  className={`w-full rounded-xl border px-4 py-2.5 text-sm text-[#2a1d19] focus:outline-none focus:border-[#6e2b38] ${
                    getFieldError("sleeveType") ? "border-red-500" : "border-[#d9a58f44]"
                  }`}
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#8b6b61] mb-1.5">
                  Primary Color Name
                </label>
                <input
                  type="text"
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                  placeholder="e.g., Wine Red"
                  className={`w-full rounded-xl border px-4 py-2.5 text-sm text-[#2a1d19] focus:outline-none focus:border-[#6e2b38] ${
                    getFieldError("color") ? "border-red-500" : "border-[#d9a58f44]"
                  }`}
                  required
                />
              </div>
            </div>
          </div>

          {/* Color variants manager */}
          <div className="rounded-2xl border border-[#d9a58f22] bg-white p-6 space-y-4">
            <h3 className="font-serif text-lg text-[#2a1d19] border-b border-[#d9a58f11] pb-3 mb-2 flex items-center gap-2">
              <Sparkles size={16} className="text-[#6e2b38]" />
              Color Variants
            </h3>

            {/* Existing color variants list */}
            {colorVariants.length > 0 && (
              <div className="grid gap-3 sm:grid-cols-2">
                {colorVariants.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between gap-3 p-3 rounded-xl bg-[#faf7f2] border border-[#d9a58f11]">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div
                        className="h-6 w-6 rounded-full border border-stone-300 flex-shrink-0"
                        style={{ backgroundColor: item.hex }}
                      />
                      <div className="min-w-0">
                        <p className="font-semibold text-xs text-[#2a1d19] truncate">{item.name}</p>
                        <p className="text-[10px] text-[#8b6b61] truncate font-mono">{item.hex}</p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveVariant(idx)}
                      className="text-red-500 hover:text-red-700 p-1"
                    >
                      <Trash size={14} />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Add color variant builder inputs */}
            <div className="border border-dashed border-[#d9a58f44] rounded-xl p-4 bg-[#faf7f2]/20 space-y-3">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-[#8b6b61]">Add Custom Variant</p>
              
              <div className="grid gap-3 sm:grid-cols-3">
                <div>
                  <input
                    type="text"
                    value={varName}
                    onChange={(e) => setVarName(e.target.value)}
                    placeholder="Variant Color Name"
                    className="w-full rounded-lg border border-[#d9a58f44] px-3 py-2 text-xs text-[#2a1d19] focus:outline-none"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={varHex}
                    onChange={(e) => setVarHex(e.target.value)}
                    className="h-8 w-10 border border-[#d9a58f44] cursor-pointer rounded"
                  />
                  <input
                    type="text"
                    value={varHex}
                    onChange={(e) => setVarHex(e.target.value)}
                    placeholder="#ffffff"
                    className="w-full rounded-lg border border-[#d9a58f44] px-3 py-2 text-xs font-mono text-[#2a1d19] focus:outline-none"
                  />
                </div>
                <div className="space-y-1.5">
                  <input
                    type="text"
                    value={varImage}
                    onChange={(e) => setVarImage(e.target.value)}
                    placeholder="Variant Image URL"
                    className="w-full rounded-lg border border-[#d9a58f44] px-3 py-2 text-xs text-[#2a1d19] focus:outline-none"
                  />
                  <div className="flex gap-1.5">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageUpload(e, true)}
                      disabled={uploadingVariantImage}
                      className="hidden"
                      id="variant-image-upload"
                    />
                    <label
                      htmlFor="variant-image-upload"
                      className="w-full flex items-center justify-center gap-1.5 rounded-lg border border-dashed border-[#d9a58f44] hover:border-[#6e2b38] hover:bg-[#faf7f2]/45 text-[10px] text-[#5c4a44] p-1.5 cursor-pointer transition-colors"
                    >
                      <Upload size={11} className="text-[#8b6b61]" />
                      {uploadingVariantImage ? "Uploading..." : "Upload File"}
                    </label>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={handleAddVariant}
                className="flex items-center gap-1.5 rounded-lg bg-[#faf7f2] hover:bg-[#6e2b38] hover:text-white border border-[#d9a58f33] text-[#6e2b38] px-3 py-2 text-xs font-semibold uppercase tracking-wider transition-all"
              >
                <Plus size={14} />
                Attach Variant
              </button>
            </div>
          </div>
        </div>

        {/* Right 1 col: Classification & Photos */}
        <div className="space-y-6">
          {/* Classification & Pricing card */}
          <div className="rounded-2xl border border-[#d9a58f22] bg-white p-6 space-y-4">
            <h3 className="font-serif text-lg text-[#2a1d19] border-b border-[#d9a58f11] pb-3 mb-2">
              Metadata & Pricing
            </h3>

            {/* Category Select */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#8b6b61] mb-1.5">
                Collection Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as Category)}
                className="w-full rounded-xl border border-[#d9a58f44] px-4 py-2.5 text-sm text-[#2a1d19] focus:outline-none focus:border-[#6e2b38]"
              >
                <option value="kurtis">Kurtis Collection</option>
                <option value="dresses">Dresses Collection</option>
              </select>
            </div>

            {/* Product Type Select */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#8b6b61] mb-1.5">
                Product Type
              </label>
              <select
                value={productType}
                onChange={(e) => setProductType(e.target.value as ProductType)}
                className="w-full rounded-xl border border-[#d9a58f44] px-4 py-2.5 text-sm text-[#2a1d19] focus:outline-none focus:border-[#6e2b38]"
              >
                <option value="kurti">Kurti</option>
                <option value="tunic_top">Tunic Top</option>
                <option value="dress">Dress</option>
              </select>
            </div>

            {/* Price */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#8b6b61] mb-1.5">
                Price (₹)
              </label>
              <input
                type="number"
                min="1"
                value={price}
                onChange={(e) => setPrice(e.target.value ? parseFloat(e.target.value) : "")}
                placeholder="Retail price"
                className={`w-full rounded-xl border px-4 py-2.5 text-sm text-[#2a1d19] focus:outline-none focus:border-[#6e2b38] ${
                  getFieldError("price") ? "border-red-500" : "border-[#d9a58f44]"
                }`}
                required
              />
              {getFieldError("price") && (
                <p className="mt-1 text-xs text-red-600">{getFieldError("price")}</p>
              )}
            </div>

            {/* Compare at Price */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#8b6b61] mb-1.5">
                Compare At Price (₹)
              </label>
              <input
                type="number"
                min="1"
                value={compareAtPrice}
                onChange={(e) => setCompareAtPrice(e.target.value ? parseFloat(e.target.value) : "")}
                placeholder="Original pre-discount price"
                className="w-full rounded-xl border border-[#d9a58f44] px-4 py-2.5 text-sm text-[#2a1d19] focus:outline-none focus:border-[#6e2b38]"
              />
            </div>

            {/* Stock level */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#8b6b61] mb-1.5">
                Initial Stock
              </label>
              <input
                type="number"
                min="0"
                value={stock}
                onChange={(e) => setStock(e.target.value ? parseInt(e.target.value) : "")}
                placeholder="Boutique stock quantity"
                className="w-full rounded-xl border border-[#d9a58f44] px-4 py-2.5 text-sm text-[#2a1d19] focus:outline-none"
                required
              />
            </div>

            {/* New tag switch */}
            <div className="flex items-center justify-between py-2 border-t border-[#d9a58f11]">
              <span className="text-xs font-semibold uppercase tracking-wider text-[#8b6b61]">
                Mark as &quot;New Arrival&quot;
              </span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={isNew}
                  onChange={(e) => setIsNew(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-9 h-5 bg-stone-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#6e2b38]"></div>
              </label>
            </div>
          </div>

          {/* Sizes card */}
          <div className="rounded-2xl border border-[#d9a58f22] bg-white p-6 space-y-4">
            <h3 className="font-serif text-lg text-[#2a1d19] border-b border-[#d9a58f11] pb-3 mb-2">
              Sizing Matrix
            </h3>
            <div className="flex flex-wrap gap-2">
              {availableSizes.map((size) => {
                const active = sizes.includes(size);
                return (
                  <button
                    key={size}
                    type="button"
                    onClick={() => handleToggleSize(size)}
                    className={`h-10 min-w-10 rounded-lg px-2.5 text-xs font-semibold border transition-all ${
                      active
                        ? "bg-[#6e2b38] border-[#6e2b38] text-white"
                        : "bg-white border-[#d9a58f33] text-[#5c4a44] hover:bg-[#faf7f2]"
                    }`}
                  >
                    {size}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Images URLs list card */}
          <div className="rounded-2xl border border-[#d9a58f22] bg-white p-6 space-y-4">
            <h3 className="font-serif text-lg text-[#2a1d19] border-b border-[#d9a58f11] pb-3 mb-2">
              Editorial Media
            </h3>

            {/* Images list previews */}
            {images.length > 0 ? (
              <div className="grid gap-2 grid-cols-3">
                {images.map((img, idx) => (
                  <div key={idx} className="relative aspect-[3/4] rounded-lg overflow-hidden bg-stone-100 group border border-[#d9a58f11]">
                    <img src={img} alt="Product Spec" className="h-full w-full object-cover" />
                    <button
                      type="button"
                      onClick={() => handleRemoveImageUrl(idx)}
                      className="absolute top-1 right-1 rounded-full bg-black/50 p-1 text-white hover:bg-black transition-colors"
                    >
                      <Trash size={10} />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6 border border-dashed border-[#d9a58f44] rounded-xl">
                <ImageIcon className="mx-auto text-[#d9a58f66] mb-2" size={32} />
                <p className="text-xs text-[#8b6b61] italic">Add image URLs below.</p>
              </div>
            )}

            {/* Add Image input */}
            <div className="space-y-3 pt-2 border-t border-[#d9a58f11]">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-[#8b6b61] mb-1">
                  Upload Product Image
                </label>
                <div className="flex gap-2">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageUpload(e, false)}
                    disabled={uploadingImage}
                    className="hidden"
                    id="product-image-upload"
                  />
                  <label
                    htmlFor="product-image-upload"
                    className="flex-1 flex items-center justify-center gap-2 rounded-xl border border-dashed border-[#d9a58f66] hover:border-[#6e2b38] hover:bg-[#faf7f2] text-xs text-[#5c4a44] p-3 cursor-pointer transition-colors font-semibold"
                  >
                    <Upload size={14} className="text-[#8b6b61]" />
                    {uploadingImage ? "Uploading to Supabase..." : "Choose Image File"}
                  </label>
                </div>
              </div>

              <div className="relative flex py-1 items-center">
                <div className="flex-grow border-t border-[#d9a58f11]"></div>
                <span className="flex-shrink mx-2 text-[9px] text-[#8b6b61] uppercase font-bold tracking-wider">Or Paste URL</span>
                <div className="flex-grow border-t border-[#d9a58f11]"></div>
              </div>

              <div className="space-y-2">
                <input
                  type="text"
                  placeholder="Paste high-res image URL..."
                  value={newImageUrl}
                  onChange={(e) => setNewImageUrl(e.target.value)}
                  className="w-full rounded-xl border border-[#d9a58f44] px-3.5 py-2 text-xs focus:outline-none"
                />
                <button
                  type="button"
                  onClick={handleAddImageUrl}
                  className="w-full flex items-center justify-center gap-1.5 rounded-xl bg-[#faf7f2] hover:bg-[#6e2b38] hover:text-white border border-[#d9a58f33] text-[#6e2b38] py-2 text-xs font-semibold uppercase tracking-wider transition-all"
                >
                  <Plus size={14} />
                  Add Image URL
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Form Action Buttons */}
      <div className="flex items-center justify-end gap-3 pt-6 border-t border-[#d9a58f22]">
        <button
          type="button"
          onClick={() => router.push("/dashboard/products")}
          disabled={submitting}
          className="px-6 py-3 rounded-xl border border-[#d9a58f44] text-xs font-semibold uppercase tracking-widest text-[#5c4a44] hover:bg-[#faf7f2] transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={submitting}
          className="px-8 py-3 rounded-xl bg-[#6e2b38] hover:bg-[#521e28] text-white text-xs font-semibold uppercase tracking-widest transition-colors flex items-center gap-2"
        >
          {submitting ? "Saving..." : isEdit ? "Update Design" : "Publish Design"}
        </button>
      </div>
    </form>
  );
}
