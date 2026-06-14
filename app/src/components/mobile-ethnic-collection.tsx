"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Heart, Plus, Minus, ShoppingBag } from "lucide-react";
import { useShop } from "@/context/shop-context";
import { Product } from "@/types";

// ─── DATASET FOR MOBILE PREVIEWS (modeless / flat-lay photos) ──
const K = "/photo modeless/kurti";
const T = "/photo modeless/tunic";

const mobileKurtis: Product[] = [
  {
    id: "mobile-k1", slug: "rayon-floral-printed-kurti", title: "Rayon Floral Printed Kurti",
    category: "kurtis", productType: "kurti", subcategory: "Surat Printed",
    description: "An elegant rayon floral printed kurti featuring beautiful embroidery on the neck. Crafted with a premium drape and lightweight comfort.",
    fabric: "Premium Rayon Slub", sleeveType: "3/4 Sleeve", color: "Peach Blush",
    price: 899, compareAtPrice: 1799, sizes: ["S", "M", "L", "XL", "XXL"], stock: 22, rating: 4.8, reviews: 142, isNew: true,
    images: [`${K}/7991032735d4941dd872e07f4fbe08e9b26d6ab69dd81479a7c1782d6be2067c.png`, `${K}/a2160073ca5a0516fa6601f8080a04d1aabe78848f023fa689ec1a79a265d7c3.png`],
    colorVariants: [{ name: "Peach Blush", hex: "#EAD6CF" }, { name: "Teal Glow", hex: "#0D9488" }]
  },
  {
    id: "mobile-k2", slug: "cotton-anarkali-tunic-set", title: "Cotton Anarkali Tunic Set",
    category: "kurtis", productType: "kurti", subcategory: "Anarkali Flares",
    description: "Traditional Anarkali flared kurti in gold foil motifs. Tailored in soft cotton mulmul, providing high breathability and festive charm.",
    fabric: "100% Cotton Mulmul", sleeveType: "Full Sleeve", color: "Deep Maroon",
    price: 1299, compareAtPrice: 2599, sizes: ["S", "M", "L", "XL", "XXL"], stock: 15, rating: 4.9, reviews: 188, isNew: true,
    images: [`${K}/a2160073ca5a0516fa6601f8080a04d1aabe78848f023fa689ec1a79a265d7c3.png`, `${K}/cbced159d300f0054a98f6dfc484470966caffb38e10e3395b2a02acefafd358.png`],
    colorVariants: [{ name: "Deep Maroon", hex: "#6E2B38" }, { name: "Mustard Gold", hex: "#DCCBA0" }]
  },
  {
    id: "mobile-k3", slug: "jaipuri-printed-straight-kurti", title: "Jaipuri Printed Straight Kurti",
    category: "kurtis", productType: "kurti", subcategory: "Jaipuri Classic",
    description: "A classic straight-cut cotton kurti featuring hand-block Jaipuri style prints. Very comfortable and perfect for work or casual days.",
    fabric: "Jaipuri Cotton", sleeveType: "3/4 Sleeve", color: "Indigo Blue",
    price: 699, compareAtPrice: 1399, sizes: ["S", "M", "L", "XL"], stock: 35, rating: 4.6, reviews: 94,
    images: [`${K}/cbced159d300f0054a98f6dfc484470966caffb38e10e3395b2a02acefafd358.png`, `${K}/b0a5ec56bc902575b46e9d0d7697624ef2ef93927e83e7f40cde9a330c9d749a.png`],
    colorVariants: [{ name: "Indigo Blue", hex: "#2B3D5C" }, { name: "Turquoise Green", hex: "#2B5C4A" }]
  },
  {
    id: "mobile-k4", slug: "silk-blend-aline-kurti", title: "Silk Blend A-Line Kurti",
    category: "kurtis", productType: "kurti", subcategory: "Chanderi Shimmer",
    description: "An elegant A-line kurti with subtle hand-stitched sequins detail around the yoke. Exudes a gentle sheen ideal for semi-formal gatherings.",
    fabric: "Chanderi Silk Blend", sleeveType: "3/4 Sleeve", color: "Sage Green",
    price: 1099, compareAtPrice: 2199, sizes: ["S", "M", "L", "XL", "XXL"], stock: 18, rating: 4.7, reviews: 112,
    images: [`${K}/b0a5ec56bc902575b46e9d0d7697624ef2ef93927e83e7f40cde9a330c9d749a.png`, `${K}/30d97ad77e93ea942815e38bb52e9a50afb83be88dcfd62ece7199044bdc6c91.png`],
    colorVariants: [{ name: "Sage Green", hex: "#A5BCA0" }, { name: "Dusty Rose", hex: "#C98A9E" }]
  },
  {
    id: "mobile-k5", slug: "chikankari-linen-styled-kurti", title: "Chikankari Linen Styled Kurti",
    category: "kurtis", productType: "kurti", subcategory: "Luxe Linen",
    description: "Intricate faux Chikankari threadwork on light, breathable cotton-linen fabric. Offers a traditional, neat, and highly sophisticated vibe.",
    fabric: "Soft Cotton Linen", sleeveType: "3/4 Sleeve", color: "Classic Ivory",
    price: 999, compareAtPrice: 1999, sizes: ["S", "M", "L", "XL"], stock: 24, rating: 4.8, reviews: 120, isNew: true,
    images: [`${K}/30d97ad77e93ea942815e38bb52e9a50afb83be88dcfd62ece7199044bdc6c91.png`, `${K}/7991032735d4941dd872e07f4fbe08e9b26d6ab69dd81479a7c1782d6be2067c.png`],
    colorVariants: [{ name: "Classic Ivory", hex: "#FFF8F4" }, { name: "Lilac Frost", hex: "#D9CBE8" }]
  },
  {
    id: "mobile-k6", slug: "organza-designer-kurti", title: "Organza Designer Kurti",
    category: "kurtis", productType: "kurti", subcategory: "Occasion Wear",
    description: "Luxurious organza silk designer kurti adorned with detailed floral print layout and premium golden zari lace detailing along the hem.",
    fabric: "Surat Organza Silk", sleeveType: "3/4 Sleeve", color: "Mint Cream",
    price: 1499, compareAtPrice: 2999, sizes: ["S", "M", "L", "XL"], stock: 12, rating: 4.9, reviews: 64,
    images: [`${K}/7991032735d4941dd872e07f4fbe08e9b26d6ab69dd81479a7c1782d6be2067c.png`, `${K}/a2160073ca5a0516fa6601f8080a04d1aabe78848f023fa689ec1a79a265d7c3.png`],
    colorVariants: [{ name: "Mint Cream", hex: "#E0F2E9" }, { name: "Lavender Gold", hex: "#E8D9C0" }]
  },
  {
    id: "mobile-k7", slug: "bandhani-print-flared-kurti", title: "Bandhani Print Flared Kurti",
    category: "kurtis", productType: "kurti", subcategory: "Heritage Prints",
    description: "Bright and traditional Bandhani print kurti featuring a full flared skirt and a comfortable fitted bodice. Made from smooth georgette crepe.",
    fabric: "Georgette Crepe", sleeveType: "3/4 Sleeve", color: "Festive Red",
    price: 799, compareAtPrice: 1599, sizes: ["S", "M", "L", "XL", "XXL"], stock: 28, rating: 4.5, reviews: 76,
    images: [`${K}/a2160073ca5a0516fa6601f8080a04d1aabe78848f023fa689ec1a79a265d7c3.png`, `${K}/cbced159d300f0054a98f6dfc484470966caffb38e10e3395b2a02acefafd358.png`],
    colorVariants: [{ name: "Festive Red", hex: "#B82E3E" }, { name: "Emerald Green", hex: "#2EB854" }]
  },
  {
    id: "mobile-k8", slug: "striped-office-wear-kurti", title: "Striped Office Wear Kurti",
    category: "kurtis", productType: "kurti", subcategory: "Daily Formal",
    description: "Perfect straight fit kurti featuring formal vertical lines, crafted from premium handloom Khadi cotton. Keeps you cool all day long.",
    fabric: "Premium Khadi Cotton", sleeveType: "3/4 Sleeve", color: "Slate Grey",
    price: 749, compareAtPrice: 1499, sizes: ["S", "M", "L", "XL"], stock: 40, rating: 4.7, reviews: 58,
    images: [`${K}/cbced159d300f0054a98f6dfc484470966caffb38e10e3395b2a02acefafd358.png`, `${K}/b0a5ec56bc902575b46e9d0d7697624ef2ef93927e83e7f40cde9a330c9d749a.png`],
    colorVariants: [{ name: "Slate Grey", hex: "#8A8A8A" }, { name: "Eco Khadi", hex: "#E2DCD2" }]
  },
  {
    id: "mobile-k9", slug: "zari-border-traditional-kurti", title: "Zari Border Traditional Kurti",
    category: "kurtis", productType: "kurti", subcategory: "Surat Craft",
    description: "Rich straight kurti with a stunning traditional zari weave borders, tailored out of tussar silk blend. A true Surat craft statement.",
    fabric: "Tussar Silk Blend", sleeveType: "3/4 Sleeve", color: "Royal Grape",
    price: 1199, compareAtPrice: 2399, sizes: ["S", "M", "L", "XL", "XXL"], stock: 14, rating: 4.8, reviews: 91,
    images: [`${K}/b0a5ec56bc902575b46e9d0d7697624ef2ef93927e83e7f40cde9a330c9d749a.png`, `${K}/30d97ad77e93ea942815e38bb52e9a50afb83be88dcfd62ece7199044bdc6c91.png`],
    colorVariants: [{ name: "Royal Grape", hex: "#4C2B5C" }, { name: "Sunset Amber", hex: "#C46524" }]
  },
  {
    id: "mobile-k10", slug: "tiered-mulmul-flared-kurti", title: "Tiered Mulmul Flared Kurti",
    category: "kurtis", productType: "kurti", subcategory: "Angrakha Flairs",
    description: "Breezy three-tiered flared kurti made from ultra-soft mulmul cotton. Styled with delicate lace insertions and elegant tassel ties.",
    fabric: "Fine Mulmul Cotton", sleeveType: "3/4 Sleeve", color: "Pastel Yellow",
    price: 1399, compareAtPrice: 2799, sizes: ["S", "M", "L", "XL"], stock: 19, rating: 4.9, reviews: 104, isNew: true,
    images: [`${K}/30d97ad77e93ea942815e38bb52e9a50afb83be88dcfd62ece7199044bdc6c91.png`, `${K}/7991032735d4941dd872e07f4fbe08e9b26d6ab69dd81479a7c1782d6be2067c.png`],
    colorVariants: [{ name: "Pastel Yellow", hex: "#FAF3C5" }, { name: "Powder Sky", hex: "#C5ECFA" }]
  }
];

const mobileTunics: Product[] = [
  {
    id: "mobile-t1", slug: "embroidered-rayon-flared-tunic", title: "Embroidered Rayon Flared Tunic",
    category: "tunic-tops", productType: "tunic_top", subcategory: "Casual Tunics",
    description: "Features a flared short silhouette in soft, heavy rayon, accented with premium multi-thread embroidery around the neck and sleeves.",
    fabric: "Luxe Rayon Slub", sleeveType: "3/4 Sleeve", color: "Blush Pink",
    price: 799, compareAtPrice: 1599, sizes: ["S", "M", "L", "XL", "XXL"], stock: 32, rating: 4.7, reviews: 114,
    images: [`${T}/052081f1262d42453b2864b2120581c84be1200dd8a51d24744a6d9c4abb5992.png`, `${T}/16325f0d65e848239ec5c846ee373d6111ab99cbf22dd64c36b5ef807cf47342.png`, `${T}/tunic.jpeg`],
    colorVariants: [{ name: "Blush Pink", hex: "#E7C2B8" }, { name: "Teal Green", hex: "#0D9488" }]
  },
  {
    id: "mobile-t2", slug: "chanderi-silk-fusion-tunic", title: "Chanderi Silk Fusion Tunic",
    category: "tunic-tops", productType: "tunic_top", subcategory: "Festive Tunics",
    description: "An elegant high-low tunic crafted from premium Chanderi silk. Designed with gold block-prints for a fusion festive look.",
    fabric: "Chanderi Silk Blend", sleeveType: "Full Sleeve", color: "Maroon Burgundy",
    price: 1299, compareAtPrice: 2499, sizes: ["S", "M", "L", "XL"], stock: 16, rating: 4.9, reviews: 87,
    images: [`${T}/33e487078704a681b64d3ed522344381e872d85ad370d1f7ac2c462f0ecf6fe6.png`, `${T}/6f3b4324572536e1c644bea8fb930139f703830c3430d24d5b047a122dbb7417.png`],
    colorVariants: [{ name: "Maroon Burgundy", hex: "#6E2B38" }, { name: "Teal Gold", hex: "#DCCBA0" }]
  },
  {
    id: "mobile-t3", slug: "vneck-cotton-indigo-tunic", title: "V-Neck Cotton Indigo Tunic",
    category: "tunic-tops", productType: "tunic_top", subcategory: "Indigos",
    description: "A classic short tunic in pure indigo cotton, printed with traditional Dabu prints. Easy fit and breathable.",
    fabric: "Pure Cotton", sleeveType: "3/4 Sleeve", color: "Indigo Blue",
    price: 699, compareAtPrice: 1399, sizes: ["S", "M", "L", "XL"], stock: 29, rating: 4.5, reviews: 65,
    images: [`${T}/80a8ba805434a5c22ef64bc2313ae280404e5e50c301a4cdf674d4b15ad4b233.png`, `${T}/80fbbfbd292675e4ae8718dcfceb5508a4dcd142263ab0ae213e89e5d89124fe.png`],
    colorVariants: [{ name: "Indigo Blue", hex: "#2B3D5C" }, { name: "Turmeric Yellow", hex: "#F5C969" }]
  },
  {
    id: "mobile-t4", slug: "asymmetric-georgette-tunic", title: "Asymmetric Georgette Tunic",
    category: "tunic-tops", productType: "tunic_top", subcategory: "Contemporary",
    description: "Feminine, tiered asymmetric tunic with side slits. Features a light lining and an elegant neck keyhole detail.",
    fabric: "Poly Georgette", sleeveType: "Sleeveless", color: "Peach Coral",
    price: 999, compareAtPrice: 1999, sizes: ["S", "M", "L", "XL"], stock: 20, rating: 4.8, reviews: 83,
    images: [`${T}/816c6089e5f370b4f7e924323c04f9bf9b7be89a94a0bc7ab44e32d3e2b0218e.png`, `${T}/8dcce96683276500c2236556084f5d2ec0b2c695b15201a77821204c1030c309.png`],
    colorVariants: [{ name: "Peach Coral", hex: "#F3B3A1" }, { name: "Mint Green", hex: "#A1F3B7" }]
  },
  {
    id: "mobile-t5", slug: "linen-blend-short-aline-tunic", title: "Linen Blend Short A-Line Tunic",
    category: "tunic-tops", productType: "tunic_top", subcategory: "Casual Linen",
    description: "Crafted from a premium linen viscose blend, this short A-line tunic has shell buttons on the front and roll-up sleeves.",
    fabric: "Linen Viscose", sleeveType: "Half Sleeve", color: "Ivory Cream",
    price: 849, compareAtPrice: 1699, sizes: ["S", "M", "L", "XL"], stock: 22, rating: 4.6, reviews: 79,
    images: [`${T}/94e518b39edefcb348371c6f19423d43c5ff6a608d9060c90e9213b2c8fd30df.png`, `${T}/94f3f6fc103aa131653afadd4cdac362e00cf2d1d796568db0627351611b10c5.png`],
    colorVariants: [{ name: "Ivory Cream", hex: "#FAF7F2" }, { name: "Oatmeal Beige", hex: "#DFD9CE" }]
  },
  {
    id: "mobile-t6", slug: "tiedye-georgette-flare-tunic", title: "Tie-Dye Georgette Flare Tunic",
    category: "tunic-tops", productType: "tunic_top", subcategory: "Indigo Prints",
    description: "Eye-catching Shibori-style tie-dye flared tunic with three-quarter bell sleeves and a matching fabric belt.",
    fabric: "Georgette", sleeveType: "3/4 Sleeve", color: "Lavender Sky",
    price: 1099, compareAtPrice: 2199, sizes: ["S", "M", "L", "XL", "XXL"], stock: 15, rating: 4.7, reviews: 55,
    images: [`${T}/9734ac5480510f0d7c814c0dfc2a086593ce447ec96e6b844520dacfe40c7945.png`, `${T}/9bb581778c2cc6cef86ace04050044b5de5c1f79cc848f23ac0750c0ad40d7fa.png`],
    colorVariants: [{ name: "Lavender Sky", hex: "#DFD9FA" }, { name: "Aqua Blue", hex: "#9CE9F5" }]
  },
  {
    id: "mobile-t7", slug: "gota-patti-festive-tunic", title: "Gota Patti Festive Tunic",
    category: "tunic-tops", productType: "tunic_top", subcategory: "Celebrations",
    description: "Chanderi tunic showcasing traditional Rajasthani Gota Patti border work on the hem and sleeves. Absolute elegance.",
    fabric: "Silk Chanderi", sleeveType: "3/4 Sleeve", color: "Crimson Red",
    price: 1399, compareAtPrice: 2799, sizes: ["S", "M", "L", "XL"], stock: 14, rating: 4.9, reviews: 73,
    images: [`${T}/a989fa4d2c204c4c58698f66efe357b7008f8d05d1bf03fcf0092d833b0836fc.png`, `${T}/c7f207181a46b01ee387c4bbf41a6d965c5475211be3b1b05f886056f3ce1072.png`],
    colorVariants: [{ name: "Crimson Red", hex: "#B8232F" }, { name: "Emerald Green", hex: "#1A6B32" }]
  },
  {
    id: "mobile-t8", slug: "printed-angrakha-tunic-top", title: "Printed Angrakha Tunic Top",
    category: "tunic-tops", productType: "tunic_top", subcategory: "Angrakha Fits",
    description: "Comfortable side-tying Angrakha short tunic made of breathable Mulmul cotton, adorned with small hand-block floral motifs.",
    fabric: "Soft Cotton Mul", sleeveType: "3/4 Sleeve", color: "Indigo",
    price: 749, compareAtPrice: 1499, sizes: ["S", "M", "L", "XL"], stock: 30, rating: 4.6, reviews: 62,
    images: [`${T}/cdbff740b9366871671944bf4329973cfe63cc21e60255e005182161b1542d72.png`, `${T}/d3339d21e82764759c48de6e70c5538ca313423a0752582698c82fe4fcb663f4.png`],
    colorVariants: [{ name: "Indigo", hex: "#2B3D5C" }, { name: "Lilac", hex: "#D6CBE8" }]
  },
  {
    id: "mobile-t9", slug: "mandarin-collar-muslin-tunic", title: "Mandarin Collar Muslin Tunic",
    category: "tunic-tops", productType: "tunic_top", subcategory: "Premium Fusion",
    description: "Rich Muslin tunic with a structured mandarin collar, half-placket closure, and a sleek glossy finish. Perfect for elegant evenings.",
    fabric: "Muslin Silk", sleeveType: "Full Sleeve", color: "Teal Green",
    price: 1199, compareAtPrice: 2399, sizes: ["S", "M", "L", "XL", "XXL"], stock: 18, rating: 4.8, reviews: 79,
    images: [`${T}/eaa09b74a57f958619ee031523d47e4a70b8999f5066e556febe0c05c139362e.png`, `${T}/ec9fac511794673e59f113d66686de499e3323184d10b72fe55da77ada9619c4.png`],
    colorVariants: [{ name: "Teal Green", hex: "#0D9488" }, { name: "Wine Red", hex: "#6E2B38" }]
  },
  {
    id: "mobile-t10", slug: "aline-pleated-tunic-set", title: "A-Line Pleated Tunic Set",
    category: "tunic-tops", productType: "tunic_top", subcategory: "Occasions",
    description: "Sophisticated pleated A-line tunic featuring front pleats, an embroidered neck keyhole, and a premium flowy silhouette.",
    fabric: "Viscose Blend", sleeveType: "3/4 Sleeve", color: "Pastel Yellow",
    price: 1499, compareAtPrice: 2999, sizes: ["S", "M", "L", "XL"], stock: 12, rating: 4.9, reviews: 45,
    images: [`${T}/f655dfe697c9665cbf991262939d41b341203af8c792f879663c652577e7c1a8.png`, `${T}/Gemini_Generated_Image_7p370v7p370v7p37.png`],
    colorVariants: [{ name: "Pastel Yellow", hex: "#FAF3C5" }, { name: "Powder Blue", hex: "#C5ECFA" }]
  }
];

export default function MobileEthnicCollection() {
  const { addCustomToCart } = useShop();

  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedSize, setSelectedSize] = useState<string>("M");
  const [selectedColor, setSelectedColor] = useState<string>("");
  const [quantity, setQuantity] = useState<number>(1);
  const [isJiggling, setIsJiggling] = useState<boolean>(false);
  const [cartBadgeCount, setCartBadgeCount] = useState<number>(0);
  const [showToast, setShowToast] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string>("");

  const [activeImageIdx, setActiveImageIdx] = useState<number>(0);
  const galleryRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Body scroll lock: preserve scroll position
  const savedScrollY = useRef<number>(0);

  // Gesture dragging for bottom sheet dismissal
  const [dragStartY, setDragStartY] = useState<number>(0);
  const [dragOffset, setDragOffset] = useState<number>(0);
  const [isDragging, setIsDragging] = useState<boolean>(false);

  // Tracks for Marquee populated items (single row per section)
  const tracks = {
    kurtis: [
      { id: "kurti-track-1", items: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 0, 1], speed: "30s", dir: "rtl" }
    ],
    tunics: [
      { id: "tunic-track-1", items: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 0, 1], speed: "32s", dir: "ltr" }
    ]
  };

  // State to track global marquee pause (when card is hovered/tapped)
  const [isMarqueePaused, setIsMarqueePaused] = useState<boolean>(false);

  // Floating Cart scroll listener
  const [showFloatingCart, setShowFloatingCart] = useState<boolean>(false);

  useEffect(() => {
    // We listen to the page scroll to toggle the floating cart button
    const handleScroll = () => {
      if (window.scrollY > 350) {
        setShowFloatingCart(true);
      } else {
        setShowFloatingCart(false);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Back button modal dismissal
  useEffect(() => {
    const handlePopState = () => {
      if (selectedProduct) {
        setSelectedProduct(null);
      }
    };
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, [selectedProduct]);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2500);
  };

  const handleCardClick = (product: Product) => {
    setSelectedProduct(product);
    setSelectedSize("M");
    setSelectedColor(product.colorVariants?.[0]?.name || product.color || "");
    setQuantity(1);
    setActiveImageIdx(0);
    setIsMarqueePaused(true); // Pause marquee when modal is open

    // Intercept back button
    window.history.pushState({ modalOpen: true }, "");
  };

  const handleCloseModal = () => {
    if (window.history.state?.modalOpen) {
      window.history.back(); // Will trigger popstate listener to close
    } else {
      setSelectedProduct(null);
      setIsMarqueePaused(false);
    }
  };

  // Lock background scrolling when modal is open (preserve scroll position)
  useEffect(() => {
    if (selectedProduct) {
      savedScrollY.current = window.scrollY;
      document.body.style.top = `-${savedScrollY.current}px`;
      document.body.classList.add("overflow-hidden-scroll");
    } else {
      document.body.classList.remove("overflow-hidden-scroll");
      document.body.style.top = "";
      window.scrollTo(0, savedScrollY.current);
    }
  }, [selectedProduct]);

  // Gallery Scroll Sync Dots
  const handleGalleryScroll = () => {
    const gallery = galleryRef.current;
    if (!gallery) return;
    const scrollPos = gallery.scrollLeft;
    const width = gallery.clientWidth;
    if (width > 0) {
      setActiveImageIdx(Math.round(scrollPos / width));
    }
  };

  // Gesture drag logic
  const handleTouchStart = (e: React.TouchEvent) => {
    setDragStartY(e.touches[0].clientY);
    setIsDragging(true);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    const currentY = e.touches[0].clientY;
    const deltaY = currentY - dragStartY;
    if (deltaY > 0) {
      setDragOffset(deltaY);
    }
  };

  const handleTouchEnd = () => {
    if (!isDragging) return;
    setIsDragging(false);
    if (dragOffset > 130) {
      handleCloseModal();
    }
    setDragOffset(0);
  };

  // Fly to Cart Animation
  const animateFlyToCart = (e: React.MouseEvent) => {
    if (!selectedProduct) return;

    // Trigger cart action
    addCustomToCart({
      productId: selectedProduct.id,
      title: selectedProduct.title,
      image: selectedProduct.images[0],
      price: selectedProduct.price,
      size: selectedSize,
      slug: selectedProduct.slug
    });

    setCartBadgeCount(prev => prev + quantity);

    const btn = e.currentTarget as HTMLButtonElement;
    const activeImageEl = galleryRef.current?.children[activeImageIdx] as HTMLImageElement;
    const cartIconEl = document.getElementById("floating-cart-button");

    if (activeImageEl && cartIconEl) {
      const rectImg = activeImageEl.getBoundingClientRect();
      const rectCart = cartIconEl.getBoundingClientRect();

      // Create fly clone
      const clone = document.createElement("img");
      clone.src = activeImageEl.src;
      clone.style.position = "fixed";
      clone.style.top = `${rectImg.top}px`;
      clone.style.left = `${rectImg.left}px`;
      clone.style.width = `${rectImg.width}px`;
      clone.style.height = `${rectImg.height}px`;
      clone.style.zIndex = "9999";
      clone.style.borderRadius = "20px";
      clone.style.objectFit = "cover";
      clone.style.pointerEvents = "none";
      clone.style.transition = "all 0.8s cubic-bezier(0.25, 1, 0.5, 1)";
      document.body.appendChild(clone);

      setTimeout(() => {
        clone.style.top = `${rectCart.top + 10}px`;
        clone.style.left = `${rectCart.left + 10}px`;
        clone.style.width = "30px";
        clone.style.height = "30px";
        clone.style.opacity = "0.2";
        clone.style.borderRadius = "50%";
      }, 40);

      setTimeout(() => {
        clone.remove();
        setIsJiggling(true);
        setTimeout(() => setIsJiggling(false), 650);
        triggerToast(`${selectedProduct.title} added to cart!`);
      }, 820);
    } else {
      triggerToast(`${selectedProduct.title} added to cart!`);
    }

    // Temporary Button State change
    const originalText = btn.innerHTML;
    btn.classList.add("bg-teal-600", "text-white", "border-teal-600");
    btn.innerHTML = "Added! ✓";
    setTimeout(() => {
      btn.classList.remove("bg-teal-600", "text-white", "border-teal-600");
      btn.innerHTML = originalText;
    }, 1500);
  };

  // Render product card component helper (min-width 220px, height 320px, hover/tap effects)
  const renderCard = (product: Product, keySuffix: string | number) => (
    <motion.div
      key={`${product.id}-${keySuffix}`}
      onClick={() => handleCardClick(product)}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-10px" }}
      whileHover={{ y: -6 }}
      whileTap={{ scale: 0.96 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className="product-card-react-active flex-shrink-0 w-[220px] min-w-[220px] h-[320px] bg-white rounded-[24px] shadow-md border border-[#FAF7F2] overflow-hidden cursor-pointer mr-5 flex flex-col justify-between"
    >
      <div className="relative w-full h-[210px] overflow-hidden bg-[#F7F3EE] card-img-shimmer">
        <img
          src={product.images[0]}
          alt={product.title}
          className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
          loading="lazy"
          onLoad={(e) => { (e.target as HTMLImageElement).parentElement?.classList.remove("card-img-shimmer"); }}
        />
        {/* Badges */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1.5 items-start">
          {product.isNew && (
            <span className="bg-[#B8924A]/90 text-white text-[9px] tracking-wider uppercase px-2.5 py-0.5 rounded-full font-semibold shadow-sm">
              New
            </span>
          )}
          <span className="bg-[#0D0906]/75 text-white text-[8px] tracking-widest uppercase px-2 py-0.5 rounded-full font-medium shadow-sm backdrop-blur-xs">
            {product.productType === "kurti" ? "Kurti" : "Tunic"}
          </span>
        </div>
      </div>
      <div className="p-4 flex flex-col justify-between flex-1 bg-white">
        <div>
          <h4 className="font-serif text-[13px] text-[#0D0906] font-semibold tracking-wide truncate mb-1">
            {product.title}
          </h4>
          <div className="flex items-center gap-1.5 mb-2">
            <div className="flex text-amber-500 text-[9px] tracking-tighter">
              {"★".repeat(Math.floor(product.rating))}
              {"☆".repeat(5 - Math.floor(product.rating))}
            </div>
            <span className="text-[9px] text-gray-400 font-semibold">{product.rating}</span>
          </div>
        </div>
        <div className="flex items-baseline justify-between">
          <div className="flex items-baseline gap-2">
            <span className="text-[13px] font-bold text-[#991B1B]">₹{product.price}</span>
            {product.compareAtPrice && (
              <span className="text-[10px] text-gray-400 line-through">₹{product.compareAtPrice}</span>
            )}
          </div>
          <span className="text-[9px] text-[#B8924A] font-semibold tracking-wider uppercase">Inquire</span>
        </div>
      </div>
    </motion.div>
  );

  return (
    <div className="relative">
      
      {/* ─── KURTIS SECTION ─────────────────────────── */}
      <section className="pt-10 px-4">
        <div className="flex justify-between items-end mb-6 section-fade-in">
          <div>
            <span className="text-[10px] uppercase tracking-[0.2em] text-[#B8924A] font-semibold block mb-1">
              Elegant styles crafted for modern women
            </span>
            <h2 className="font-serif text-2xl md:text-3xl font-semibold tracking-wide flex items-center gap-2 text-[#0D0906]">
              Premium Kurtis
            </h2>
            <div className="w-12 h-[2px] bg-gradient-to-r from-[#B8924A] to-transparent mt-1.5" />
          </div>
          <button className="flex items-center gap-1 text-[10px] font-semibold text-[#B8924A] tracking-widest uppercase pb-1 border-b border-[#B8924A]/10 hover:border-[#B8924A] active:scale-95 transition-all">
            View All <span className="text-[9px]">→</span>
          </button>
        </div>

        {/* 2 Marquee Tracks */}
        <div
          className={`space-y-4.5 -mx-4 overflow-hidden relative ${isMarqueePaused ? "marquee-paused-react" : ""}`}
          onMouseEnter={() => setIsMarqueePaused(true)}
          onMouseLeave={() => { if (!selectedProduct) setIsMarqueePaused(false); }}
          onTouchStart={() => setIsMarqueePaused(true)}
          onTouchEnd={() => { if (!selectedProduct) setIsMarqueePaused(false); }}
        >
          {tracks.kurtis.map((track) => (
            <div key={track.id} className="marquee-track-react">
              <div
                className={`marquee-content-react py-1.5 ${
                  track.dir === "rtl" ? "animate-marquee-rtl-react" : "animate-marquee-ltr-react"
                }`}
                style={{ "--speed": track.speed } as React.CSSProperties}
              >
                {track.items.map((idx, itemIndex) => renderCard(mobileKurtis[idx], `content-${itemIndex}`))}
              </div>
              <div
                className={`marquee-content-react py-1.5 ${
                  track.dir === "rtl" ? "animate-marquee-rtl-react" : "animate-marquee-ltr-react"
                }`}
                aria-hidden="true"
                style={{ "--speed": track.speed } as React.CSSProperties}
              >
                {track.items.map((idx, itemIndex) => renderCard(mobileKurtis[idx], `dup-${itemIndex}`))}
              </div>
            </div>
          ))}
        </div>

      </section>

      {/* ─── TRUST / USP STRIP ───────────────────────── */}
      <div className="py-6 overflow-hidden border-y border-[#B8924A]/8 bg-[#FAF7F2]/60 backdrop-blur-sm">
        <div className="flex usp-scroll-strip whitespace-nowrap">
          {[...Array(2)].map((_, dupIdx) => (
            <div key={dupIdx} className="flex items-center gap-8 px-4 shrink-0">
              <span className="flex items-center gap-2 text-[10px] font-semibold tracking-widest uppercase text-[#B8924A]">
                <span className="text-sm">✦</span> Free Shipping All India
              </span>
              <span className="flex items-center gap-2 text-[10px] font-semibold tracking-widest uppercase text-[#0D0906]/50">
                <span className="text-sm">◇</span> Premium Fabrics
              </span>
              <span className="flex items-center gap-2 text-[10px] font-semibold tracking-widest uppercase text-[#B8924A]">
                <span className="text-sm">✦</span> Handcrafted in Surat
              </span>
              <span className="flex items-center gap-2 text-[10px] font-semibold tracking-widest uppercase text-[#0D0906]/50">
                <span className="text-sm">◇</span> Easy Returns
              </span>
              <span className="flex items-center gap-2 text-[10px] font-semibold tracking-widest uppercase text-[#B8924A]">
                <span className="text-sm">✦</span> Wholesale Available
              </span>
              <span className="flex items-center gap-2 text-[10px] font-semibold tracking-widest uppercase text-[#0D0906]/50">
                <span className="text-sm">◇</span> COD Accepted
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* ─── TUNICS SECTION ─────────────────────────── */}
      <section className="pt-12 px-4">
        <div className="flex justify-between items-end mb-6 section-fade-in">
          <div>
            <span className="text-[10px] uppercase tracking-[0.2em] text-[#B8924A] font-semibold block mb-1">
              Designed for comfort and elegance
            </span>
            <h2 className="font-serif text-2xl md:text-3xl font-semibold tracking-wide flex items-center gap-2 text-[#0D0906]">
              Stylish Tunics
            </h2>
            <div className="w-12 h-[2px] bg-gradient-to-r from-[#B8924A] to-transparent mt-1.5" />
          </div>
          <button className="flex items-center gap-1 text-[10px] font-semibold text-[#B8924A] tracking-widest uppercase pb-1 border-b border-[#B8924A]/10 hover:border-[#B8924A] active:scale-95 transition-all">
            View All <span className="text-[9px]">→</span>
          </button>
        </div>

        {/* 2 Marquee Tracks */}
        <div
          className={`space-y-4.5 -mx-4 overflow-hidden relative ${isMarqueePaused ? "marquee-paused-react" : ""}`}
          onMouseEnter={() => setIsMarqueePaused(true)}
          onMouseLeave={() => { if (!selectedProduct) setIsMarqueePaused(false); }}
          onTouchStart={() => setIsMarqueePaused(true)}
          onTouchEnd={() => { if (!selectedProduct) setIsMarqueePaused(false); }}
        >
          {tracks.tunics.map((track) => (
            <div key={track.id} className="marquee-track-react">
              <div
                className={`marquee-content-react py-1.5 ${
                  track.dir === "rtl" ? "animate-marquee-rtl-react" : "animate-marquee-ltr-react"
                }`}
                style={{ "--speed": track.speed } as React.CSSProperties}
              >
                {track.items.map((idx, itemIndex) => renderCard(mobileTunics[idx], `content-${itemIndex}`))}
              </div>
              <div
                className={`marquee-content-react py-1.5 ${
                  track.dir === "rtl" ? "animate-marquee-rtl-react" : "animate-marquee-ltr-react"
                }`}
                aria-hidden="true"
                style={{ "--speed": track.speed } as React.CSSProperties}
              >
                {track.items.map((idx, itemIndex) => renderCard(mobileTunics[idx], `dup-${itemIndex}`))}
              </div>
            </div>
          ))}
        </div>

      </section>

      {/* Original Footer is rendered from layout.tsx — no duplicate needed */}

      {/* ─── FLOATING CART BUTTON ───────────────────── */}
      <AnimatePresence>
        {showFloatingCart && (
          <motion.div
            initial={{ translateY: 80, opacity: 0 }}
            animate={{ translateY: 0, opacity: 1 }}
            exit={{ translateY: 80, opacity: 0 }}
            id="floating-cart-button"
            className="fixed bottom-6 right-6 z-40"
          >
            <button className="w-14 h-14 bg-[#B8924A] rounded-full flex items-center justify-center text-white shadow-lg relative border border-[#D4AC6E]/20 active:scale-90 transition-transform">
              <ShoppingBag size={22} className={isJiggling ? "animate-jiggle-react" : ""} />
              {cartBadgeCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#991B1B] text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center font-bold border-2 border-[#B8924A]">
                  {cartBadgeCount}
                </span>
              )}
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ─── PREMIUM FULLSCREEN MODAL ──────────────── */}
      <AnimatePresence>
        {selectedProduct && (
          <div className="fixed inset-0 z-50 flex justify-center items-end pointer-events-none">
            
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={handleCloseModal}
              className="absolute inset-0 bg-black/60 pointer-events-auto"
            />

            {/* Fullscreen Sheet Content */}
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 26, stiffness: 220 }}
              style={{ y: dragOffset }}
              className="fixed inset-0 w-full h-full md:bottom-0 md:top-auto md:h-[85vh] md:max-w-md md:left-1/2 md:-translate-x-1/2 bg-[#F7F3EE] shadow-2xl flex flex-col pointer-events-auto overflow-hidden"
            >
              
              {/* Drag handle / Close bar */}
              <div
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
                className="w-full flex justify-center py-3.5 cursor-grab active:cursor-grabbing border-b border-[#B8924A]/5 bg-[#F7F3EE]/85 backdrop-blur-sm sticky top-0 z-20 shrink-0"
              >
                <div className="w-12 h-1.5 bg-[#B8924A]/25 rounded-full" />
              </div>

              <button
                onClick={handleCloseModal}
                className="absolute top-3 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-white/95 border border-[#B8924A]/10 text-[#0D0906] shadow-sm active:scale-95 transition-transform z-30"
              >
                <X size={15} strokeWidth={2.5} />
              </button>

              {/* Scrollable Body */}
              <div
                ref={scrollContainerRef}
                className="flex-1 overflow-y-auto px-6 pb-12 space-y-6 pt-2 scrollbar-none"
              >
                {/* Gallery Slider */}
                <div className="relative -mx-6 -mt-2">
                  <div
                    ref={galleryRef}
                    onScroll={handleGalleryScroll}
                    className="flex overflow-x-auto snap-x snap-mandatory scrollbar-none w-full"
                  >
                    {selectedProduct.images.map((imgSrc, idx) => (
                      <img
                        key={idx}
                        src={imgSrc}
                        alt={selectedProduct.title}
                        className="w-full h-[320px] modal-gallery-img object-cover shrink-0 snap-start"
                      />
                    ))}
                  </div>
                  {/* Dots */}
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
                    {selectedProduct.images.map((_, idx) => (
                      <div
                        key={idx}
                        className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                          idx === activeImageIdx ? "bg-[#B8924A] w-3" : "bg-[#B8924A]/30"
                        }`}
                      />
                    ))}
                  </div>
                </div>

                {/* Title and price */}
                <div className="space-y-2">
                  <span className="text-[#B8924A] text-[9px] tracking-widest uppercase font-semibold block">
                    {selectedProduct.productType === "kurti" ? "Surat Kurti Collection" : "Premium Tunic Top"}
                  </span>
                  <h3 className="font-serif text-xl font-bold tracking-wide text-[#0D0906] leading-snug">
                    {selectedProduct.title}
                  </h3>
                  <div className="flex items-center gap-3">
                    <span className="text-xl font-semibold text-[#991B1B]">₹{selectedProduct.price}</span>
                    {selectedProduct.compareAtPrice && (
                      <span className="text-xs text-gray-400 line-through">₹{selectedProduct.compareAtPrice}</span>
                    )}
                    {selectedProduct.compareAtPrice && (
                      <span className="text-xs font-semibold text-teal-600 bg-teal-50 px-2 py-0.5 rounded-full">
                        {Math.round((1 - selectedProduct.price / selectedProduct.compareAtPrice) * 100)}% OFF
                      </span>
                    )}
                  </div>
                </div>

                <hr className="border-[#B8924A]/10" />

                {/* Details */}
                <div className="text-xs space-y-1">
                  <span className="text-gray-400 uppercase tracking-widest font-semibold text-[9px]">
                    Garment Details
                  </span>
                  <p className="text-[#0D0906] font-medium">
                    Fabric: <span className="font-light">{selectedProduct.fabric}</span>
                  </p>
                </div>

                {/* Description */}
                <div className="text-xs space-y-1">
                  <span className="text-gray-400 uppercase tracking-widest font-semibold text-[9px]">
                    Description
                  </span>
                  <p className="text-gray-600 leading-relaxed font-light">
                    {selectedProduct.description}
                  </p>
                </div>

                <hr className="border-[#B8924A]/10" />

                {/* Size Selector */}
                <div className="space-y-2.5">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400 uppercase tracking-widest font-semibold text-[9px]">
                      Select Size
                    </span>
                    <span className="text-[10px] text-[#B8924A] font-semibold underline cursor-pointer">
                      Size Guide
                    </span>
                  </div>
                  <div className="flex gap-2.5">
                    {selectedProduct.sizes.map((size) => (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className={`w-10 h-10 flex items-center justify-center rounded-full border text-xs font-semibold tracking-wide transition-all ${
                          selectedSize === size
                            ? "border-[#B8924A] bg-[#B8924A] text-white shadow-sm"
                            : "border-[#B8924A]/10 text-[#0D0906] bg-white"
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Color Selector */}
                {selectedProduct.colorVariants && selectedProduct.colorVariants.length > 0 && (
                  <div className="space-y-2.5">
                    <span className="text-gray-400 uppercase tracking-widest font-semibold text-[9px]">
                      Select Color
                    </span>
                    <div className="flex gap-2">
                      {selectedProduct.colorVariants.map((col) => (
                        <button
                          key={col.name}
                          onClick={() => setSelectedColor(col.name)}
                          className={`px-3 py-1.5 rounded-full border text-[9px] font-semibold tracking-wider uppercase transition-all ${
                            selectedColor === col.name
                              ? "border-[#991B1B] bg-[#991B1B]/5 text-[#991B1B]"
                              : "border-[#B8924A]/10 bg-white text-gray-500"
                          }`}
                        >
                          {col.name}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Quantity & Actions */}
                <div className="space-y-4 pt-2">
                  {/* WhatsApp Inquiry Button (Primary Conversion CTA) */}
                  <a
                    href={`https://wa.me/919099369035?text=${encodeURIComponent(`Hi Manasvi Fashion, I'm interested in inquiring about "${selectedProduct.title}" (Fabric: ${selectedProduct.fabric}, Price: ₹${selectedProduct.price}).`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="whatsapp-glow w-full py-3.5 bg-[#128C7E] hover:bg-[#075E54] active:scale-95 text-white rounded-full font-sans font-semibold text-[10px] tracking-widest uppercase shadow-md flex items-center justify-center gap-2 transition-all duration-300 pointer-events-auto"
                  >
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                      <path d="M12.031 2c-5.514 0-9.989 4.475-9.989 9.989 0 1.761.458 3.479 1.332 5.003L2 22l5.138-1.347c1.474.805 3.125 1.229 4.887 1.231h.005c5.513 0 9.987-4.476 9.987-9.99 0-2.67-1.039-5.18-2.926-7.07C17.202 3.037 14.7 2 12.031 2zm6.917 14.075c-.279.782-1.388 1.436-1.921 1.505-.516.068-1.162.338-3.414-.593-2.88-1.19-4.708-4.113-4.851-4.306-.145-.192-.47-.625-.47-1.053 0-.427.224-.637.304-.722.08-.086.208-.13.336-.13h.105c.105 0 .248-.04.387.295.145.348.496 1.21.539 1.3.043.09.072.195.014.312-.058.118-.088.192-.175.292-.088.1-.184.225-.262.302-.087.087-.178.182-.077.356.1.174.445.734.956 1.19.658.587 1.212.77 1.385.856.173.088.274.072.376-.046.102-.118.438-.509.554-.683.117-.174.234-.145.394-.087.16.059 1.02.481 1.195.568.175.088.291.13.335.207.043.078.043.452-.236 1.234z"/>
                    </svg>
                    WhatsApp Inquiry
                  </a>

                  {/* Quantity & Wishlist Selector */}
                  <div className="flex items-center justify-between gap-4 pt-2">
                    <div className="space-y-1 flex-1">
                      <span className="text-gray-400 uppercase tracking-widest font-semibold text-[9px] block">
                        Quantity
                      </span>
                      <div className="flex items-center border border-[#B8924A]/20 rounded-full w-28 bg-white h-10 overflow-hidden shadow-sm">
                        <button
                          onClick={() => { if (quantity > 1) setQuantity(quantity - 1); }}
                          className="flex-1 h-full flex items-center justify-center text-[#B8924A] hover:bg-[#B8924A]/5 select-none active:scale-90 transition-transform"
                        >
                          <Minus size={14} />
                        </button>
                        <span className="w-8 text-center text-xs font-semibold text-[#0D0906] select-none">
                          {quantity}
                        </span>
                        <button
                          onClick={() => setQuantity(quantity + 1)}
                          className="flex-1 h-full flex items-center justify-center text-[#B8924A] hover:bg-[#B8924A]/5 select-none active:scale-90 transition-transform"
                        >
                          <Plus size={14} />
                        </button>
                      </div>
                    </div>
                    
                    {/* Wishlist */}
                    <button className="w-10 h-10 rounded-full border border-[#B8924A]/20 flex items-center justify-center text-[#B8924A] hover:bg-[#B8924A]/5 active:scale-90 transition-all shadow-sm bg-white mt-4">
                      <Heart size={16} />
                    </button>
                  </div>

                  {/* Retail Actions */}
                  <div className="grid grid-cols-2 gap-3 pt-2">
                    <button
                      onClick={animateFlyToCart}
                      className="w-full py-3.5 border border-[#B8924A] bg-white text-[#B8924A] rounded-full font-sans font-semibold text-[10px] tracking-widest uppercase hover:bg-[#B8924A] hover:text-white active:scale-95 transition-all shadow-sm duration-300"
                    >
                      Add to Cart
                    </button>
                    <button
                      onClick={() => {
                        triggerToast("Redirecting to checkout...");
                        setTimeout(() => {
                          handleCloseModal();
                          alert(`Demo checkout for ${selectedProduct.title} (Qty: ${quantity}, Size: ${selectedSize})`);
                        }, 800);
                      }}
                      className="w-full py-3.5 bg-[#991B1B] text-white rounded-full font-sans font-semibold text-[10px] tracking-widest uppercase hover:bg-[#991B1B]/90 active:scale-95 transition-all shadow-md duration-300"
                    >
                      Buy Now
                    </button>
                  </div>
                </div>

                <hr className="border-[#B8924A]/10" />

                {/* You May Also Like Related scroll */}
                <div className="space-y-3">
                  <span className="text-gray-400 uppercase tracking-widest font-semibold text-[9px]">
                    You May Also Like
                  </span>
                  <div className="flex gap-4 overflow-x-auto scrollbar-none pb-2">
                    {relatedList(selectedProduct).map((item) => (
                      <div
                        key={item.id}
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedProduct(item);
                          setSelectedSize("M");
                          setSelectedColor(item.colorVariants?.[0]?.name || item.color || "");
                          setQuantity(1);
                          setActiveImageIdx(0);
                          scrollContainerRef.current?.scrollTo({ top: 0, behavior: "smooth" });
                        }}
                        className="shrink-0 w-[90px] cursor-pointer group"
                      >
                        <div className="relative w-full h-[110px] rounded-xl overflow-hidden bg-[#F7F3EE] mb-1 border border-[#B8924A]/5">
                          <img
                            src={item.images[0]}
                            alt={item.title}
                            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                          />
                        </div>
                        <h5 className="text-[9px] text-[#0D0906] font-semibold truncate leading-tight">
                          {item.title}
                        </h5>
                        <p className="text-[9px] text-[#991B1B] font-bold">₹{item.price}</p>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ─── TOAST NOTIFICATION ─────────────────────── */}
      <AnimatePresence>
        {showToast && (
          <motion.div
            initial={{ bottom: 16, opacity: 0, scale: 0.9 }}
            animate={{ bottom: 96, opacity: 1, scale: 1 }}
            exit={{ bottom: 16, opacity: 0, scale: 0.9 }}
            className="fixed left-1/2 -translate-x-1/2 z-50 bg-[#0D0906] text-[#FAF7F2] px-4 py-2.5 rounded-full text-[10px] font-sans font-semibold tracking-wide shadow-lg flex items-center gap-1.5 border border-[#B8924A]/15 pointer-events-none"
          >
            <span className="text-[#B8924A]">✔</span> {toastMessage}
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );

  function relatedList(prod: Product) {
    const list = prod.id.startsWith("mobile-k") ? mobileKurtis : mobileTunics;
    return list.filter(item => item.id !== prod.id).slice(0, 5);
  }
}
