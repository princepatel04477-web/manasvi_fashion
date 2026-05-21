"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
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

  const refetchProducts = async () => {
    try {
      const res = await fetch("/api/products");
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          setProductsList(data);
        }
      }
    } catch (err) {
      console.error("Failed to fetch dynamic products:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    refetchProducts();
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
