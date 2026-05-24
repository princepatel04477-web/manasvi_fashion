"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { set } from "animejs";
import { interpolate, luxuryEase } from "@/lib/use-anime-scroll";
import { Menu, X, ShoppingBag, Trash2, Plus, Minus } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useShop } from "@/context/shop-context";
import { formatINR } from "@/lib/store";

export default function Header() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [drawerTab, setDrawerTab] = useState<"menu" | "cart">("menu");
  const { cart, products: productsList, cartCount, cartTotal, updateQty, removeFromCart } = useShop();
  const [isScrolledPastSlides, setIsScrolledPastSlides] = useState(false);
  const navRef1 = useRef<HTMLElement>(null);
  const navRef2 = useRef<HTMLElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);

  const isHome = pathname === "/";
  const isAdmin = (session?.user as any)?.role === "admin" || (session?.user as any)?.role === "seller";
  const firstName = session?.user?.name ? session.user.name.split(" ")[0] : "";

  // Lock background scroll when mobile drawer is open
  useEffect(() => {
    if (isDrawerOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isDrawerOpen]);

  // Auto-close drawer on route change
  useEffect(() => {
    setIsDrawerOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (pathname.startsWith("/dashboard") || pathname.startsWith("/auth")) {
      return;
    }

    const handleScroll = () => {
      const sy = window.scrollY;
      const threshold = window.innerHeight * 3 - 80;
      setIsScrolledPastSlides(sy > threshold);

      if (!isHome) return;

      const hasScroll = document.documentElement.scrollHeight > window.innerHeight + 4;
      if (!hasScroll) {
        if (navRef1.current) {
          set(navRef1.current, { opacity: 1, translateY: "0px" });
        }
        if (navRef2.current) {
          set(navRef2.current, { opacity: 1, translateY: "0px" });
        }
        if (logoRef.current) {
          set(logoRef.current, { opacity: 1 });
        }
        return;
      }

      const navOpacity = interpolate(sy, { inputRange: [190, 360], outputRange: [0, 1], ease: luxuryEase });
      const navY = interpolate(sy, { inputRange: [190, 360], outputRange: [20, 0], ease: luxuryEase });
      const logoOpacity = interpolate(sy, { inputRange: [650, 730], outputRange: [0, 1], ease: luxuryEase });

      if (navRef1.current) {
        set(navRef1.current, {
          opacity: navOpacity,
          translateY: `${navY}px`
        });
      }
      if (navRef2.current) {
        set(navRef2.current, {
          opacity: navOpacity,
          translateY: `${navY}px`
        });
      }
      if (logoRef.current) {
        set(logoRef.current, {
          opacity: logoOpacity
        });
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, [isHome, pathname]);

  if (pathname.startsWith("/dashboard") || pathname.startsWith("/auth")) {
    return null;
  }

  if (!isHome) {
    return (
      <>
        <header className="fixed inset-x-0 top-0 z-50 bg-[#FAF7F2]/92 backdrop-blur-md border-b border-[#C98E87]/15 text-[#3B2B28]">
          <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 sm:px-8">
            {/* Logo */}
            <div>
              <Link href="/" className="flex flex-col items-center gap-0.5 group">
                <span className="font-[var(--font-bodoni)] text-[1.35rem] leading-none tracking-[0.06em] text-[#3B2B28] group-hover:text-[#8B6B61] transition-colors duration-300 [-webkit-font-smoothing:antialiased]">
                  MANASVI
                </span>
                <span className="font-[var(--font-im-fell)] italic text-[0.6rem] tracking-[0.35em] text-[#8B6B61] uppercase leading-none">
                  Fashion
                </span>
              </Link>
            </div>

            <div className="flex items-center gap-8">
              {/* Desktop Nav Links */}
              <nav className="hidden gap-7 md:flex [text-rendering:optimizeLegibility] items-center">
                {["/kurtis", "/tunic-tops", "/dresses"].map((path, i) => (
                  <Link
                    key={path}
                    href={path}
                    className="font-[var(--font-cormorant)] text-[0.8rem] font-medium italic tracking-[0.18em] text-[#3B2B28]/75 uppercase hover:text-[#8B6B61] transition-colors duration-300"
                  >
                    {["Kurtis", "Tunics", "Dresses"][i]}
                  </Link>
                ))}
                {isAdmin && (
                  <Link
                    href="/dashboard"
                    className="font-[var(--font-cormorant)] text-[0.8rem] font-medium italic tracking-[0.18em] text-[#3B2B28]/75 uppercase hover:text-[#8B6B61] transition-colors duration-300"
                  >
                    Dashboard
                  </Link>
                )}
              </nav>

              {/* Divider */}
              <span className="hidden md:block w-px h-4 bg-[#C98E87]/30" />

              {/* Sign In / Out */}
              <div className="hidden md:flex items-center">
                {session ? (
                  <button
                    onClick={() => signOut({ callbackUrl: "/" })}
                    className="font-[var(--font-cormorant)] text-[0.78rem] italic tracking-[0.18em] text-[#3B2B28]/70 uppercase hover:text-[#8B6B61] transition-colors duration-300 cursor-pointer"
                  >
                    Sign Out {firstName ? `· ${firstName}` : ""}
                  </button>
                ) : (
                  <Link
                    href="/auth/signin"
                    className="font-[var(--font-cormorant)] text-[0.78rem] italic tracking-[0.18em] text-[#3B2B28]/70 uppercase hover:text-[#8B6B61] transition-colors duration-300"
                  >
                    Sign In
                  </Link>
                )}
              </div>

              {/* Cart icon — desktop */}
              <button
                onClick={() => { setDrawerTab("cart"); setIsDrawerOpen(true); }}
                className="hidden md:flex text-[#3B2B28]/70 hover:text-[#8B6B61] transition-colors p-1 relative cursor-pointer"
                aria-label="Open shopping bag"
              >
                <ShoppingBag className="w-4.5 h-4.5" strokeWidth={1.5} />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-[#C98E87] text-white text-[7px] font-bold w-3.5 h-3.5 flex items-center justify-center rounded-full">
                    {cartCount}
                  </span>
                )}
              </button>

              {/* Mobile controls */}
              <div className="flex items-center gap-2 md:hidden">
                <button
                  onClick={() => { setDrawerTab("cart"); setIsDrawerOpen(true); }}
                  className="text-[#3B2B28]/70 hover:text-[#8B6B61] transition-colors p-2 relative cursor-pointer"
                  aria-label="Open shopping bag"
                >
                  <ShoppingBag className="w-5 h-5" strokeWidth={1.5} />
                  {cartCount > 0 && (
                    <span className="absolute top-1 right-1 bg-[#C98E87] text-white text-[8px] font-bold w-4 h-4 flex items-center justify-center rounded-full">
                      {cartCount}
                    </span>
                  )}
                </button>
                <button
                  onClick={() => { setDrawerTab("menu"); setIsDrawerOpen(!isDrawerOpen); }}
                  className="text-[#3B2B28]/70 hover:text-[#8B6B61] transition-colors focus:outline-none z-50 relative p-2 cursor-pointer"
                  aria-label="Toggle navigation menu"
                >
                  {isDrawerOpen ? <X className="w-5 h-5" strokeWidth={1.5} /> : <Menu className="w-5 h-5" strokeWidth={1.5} />}
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Slide-out Drawer Component */}
        {renderDrawer()}
      </>
    );
  }

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-50 bg-transparent py-5">
        <div
          className={`mx-auto grid max-w-7xl grid-cols-3 items-center px-6 transition-colors duration-500 ${
            isScrolledPastSlides
              ? "text-[#3B2B28]"
              : "text-[#fff8f2] [text-shadow:0_1px_10px_rgba(0,0,0,0.5)]"
          }`}
        >
          {/* Left nav */}
          <nav
            ref={navRef1}
            style={{ opacity: 0, transform: "translateY(20px)" }}
            className="col-start-1 hidden items-center gap-7 md:flex [text-rendering:optimizeLegibility] [-webkit-font-smoothing:antialiased]"
          >
            {[
              ["/kurtis", "Kurtis"],
              ["/tunic-tops", "Tunics"],
              ["/collections", "Collections"],
            ].map(([path, label]) => (
              <Link
                key={path}
                href={path}
                className="font-[var(--font-cormorant)] text-[0.82rem] font-normal italic tracking-[0.22em] uppercase text-current opacity-85 hover:opacity-100 transition-opacity duration-300"
              >
                {label}
              </Link>
            ))}
          </nav>

          {/* Centre logo */}
          <div
            ref={logoRef}
            style={{ opacity: 0 }}
            className="col-start-2 justify-self-center [will-change:opacity]"
          >
            <Link
              href="/"
              className="flex flex-col items-center gap-0.5 [font-kerning:normal] [text-rendering:optimizeLegibility] [-webkit-font-smoothing:antialiased]"
            >
              <div className="font-[var(--font-bodoni)] text-[1.7rem] leading-none tracking-[0.06em] text-current md:text-[2rem]">
                MANASVI
              </div>
              <div className="font-[var(--font-im-fell)] italic text-[0.58rem] tracking-[0.42em] text-current uppercase leading-none opacity-80">
                Fashion
              </div>
            </Link>
          </div>

          {/* Right nav */}
          <nav
            ref={navRef2}
            style={{ opacity: 0, transform: "translateY(20px)" }}
            className="col-start-3 hidden items-center justify-end gap-7 md:flex [text-rendering:optimizeLegibility] [-webkit-font-smoothing:antialiased]"
          >
            <Link
              href="/about"
              className="font-[var(--font-cormorant)] text-[0.82rem] font-normal italic tracking-[0.22em] uppercase text-current opacity-85 hover:opacity-100 transition-opacity duration-300"
            >
              About
            </Link>

            {isAdmin && (
              <Link
                href="/dashboard"
                className="font-[var(--font-cormorant)] text-[0.82rem] font-normal italic tracking-[0.22em] uppercase text-current opacity-85 hover:opacity-100 transition-opacity duration-300"
              >
                Dashboard
              </Link>
            )}

            {session ? (
              <button
                onClick={() => signOut({ callbackUrl: "/" })}
                className="font-[var(--font-cormorant)] text-[0.82rem] font-normal italic tracking-[0.22em] uppercase text-current opacity-85 hover:opacity-100 transition-opacity duration-300 cursor-pointer"
              >
                Sign Out
              </button>
            ) : (
              <Link
                href="/auth/signin"
                className="font-[var(--font-cormorant)] text-[0.82rem] font-normal italic tracking-[0.22em] uppercase text-current opacity-85 hover:opacity-100 transition-opacity duration-300"
              >
                Sign In
              </Link>
            )}

            {/* Cart icon */}
            <button
              onClick={() => { setDrawerTab("cart"); setIsDrawerOpen(true); }}
              className="text-current opacity-85 hover:opacity-100 transition-opacity p-1 relative cursor-pointer"
              aria-label="Open shopping bag"
            >
              <ShoppingBag className="w-4 h-4" strokeWidth={1.5} />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#C98E87] text-white text-[7px] font-bold w-3.5 h-3.5 flex items-center justify-center rounded-full">
                  {cartCount}
                </span>
              )}
            </button>
          </nav>

          {/* Mobile controls */}
          <div className="col-start-3 justify-self-end flex items-center gap-1 md:hidden">
            <button
              onClick={() => { setDrawerTab("cart"); setIsDrawerOpen(true); }}
              className="text-current opacity-85 hover:opacity-100 transition-opacity p-2 relative cursor-pointer"
              aria-label="Open shopping bag"
            >
              <ShoppingBag className="w-5 h-5" strokeWidth={1.5} />
              {cartCount > 0 && (
                <span className="absolute top-0.5 right-0.5 bg-[#C98E87] text-white text-[8px] font-bold w-4 h-4 flex items-center justify-center rounded-full">
                  {cartCount}
                </span>
              )}
            </button>
            <button
              onClick={() => { setDrawerTab("menu"); setIsDrawerOpen(!isDrawerOpen); }}
              className="text-current opacity-85 hover:opacity-100 transition-opacity focus:outline-none z-50 relative p-2 cursor-pointer"
              aria-label="Toggle navigation menu"
            >
              {isDrawerOpen ? <X className="w-5 h-5" strokeWidth={1.5} /> : <Menu className="w-5 h-5" strokeWidth={1.5} />}
            </button>
          </div>
        </div>
      </header>

      {/* Slide-out Drawer Component */}
      {renderDrawer()}
    </>
  );

  function renderDrawer() {
    const cartItems = cart
      .map((item) => {
        const product = productsList.find((p) => p.id === item.productId);
        return {
          ...item,
          title: item.title || product?.title || "Premium Apparel",
          price: item.price ?? product?.price ?? 0,
          category: product?.subcategory || product?.category || "Women's Fashion",
          image: item.image ?? product?.images[0],
          hoverImage: product?.images[1] ?? product?.images[0],
          color: product?.color || "Custom Palette",
          slug: item.slug ?? product?.slug ?? "",
        };
      })
      .filter((item) => item.title);

    return (
      <AnimatePresence>
        {isDrawerOpen && (
          <>
            {/* Backdrop with fade-in and smooth click handler */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsDrawerOpen(false)}
              className="fixed inset-0 z-40 bg-[#160E0C]/40 backdrop-blur-md"
            />

            {/* Navigation panel sliding from the right */}
            <motion.div
              variants={{
                hidden: { x: "100%" },
                visible: {
                  x: 0,
                  transition: {
                    type: "spring",
                    stiffness: 380,
                    damping: 38,
                    staggerChildren: 0.08,
                    delayChildren: 0.15,
                  },
                },
                exit: {
                  x: "100%",
                  transition: {
                    type: "spring",
                    stiffness: 380,
                    damping: 38,
                  },
                },
              }}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="fixed bottom-0 right-0 top-0 z-50 flex h-full w-[85vw] max-w-[380px] flex-col bg-[#160E0C] p-6 text-[#FAF7F2] shadow-2xl border-l border-[#8B6B61]/10"
            >
              {/* Header inside drawer */}
              <div className="flex items-center justify-between border-b border-[#FAF7F2]/10 pb-4">
                <Link
                  href="/"
                  onClick={() => setIsDrawerOpen(false)}
                  className="flex flex-col items-start font-[var(--font-grance)] text-xl font-semibold tracking-[0.04em] text-[#FAF7F2]"
                >
                  <span>MANASVI</span>
                  <span className="font-[var(--font-cormorant)] text-[10px] font-semibold uppercase tracking-[0.22em] text-[#E7C2B8]">
                    Fashion
                  </span>
                </Link>
                <button
                  onClick={() => setIsDrawerOpen(false)}
                  className="text-[#FAF7F2] hover:text-[#E7C2B8] transition-colors p-1 cursor-pointer"
                  aria-label="Close menu"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Tab Selector */}
              <div className="flex w-full border-b border-[#FAF7F2]/10 mt-4 text-[10px] font-semibold uppercase tracking-[0.2em] font-inter">
                <button
                  onClick={() => setDrawerTab("menu")}
                  className={`flex-1 py-3 text-center border-b-2 transition-all duration-300 cursor-pointer ${
                    drawerTab === "menu"
                      ? "border-[#E7C2B8] text-white"
                      : "border-transparent text-white/40 hover:text-white/70"
                  }`}
                >
                  Menu
                </button>
                <button
                  onClick={() => setDrawerTab("cart")}
                  className={`flex-1 py-3 text-center border-b-2 transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer ${
                    drawerTab === "cart"
                      ? "border-[#E7C2B8] text-white"
                      : "border-transparent text-white/40 hover:text-white/70"
                  }`}
                >
                  <span>Bag</span>
                  {cartCount > 0 && (
                    <span className="bg-[#E7C2B8] text-[#160E0C] text-[9px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center scale-90">
                      {cartCount}
                    </span>
                  )}
                </button>
              </div>

              {/* Drawer Content */}
              {drawerTab === "menu" ? (
                <div className="flex flex-col justify-between flex-grow overflow-hidden">
                  {/* Navigation links */}
                  <nav className="flex flex-col gap-6 py-8 overflow-y-auto scrollbar-none flex-grow">
                    {[
                      ["/", "Home"],
                      ["/kurtis", "Kurtis Collection"],
                      ["/tunic-tops", "Tunic Tops"],
                      ["/dresses", "Dresses"],
                      ["/collections", "Lookbook & Collections"],
                      ["/about", "Our Story"],
                      ["/cart", "Shopping Bag"],
                    ].map(([href, label]) => (
                      <motion.div
                        key={href}
                        variants={{
                          hidden: { opacity: 0, x: 20 },
                          visible: { opacity: 1, x: 0 },
                        }}
                      >
                        <Link
                          href={href}
                          onClick={() => setIsDrawerOpen(false)}
                          className="group flex items-center justify-between py-1 text-lg font-light tracking-wide hover:text-[#E7C2B8] transition-colors"
                        >
                          <span className="font-cormorant italic font-medium">{label}</span>
                          <span className="opacity-0 group-hover:opacity-100 transition-opacity text-[#E7C2B8] text-xs">→</span>
                        </Link>
                      </motion.div>
                    ))}
                  </nav>

                  {/* Action buttons at the bottom of the drawer */}
                  <div className="border-t border-[#FAF7F2]/10 pt-4 flex flex-col gap-4">
                    {isAdmin && (
                      <Link
                        href="/dashboard"
                        onClick={() => setIsDrawerOpen(false)}
                        className="w-full text-center py-3 border border-[#E7C2B8]/20 rounded-sm font-inter text-xs uppercase tracking-[0.2em] bg-[#E7C2B8]/5 hover:bg-[#E7C2B8]/10 text-[#E7C2B8] transition-all"
                      >
                        Admin Dashboard
                      </Link>
                    )}
                    {session ? (
                      <button
                        onClick={() => {
                          setIsDrawerOpen(false);
                          signOut({ callbackUrl: "/" });
                        }}
                        className="w-full py-3 bg-[#E7C2B8] hover:bg-[#DFAE9F] text-[#160E0C] font-semibold font-inter text-xs uppercase tracking-[0.2em] rounded-sm transition-all cursor-pointer"
                      >
                        Sign Out {firstName ? `(${firstName})` : ""}
                      </button>
                    ) : (
                      <Link
                        href="/auth/signin"
                        onClick={() => setIsDrawerOpen(false)}
                        className="w-full text-center py-3 bg-[#E7C2B8] hover:bg-[#DFAE9F] text-[#160E0C] font-semibold font-inter text-xs uppercase tracking-[0.2em] rounded-sm transition-all block"
                      >
                        Sign In
                      </Link>
                    )}
                    <div className="text-[10px] text-center text-[#FAF7F2]/40 tracking-wider font-light mt-2 uppercase font-inter">
                      © 2026 Manasvi Fashion Atelier
                    </div>
                  </div>
                </div>
              ) : (
                /* Cart Tab View */
                <div className="flex flex-col justify-between flex-grow overflow-hidden py-6">
                  {cartItems.length === 0 ? (
                    <div className="flex-grow flex flex-col items-center justify-center text-center px-4">
                      <ShoppingBag className="w-10 h-10 text-white/20 mb-4 stroke-1" />
                      <p className="font-cormorant text-xl italic text-white/80">Your bag is empty.</p>
                      <p className="font-inter text-[11px] text-white/40 tracking-wider mt-2 max-w-[200px]">
                        Save your favorite silhouettes and designs to purchase them later.
                      </p>
                      <button
                        onClick={() => {
                          setIsDrawerOpen(false);
                          window.location.href = "/collections";
                        }}
                        className="mt-6 px-6 py-2.5 bg-[#FAF7F2] text-[#160E0C] text-[10px] font-semibold uppercase tracking-[0.2em] rounded-sm hover:bg-[#E7C2B8] transition-colors cursor-pointer"
                      >
                        Browse Boutique
                      </button>
                    </div>
                  ) : (
                    <>
                      {/* Cart Items List */}
                      <div className="flex-grow overflow-y-auto pr-1 space-y-4 scrollbar-thin scrollbar-thumb-white/10 hover:scrollbar-thumb-white/20">
                        {cartItems.map((item) => (
                          <div
                            key={`${item.productId}-${item.size}`}
                            className="flex gap-4 p-3 bg-white/[0.02] border border-white/[0.05] rounded-lg relative group transition-colors duration-300 hover:bg-white/[0.04]"
                          >
                            {/* Product Thumbnail */}
                            <div className="w-16 h-20 rounded-md overflow-hidden bg-white/5 border border-white/[0.08] flex-shrink-0">
                              <img
                                src={item.image}
                                alt={item.title}
                                className="w-full h-full object-cover"
                              />
                            </div>

                            {/* Item Details */}
                            <div className="flex-grow flex flex-col justify-between">
                              <div>
                                <h4 className="font-cormorant text-sm font-medium tracking-wide text-white line-clamp-1 leading-snug">
                                  {item.title}
                                </h4>
                                <div className="flex gap-2 items-center text-[10px] text-white/40 mt-1 font-inter tracking-wider uppercase">
                                  <span>Size: {item.size}</span>
                                  <span>•</span>
                                  <span>{formatINR(item.price)}</span>
                                </div>
                              </div>

                              {/* Quantity controls */}
                              <div className="flex items-center justify-between mt-2">
                                <div className="flex items-center gap-2.5 border border-white/10 rounded-md px-2 py-1 bg-white/[0.01]">
                                  <button
                                    onClick={() => updateQty(item.productId, item.size, item.qty - 1)}
                                    className="text-white/40 hover:text-white transition-colors cursor-pointer p-0.5"
                                    aria-label="Decrease quantity"
                                  >
                                    <Minus className="w-3 h-3" />
                                  </button>
                                  <span className="font-inter text-xs text-white/80 min-w-[12px] text-center">
                                    {item.qty}
                                  </span>
                                  <button
                                    onClick={() => updateQty(item.productId, item.size, item.qty + 1)}
                                    className="text-white/40 hover:text-white transition-colors cursor-pointer p-0.5"
                                    aria-label="Increase quantity"
                                  >
                                    <Plus className="w-3 h-3" />
                                  </button>
                                </div>

                                <button
                                  onClick={() => removeFromCart(item.productId, item.size)}
                                  className="text-white/30 hover:text-[#C98E87] transition-colors p-1 cursor-pointer"
                                  aria-label="Remove item"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Summary Section */}
                      <div className="border-t border-[#FAF7F2]/10 pt-4 mt-4 space-y-3 font-inter">
                        <div className="flex items-center justify-between text-xs tracking-wider">
                          <span className="text-white/40 uppercase">Subtotal</span>
                          <span className="text-white font-medium">{formatINR(cartTotal)}</span>
                        </div>
                        <p className="text-[10px] text-white/30 font-light tracking-wide leading-relaxed">
                          Shipping and discount codes are applied at checkout.
                        </p>
                        
                        <div className="flex gap-2 pt-2">
                          <Link
                            href="/cart"
                            onClick={() => setIsDrawerOpen(false)}
                            className="flex-1 text-center py-3 border border-white/10 rounded-sm font-inter text-[10px] uppercase tracking-[0.2em] text-white hover:bg-white/[0.05] transition-all"
                          >
                            View Bag
                          </Link>
                          <Link
                            href={session ? "/checkout" : "/auth/signin?callbackUrl=/checkout"}
                            onClick={() => setIsDrawerOpen(false)}
                            className="flex-1 text-center py-3 bg-[#E7C2B8] hover:bg-[#DFAE9F] text-[#160E0C] font-semibold font-inter text-[10px] uppercase tracking-[0.2em] rounded-sm transition-all"
                          >
                            Checkout
                          </Link>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    );
  }

}
