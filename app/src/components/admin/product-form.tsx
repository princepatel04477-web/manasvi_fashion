"use client";

import React, { useState, useEffect, useRef } from "react";
import { Plus, Trash, ArrowLeft, Image as ImageIcon, Sparkles, Upload, ChevronDown, ChevronUp, ArrowUp, ArrowDown } from "lucide-react";
import { useRouter } from "next/navigation";
import { Product, ColorVariant, Category, ProductType } from "@/types";
import { supabase } from "@/lib/supabase";
import { useShop } from "@/context/shop-context";
import { animate } from "animejs";

interface ProductFormProps {
  initialData?: Product;
  isEdit?: boolean;
}

type NamedColor = { name: string; hex: string };

const NAMED_COLORS: NamedColor[] = [
  { name: "Black", hex: "#000000" },
  { name: "White", hex: "#ffffff" },
  { name: "Red", hex: "#ff0000" },
  { name: "Maroon", hex: "#800000" },
  { name: "Burgundy", hex: "#800020" },
  { name: "Pink", hex: "#ffc0cb" },
  { name: "Rose", hex: "#ff007f" },
  { name: "Coral", hex: "#ff7f50" },
  { name: "Orange", hex: "#ffa500" },
  { name: "Peach", hex: "#ffcba4" },
  { name: "Yellow", hex: "#ffff00" },
  { name: "Mustard", hex: "#ffdb58" },
  { name: "Lime", hex: "#bfff00" },
  { name: "Green", hex: "#008000" },
  { name: "Olive", hex: "#808000" },
  { name: "Teal", hex: "#008080" },
  { name: "Cyan", hex: "#00ffff" },
  { name: "Sky Blue", hex: "#87ceeb" },
  { name: "Blue", hex: "#0000ff" },
  { name: "Navy", hex: "#000080" },
  { name: "Indigo", hex: "#4b0082" },
  { name: "Purple", hex: "#800080" },
  { name: "Lavender", hex: "#e6e6fa" },
  { name: "Magenta", hex: "#ff00ff" },
  { name: "Brown", hex: "#8b4513" },
  { name: "Tan", hex: "#d2b48c" },
  { name: "Beige", hex: "#f5f5dc" },
  { name: "Cream", hex: "#fffdd0" },
  { name: "Gold", hex: "#ffd700" },
  { name: "Silver", hex: "#c0c0c0" },
  { name: "Grey", hex: "#808080" }
];

function normalizeHex(raw: string): string {
  const cleaned = raw.trim().replace(/^#/, "").toLowerCase();
  if (!/^[0-9a-f]{3}$|^[0-9a-f]{6}$/.test(cleaned)) return raw;
  if (cleaned.length === 3) {
    return `#${cleaned.split("").map((c) => `${c}${c}`).join("")}`;
  }
  return `#${cleaned}`;
}

function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const n = normalizeHex(hex);
  if (!/^#[0-9a-f]{6}$/i.test(n)) return null;
  return {
    r: parseInt(n.slice(1, 3), 16),
    g: parseInt(n.slice(3, 5), 16),
    b: parseInt(n.slice(5, 7), 16)
  };
}

function detectColorName(hex: string): string | null {
  const target = hexToRgb(hex);
  if (!target) return null;

  let bestMatch = NAMED_COLORS[0];
  let bestDistance = Number.POSITIVE_INFINITY;

  for (const color of NAMED_COLORS) {
    const rgb = hexToRgb(color.hex);
    if (!rgb) continue;
    const distance =
      Math.pow(target.r - rgb.r, 2) +
      Math.pow(target.g - rgb.g, 2) +
      Math.pow(target.b - rgb.b, 2);
    if (distance < bestDistance) {
      bestDistance = distance;
      bestMatch = color;
    }
  }

  return bestMatch.name;
}

export default function ProductForm({ initialData, isEdit = false }: ProductFormProps) {
  const router = useRouter();
  const { refetchProducts } = useShop() || {};

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

  // Sizes Matrix List State (Default sizes selected)
  const availableSizes = ["XS", "S", "M", "L", "XL", "XXL", "3XL"];
  const [sizes, setSizes] = useState<string[]>(initialData?.sizes || ["S", "M", "L", "XL"]);

  // Color Variants State
  const [colorVariants, setColorVariants] = useState<ColorVariant[]>(initialData?.colorVariants || []);
  
  // Custom Variant Addition Fields
  const [varName, setVarName] = useState("");
  const [varHex, setVarHex] = useState("#c98e87");
  const [lastAutoColorName, setLastAutoColorName] = useState("");
  const [varSku, setVarSku] = useState("");
  const [varStock, setVarStock] = useState<number>(50);
  const [varPriceAdjustment, setVarPriceAdjustment] = useState<number | "">("");
  const [varFrontImage, setVarFrontImage] = useState("");
  const [varModelImage, setVarModelImage] = useState("");

  const [uploadingFront, setUploadingFront] = useState(false);
  const [uploadingModel, setUploadingModel] = useState(false);
  const [uploadingStates, setUploadingStates] = useState<Record<string, boolean>>({});

  // Expandable Variant Card state
  const [expandedVariants, setExpandedVariants] = useState<Record<number, boolean>>({});

  // Submit states
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<Array<{ field: string; message: string }>>([]);

  // Auto-save draft triggers
  useEffect(() => {
    if (!isEdit) {
      const savedDraft = localStorage.getItem("mf-product-form-draft");
      if (savedDraft) {
        try {
          const draft = JSON.parse(savedDraft);
          setTitle(draft.title || "");
          setSlug(draft.slug || "");
          setDescription(draft.description || "");
          setCategory(draft.category || "kurtis");
          setProductType(draft.productType || "kurti");
          setSubcategory(draft.subcategory || "");
          setFabric(draft.fabric || "");
          setSleeveType(draft.sleeveType || "");
          setColor(draft.color || "");
          setPrice(draft.price || "");
          setCompareAtPrice(draft.compareAtPrice || "");
          setStock(draft.stock || "");
          setSizes(draft.sizes || ["S", "M", "L", "XL"]);
          setColorVariants(draft.colorVariants || []);
        } catch (e) {
          console.error("Failed to parse draft:", e);
        }
      }
    }
  }, [isEdit]);

  useEffect(() => {
    if (!isEdit) {
      const draft = {
        title,
        slug,
        description,
        category,
        productType,
        subcategory,
        fabric,
        sleeveType,
        color,
        price,
        compareAtPrice,
        stock,
        sizes,
        colorVariants
      };
      localStorage.setItem("mf-product-form-draft", JSON.stringify(draft));
    }
  }, [title, slug, description, category, productType, subcategory, fabric, sleeveType, color, price, compareAtPrice, stock, sizes, colorVariants, isEdit]);

  // Size toggler
  function handleVariantHexChange(rawHex: string) {
    setVarHex(rawHex);
    const autoName = detectColorName(rawHex);
    if (!autoName) return;
    if (!varName.trim() || varName === lastAutoColorName) {
      setVarName(autoName);
      setLastAutoColorName(autoName);
    }
  }

  function handleToggleSize(size: string) {
    if (sizes.includes(size)) {
      setSizes(sizes.filter((s) => s !== size));
    } else {
      setSizes([...sizes, size]);
    }
  }

  // Variant adding
  function handleAddVariant() {
    if (!varName.trim()) {
      alert("Please specify a Color Name.");
      return;
    }
    if (!varSku.trim()) {
      alert("Please specify a unique SKU.");
      return;
    }
    if (!varFrontImage) {
      alert("Validation Error: Front view image is required per variant.");
      return;
    }

    const newVariant: ColorVariant = {
      name: varName.trim(),
      hex: varHex.trim(),
      sku: varSku.trim(),
      stock: Number(varStock),
      priceAdjustment: varPriceAdjustment ? Number(varPriceAdjustment) : undefined,
      frontImage: varFrontImage,
      modelImage: varModelImage || undefined
    };

    // Animate addition
    const targetIdx = colorVariants.length;
    setColorVariants([...colorVariants, newVariant]);
    setExpandedVariants(prev => ({ ...prev, [targetIdx]: true }));

    // Reset input fields
    setVarName("");
    setVarHex("#c98e87");
    setLastAutoColorName("");
    setVarSku("");
    setVarStock(50);
    setVarPriceAdjustment("");
    setVarFrontImage("");
    setVarModelImage("");

    // Trigger Anime.js entry animation
    setTimeout(() => {
      animate(`.variant-card-${targetIdx}`, {
        opacity: [0, 1],
        translateY: [20, 0],
        duration: 500,
        easing: "easeOutQuad"
      });
    }, 50);
  }

  // Variant deletion
  function handleRemoveVariant(idx: number) {
    animate(`.variant-card-${idx}`, {
      opacity: 0,
      scale: 0.9,
      duration: 300,
      easing: "easeInQuad",
      complete: () => {
        const filtered = colorVariants.filter((_, i) => i !== idx);
        setColorVariants(filtered);
        // Reset expansion states mapping
        const nextExpanded: Record<number, boolean> = {};
        filtered.forEach((_, i) => {
          nextExpanded[i] = true;
        });
        setExpandedVariants(nextExpanded);
      }
    });
  }

  // Reorder variants using Anime.js shifts
  const moveVariant = (index: number, direction: "up" | "down") => {
    const nextIndex = direction === "up" ? index - 1 : index + 1;
    if (nextIndex < 0 || nextIndex >= colorVariants.length) return;

    const updated = [...colorVariants];
    const temp = updated[index];
    updated[index] = updated[nextIndex];
    updated[nextIndex] = temp;
    setColorVariants(updated);

    setExpandedVariants(prev => {
      const next = { ...prev };
      const tempExpanded = next[index];
      next[index] = next[nextIndex];
      next[nextIndex] = tempExpanded;
      return next;
    });

    // Spring animation using Anime.js
    setTimeout(() => {
      animate(`.variant-card-${index}, .variant-card-${nextIndex}`, {
        translateY: [direction === "up" ? 15 : -15, 0],
        duration: 350,
        easing: "easeOutSine"
      });
    }, 50);
  };

  // Submit Handler
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setFormError(null);
    setValidationErrors([]);

    if (colorVariants.length === 0) {
      setFormError("At least one color variant with a Front photo is required.");
      setSubmitting(false);
      return;
    }

    // Verify all variants have front image
    for (const v of colorVariants) {
      if (!v.frontImage) {
        setFormError(`Validation: Variant "${v.name}" is missing Front view image.`);
        setSubmitting(false);
        return;
      }
    }

    if (sizes.length === 0) {
      setFormError("At least one size must be selected.");
      setSubmitting(false);
      return;
    }

    // Flatten all variant images so the main product listing receives them
    const allVariantImages = colorVariants.flatMap(v => [v.frontImage, v.modelImage].filter(Boolean) as string[]);

    // Set first variant's color as default primary color if blank
    const primaryColor = color.trim() || colorVariants[0].name;

    const payload = {
      title,
      slug: slug.trim() || title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""),
      description,
      category,
      productType,
      subcategory,
      fabric,
      sleeveType,
      color: primaryColor,
      price: Number(price),
      compareAtPrice: compareAtPrice ? Number(compareAtPrice) : undefined,
      sizes,
      images: allVariantImages,
      stock: Number(stock) || colorVariants.reduce((sum, v) => sum + (v.stock || 0), 0),
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
        localStorage.removeItem("mf-product-form-draft");
        if (refetchProducts) {
          await refetchProducts();
        }
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

  // Auto-generate slug from title
  useEffect(() => {
    if (!isEdit && title.trim()) {
      setSlug(title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""));
    }
  }, [title, isEdit]);

  function getFieldError(fieldName: string) {
    const error = validationErrors.find(e => e.field === fieldName);
    return error ? error.message : null;
  }

  // Upload file widget component inside form
  function ImageUploadArea({
    label,
    value,
    onChange,
    uploading,
    setUploading,
    id
  }: {
    label: string;
    value: string;
    onChange: (url: string) => void;
    uploading: boolean;
    setUploading: (u: boolean) => void;
    id: string;
  }) {
    const [dragActive, setDragActive] = useState(false);

    const handleDrag = (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      if (e.type === "dragenter" || e.type === "dragover") {
        setDragActive(true);
      } else if (e.type === "dragleave") {
        setDragActive(false);
      }
    };

    const handleDrop = async (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setDragActive(false);

      if (e.dataTransfer.files && e.dataTransfer.files[0]) {
        const file = e.dataTransfer.files[0];
        await uploadToSupabase(file);
      }
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files[0]) {
        const file = e.target.files[0];
        await uploadToSupabase(file);
      }
    };

    const uploadToSupabase = async (file: File) => {
      if (!supabase) {
        alert("Supabase client is not initialized.");
        return;
      }
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

        const { data: urlData } = supabase.storage
          .from("products")
          .getPublicUrl(filePath);

        if (urlData?.publicUrl) {
          onChange(urlData.publicUrl);
        }
      } catch (err: any) {
        console.error("Upload error:", err);
        alert(`Upload failed: ${err.message || "Unknown error"}. Make sure 'products' bucket exists.`);
      } finally {
        setUploading(false);
      }
    };

    return (
      <div
        onDragEnter={handleDrag}
        onDragOver={handleDrag}
        onDragLeave={handleDrag}
        onDrop={handleDrop}
        className={`relative flex flex-col items-center justify-center border border-dashed rounded-xl p-3 text-center transition-all ${
          dragActive
            ? "border-[#c98e87] bg-[#c98e87]/10"
            : value
              ? "border-[#d9a58f33] bg-[#1a191d]/80"
              : "border-[#d9a58f22] bg-[#141316] hover:border-[#d9a58f55]"
        }`}
      >
        <span className="text-[10px] uppercase font-bold tracking-wider text-[#8c827a] mb-2">{label}</span>

        {value ? (
          <div className="relative aspect-[3/4] w-full max-h-36 rounded-lg overflow-hidden border border-[#d9a58f22]">
            <img src={value} alt={label} className="w-full h-full object-cover" />
            <button
              type="button"
              onClick={() => onChange("")}
              className="absolute top-1 right-1 rounded-full bg-black/60 hover:bg-black p-1 text-white transition-colors"
            >
              <Trash size={10} />
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-3">
            <Upload size={20} className="text-[#c98e87]/70 mb-1" />
            <span className="text-[10px] text-[#8c827a] font-light">Drag & drop or</span>
            <input
              type="file"
              id={id}
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
              disabled={uploading}
            />
            <label
              htmlFor={id}
              className="mt-1 text-[10px] font-bold uppercase tracking-wider text-[#c98e87] hover:text-[#f5ebd8] cursor-pointer transition-colors"
            >
              {uploading ? "Uploading..." : "Upload File"}
            </label>
          </div>
        )}

        {uploading && (
          <div className="absolute inset-0 bg-[#0c0b0d]/90 rounded-xl flex flex-col items-center justify-center">
            <div className="h-5 w-5 animate-spin rounded-full border-2 border-t-[#c98e87] border-r-transparent border-b-[#c98e87] border-l-transparent"></div>
            <span className="text-[8px] uppercase tracking-wider text-[#c98e87] mt-1.5">Uploading...</span>
          </div>
        )}
      </div>
    );
  }

  // Get preview thumbnail image of product (first color frontImage)
  const productPreviewImage = colorVariants[0]?.frontImage || "";

  return (
    <form onSubmit={handleSubmit} className="space-y-8 animate-fadeIn max-w-5xl text-[#e3dcd5]">
      {/* Back button */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => router.push("/dashboard/products")}
          className="group flex items-center gap-2 rounded-xl border border-[#d9a58f33] bg-[#1a191d]/80 px-4 py-2.5 text-xs font-semibold uppercase tracking-wider text-[#e3dcd5] hover:bg-[#252328] transition-colors"
        >
          <ArrowLeft size={14} className="group-hover:-translate-x-0.5 transition-transform" />
          Collection
        </button>
      </div>

      {formError && (
        <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-xs text-red-400 font-medium">
          {formError}
        </div>
      )}

      {/* Grid Layout */}
      <div className="grid gap-6 lg:grid-cols-12 items-start">
        {/* LEFT 7 cols: Product Details Card */}
        <div className="lg:col-span-7 space-y-6">
          <div className="rounded-2xl border border-[#d9a58f22] bg-[#161519]/80 backdrop-blur-md p-6 space-y-6 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1 h-full bg-[#c98e87]" />
            
            <div className="flex justify-between items-start gap-4">
              <div className="space-y-1 flex-1">
                <h3 className="font-serif text-xl font-light italic text-[#f5ebd8] tracking-wide">
                  Product Specifications
                </h3>
                <p className="text-[11px] text-[#8c827a] font-light">
                  Provide primary descriptions, fabrics, and baseline valuations.
                </p>
              </div>

              {/* Product Thumbnail on the right */}
              <div className="w-16 h-20 rounded-xl overflow-hidden border border-[#d9a58f22] bg-[#121214] flex-shrink-0 relative">
                {productPreviewImage ? (
                  <img src={productPreviewImage} className="w-full h-full object-cover" alt="Preview" />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-center p-1">
                    <ImageIcon className="text-[#8c827a]/40" size={16} />
                    <span className="text-[7px] text-[#8c827a] uppercase font-bold tracking-wider mt-1">No Image</span>
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-4 pt-4 border-t border-[#d9a58f11]">
              {/* Title & Slug */}
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#8b6b61] mb-1.5">
                    Product Title
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g., Elara Signature Kurta"
                    className={`w-full rounded-xl border bg-[#141316]/50 px-4 py-2.5 text-sm text-[#e3dcd5] focus:outline-none focus:border-[#c98e87] ${
                      getFieldError("title") ? "border-red-500" : "border-[#d9a58f33]"
                    }`}
                    required
                  />
                  {getFieldError("title") && (
                    <p className="mt-1 text-xs text-red-600">{getFieldError("title")}</p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#8b6b61] mb-1.5">
                    Custom URL Slug
                  </label>
                  <input
                    type="text"
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    placeholder="elara-signature-kurta"
                    className={`w-full rounded-xl border bg-[#141316]/50 px-4 py-2.5 text-sm text-[#e3dcd5] focus:outline-none focus:border-[#c98e87] ${
                      getFieldError("slug") ? "border-red-500" : "border-[#d9a58f33]"
                    }`}
                    required
                  />
                  {getFieldError("slug") && (
                    <p className="mt-1 text-xs text-red-600">{getFieldError("slug")}</p>
                  )}
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#8b6b61] mb-1.5">
                  Detailed Atelier Description
                </label>
                <textarea
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe the silhouettes, embroidery details, fit details..."
                  className={`w-full rounded-xl border bg-[#141316]/50 px-4 py-2.5 text-sm text-[#e3dcd5] focus:outline-none focus:border-[#c98e87] ${
                    getFieldError("description") ? "border-red-500" : "border-[#d9a58f33]"
                  }`}
                  required
                />
                {getFieldError("description") && (
                  <p className="mt-1 text-xs text-red-600">{getFieldError("description")}</p>
                )}
              </div>

              {/* Specific Fabric details */}
              <div className="grid gap-4 sm:grid-cols-3">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#8b6b61] mb-1.5">
                    Subcategory
                  </label>
                  <input
                    type="text"
                    value={subcategory}
                    onChange={(e) => setSubcategory(e.target.value)}
                    placeholder="e.g., Embroidered Kurta"
                    className="w-full rounded-xl border border-[#d9a58f33] bg-[#141316]/50 px-4 py-2.5 text-sm text-[#e3dcd5] focus:outline-none focus:border-[#c98e87]"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#8b6b61] mb-1.5">
                    Fabric Detail
                  </label>
                  <input
                    type="text"
                    value={fabric}
                    onChange={(e) => setFabric(e.target.value)}
                    placeholder="e.g., Pure Silk Cotton"
                    className="w-full rounded-xl border border-[#d9a58f33] bg-[#141316]/50 px-4 py-2.5 text-sm text-[#e3dcd5] focus:outline-none focus:border-[#c98e87]"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#8b6b61] mb-1.5">
                    Sleeve Type
                  </label>
                  <input
                    type="text"
                    value={sleeveType}
                    onChange={(e) => setSleeveType(e.target.value)}
                    placeholder="e.g., 3/4 Sleeve"
                    className="w-full rounded-xl border border-[#d9a58f33] bg-[#141316]/50 px-4 py-2.5 text-sm text-[#e3dcd5] focus:outline-none focus:border-[#c98e87]"
                    required
                  />
                </div>
              </div>

              {/* Valuation details */}
              <div className="grid gap-4 sm:grid-cols-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#8b6b61] mb-1.5">
                    Base Price (₹)
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={price}
                    onChange={(e) => setPrice(e.target.value ? parseFloat(e.target.value) : "")}
                    placeholder="Retail Price"
                    className={`w-full rounded-xl border bg-[#141316]/50 px-4 py-2.5 text-sm text-[#e3dcd5] focus:outline-none focus:border-[#c98e87] ${
                      getFieldError("price") ? "border-red-500" : "border-[#d9a58f33]"
                    }`}
                    required
                  />
                  {getFieldError("price") && (
                    <p className="mt-1 text-xs text-red-600">{getFieldError("price")}</p>
                  )}
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#8b6b61] mb-1.5">
                    Compare At Price (₹)
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={compareAtPrice}
                    onChange={(e) => setCompareAtPrice(e.target.value ? parseFloat(e.target.value) : "")}
                    placeholder="Original Price"
                    className="w-full rounded-xl border border-[#d9a58f33] bg-[#141316]/50 px-4 py-2.5 text-sm text-[#e3dcd5] focus:outline-none focus:border-[#c98e87]"
                  />
                </div>
              </div>

              {/* Metadata Fields */}
              <div className="grid gap-4 sm:grid-cols-3">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#8b6b61] mb-1.5">
                    Category
                  </label>
                  <select
                    value={category}
                    onChange={(e) => {
                      const val = e.target.value as Category;
                      setCategory(val);
                      if (val === "tunic-tops") {
                        setProductType("tunic_top");
                      } else if (val === "kurtis") {
                        setProductType("kurti");
                      } else if (val === "dresses") {
                        setProductType("dress");
                      }
                    }}
                    className="w-full rounded-xl border border-[#d9a58f33] bg-[#141316]/80 px-4 py-2.5 text-sm text-[#e3dcd5] focus:outline-none focus:border-[#c98e87]"
                  >
                    <option value="kurtis">Kurtis</option>
                    <option value="dresses">Dresses</option>
                    <option value="tunic-tops">Tunic Tops</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#8b6b61] mb-1.5">
                    Product Type
                  </label>
                  <select
                    value={productType}
                    onChange={(e) => setProductType(e.target.value as ProductType)}
                    className="w-full rounded-xl border border-[#d9a58f33] bg-[#141316]/80 px-4 py-2.5 text-sm text-[#e3dcd5] focus:outline-none focus:border-[#c98e87]"
                  >
                    <option value="kurti">Kurti</option>
                    <option value="tunic_top">Tunic Top</option>
                    <option value="dress">Dress</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#8b6b61] mb-1.5">
                    Status Settings
                  </label>
                  <div className="flex items-center h-[42px] px-2">
                    <label className="flex items-center gap-2 text-sm text-[#e3dcd5] cursor-pointer">
                      <input
                        type="checkbox"
                        checked={isNew}
                        onChange={(e) => setIsNew(e.target.checked)}
                        className="rounded accent-[#c98e87] border-[#d9a58f44] bg-[#141316] h-4 w-4"
                      />
                      New Arrival Tag
                    </label>
                  </div>
                </div>
              </div>

              {/* Sizes Selection */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#8b6b61] mb-2">
                  Sizing Matrix Selection
                </label>
                <div className="flex flex-wrap gap-2">
                  {availableSizes.map((size) => {
                    const active = sizes.includes(size);
                    return (
                      <button
                        key={size}
                        type="button"
                        onClick={() => handleToggleSize(size)}
                        className={`h-9 min-w-9 rounded-lg px-2 text-xs font-bold border transition-all ${
                          active
                            ? "bg-[#c98e87] border-[#c98e87] text-white"
                            : "bg-[#141316]/50 border-[#d9a58f22] text-[#8c827a] hover:bg-[#1a191d]"
                        }`}
                      >
                        {size}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT 5 cols: Color Variants upload layout */}
        <div className="lg:col-span-5 space-y-6">
          <div className="rounded-2xl border border-[#d9a58f22] bg-[#161519]/80 backdrop-blur-md p-6 space-y-6 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1 h-full bg-[#c98e87]" />
            
            <div className="space-y-1">
              <h3 className="font-serif text-xl font-light italic text-[#f5ebd8] tracking-wide flex items-center gap-2">
                <Sparkles size={18} className="text-[#c98e87]" />
                Colorways & Photos
              </h3>
              <p className="text-[11px] text-[#8c827a] font-light">
                Add unique colorways. Each color variant must include a Front view image.
              </p>
            </div>

            {/* List of existing variants */}
            {colorVariants.length > 0 && (
              <div className="space-y-4">
                {colorVariants.map((item, idx) => {
                  const expanded = expandedVariants[idx] !== false;
                  return (
                    <div
                      key={idx}
                      className={`variant-card-${idx} rounded-xl border border-[#d9a58f22] bg-[#1e1d22]/70 overflow-hidden transition-all duration-300`}
                    >
                      {/* Variant card header bar */}
                      <div
                        onClick={() => setExpandedVariants(prev => ({ ...prev, [idx]: !expanded }))}
                        className="flex items-center justify-between p-3 bg-[#17161b]/80 cursor-pointer hover:bg-[#201f25] transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className="h-4 w-4 rounded-full border border-stone-600 flex-shrink-0"
                            style={{ backgroundColor: item.hex }}
                          />
                          <div>
                            <span className="text-xs font-bold text-[#f5ebd8]">{item.name}</span>
                            <span className="text-[9px] text-[#8c827a] font-mono ml-2">({item.sku})</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-3" onClick={e => e.stopPropagation()}>
                          {/* Reordering handles */}
                          <div className="flex items-center gap-1">
                            <button
                              type="button"
                              onClick={() => moveVariant(idx, "up")}
                              disabled={idx === 0}
                              className="text-[#8c827a] hover:text-[#f5ebd8] disabled:opacity-30 disabled:pointer-events-none p-1"
                              title="Move Up"
                            >
                              <ArrowUp size={12} />
                            </button>
                            <button
                              type="button"
                              onClick={() => moveVariant(idx, "down")}
                              disabled={idx === colorVariants.length - 1}
                              className="text-[#8c827a] hover:text-[#f5ebd8] disabled:opacity-30 disabled:pointer-events-none p-1"
                              title="Move Down"
                            >
                              <ArrowDown size={12} />
                            </button>
                          </div>

                          <button
                            type="button"
                            onClick={() => handleRemoveVariant(idx)}
                            className="text-red-400 hover:text-red-600 p-1 flex-shrink-0"
                            title="Delete variant"
                          >
                            <Trash size={12} />
                          </button>

                          {expanded ? <ChevronUp size={14} className="text-[#8c827a]" /> : <ChevronDown size={14} className="text-[#8c827a]" />}
                        </div>
                      </div>

                      {/* Variant card expanded details view */}
                      {expanded && (
                        <div className="p-4 space-y-4 border-t border-[#d9a58f11]">
                          <div className="grid gap-3 grid-cols-3 text-[11px]">
                            <div>
                              <span className="block text-[#8c827a] mb-0.5">SKU</span>
                              <span className="font-mono text-[#f5ebd8]">{item.sku}</span>
                            </div>
                            <div>
                              <span className="block text-[#8c827a] mb-0.5">Stock</span>
                              <span className="font-semibold text-[#f5ebd8]">{item.stock}</span>
                            </div>
                            <div>
                              <span className="block text-[#8c827a] mb-0.5">Adj. Price</span>
                              <span className="text-[#c98e87]">{item.priceAdjustment ? `+₹${item.priceAdjustment}` : "None"}</span>
                            </div>
                          </div>

                          {/* Image views previews side-by-side */}
                          <div className={`grid gap-3 ${item.modelImage ? "grid-cols-2" : "grid-cols-1"}`}>
                            <div className="space-y-1">
                              <span className="block text-[9px] uppercase tracking-wider text-[#8c827a] font-bold text-center">Front View</span>
                              <div className="aspect-[3/4] rounded-lg overflow-hidden border border-[#d9a58f11] bg-stone-900/50">
                                <img src={item.frontImage} className="w-full h-full object-cover" alt="" />
                              </div>
                            </div>
                            {item.modelImage && (
                              <div className="space-y-1">
                                <span className="block text-[9px] uppercase tracking-wider text-[#8c827a] font-bold text-center">On Model</span>
                                <div className="aspect-[3/4] rounded-lg overflow-hidden border border-[#d9a58f11] bg-stone-900/50">
                                  <img src={item.modelImage} className="w-full h-full object-cover" alt="" />
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}

            {/* Custom variant inputs creation area */}
            <div className="border border-dashed border-[#d9a58f33] rounded-xl p-4 bg-[#1e1d22]/30 space-y-4 pt-4 relative">
              <span className="absolute top-[-9px] left-3 bg-[#161519] px-2 text-[10px] font-bold uppercase tracking-widest text-[#c98e87]">
                Add Custom Variant
              </span>

              {/* Variant Specs fields */}
              <div className="grid gap-3 grid-cols-1 sm:grid-cols-2">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-[#8b6b61] mb-1">Color Name</label>
                  <input
                    type="text"
                    value={varName}
                    onChange={(e) => setVarName(e.target.value)}
                    placeholder="e.g. Ruby Red"
                    className="w-full rounded-lg border border-[#d9a58f33] bg-[#141316]/50 px-3 py-2 text-xs text-[#e3dcd5] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-[#8b6b61] mb-1">Hex Swatch</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={varHex}
                      onChange={(e) => handleVariantHexChange(e.target.value)}
                      className="h-8 w-10 border border-[#d9a58f33] bg-transparent cursor-pointer rounded"
                    />
                    <input
                      type="text"
                      value={varHex}
                      onChange={(e) => handleVariantHexChange(e.target.value)}
                      placeholder="#c98e87"
                      className="w-full rounded-lg border border-[#d9a58f33] bg-[#141316]/50 px-3 py-2 text-xs font-mono text-[#e3dcd5] focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-[#8b6b61] mb-1">SKU Code</label>
                  <input
                    type="text"
                    value={varSku}
                    onChange={(e) => setVarSku(e.target.value)}
                    placeholder="e.g. KRT-RBY-01"
                    className="w-full rounded-lg border border-[#d9a58f33] bg-[#141316]/50 px-3 py-2 text-xs text-[#e3dcd5] focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-[#8b6b61] mb-1">Stock</label>
                    <input
                      type="number"
                      min="0"
                      value={varStock}
                      onChange={(e) => setVarStock(e.target.value ? parseInt(e.target.value) : 0)}
                      className="w-full rounded-lg border border-[#d9a58f33] bg-[#141316]/50 px-3 py-2 text-xs text-[#e3dcd5] focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-[#8b6b61] mb-1">Price Adj. (₹)</label>
                    <input
                      type="number"
                      value={varPriceAdjustment}
                      onChange={(e) => setVarPriceAdjustment(e.target.value ? parseFloat(e.target.value) : "")}
                      placeholder="e.g. +300"
                      className="w-full rounded-lg border border-[#d9a58f33] bg-[#141316]/50 px-3 py-2 text-xs text-[#e3dcd5] focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Front and Model image uploads */}
              <div className="grid gap-3 grid-cols-1 sm:grid-cols-2 pt-2 border-t border-[#d9a58f11]">
                <ImageUploadArea
                  label="Front View Photo"
                  value={varFrontImage}
                  onChange={setVarFrontImage}
                  uploading={uploadingFront}
                  setUploading={setUploadingFront}
                  id="variant-front-upload"
                />

                <ImageUploadArea
                  label="On Model Photo (Optional)"
                  value={varModelImage}
                  onChange={setVarModelImage}
                  uploading={uploadingModel}
                  setUploading={setUploadingModel}
                  id="variant-model-upload"
                />
              </div>

              <button
                type="button"
                onClick={handleAddVariant}
                className="w-full flex items-center justify-center gap-1.5 rounded-xl bg-[#faf7f2]/10 hover:bg-[#c98e87] hover:text-[#121214] border border-[#c98e87]/40 text-[#c98e87] py-2.5 text-xs font-bold uppercase tracking-wider transition-all duration-300"
              >
                <Plus size={14} />
                Attach Variant Colorway
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Form Action Buttons */}
      <div className="flex items-center justify-end gap-3 pt-6 border-t border-[#d9a58f22]">
        <button
          type="button"
          onClick={() => {
            localStorage.removeItem("mf-product-form-draft");
            router.push("/dashboard/products");
          }}
          disabled={submitting}
          className="px-6 py-3 rounded-xl border border-[#d9a58f33] text-xs font-semibold uppercase tracking-widest text-[#8c827a] hover:text-[#e3dcd5] hover:bg-[#1a191d] transition-all duration-300"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={submitting}
          className="px-8 py-3 rounded-xl bg-[#c98e87] hover:bg-[#b07871] text-[#121214] text-xs font-bold uppercase tracking-widest transition-all duration-300 flex items-center gap-2 shadow-lg shadow-[#c98e87]/15"
        >
          {submitting ? "Saving..." : isEdit ? "Update Design" : "Publish Design"}
        </button>
      </div>
    </form>
  );
}
