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

  // One Piece specific attributes
  const [length, setLength] = useState(initialData?.length || "");
  const [fitType, setFitType] = useState(initialData?.fitType || "");
  const [neckType, setNeckType] = useState(initialData?.neckType || "");
  const [occasion, setOccasion] = useState(initialData?.occasion || "");

  // Sizes Matrix List State (Default sizes selected)
  const availableSizes = ["XS", "S", "M", "L", "XL", "XXL", "3XL"];
  const [sizes, setSizes] = useState<string[]>(initialData?.sizes || ["S", "M", "L", "XL"]);

  // Color Variants State
  const [colorVariants, setColorVariants] = useState<ColorVariant[]>(() => {
    const raw = initialData?.colorVariants || [];
    return raw.map((v, vIdx) => {
      const varId = v.id || `var_${initialData?.id || 'new'}_${vIdx}_${Math.random().toString(36).substring(2, 5)}`;
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
      images.sort((a, b) => (a.order || 0) - (b.order || 0));
      return {
        ...v,
        id: varId,
        images,
        frontImage: v.frontImage || images.find(img => img.type === "front")?.url || images[0]?.url || "",
        modelImage: v.modelImage || images.find(img => img.type === "back" || img.type === "closeup" || img.type === "gallery")?.url || ""
      };
    });
  });
  
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

  // Photo Management Modals & Toast State
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);
  const [confirmDeleteImage, setConfirmDeleteImage] = useState<{ variantId: string; imageId: string } | null>(null);
  const [confirmDeleteVariant, setConfirmDeleteVariant] = useState<{ variantId: string; variantName: string } | null>(null);
  const [addPhotoModal, setAddPhotoModal] = useState<{ variantId: string } | null>(null);
  const [newPhotoType, setNewPhotoType] = useState<"front" | "back" | "side" | "closeup" | "gallery">("gallery");
  const [newPhotoUrl, setNewPhotoUrl] = useState("");
  const [uploadingNewPhoto, setUploadingNewPhoto] = useState(false);
  const [draggedImage, setDraggedImage] = useState<{ variantId: string; imageId: string } | null>(null);

  const showToast = (message: string, type: "success" | "error" = "success") => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 3000);
  };

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
          setLength(draft.length || "");
          setFitType(draft.fitType || "");
          setNeckType(draft.neckType || "");
          setOccasion(draft.occasion || "");
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
        colorVariants,
        length,
        fitType,
        neckType,
        occasion
      };
      localStorage.setItem("mf-product-form-draft", JSON.stringify(draft));
    }
  }, [title, slug, description, category, productType, subcategory, fabric, sleeveType, color, price, compareAtPrice, stock, sizes, colorVariants, length, fitType, neckType, occasion, isEdit]);

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

    const varId = `var_${Date.now()}_${Math.random().toString(36).substring(2, 5)}`;
    const images = [];
    if (varFrontImage) {
      images.push({
        id: `img_${varId}_front`,
        type: "front" as const,
        url: varFrontImage,
        order: 1
      });
    }
    if (varModelImage) {
      images.push({
        id: `img_${varId}_model`,
        type: "back" as const,
        url: varModelImage,
        order: 2
      });
    }

    const newVariant: ColorVariant = {
      id: varId,
      name: varName.trim(),
      hex: varHex.trim(),
      sku: varSku.trim(),
      stock: Number(varStock),
      priceAdjustment: varPriceAdjustment ? Number(varPriceAdjustment) : undefined,
      frontImage: varFrontImage,
      modelImage: varModelImage || undefined,
      images
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
    const item = colorVariants[idx];
    if (item && item.id) {
      setConfirmDeleteVariant({ variantId: item.id, variantName: item.name });
    }
  }

  // Delete single photo
  const handleDeleteImage = async () => {
    if (!confirmDeleteImage) return;
    const { variantId, imageId } = confirmDeleteImage;
    
    let imgUrl = "";
    colorVariants.forEach(v => {
      if (v.id === variantId && v.images) {
        const img = v.images.find(i => i.id === imageId);
        if (img) imgUrl = img.url;
      }
    });

    setConfirmDeleteImage(null);
    setUploadingStates(prev => ({ ...prev, [imageId]: true }));
    
    try {
      // Optimistic update
      setColorVariants(prev => {
        return prev.map(v => {
          if (v.id === variantId && v.images) {
            const updatedImages = v.images.filter(img => img.id !== imageId);
            const frontImg = updatedImages.find(i => i.type === "front")?.url || updatedImages[0]?.url || "";
            const modelImg = updatedImages.find(i => i.type === "back" || i.type === "closeup" || i.type === "gallery")?.url || "";
            return {
              ...v,
              images: updatedImages,
              frontImage: frontImg,
              modelImage: modelImg
            };
          }
          return v;
        });
      });

      // Storage deletion client-side first
      if (supabase && imgUrl) {
        const bucketMarker = "/storage/v1/object/public/products/";
        const markerIndex = imgUrl.indexOf(bucketMarker);
        if (markerIndex !== -1) {
          const filePath = imgUrl.slice(markerIndex + bucketMarker.length);
          const decodedPath = decodeURIComponent(filePath);
          await supabase.storage.from("products").remove([decodedPath]);
        }
      }

      if (isEdit) {
        const res = await fetch("/api/admin/variants", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            action: "delete-image",
            imageId
          })
        });
        const resData = await res.json();
        if (!resData.success) throw new Error(resData.message || "Failed to delete image from DB.");
      }
      
      showToast("Photo deleted successfully.");
    } catch (err: any) {
      console.error(err);
      showToast(err.message || "Failed to delete image.", "error");
    } finally {
      setUploadingStates(prev => ({ ...prev, [imageId]: false }));
    }
  };

  // Replace photo file
  const handleReplaceImageFile = async (
    e: React.ChangeEvent<HTMLInputElement>,
    variantId: string,
    imageId: string
  ) => {
    if (!e.target.files || !e.target.files[0]) return;
    const file = e.target.files[0];
    
    // Find old URL to delete later
    let oldUrl = "";
    colorVariants.forEach(v => {
      if (v.id === variantId && v.images) {
        const img = v.images.find(i => i.id === imageId);
        if (img) oldUrl = img.url;
      }
    });

    setUploadingStates(prev => ({ ...prev, [imageId]: true }));
    
    try {
      if (!supabase) throw new Error("Supabase is not initialized.");
      
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
        
      if (!urlData?.publicUrl) throw new Error("Failed to get public URL.");
      
      const newUrl = urlData.publicUrl;
      
      // Optimistic update
      setColorVariants(prev => {
        return prev.map(v => {
          if (v.id === variantId && v.images) {
            const updatedImages = v.images.map(img => {
              if (img.id === imageId) {
                return { ...img, url: newUrl };
              }
              return img;
            });
            const frontImg = updatedImages.find(i => i.type === "front")?.url || updatedImages[0]?.url || "";
            const modelImg = updatedImages.find(i => i.type === "back" || i.type === "closeup" || i.type === "gallery")?.url || "";
            return {
              ...v,
              images: updatedImages,
              frontImage: frontImg,
              modelImage: modelImg
            };
          }
          return v;
        });
      });
      
      // Delete old file from storage client-side
      if (supabase && oldUrl) {
        const bucketMarker = "/storage/v1/object/public/products/";
        const markerIndex = oldUrl.indexOf(bucketMarker);
        if (markerIndex !== -1) {
          const filePath = oldUrl.slice(markerIndex + bucketMarker.length);
          const decodedPath = decodeURIComponent(filePath);
          await supabase.storage.from("products").remove([decodedPath]);
        }
      }

      if (isEdit) {
        const res = await fetch("/api/admin/variants", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            action: "replace-image",
            variantId,
            imageId,
            newImageUrl: newUrl
          })
        });
        const resData = await res.json();
        if (!resData.success) throw new Error(resData.message || "Failed to update image on database.");
      }
      
      showToast("Photo replaced successfully.");
    } catch (err: any) {
      console.error(err);
      showToast(err.message || "Failed to replace image.", "error");
    } finally {
      setUploadingStates(prev => ({ ...prev, [imageId]: false }));
    }
  };

  // Add additional photo
  const handleSaveNewPhoto = async () => {
    if (!addPhotoModal) return;
    const { variantId } = addPhotoModal;
    
    if (!newPhotoUrl) {
      alert("Please upload an image first.");
      return;
    }
    
    const imageId = `img_${Date.now()}_${Math.random().toString(36).substring(2, 5)}`;
    
    let maxOrder = 0;
    colorVariants.forEach(v => {
      if (v.id === variantId && v.images) {
        maxOrder = v.images.reduce((max, img) => Math.max(max, img.order || 0), 0);
      }
    });
    
    const newImage = {
      id: imageId,
      type: newPhotoType,
      url: newPhotoUrl,
      order: maxOrder + 1
    };

    setAddPhotoModal(null);
    setNewPhotoUrl("");
    
    try {
      // Optimistic update
      setColorVariants(prev => {
        return prev.map(v => {
          if (v.id === variantId) {
            const updatedImages = v.images ? [...v.images, newImage] : [newImage];
            updatedImages.sort((a, b) => (a.order || 0) - (b.order || 0));
            const frontImg = updatedImages.find(i => i.type === "front")?.url || updatedImages[0]?.url || "";
            const modelImg = updatedImages.find(i => i.type === "back" || i.type === "closeup" || i.type === "gallery")?.url || "";
            return {
              ...v,
              images: updatedImages,
              frontImage: frontImg,
              modelImage: modelImg
            };
          }
          return v;
        });
      });

      if (isEdit) {
        const res = await fetch("/api/admin/variants", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            action: "add-image",
            variantId,
            image: {
              id: imageId,
              type: newPhotoType,
              url: newPhotoUrl
            }
          })
        });
        const resData = await res.json();
        if (!resData.success) throw new Error(resData.message || "Failed to add image to DB.");
      }
      
      showToast("Photo added successfully.");
    } catch (err: any) {
      console.error(err);
      showToast(err.message || "Failed to add photo.", "error");
    }
  };

  // Delete entire variant
  const handleDeleteVariant = async () => {
    if (!confirmDeleteVariant) return;
    const { variantId } = confirmDeleteVariant;
    
    const variant = colorVariants.find(v => v.id === variantId);
    const imgUrls = variant?.images?.map(img => img.url) || [];
    
    setConfirmDeleteVariant(null);
    
    try {
      const idx = colorVariants.findIndex(v => v.id === variantId);
      if (idx !== -1) {
        animate(`.variant-card-${idx}`, {
          opacity: 0,
          scale: 0.9,
          duration: 300,
          easing: "easeInQuad",
          complete: async () => {
            setColorVariants(prev => prev.filter(v => v.id !== variantId));
            
            // Delete storage files client-side
            if (supabase && imgUrls.length > 0) {
              const paths = imgUrls.map(url => {
                const bucketMarker = "/storage/v1/object/public/products/";
                const markerIndex = url.indexOf(bucketMarker);
                if (markerIndex !== -1) {
                  return decodeURIComponent(url.slice(markerIndex + bucketMarker.length));
                }
                return "";
              }).filter(Boolean);
              
              if (paths.length > 0) {
                await supabase.storage.from("products").remove(paths);
              }
            }

            if (isEdit) {
              const res = await fetch("/api/admin/variants", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  action: "delete-variant",
                  variantId
                })
              });
              const resData = await res.json();
              if (!resData.success) throw new Error(resData.message || "Failed to delete variant from DB.");
            }
            
            showToast("Color variant deleted successfully.");
          }
        });
      }
    } catch (err: any) {
      console.error(err);
      showToast(err.message || "Failed to delete variant.", "error");
    }
  };

  // Drag and drop image reordering
  const handleDragStart = (e: React.DragEvent, variantId: string, imageId: string) => {
    setDraggedImage({ variantId, imageId });
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = async (e: React.DragEvent, targetVariantId: string, targetImageId: string) => {
    e.preventDefault();
    if (!draggedImage || draggedImage.variantId !== targetVariantId) return;
    
    const { variantId, imageId: sourceImageId } = draggedImage;
    setDraggedImage(null);
    
    if (sourceImageId === targetImageId) return;

    const variant = colorVariants.find(v => v.id === variantId);
    if (!variant || !variant.images) return;

    const images = [...variant.images];
    const sourceIdx = images.findIndex(img => img.id === sourceImageId);
    const targetIdx = images.findIndex(img => img.id === targetImageId);
    
    if (sourceIdx === -1 || targetIdx === -1) return;

    const [movedImage] = images.splice(sourceIdx, 1);
    images.splice(targetIdx, 0, movedImage);

    const reorderedList = images.map((img, index) => ({
      ...img,
      order: index + 1
    }));

    setColorVariants(prev => {
      return prev.map(v => {
        if (v.id === variantId) {
          const frontImg = reorderedList.find(i => i.type === "front")?.url || reorderedList[0]?.url || "";
          const modelImg = reorderedList.find(i => i.type === "back" || i.type === "closeup" || i.type === "gallery")?.url || "";
          return {
            ...v,
            images: reorderedList,
            frontImage: frontImg,
            modelImage: modelImg
          };
        }
        return v;
      });
    });

    try {
      if (isEdit) {
        const payload = reorderedList.map(img => ({
          id: img.id,
          order: img.order
        }));
        
        const res = await fetch("/api/admin/variants", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            action: "reorder-images",
            variantId,
            reorderedImages: payload
          })
        });
        const resData = await res.json();
        if (!resData.success) throw new Error(resData.message || "Failed to update image order in DB.");
      }
      showToast("Photos reordered successfully.");
    } catch (err: any) {
      console.error(err);
      showToast(err.message || "Failed to save photo order.", "error");
    }
  };

  // Click / Button rapid reordering
  const handleArrowReorder = async (variantId: string, imageId: string, direction: "left" | "right") => {
    const variant = colorVariants.find(v => v.id === variantId);
    if (!variant || !variant.images) return;

    const images = [...variant.images];
    const idx = images.findIndex(img => img.id === imageId);
    if (idx === -1) return;

    const targetIdx = direction === "left" ? idx - 1 : idx + 1;
    if (targetIdx < 0 || targetIdx >= images.length) return;

    const temp = images[idx];
    images[idx] = images[targetIdx];
    images[targetIdx] = temp;

    const reorderedList = images.map((img, index) => ({
      ...img,
      order: index + 1
    }));

    setColorVariants(prev => {
      return prev.map(v => {
        if (v.id === variantId) {
          const frontImg = reorderedList.find(i => i.type === "front")?.url || reorderedList[0]?.url || "";
          const modelImg = reorderedList.find(i => i.type === "back" || i.type === "closeup" || i.type === "gallery")?.url || "";
          return {
            ...v,
            images: reorderedList,
            frontImage: frontImg,
            modelImage: modelImg
          };
        }
        return v;
      });
    });

    try {
      if (isEdit) {
        const payload = reorderedList.map(img => ({
          id: img.id,
          order: img.order
        }));
        
        const res = await fetch("/api/admin/variants", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            action: "reorder-images",
            variantId,
            reorderedImages: payload
          })
        });
        const resData = await res.json();
        if (!resData.success) throw new Error(resData.message || "Failed to update image order in DB.");
      }
      showToast("Photo order updated.");
    } catch (err: any) {
      console.error(err);
      showToast(err.message || "Failed to save photo order.", "error");
    }
  };

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
      colorVariants,
      // One Piece specific attributes
      length: category === "one-piece" ? length : undefined,
      fitType: category === "one-piece" ? fitType : undefined,
      neckType: category === "one-piece" ? neckType : undefined,
      occasion: category === "one-piece" ? occasion : undefined,
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
                      } else if (val === "one-piece") {
                        setProductType("one_piece");
                      }
                    }}
                    className="w-full rounded-xl border border-[#d9a58f33] bg-[#141316]/80 px-4 py-2.5 text-sm text-[#e3dcd5] focus:outline-none focus:border-[#c98e87]"
                  >
                    <option value="kurtis">Kurtis</option>
                    <option value="dresses">Dresses</option>
                    <option value="tunic-tops">Tunic Tops</option>
                    <option value="one-piece">One Piece</option>
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
                    <option value="one_piece">One Piece</option>
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

              {/* One Piece Specific Attributes (Conditional) */}
              {category === "one-piece" && (
                <div className="grid gap-4 sm:grid-cols-4 p-4 rounded-xl border border-[#d9a58f22] bg-[#141316]/20">
                  <div className="sm:col-span-4">
                    <h4 className="text-xs font-bold uppercase tracking-widest text-[#c98e87]">
                      One Piece Styling Attributes
                    </h4>
                    <p className="text-[10px] text-[#8b6b61] mt-0.5">
                      Configure custom categorization tags for the luxury One Piece catalog.
                    </p>
                  </div>
                  
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#8b6b61] mb-1.5">
                      Length
                    </label>
                    <select
                      value={length}
                      onChange={(e) => setLength(e.target.value)}
                      className="w-full rounded-xl border border-[#d9a58f33] bg-[#141316]/80 px-4 py-2.5 text-sm text-[#e3dcd5] focus:outline-none focus:border-[#c98e87]"
                    >
                      <option value="">Select Length</option>
                      <option value="Mini">Mini</option>
                      <option value="Above Knee">Above Knee</option>
                      <option value="Knee Length">Knee Length</option>
                      <option value="Midi">Midi</option>
                      <option value="Maxi">Maxi</option>
                      <option value="Floor Length">Floor Length</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#8b6b61] mb-1.5">
                      Fit Type
                    </label>
                    <select
                      value={fitType}
                      onChange={(e) => setFitType(e.target.value)}
                      className="w-full rounded-xl border border-[#d9a58f33] bg-[#141316]/80 px-4 py-2.5 text-sm text-[#e3dcd5] focus:outline-none focus:border-[#c98e87]"
                    >
                      <option value="">Select Fit Type</option>
                      <option value="Regular">Regular</option>
                      <option value="A-Line">A-Line</option>
                      <option value="Fit & Flare">Fit & Flare</option>
                      <option value="Bodycon">Bodycon</option>
                      <option value="Straight Fit">Straight Fit</option>
                      <option value="Oversized">Oversized</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#8b6b61] mb-1.5">
                      Neck Type
                    </label>
                    <select
                      value={neckType}
                      onChange={(e) => setNeckType(e.target.value)}
                      className="w-full rounded-xl border border-[#d9a58f33] bg-[#141316]/80 px-4 py-2.5 text-sm text-[#e3dcd5] focus:outline-none focus:border-[#c98e87]"
                    >
                      <option value="">Select Neck Type</option>
                      <option value="Round Neck">Round Neck</option>
                      <option value="V Neck">V Neck</option>
                      <option value="Square Neck">Square Neck</option>
                      <option value="Boat Neck">Boat Neck</option>
                      <option value="Collar Neck">Collar Neck</option>
                      <option value="Sweetheart Neck">Sweetheart Neck</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#8b6b61] mb-1.5">
                      Occasion
                    </label>
                    <select
                      value={occasion}
                      onChange={(e) => setOccasion(e.target.value)}
                      className="w-full rounded-xl border border-[#d9a58f33] bg-[#141316]/80 px-4 py-2.5 text-sm text-[#e3dcd5] focus:outline-none focus:border-[#c98e87]"
                    >
                      <option value="">Select Occasion</option>
                      <option value="Casual Wear">Casual Wear</option>
                      <option value="Office Wear">Office Wear</option>
                      <option value="Party Wear">Party Wear</option>
                      <option value="Festive Wear">Festive Wear</option>
                      <option value="Vacation Wear">Vacation Wear</option>
                      <option value="Evening Wear">Evening Wear</option>
                    </select>
                  </div>
                </div>
              )}

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

                           {/* Variant images grid */}
                           <div className="space-y-2">
                             <span className="block text-[10px] font-bold uppercase tracking-wider text-[#8b6b61]">
                               Photos
                             </span>
                             <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                               {(item.images || []).map((img, imgIdx) => {
                                 const isUploading = uploadingStates[img.id];
                                 return (
                                   <div
                                     key={img.id}
                                     draggable
                                     onDragStart={(e) => handleDragStart(e, item.id || '', img.id)}
                                     onDragOver={handleDragOver}
                                     onDrop={(e) => handleDrop(e, item.id || '', img.id)}
                                     className="group relative aspect-[3/4] rounded-lg overflow-hidden border border-[#d9a58f22] bg-[#141316] cursor-grab active:cursor-grabbing hover:border-[#c98e87]/50 transition-all duration-300 flex flex-col justify-between"
                                   >
                                     {/* Image */}
                                     <img
                                       src={img.url}
                                       alt={`${item.name} - ${img.type}`}
                                       className="absolute inset-0 w-full h-full object-cover select-none pointer-events-none group-hover:scale-105 transition-transform duration-500"
                                     />

                                     {/* Type Badge */}
                                     <div className="absolute top-1.5 left-1.5 bg-black/60 backdrop-blur-md border border-[#d9a58f22] rounded px-1.5 py-0.5 text-[8px] uppercase tracking-wider font-bold text-[#c98e87] z-10">
                                       {img.type}
                                     </div>

                                     {/* Reorder indicators / buttons */}
                                     <div className="absolute top-1.5 right-1.5 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                                       <button
                                         type="button"
                                         onClick={() => handleArrowReorder(item.id || '', img.id, "left")}
                                         disabled={imgIdx === 0}
                                         className="bg-black/60 hover:bg-black p-1 rounded text-white disabled:opacity-30 transition-all active:scale-95"
                                         title="Move left"
                                       >
                                         <ArrowLeft size={10} />
                                       </button>
                                       <button
                                         type="button"
                                         onClick={() => handleArrowReorder(item.id || '', img.id, "right")}
                                         disabled={imgIdx === (item.images?.length || 1) - 1}
                                         className="bg-black/60 hover:bg-black p-1 rounded text-white disabled:opacity-30 transition-all active:scale-95 animate-rotate-180"
                                         title="Move right"
                                       >
                                         <ArrowLeft size={10} className="rotate-180" />
                                       </button>
                                     </div>

                                     {/* Uploading indicator */}
                                     {isUploading && (
                                       <div className="absolute inset-0 bg-black/85 flex flex-col items-center justify-center z-20">
                                         <div className="h-5 w-5 animate-spin rounded-full border-2 border-t-[#c98e87] border-r-transparent border-b-[#c98e87] border-l-transparent"></div>
                                         <span className="text-[8px] uppercase tracking-wider text-[#c98e87] mt-1.5">Processing...</span>
                                       </div>
                                     )}

                                     {/* Desktop Hover Controls */}
                                     <div className="absolute inset-0 bg-[#0c0b0d]/75 opacity-0 group-hover:opacity-100 transition-opacity duration-300 hidden md:flex flex-col items-center justify-center gap-2 z-10">
                                       <button
                                         type="button"
                                         onClick={() => {
                                           document.getElementById(`replace-input-${img.id}`)?.click();
                                         }}
                                         className="px-3 py-1.5 rounded-lg border border-[#c98e87]/40 bg-[#c98e87]/10 text-[10px] font-bold uppercase tracking-wider text-[#f5ebd8] hover:bg-[#c98e87] hover:text-black transition-all flex items-center gap-1 active:scale-95"
                                       >
                                         ✏ Replace
                                       </button>
                                       <button
                                         type="button"
                                         onClick={() => setConfirmDeleteImage({ variantId: item.id || '', imageId: img.id })}
                                         className="px-3 py-1.5 rounded-lg border border-red-500/40 bg-red-500/10 text-[10px] font-bold uppercase tracking-wider text-red-200 hover:bg-red-500 hover:text-white transition-all flex items-center gap-1 active:scale-95"
                                       >
                                         🗑 Delete
                                       </button>
                                     </div>

                                     {/* Mobile Overlay (Floating Action Buttons) */}
                                     <div className="absolute bottom-2 inset-x-2 flex justify-between md:hidden z-10">
                                       <button
                                         type="button"
                                         onClick={() => {
                                           document.getElementById(`replace-input-${img.id}`)?.click();
                                         }}
                                         className="h-8 w-8 rounded-full bg-black/80 backdrop-blur-md border border-[#c98e87]/40 text-[#f5ebd8] flex items-center justify-center shadow-lg active:scale-95"
                                         title="Replace image"
                                       >
                                         ✏
                                       </button>
                                       <button
                                         type="button"
                                         onClick={() => setConfirmDeleteImage({ variantId: item.id || '', imageId: img.id })}
                                         className="h-8 w-8 rounded-full bg-black/80 backdrop-blur-md border border-red-500/40 text-red-400 flex items-center justify-center shadow-lg active:scale-95"
                                         title="Delete image"
                                       >
                                         🗑
                                       </button>
                                     </div>

                                     {/* Hidden Replace Input */}
                                     <input
                                       type="file"
                                       id={`replace-input-${img.id}`}
                                       accept="image/*"
                                       onChange={(e) => handleReplaceImageFile(e, item.id || '', img.id)}
                                       className="hidden"
                                     />
                                   </div>
                                 );
                               })}

                               {/* + Add Photo Card */}
                               <button
                                 type="button"
                                 onClick={() => setAddPhotoModal({ variantId: item.id || '' })}
                                 className="relative aspect-[3/4] rounded-lg border border-dashed border-[#d9a58f33] bg-[#141316]/40 hover:bg-[#1a191d]/60 hover:border-[#c98e87]/40 transition-all flex flex-col items-center justify-center gap-1.5 text-[#8c827a] hover:text-[#f5ebd8] active:scale-95"
                               >
                                 <Plus size={20} />
                                 <span className="text-[10px] font-bold uppercase tracking-wider">Add Photo</span>
                               </button>
                             </div>
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

      {/* Toast Notification */}
      {toast && (
        <div className="fixed bottom-5 right-5 z-50 animate-slideIn select-none pointer-events-none">
          <div className={`flex items-center gap-2 rounded-xl border px-4 py-3 shadow-2xl backdrop-blur-md ${
            toast.type === "success" 
              ? "border-[#c98e87]/40 bg-[#161519]/90 text-[#f5ebd8]" 
              : "border-red-500/40 bg-red-950/90 text-red-200"
          }`}>
            <span className={toast.type === "success" ? "text-[#c98e87]" : "text-red-400"}>
              {toast.type === "success" ? "✓" : "⚠"}
            </span>
            <span className="text-xs font-semibold">{toast.message}</span>
          </div>
        </div>
      )}

      {/* Confirm Delete Image Modal */}
      {confirmDeleteImage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="w-full max-w-sm rounded-2xl border border-[#d9a58f22] bg-[#1a191d] p-6 shadow-2xl space-y-4">
            <h4 className="font-serif text-lg font-light text-[#f5ebd8] tracking-wide">
              Delete this photo?
            </h4>
            <p className="text-xs text-[#8c827a] font-light leading-relaxed">
              Are you sure you want to permanently remove this photo? This will delete the photo record and its storage object immediately.
            </p>
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setConfirmDeleteImage(null)}
                className="px-4 py-2 rounded-lg border border-[#d9a58f33] text-xs text-[#8c827a] hover:text-[#e3dcd5] transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeleteImage}
                className="px-4 py-2 rounded-lg bg-red-500/20 border border-red-500/40 text-xs text-red-200 hover:bg-red-500 hover:text-white transition-all"
              >
                Delete Photo
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirm Delete Variant Modal */}
      {confirmDeleteVariant && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="w-full max-w-sm rounded-2xl border border-red-900/30 bg-[#1a191d] p-6 shadow-2xl space-y-4">
            <h4 className="font-serif text-lg font-light text-red-200 tracking-wide">
              Delete {confirmDeleteVariant.variantName} Variant?
            </h4>
            <div className="text-xs text-[#8c827a] font-light leading-relaxed space-y-2">
              <p>This will permanently remove:</p>
              <ul className="list-disc pl-4 space-y-1">
                <li>All variant photos from storage</li>
                <li>Inventory and stock details</li>
                <li>SKU and pricing information</li>
                <li>Metadata mapping</li>
              </ul>
            </div>
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setConfirmDeleteVariant(null)}
                className="px-4 py-2 rounded-lg border border-[#d9a58f33] text-xs text-[#8c827a] hover:text-[#e3dcd5] transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeleteVariant}
                className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-xs text-white transition-all"
              >
                Delete Variant
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Photo Modal */}
      {addPhotoModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-2xl border border-[#d9a58f22] bg-[#1a191d] p-6 shadow-2xl space-y-4">
            <h4 className="font-serif text-lg font-light text-[#f5ebd8] tracking-wide">
              Add Photo to Variant
            </h4>
            
            <div className="space-y-3">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-[#8b6b61] mb-1">
                  Photo Type / View
                </label>
                <select
                  value={newPhotoType}
                  onChange={(e) => setNewPhotoType(e.target.value as any)}
                  className="w-full rounded-lg border border-[#d9a58f33] bg-[#141316]/50 px-3 py-2 text-xs text-[#e3dcd5] focus:outline-none"
                >
                  <option value="front">Front View</option>
                  <option value="back">Back View</option>
                  <option value="side">Side View</option>
                  <option value="closeup">Closeup</option>
                  <option value="gallery">Gallery Images</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-[#8b6b61] mb-1">
                  Image Upload
                </label>
                <div className="mt-1">
                  <ImageUploadArea
                    label="Choose File"
                    value={newPhotoUrl}
                    onChange={setNewPhotoUrl}
                    uploading={uploadingNewPhoto}
                    setUploading={setUploadingNewPhoto}
                    id="new-photo-upload"
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => {
                  setAddPhotoModal(null);
                  setNewPhotoUrl("");
                }}
                className="px-4 py-2 rounded-lg border border-[#d9a58f33] text-xs text-[#8c827a] hover:text-[#e3dcd5] transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={!newPhotoUrl || uploadingNewPhoto}
                onClick={handleSaveNewPhoto}
                className="px-4 py-2 rounded-lg bg-[#c98e87] hover:bg-[#b07871] text-xs font-bold text-[#121214] disabled:opacity-50 transition-all uppercase tracking-wider"
              >
                Add to Gallery
              </button>
            </div>
          </div>
        </div>
      )}
    </form>
  );
}
