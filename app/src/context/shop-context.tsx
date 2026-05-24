"use client";

import { createContext, useContext, useEffect, useMemo, useRef, useState } from "react";
import { products as staticProducts } from "@/data/products";
import { CartItem, Product } from "@/types";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

interface ShopContextValue {
  cart: CartItem[];
  wishlist: string[];
  addToCart: (productId: string, size: string) => void;
  addCustomToCart: (item: { productId: string; title: string; image: string; price: number; size?: string; slug?: string }) => void;
  updateQty: (productId: string, size: string, qty: number) => void;
  removeFromCart: (productId: string, size: string) => void;
  toggleWishlist: (productId: string) => void;
  clearCart: () => void;
  cartCount: number;
  cartTotal: number;
  products: Product[];
  loading: boolean;
  refetchProducts: () => Promise<void>;
}

const ShopContext = createContext<ShopContextValue | null>(null);

export function ShopProvider({ children }: { children: React.ReactNode }) {
  const [productsList, setProductsList] = useState<Product[]>(staticProducts);
  const [loading, setLoading] = useState(true);
  const { data: session } = useSession();
  const router = useRouter();

  const [cart, setCart] = useState<CartItem[]>(() => {
    if (typeof window === "undefined") return [];
    const saved = localStorage.getItem("mf-cart");
    return saved ? JSON.parse(saved) : [];
  });
  const [wishlist, setWishlist] = useState<string[]>(() => {
    if (typeof window === "undefined") return [];
    const saved = localStorage.getItem("mf-wishlist");
    return saved ? JSON.parse(saved) : [];
  });

  // Track if component is mounted to avoid state updates after unmount
  const mountedRef = useRef(true);
  useEffect(() => {
    mountedRef.current = true;
    return () => { mountedRef.current = false; };
  }, []);

  const refetchProducts = async () => {
    const controller = new AbortController();
    // 5-second timeout — if Supabase or the API hangs, we fall back to static data
    const timeoutId = setTimeout(() => {
      console.warn("[shop-context] /api/products fetch timed out after 5s — using fallback data");
      controller.abort();
    }, 5000);

    try {
      const res = await fetch("/api/products", { signal: controller.signal });
      clearTimeout(timeoutId);

      if (!mountedRef.current) return;

      if (res.ok) {
        const data = await res.json();
        console.log("[shop-context] /api/products response — count:", Array.isArray(data) ? data.length : "not an array", data);
        if (Array.isArray(data) && data.length > 0) {
          setProductsList(data);
        } else {
          console.warn("[shop-context] API returned empty/invalid data, keeping static fallback");
        }
      } else {
        const errorBody = await res.text().catch(() => "(unreadable)");
        console.error(`[shop-context] /api/products responded ${res.status}:`, errorBody);
      }
    } catch (err) {
      clearTimeout(timeoutId);
      if ((err as Error)?.name === "AbortError") {
        console.warn("[shop-context] Fetch aborted (timeout) — products will use static fallback");
      } else {
        console.error("[shop-context] Failed to fetch dynamic products:", err);
      }
    } finally {
      if (mountedRef.current) {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    refetchProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => localStorage.setItem("mf-cart", JSON.stringify(cart)), [cart]);
  useEffect(() => localStorage.setItem("mf-wishlist", JSON.stringify(wishlist)), [wishlist]);

  const addToCart = (productId: string, size: string) => {
    if (!session) {
      const currentUrl = typeof window !== "undefined" ? window.location.href : "/";
      router.push(`/auth/signin?callbackUrl=${encodeURIComponent(currentUrl)}`);
      return;
    }
    setCart((prev) => {
      const idx = prev.findIndex((i) => i.productId === productId && i.size === size);
      if (idx >= 0) return prev.map((i, n) => (n === idx ? { ...i, qty: i.qty + 1 } : i));
      return [...prev, { productId, size, qty: 1 }];
    });
  };

  const addCustomToCart = (item: { productId: string; title: string; image: string; price: number; size?: string; slug?: string }) => {
    if (!session) {
      const currentUrl = typeof window !== "undefined" ? window.location.href : "/";
      router.push(`/auth/signin?callbackUrl=${encodeURIComponent(currentUrl)}`);
      return;
    }
    const size = item.size || "Free";
    setCart((prev) => {
      const idx = prev.findIndex((i) => i.productId === item.productId && i.size === size);
      if (idx >= 0) return prev.map((i, n) => (n === idx ? { ...i, qty: i.qty + 1 } : i));
      return [...prev, { productId: item.productId, size, qty: 1, title: item.title, image: item.image, price: item.price, slug: item.slug }];
    });
  };

  const updateQty = (productId: string, size: string, qty: number) => {
    if (qty <= 0) return removeFromCart(productId, size);
    setCart((prev) => prev.map((i) => (i.productId === productId && i.size === size ? { ...i, qty } : i)));
  };

  const removeFromCart = (productId: string, size: string) => setCart((prev) => prev.filter((i) => !(i.productId === productId && i.size === size)));
  const toggleWishlist = (productId: string) => setWishlist((prev) => (prev.includes(productId) ? prev.filter((id) => id !== productId) : [...prev, productId]));
  const clearCart = () => setCart([]);

  const cartCount = useMemo(() => cart.reduce((sum, item) => sum + item.qty, 0), [cart]);
  const cartTotal = useMemo(
    () =>
      cart.reduce((sum, item) => {
        const defaultPrice = productsList.find((p) => p.id === item.productId)?.price || 0;
        return sum + (item.price ?? defaultPrice) * item.qty;
      }, 0),
    [cart, productsList],
  );

  return (
    <ShopContext.Provider value={{ cart, wishlist, addToCart, addCustomToCart, updateQty, removeFromCart, toggleWishlist, clearCart, cartCount, cartTotal, products: productsList, loading, refetchProducts }}>
      {children}
    </ShopContext.Provider>
  );
}

export const useShop = () => {
  const ctx = useContext(ShopContext);
  if (!ctx) throw new Error("useShop must be used inside ShopProvider");
  return ctx;
};
