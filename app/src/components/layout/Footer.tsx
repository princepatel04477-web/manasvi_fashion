"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUp, ChevronDown, Globe, Mail, Check } from "lucide-react";

// Reusable animated footer link with premium slide-in underline
const FooterLink = ({ href, children }: { href: string; children: React.ReactNode }) => (
  <Link
    href={href}
    className="group relative inline-flex py-1.5 text-[13px] text-white/50 transition-colors duration-300 hover:text-white font-[var(--font-inter)] tracking-wider"
  >
    <span className="relative z-10 transition-transform duration-300 group-hover:translate-x-1">
      {children}
    </span>
    <span className="absolute bottom-1.5 left-1 h-[1px] w-0 bg-[#E7C2B8]/80 transition-all duration-300 ease-out group-hover:w-5/6" />
  </Link>
);

export default function Footer() {
  const pathname = usePathname();
  const [openSection, setOpenSection] = useState<string | null>(null);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [newsletterSubmitted, setNewsletterSubmitted] = useState(false);

  // Scroll listener for Back to Top button
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 400) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Exclude administrative dashboard and auth pages
  if (pathname.startsWith("/dashboard") || pathname.startsWith("/auth")) {
    return null;
  }

  const toggleSection = (section: string) => {
    setOpenSection(openSection === section ? null : section);
  };

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (newsletterEmail.trim()) {
      setNewsletterSubmitted(true);
      setTimeout(() => {
        setNewsletterEmail("");
      }, 2000);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Custom monochromatic premium payment vector icons
  const PaymentIcons = () => (
    <div className="flex items-center gap-3 opacity-40">
      {/* Visa */}
      <svg className="h-5 w-8 fill-current text-[#FAF7F2]" viewBox="0 0 32 20">
        <path d="M12.24 16.48h2.08l1.3-8.08h-2.08l-1.3 8.08zm8.74-7.8c-.46-.18-1.18-.38-2.06-.38-2.28 0-3.88 1.22-3.9 2.94-.02 1.28 1.14 1.98 2.02 2.42.9.44 1.2.72 1.2 1.12 0 .6-.72.88-1.38.88-.92 0-1.42-.14-2.18-.48l-.3-.14-.32 2c.54.26 1.54.48 2.56.5 2.4 0 3.96-1.18 4-3 .02-1-.6-1.76-1.92-2.38-.8-.42-1.3-.7-1.3-1.12 0-.38.42-.78 1.32-.78.74 0 1.28.16 1.7.34l.2.1.36-2.16zM28.02 8.4h-1.6c-.5 0-.88.14-1.1.56l-3.88 9.28.02-.04h2.18l.44-1.2h2.66l.24 1.24h1.92L28.02 8.4zm-3.32 6.84l.88-2.42 1.04 2.42h-1.92zM7.22 8.4L5.16 14.1.94 9.18C.54 8.7.12 8.44.12 8.44h4.48l1.46 4.9L7.22 8.4z" />
      </svg>
      {/* Mastercard */}
      <svg className="h-5 w-8 fill-current text-[#FAF7F2]" viewBox="0 0 32 20">
        <path d="M12 16a6 6 0 110-12 6 6 0 010 12z" opacity="0.65" />
        <path d="M20 16a6 6 0 110-12 6 6 0 010 12z" />
        <path d="M16 14.28a6 6 0 010-8.56 6 6 0 010 8.56z" opacity="0.8" />
      </svg>
      {/* Amex */}
      <svg className="h-5 w-8 fill-current text-[#FAF7F2]" viewBox="0 0 32 20">
        <rect width="32" height="20" rx="3" fill="none" stroke="currentColor" strokeWidth="1.5" />
        <text x="50%" y="62%" dominantBaseline="middle" textAnchor="middle" fontSize="6.5" fontWeight="bold" letterSpacing="0.5">AMEX</text>
      </svg>
      {/* Apple Pay */}
      <svg className="h-5 w-8 fill-current text-[#FAF7F2]" viewBox="0 0 32 20">
        <path d="M13.75 6.78c-.77.92-.73 2.11-.73 2.11s1.12.06 1.83-.8c.7-.85.64-1.99.64-1.99s-1 .24-1.74.68zm3.87.54c-.66 0-1.22.42-1.52.42-.3 0-.74-.37-1.32-.37-.73 0-1.4.42-1.77 1.07-.73 1.28-.2 3.19.5 4.2.35.49.75 1.04 1.29 1.04.5 0 .7-.31 1.3-.31.6 0 .78.31 1.3.31.54 0 .9-.5 1.25-1.01.4-.58.56-1.15.58-1.18 0-.02-1.12-.43-1.13-1.72-.01-1.08.88-1.6 1.01-1.68-.5-.74-1.28-.82-1.54-.82z" />
        <text x="21" y="11.5" fontSize="5" fontWeight="bold">Pay</text>
      </svg>
    </div>
  );

  const sections = {
    shop: {
      title: "Shop",
      links: [
        { label: "New Arrivals", href: "/collections" },
        { label: "Kurtis", href: "/kurtis" },
        { label: "Dresses", href: "/dresses" },
        { label: "Indo-Western", href: "/collections" },
        { label: "Tops", href: "/tunic-tops" },
        { label: "Sale", href: "/collections" }
      ]
    },
    company: {
      title: "Company",
      links: [
        { label: "About Us", href: "/journal" },
        { label: "Contact", href: "/order-tracking" },
        { label: "Careers", href: "/" },
        { label: "Blogs", href: "/journal" },
        { label: "Privacy Policy", href: "/" },
        { label: "Terms & Conditions", href: "/" }
      ]
    },
    support: {
      title: "Customer Support",
      links: [
        { label: "Shipping Policy", href: "/" },
        { label: "Return & Exchange", href: "/" },
        { label: "Track Order", href: "/order-tracking" },
        { label: "FAQs", href: "/" },
        { label: "Size Guide", href: "/" }
      ]
    },
    account: {
      title: "Account",
      links: [
        { label: "Login", href: "/auth/signin" },
        { label: "Register", href: "/auth/signin" },
        { label: "Wishlist", href: "/wishlist" },
        { label: "Orders", href: "/order-tracking" }
      ]
    }
  };

  return (
    <footer className="soft-grain relative overflow-hidden bg-[#160E0C] text-[#FAF7F2] pt-20 pb-12 z-10 border-t border-white/[0.04]">
      {/* Luxury Radial Light Leak Overlay */}
      <div className="absolute top-0 left-1/4 -translate-y-1/2 w-[500px] h-[500px] bg-[radial-gradient(circle,rgba(231,194,184,0.045)_0%,transparent_70%)] pointer-events-none blur-[100px] z-0" />
      <div className="absolute bottom-0 right-1/4 translate-y-1/3 w-[400px] h-[400px] bg-[radial-gradient(circle,rgba(201,142,135,0.03)_0%,transparent_70%)] pointer-events-none blur-[80px] z-0" />

      <div className="relative max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 z-10">
        
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 pb-16 border-b border-white/[0.06]">
          
          {/* Brand Presentation Section (Columns 1-4) */}
          <div className="lg:col-span-4 flex flex-col items-start space-y-6">
            <div className="flex flex-col items-start gap-1">
              <Link href="/" className="group flex flex-col items-start gap-0.5">
                <span className="font-[var(--font-grance)] text-3xl font-semibold tracking-[0.06em] text-white group-hover:text-[#E7C2B8] transition-colors duration-500">
                  MANASVI
                </span>
                <span className="font-[var(--font-cormorant)] text-xs font-semibold uppercase tracking-[0.3em] text-[#E7C2B8] opacity-90 pl-0.5">
                  Fashion
                </span>
              </Link>
            </div>
            
            <p className="font-[var(--font-cormorant)] italic text-[15px] leading-relaxed text-white/70 max-w-sm">
              “Where contemporary western fashion meets timeless Indian elegance.”
            </p>
            
            <p className="font-[var(--font-inter)] text-xs tracking-wider leading-relaxed text-white/40 max-w-xs">
              Crafting premium luxury silhouettes that honor artisanal Indian heritage with modern, cosmopolitan design.
            </p>

            {/* Circular Glassmorphic Social Media Links */}
            <div className="flex items-center gap-3 pt-2">
              {[
                {
                  name: "Instagram",
                  href: "https://instagram.com",
                  svg: (
                    <path d="M16 3c2.717 0 3.056.01 4.122.058 1.066.048 1.79.219 2.425.466a4.9 4.9 0 011.75 1.14 4.9 4.9 0 011.14 1.75c.247.635.418 1.359.466 2.425.049 1.066.058 1.405.058 4.122 0 2.717-.01 3.056-.058 4.122-.048 1.066-.219 1.79-.466 2.425a4.9 4.9 0 01-1.14 1.75 4.9 4.9 0 01-1.75 1.14c-.635.247-1.359.418-2.425.466-1.066.049-1.405.058-4.122.058-2.717 0-3.056-.01-4.122-.058-1.066-.048-1.79-.219-2.425-.466a4.9 4.9 0 01-1.75-1.14 4.9 4.9 0 01-1.14-1.75c-.247-.635-.418-1.359-.466-2.425C3.01 19.056 3 18.717 3 16c0-2.717.01-3.056.058-4.122.048-1.066.219-1.79.466-2.425a4.9 4.9 0 011.14-1.75 4.9 4.9 0 011.75-1.14c.635-.247 1.359-.418 2.425-.466C12.944 3.01 13.283 3 16 3zm0 2.25c-2.67 0-2.986.01-4.04.059-1 .045-1.543.21-1.9.35a2.65 2.65 0 00-.986.643 2.65 2.65 0 00-.643.985c-.14.358-.305.902-.35 1.901C8.01 13.014 8 13.33 8 16c0 2.67.01 2.986.059 4.04.045 1 .21 1.543.35 1.9a2.65 2.65 0 00.643.986c.358.14.902.305 1.901.35 1.054.049 1.37.059 4.04.059 2.67 0 2.986-.01 4.04-.059 1-.045 1.543-.21 1.9-.35a2.65 2.65 0 00.986-.643c.433-.433.68-.813.643-.985.14-.358.305-.902.35-1.901.049-1.054.059-1.37.059-4.04 0-2.67-.01-2.986-.059-4.04-.045-1-.21-1.543-.35-1.9a2.65 2.65 0 00-.643-.986 2.65 2.65 0 00-.985-.643c-.358-.14-.902-.305-1.901-.35-1.054-.049-1.37-.059-4.04-.059zM16 9.25a6.75 6.75 0 100 13.5 6.75 6.75 0 000-13.5zm0 2.25a4.5 4.5 0 110 9 4.5 4.5 0 010-9zm6.75-2.25a1.125 1.125 0 100 2.25 1.125 1.125 0 000-2.25z" />
                  )
                },
                {
                  name: "Pinterest",
                  href: "https://pinterest.com",
                  svg: (
                    <path d="M16 2C8.268 2 2 8.268 2 16c0 5.922 3.67 10.988 8.847 13.018-.122-1.107-.23-2.805.048-4.013.25-1.088 1.613-6.837 1.613-6.837s-.412-.824-.412-2.043c0-1.913 1.11-3.34 2.49-3.34 1.173 0 1.74.88 1.74 1.937 0 1.18-.752 2.943-1.14 4.577-.323 1.369.69 2.485 2.04 2.485 2.447 0 4.33-2.58 4.33-6.305 0-3.298-2.37-5.602-5.753-5.602-3.92 0-6.22 2.94-6.22 5.98 0 1.183.456 2.453 1.025 3.143.113.137.13.257.095.395-.104.433-.336 1.37-.38 1.558-.06.248-.194.3-.448.182-1.67-.777-2.715-3.218-2.715-5.18 0-4.217 3.064-8.09 8.834-8.09 4.638 0 8.243 3.305 8.243 7.723 0 4.607-2.905 8.31-6.94 8.31-1.355 0-2.63-.703-3.065-1.533 0 0-.67 2.553-.833 3.178-.3.115-.6.257-.9.385C11.968 29.56 13.916 30 16 30c7.732 0 14-6.268 14-14S23.732 2 16 2z" />
                  )
                },
                {
                  name: "Facebook",
                  href: "https://facebook.com",
                  svg: (
                    <path d="M29 16c0-7.18-5.82-13-13-13S3 8.82 3 16c0 6.49 4.75 11.87 11 12.87v-9.1h-3.3v-3.77H14v-2.87c0-3.27 1.94-5.07 4.9-5.07 1.42 0 2.9.25 2.9.25v3.2h-1.64c-1.62 0-2.12 1.01-2.12 2.04v2.45h3.6l-.57 3.77h-3.03v9.1c6.25-1 11-6.38 11-12.87z" />
                  )
                },
                {
                  name: "YouTube",
                  href: "https://youtube.com",
                  svg: (
                    <path d="M29.58 9.48a3.64 3.64 0 00-2.56-2.58C24.76 6.3 16 6.3 16 6.3s-8.76 0-11.02.6a3.64 3.64 0 00-2.56 2.58C1.82 11.76 1.82 16 1.82 16s0 4.24.6 6.52a3.64 3.64 0 002.56 2.58c2.26.6 11.02.6 11.02.6s8.76 0 11.02-.6a3.64 3.64 0 002.56-2.58c.6-2.28.6-6.52.6-6.52s0-4.24-.6-6.52zM13.2 20.36V11.64L20.8 16l-7.6 4.36z" />
                  )
                }
              ].map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.name}
                  className="flex items-center justify-center w-10 h-10 rounded-full border border-white/10 bg-white/[0.02] backdrop-blur-md text-white/50 hover:text-white hover:border-[#E7C2B8]/40 hover:bg-[#E7C2B8]/10 hover:scale-110 active:scale-95 transition-all duration-300 ease-out"
                >
                  <svg className="h-4.5 w-4.5 fill-current" viewBox="0 0 32 32">
                    {social.svg}
                  </svg>
                </a>
              ))}
            </div>
          </div>

          {/* Desktop Categories Grid (Columns 5-9) */}
          <div className="hidden md:grid md:grid-cols-4 lg:col-span-5 gap-8">
            
            {/* Category column components mapped dynamically */}
            {Object.entries(sections).map(([key, value]) => (
              <div key={key} className="flex flex-col space-y-4">
                <h4 className="font-[var(--font-cormorant)] text-xs font-semibold uppercase tracking-[0.25em] text-white/90">
                  {value.title}
                </h4>
                <div className="flex flex-col items-start space-y-2">
                  {value.links.map((link, index) => (
                    <FooterLink key={index} href={link.href}>
                      {link.label}
                    </FooterLink>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Mobile Collapsible Accordion (Visible on Mobile only) */}
          <div className="md:hidden lg:hidden flex flex-col divide-y divide-white/[0.06]">
            {Object.entries(sections).map(([key, value]) => {
              const isOpen = openSection === key;
              return (
                <div key={key} className="py-4">
                  <button
                    onClick={() => toggleSection(key)}
                    className="flex items-center justify-between w-full text-left focus:outline-none"
                  >
                    <span className="font-[var(--font-cormorant)] text-xs font-semibold uppercase tracking-[0.25em] text-white/90">
                      {value.title}
                    </span>
                    <motion.div
                      animate={{ rotate: isOpen ? 180 : 0 }}
                      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                    >
                      <ChevronDown className="w-4 h-4 text-white/50" />
                    </motion.div>
                  </button>
                  
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                        className="overflow-hidden"
                      >
                        <div className="flex flex-col items-start space-y-2.5 pt-4 pb-2 pl-1">
                          {value.links.map((link, index) => (
                            <FooterLink key={index} href={link.href}>
                              {link.label}
                            </FooterLink>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>

          {/* Newsletter Section (Columns 10-12) */}
          <div className="lg:col-span-3 flex flex-col space-y-4">
            <h4 className="font-[var(--font-cormorant)] text-xs font-semibold uppercase tracking-[0.25em] text-[#E7C2B8]">
              Newsletter
            </h4>
            
            <p className="font-[var(--font-cormorant)] text-[15px] leading-relaxed text-white/70">
              Join the Manasvi circle for exclusive drops and fashion stories.
            </p>

            <div className="pt-2">
              <AnimatePresence mode="wait">
                {!newsletterSubmitted ? (
                  <motion.form
                    key="form"
                    onSubmit={handleSubscribe}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="relative flex items-center border-b border-white/20 focus-within:border-[#E7C2B8] transition-colors duration-400"
                  >
                    <input
                      type="email"
                      value={newsletterEmail}
                      onChange={(e) => setNewsletterEmail(e.target.value)}
                      placeholder="YOUR EMAIL ADDRESS"
                      aria-label="Newsletter email"
                      className="w-full bg-transparent py-2.5 text-xs tracking-widest text-[#FAF7F2] placeholder-white/30 focus:outline-none font-[var(--font-inter)]"
                      required
                    />
                    <button
                      type="submit"
                      aria-label="Subscribe"
                      className="text-xs uppercase tracking-[0.2em] text-[#E7C2B8] hover:text-white transition-colors duration-300 font-semibold pl-2 py-2 cursor-pointer"
                    >
                      Subscribe
                    </button>
                  </motion.form>
                ) : (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="flex items-center gap-3 px-4 py-3 rounded-md bg-white/[0.03] border border-[#E7C2B8]/30 backdrop-blur-md"
                  >
                    <div className="flex items-center justify-center w-5 h-5 rounded-full bg-[#E7C2B8]/20 text-[#E7C2B8]">
                      <Check className="w-3.5 h-3.5" />
                    </div>
                    <span className="font-[var(--font-cormorant)] text-sm tracking-wider text-white/90">
                      Welcome to the circle.
                    </span>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            
            <p className="font-[var(--font-inter)] text-[10px] tracking-wider text-white/30 leading-relaxed pt-1">
              By subscribing, you agree to receive communications in accordance with our Privacy Policy.
            </p>
          </div>

        </div>

        {/* Bottom Bar Section */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 pt-10">
          
          {/* Copyright & Sign-off */}
          <div className="flex flex-col items-center md:items-start gap-1.5 text-center md:text-left">
            <span className="font-[var(--font-inter)] text-[11px] tracking-widest text-white/35 uppercase">
              © {new Date().getFullYear()} Manasvi Fashion. All Rights Reserved.
            </span>
            <span className="font-[var(--font-cormorant)] italic text-xs text-[#E7C2B8]/60 tracking-wider">
              Designed with elegance
            </span>
          </div>

          {/* Payment Methods */}
          <div className="flex items-center">
            <PaymentIcons />
          </div>

          {/* Country / Currency Selector (Luxury Pill Style) */}
          <div className="flex items-center">
            <div className="group flex items-center gap-2.5 px-4 py-2 rounded-full border border-white/10 bg-white/[0.01] hover:bg-white/[0.04] hover:border-white/20 transition-all duration-300 ease-out cursor-default select-none">
              <Globe className="w-3.5 h-3.5 text-[#E7C2B8] opacity-80 group-hover:scale-110 transition-transform duration-300" />
              <span className="font-[var(--font-inter)] text-[10px] tracking-[0.2em] font-semibold text-white/60 group-hover:text-white transition-colors duration-300">
                INDIA (INR / ₹)
              </span>
            </div>
          </div>

        </div>

      </div>

      {/* Floating Back to Top Control */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            key="scrollTop"
            onClick={scrollToTop}
            initial={{ opacity: 0, scale: 0.8, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 15 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            aria-label="Back to top"
            className="fixed bottom-8 right-8 z-40 flex items-center justify-center w-11 h-11 rounded-full border border-[#E7C2B8]/30 bg-[#160E0C]/80 backdrop-blur-md text-[#FAF7F2] shadow-2xl hover:border-[#E7C2B8] hover:bg-[#160E0C] active:scale-95 transition-all duration-300 cursor-pointer"
          >
            <ArrowUp className="w-4 h-4 text-[#E7C2B8]" />
          </motion.button>
        )}
      </AnimatePresence>
    </footer>
  );
}
