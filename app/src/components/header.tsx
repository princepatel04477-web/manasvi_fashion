"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { set } from "animejs";
import { interpolate, luxuryEase } from "@/lib/use-anime-scroll";
import { Menu, X, ShoppingBag, Trash2, Plus, Minus, Heart, Search, User, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useShop } from "@/context/shop-context";
import { formatINR } from "@/lib/store";

const AnimatedNavLink = ({ href, children }: { href: string; children: React.ReactNode }) => {
  const defaultTextColor = 'text-[#3B2B28]/75';
  const hoverTextColor = 'text-[#8B6B61]';
  const textSizeClass = 'text-[0.82rem] font-medium tracking-[0.18em] uppercase font-[var(--font-cormorant)]';

  return (
    <Link href={href} className={`group relative block overflow-hidden h-7 whitespace-nowrap ${textSizeClass}`}>
      <div className="flex flex-col transition-transform duration-300 ease-out transform group-hover:-translate-y-1/2">
        <span className={`h-7 flex items-center ${defaultTextColor}`}>{children}</span>
        <span className={`h-7 flex items-center ${hoverTextColor}`}>{children}</span>
      </div>
    </Link>
  );
};

export default function Header() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [drawerTab, setDrawerTab] = useState<"menu" | "cart">("menu");
  const { cart, products: productsList, cartCount, cartTotal, updateQty, removeFromCart, wishlist } = useShop();
  const [isScrolledPastSlides, setIsScrolledPastSlides] = useState(false);
  const [showGlobalHeaderMobile, setShowGlobalHeaderMobile] = useState(false);
  const navRef1 = useRef<HTMLElement>(null);
  const navRef2 = useRef<HTMLElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [headerShapeClass, setHeaderShapeClass] = useState("rounded-full");
  const shapeTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [isAccountOpen, setIsAccountOpen] = useState(false);
  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const isHome = pathname === "/";

  useEffect(() => {
    const handleOpenMenu = () => {
      setDrawerTab("menu");
      setIsDrawerOpen(true);
    };
    const handleOpenCart = () => {
      setDrawerTab("cart");
      setIsDrawerOpen(true);
    };
    window.addEventListener("open-mobile-menu", handleOpenMenu);
    window.addEventListener("open-mobile-cart", handleOpenCart);
    return () => {
      window.removeEventListener("open-mobile-menu", handleOpenMenu);
      window.removeEventListener("open-mobile-cart", handleOpenCart);
    };
  }, []);

  useEffect(() => {
    if (shapeTimeoutRef.current) {
      clearTimeout(shapeTimeoutRef.current);
    }

    if (isOpen) {
      setHeaderShapeClass("rounded-2xl");
    } else {
      shapeTimeoutRef.current = setTimeout(() => {
        setHeaderShapeClass("rounded-full");
      }, 300);
    }

    return () => {
      if (shapeTimeoutRef.current) {
        clearTimeout(shapeTimeoutRef.current);
      }
    };
  }, [isOpen]);

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

  // Auto-close drawer and mobile menu on route change
  useEffect(() => {
    setIsDrawerOpen(false);
    setIsOpen(false);
  }, [pathname]);

  useEffect(() => {
    // Persistent header: no scroll styling transitions required.
  }, [isHome, pathname]);

  if (pathname.startsWith("/dashboard") || pathname.startsWith("/auth") || pathname.startsWith("/mobile")) {
    return null;
  }

  const navLinksData = [
    { label: 'Home', href: '/' },
    { label: 'Kurtis', href: '/kurtis' },
    { label: 'Tunics', href: '/tunic-tops' },
    { label: 'Dresses', href: '/dresses' },
    { label: 'One Piece', href: '/one-piece' },
    { label: 'About', href: '/about' },
    { label: 'Contact', href: '/contact' },
  ];

  const handleSearchClick = () => {
    if (pathname === "/") {
      window.dispatchEvent(new Event("open-search"));
    } else {
      window.location.href = "/?search=true";
    }
  };

  const desktopAuthElement = session ? (
    <div 
      className="relative"
      onMouseEnter={() => setIsAccountOpen(true)}
      onMouseLeave={() => setIsAccountOpen(false)}
    >
      <button className="flex items-center gap-1.5 px-4 py-2 border border-[#C98E87]/20 bg-[#FAF7F2]/60 text-[#3B2B28]/75 hover:text-[#8B6B61] rounded-full transition-colors duration-200 text-[0.78rem] font-medium tracking-[0.18em] uppercase cursor-pointer font-[var(--font-cormorant)]">
        <span>Hi, {firstName || "User"}</span>
        <ChevronDown className="w-3.5 h-3.5 opacity-60" />
      </button>

      {/* Dropdown Menu */}
      <div className={`absolute right-0 mt-1 w-44 bg-[#FAF7F2] border border-[#C98E87]/20 rounded-xl shadow-lg py-2 flex flex-col z-50 transition-all duration-200 origin-top-right ${isAccountOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'}`}>
        {isAdmin && (
          <Link
            href="/dashboard"
            className="px-4 py-2 text-[0.78rem] tracking-[0.18em] text-[#3B2B28]/75 hover:text-[#8B6B61] hover:bg-[#FAF7F2]/50 uppercase transition-colors font-[var(--font-cormorant)] font-semibold"
          >
            Dashboard
          </Link>
        )}
        <Link
          href="/order-tracking"
          className="px-4 py-2 text-[0.78rem] tracking-[0.18em] text-[#3B2B28]/75 hover:text-[#8B6B61] hover:bg-[#FAF7F2]/50 uppercase transition-colors font-[var(--font-cormorant)] font-semibold"
        >
          Orders
        </Link>
        <Link
          href="/wishlist"
          className="px-4 py-2 text-[0.78rem] tracking-[0.18em] text-[#3B2B28]/75 hover:text-[#8B6B61] hover:bg-[#FAF7F2]/50 uppercase transition-colors font-[var(--font-cormorant)] font-semibold"
        >
          Wishlist
        </Link>
        <hr className="border-[#C98E87]/15 my-1" />
        <button
          onClick={() => signOut({ callbackUrl: "/" })}
          className="px-4 py-2 text-[0.78rem] tracking-[0.18em] text-left text-red-700/80 hover:text-red-700 hover:bg-[#FAF7F2]/50 uppercase transition-colors cursor-pointer font-[var(--font-cormorant)] font-semibold"
        >
          Sign Out
        </button>
      </div>
    </div>
  ) : (
    <div className="flex items-center gap-2 flex-nowrap flex-shrink-0">
      <Link
        href="/auth/signin"
        className="px-4 py-2 text-[0.78rem] tracking-[0.18em] text-[#3B2B28]/75 border border-[#C98E87]/25 hover:border-[#8B6B61]/50 hover:text-[#8B6B61] rounded-full bg-[#FAF7F2]/50 transition-all duration-200 font-[var(--font-cormorant)] font-semibold whitespace-nowrap flex-shrink-0"
      >
        Log In
      </Link>
      <Link
        href="/auth/signup"
        className="px-4 py-2 text-[0.78rem] tracking-[0.18em] text-white bg-gradient-to-br from-[#E7C2B8] to-[#C98E87] hover:from-[#EFCAC0] hover:to-[#D29891] rounded-full shadow-xs hover:shadow-md transition-all duration-200 font-[var(--font-cormorant)] font-semibold whitespace-nowrap flex-shrink-0"
      >
        Sign Up
      </Link>
    </div>
  );

  const mobileAuthElement = session ? (
    <div className="flex flex-col items-center space-y-4 mt-4 w-full">
      {isAdmin && (
        <Link
          href="/dashboard"
          className="text-[#3B2B28]/75 hover:text-[#8B6B61] transition-colors w-full text-center text-sm font-semibold tracking-[0.18em] uppercase font-[var(--font-cormorant)]"
          onClick={() => setIsOpen(false)}
        >
          Dashboard
        </Link>
      )}
      <Link
        href="/order-tracking"
        className="text-[#3B2B28]/75 hover:text-[#8B6B61] transition-colors w-full text-center text-sm font-semibold tracking-[0.18em] uppercase font-[var(--font-cormorant)]"
        onClick={() => setIsOpen(false)}
      >
        Orders
      </Link>
      <Link
        href="/wishlist"
        className="text-[#3B2B28]/75 hover:text-[#8B6B61] transition-colors w-full text-center text-sm font-semibold tracking-[0.18em] uppercase font-[var(--font-cormorant)]"
        onClick={() => setIsOpen(false)}
      >
        Wishlist
      </Link>
      <button
        onClick={() => {
          setIsOpen(false);
          signOut({ callbackUrl: "/" });
        }}
        className="w-full py-2.5 bg-red-700/10 hover:bg-red-700/20 text-red-700 font-semibold text-xs uppercase tracking-[0.18em] rounded-full transition-all cursor-pointer font-[var(--font-cormorant)]"
      >
        Logout
      </button>
    </div>
  ) : (
    <div className="flex flex-col items-center space-y-3 mt-4 w-full px-4 border-t border-[#C98E87]/15 pt-4">
      <Link
        href="/auth/signin"
        className="w-full text-center py-2.5 border border-[#C98E87]/30 hover:border-[#8B6B61]/50 text-[#3B2B28]/75 hover:text-[#8B6B61] font-semibold text-xs uppercase tracking-[0.18em] rounded-full transition-all block bg-[#FAF7F2]/50 font-[var(--font-cormorant)]"
        onClick={() => setIsOpen(false)}
      >
        Log In
      </Link>
      <Link
        href="/auth/signup"
        className="w-full text-center py-2.5 text-white bg-gradient-to-br from-[#E7C2B8] to-[#C98E87] hover:from-[#EFCAC0] hover:to-[#D29891] font-semibold text-xs uppercase tracking-[0.18em] rounded-full transition-all block font-[var(--font-cormorant)]"
        onClick={() => setIsOpen(false)}
      >
        Sign Up
      </Link>
    </div>
  );

  return (
    <>
      <header className={`fixed top-4 left-1/2 transform -translate-x-1/2 z-50
                         flex flex-col items-center
                         px-3.5 sm:px-6 md:px-8 py-2.5 sm:py-3 backdrop-blur-md
                         ${headerShapeClass}
                         border border-[#C98E87]/25 bg-[#FAF7F2]/82 shadow-md
                         w-[95%] max-w-7xl
                         transition-[border-radius] duration-300 ease-in-out text-[#3B2B28]`}>

        <div className="flex items-center justify-between w-full gap-x-2 sm:gap-x-4 md:gap-x-8">
          {/* Logo */}
          <div className="flex items-center flex-shrink-0">
            <Link href="/" className="flex items-center gap-1.5 sm:gap-3 group select-none">
              <img
                src="/Man_logo.png"
                alt="Manasvi Logo"
                className="h-9 w-9 sm:h-12 sm:w-12 rounded-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="flex flex-col items-start gap-0.5">
                <span className="font-[var(--font-bodoni)] text-[1.05rem] sm:text-[1.35rem] leading-none tracking-[0.06em] text-[#3B2B28] group-hover:text-[#8B6B61] transition-colors duration-300">
                  MANASVI
                </span>
                <span className="font-[var(--font-im-fell)] text-[0.5rem] sm:text-[0.62rem] tracking-[0.35em] text-[#8B6B61] uppercase leading-none font-medium">
                  Fashion
                </span>
              </div>
            </Link>
          </div>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center space-x-5 lg:space-x-7 text-sm flex-nowrap flex-shrink-0">
            {navLinksData.map((link) => (
              <AnimatedNavLink key={link.href} href={link.href}>
                {link.label}
              </AnimatedNavLink>
            ))}
          </nav>

          {/* Right Actions & Icons (Desktop) */}
          <div className="hidden md:flex items-center gap-4 flex-nowrap flex-shrink-0">
            {/* Search button */}
            <button 
              onClick={handleSearchClick}
              className="p-1 text-[#3B2B28]/70 hover:text-[#8B6B61] active:scale-95 transition-all cursor-pointer"
              aria-label="Search catalogue"
            >
              <Search className="w-4.5 h-4.5" strokeWidth={1.5} />
            </button>

            {/* Wishlist Link */}
            <Link
              href="/wishlist"
              className="text-[#3B2B28]/70 hover:text-[#8B6B61] relative p-1 transition-colors"
              aria-label="View wishlist"
            >
              <Heart className="w-4.5 h-4.5" strokeWidth={1.5} />
              {wishlist.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#C98E87] text-white text-[7px] font-bold w-3.5 h-3.5 flex items-center justify-center rounded-full">
                  {wishlist.length}
                </span>
              )}
            </Link>

            {/* Cart Trigger */}
            <button
              onClick={() => { setDrawerTab("cart"); setIsDrawerOpen(true); }}
              className="text-[#3B2B28]/70 hover:text-[#8B6B61] relative p-1 transition-colors cursor-pointer"
              aria-label="Open shopping bag"
            >
              <ShoppingBag className="w-4.5 h-4.5" strokeWidth={1.5} />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#C98E87] text-white text-[7px] font-bold w-3.5 h-3.5 flex items-center justify-center rounded-full">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Divider */}
            <span className="w-px h-4 bg-[#C98E87]/30" />

            {/* Auth section */}
            {desktopAuthElement}
          </div>

          {/* Mobile Controls (visible on < md) */}
          <div className="flex items-center gap-1 sm:gap-2 md:hidden">
            {/* Search button */}
            <button 
              onClick={handleSearchClick}
              className="p-1 sm:p-1.5 text-[#3B2B28]/70 hover:text-[#8B6B61] active:scale-95 transition-all cursor-pointer"
              aria-label="Search catalogue"
            >
              <Search className="w-4.5 h-4.5 sm:w-5 sm:h-5" strokeWidth={1.5} />
            </button>

            {/* Wishlist Link */}
            <Link
              href="/wishlist"
              className="text-[#3B2B28]/70 hover:text-[#8B6B61] relative p-1 sm:p-1.5 transition-colors"
              aria-label="View wishlist"
            >
              <Heart className="w-4.5 h-4.5 sm:w-5 sm:h-5" strokeWidth={1.5} />
              {wishlist.length > 0 && (
                <span className="absolute -top-0.5 -right-0.5 sm:top-1 sm:right-1 bg-[#C98E87] text-white text-[7px] sm:text-[7.5px] font-bold w-3 sm:w-3.5 h-3 sm:h-3.5 flex items-center justify-center rounded-full">
                  {wishlist.length}
                </span>
              )}
            </Link>

            {/* Cart Trigger */}
            <button
              onClick={() => { setDrawerTab("cart"); setIsDrawerOpen(true); }}
              className="text-[#3B2B28]/70 hover:text-[#8B6B61] relative p-1 sm:p-1.5 transition-colors cursor-pointer"
              aria-label="Open shopping bag"
            >
              <ShoppingBag className="w-4.5 h-4.5 sm:w-5 sm:h-5" strokeWidth={1.5} />
              {cartCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 sm:top-1 sm:right-1 bg-[#C98E87] text-white text-[7px] sm:text-[7.5px] font-bold w-3 sm:w-3.5 h-3 sm:h-3.5 flex items-center justify-center rounded-full">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Hamburger Menu button */}
            <button 
              className="flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 text-[#3B2B28]/75 hover:text-[#8B6B61] focus:outline-none cursor-pointer" 
              onClick={toggleMenu} 
              aria-label={isOpen ? 'Close Menu' : 'Open Menu'}
            >
              {isOpen ? <X className="w-5 h-5 sm:w-5.5 sm:h-5.5" strokeWidth={1.5} /> : <Menu className="w-5 h-5 sm:w-5.5 sm:h-5.5" strokeWidth={1.5} />}
            </button>
          </div>
        </div>

        {/* Mobile Expanded Menu */}
        <div className={`md:hidden flex flex-col items-center w-full transition-all ease-in-out duration-300 overflow-hidden
                         ${isOpen ? 'max-h-[1000px] opacity-100 pt-4' : 'max-h-0 opacity-0 pt-0 pointer-events-none'}`}>
          <nav className="flex flex-col items-center space-y-4 text-base w-full border-t border-[#C98E87]/15 pt-4">
            {navLinksData.map((link) => (
              <Link 
                key={link.href} 
                href={link.href} 
                className="text-[#3B2B28]/70 hover:text-[#8B6B61] transition-colors w-full text-center text-sm font-semibold tracking-[0.18em] uppercase font-[var(--font-cormorant)]"
                onClick={() => setIsOpen(false)}
              >
                {link.label}
              </Link>
            ))}
          </nav>
          {mobileAuthElement}
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
                       ["/one-piece", "One Piece"],
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
                          <span className="font-cormorant font-medium">{label}</span>
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
                      <div className="flex gap-3">
                        <Link
                          href="/auth/signin"
                          onClick={() => setIsDrawerOpen(false)}
                          className="flex-1 text-center py-3 bg-[#E7C2B8] hover:bg-[#DFAE9F] text-[#160E0C] font-semibold font-inter text-xs uppercase tracking-[0.2em] rounded-sm transition-all block"
                        >
                          Sign In
                        </Link>
                        <Link
                          href="/auth/signup"
                          onClick={() => setIsDrawerOpen(false)}
                          className="flex-1 text-center py-3 border border-[#E7C2B8]/30 hover:bg-[#FAF7F2]/5 text-[#E7C2B8] font-semibold font-inter text-xs uppercase tracking-[0.2em] rounded-sm transition-all block"
                        >
                          Sign Up
                        </Link>
                      </div>
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
                      <p className="font-cormorant text-xl text-white/80">Your bag is empty.</p>
                      <p className="font-inter text-[11px] text-white/40 tracking-wider mt-2 max-w-[200px]">
                        Save your favorite silhouettes and designs to purchase them later.
                      </p>
                      <button
                        onClick={() => {
                          setIsDrawerOpen(false);
                          window.location.href = "/";
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
