"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUp, ChevronDown, Globe, Mail, Check } from "lucide-react";
import { useLenis } from "@/lib/lenis";

// Reusable animated footer link with premium slide-in underline
const FooterLink = ({ href, children }: { href: string; children: React.ReactNode }) => (
  <Link
    href={href}
    className="group relative inline-flex py-1.5 text-[13px] text-white/50 transition-colors duration-300 hover:text-white font-[var(--font-inter)] tracking-wider"
  >
    <span className="relative z-10 transition-transform duration-300 group-hover:translate-x-1">
      {children}
    </span>
    <span className="absolute bottom-1.5 left-1 h-[1px] w-5/6 bg-[#E7C2B8]/80 origin-left scale-x-0 transition-transform duration-300 ease-out group-hover:scale-x-100" />
  </Link>
);

export default function Footer() {
  const pathname = usePathname();
  const [openSection, setOpenSection] = useState<string | null>(null);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [newsletterSubmitted, setNewsletterSubmitted] = useState(false);
  const lenis = useLenis();

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
    if (lenis) {
      lenis.scrollTo(0, { duration: 1.2 });
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  // Custom monochromatic premium payment vector icons
  const PaymentIcons = () => (
    <div className="flex items-center gap-2 opacity-50 hover:opacity-85 transition-opacity duration-300 group cursor-default">
      {/* Razorpay */}
      <svg className="h-4.5 w-4.5 fill-current text-[#FAF7F2] group-hover:scale-105 transition-transform duration-300" viewBox="0 0 24 24">
        <path d="M22.436 0l-11.91 7.773-1.174 4.276 6.625-4.297L11.65 24h4.391l6.395-24zM14.26 10.098L3.389 17.166 1.564 24h9.008l3.688-13.902Z" />
      </svg>
      <span className="font-[var(--font-inter)] text-[9px] tracking-[0.25em] font-semibold text-[#FAF7F2]/80 group-hover:text-white transition-colors duration-300 uppercase">
        Secured by Razorpay
      </span>
    </div>
  );

  const sections = {
    shop: {
      title: "Shop",
      links: [
        { label: "New Arrivals", href: "/new-arrivals" },
        { label: "Kurtis", href: "/kurtis" },
        { label: "Dresses", href: "/dresses" }
      ]
    },
    company: {
      title: "Company",
      links: [
        { label: "About Us", href: "/about" },
        { label: "Contact", href: "/contact" },
        { label: "Careers", href: "/careers" },
        { label: "Blogs", href: "/journal" },
        { label: "Privacy Policy", href: "/privacy-policy" },
        { label: "Terms & Conditions", href: "/terms" }
      ]
    },
    support: {
      title: "Customer Support",
      links: [
        { label: "Shipping Policy", href: "/shipping" },
        { label: "Return & Exchange", href: "/returns" },
        { label: "Track Order", href: "/order-tracking" },
        { label: "FAQs", href: "/faqs" },
        { label: "Size Guide", href: "/size-guide" }
      ]
    },
    account: {
      title: "Account",
      links: [
        { label: "Login", href: "/auth/signin" },
        { label: "Register", href: "/auth/signup" },
        { label: "Wishlist", href: "/wishlist" },
        { label: "Orders", href: "/order-tracking" }
      ]
    }
  };

  return (
    <footer className="soft-grain relative overflow-hidden bg-[#160E0C] text-[#FAF7F2] pt-14 pb-10 sm:pt-20 sm:pb-12 z-10">
      {/* Top Border Gradient Separator */}
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-[linear-gradient(90deg,transparent,rgba(231,194,184,0.15)_10%,rgba(231,194,184,0.25)_50%,rgba(231,194,184,0.15)_90%,transparent)]" />
      
      {/* Luxury Radial Light Leak Overlay */}
      <div className="absolute top-0 left-1/4 -translate-y-1/2 w-[500px] h-[500px] bg-[radial-gradient(circle,rgba(231,194,184,0.045)_0%,transparent_70%)] pointer-events-none blur-[100px] z-0" />
      <div className="absolute bottom-0 right-1/4 translate-y-1/3 w-[400px] h-[400px] bg-[radial-gradient(circle,rgba(201,142,135,0.03)_0%,transparent_70%)] pointer-events-none blur-[80px] z-0" />

      <div className="relative max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 z-10">
        
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8 pb-16 relative">
          {/* Custom gold gradient divider line */}
          <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-[linear-gradient(90deg,transparent,rgba(231,194,184,0.15)_20%,rgba(231,194,184,0.3)_50%,rgba(231,194,184,0.15)_80%,transparent)]" />
          
          {/* Brand Presentation Section (Columns 1-4) */}
          <div className="md:col-span-2 lg:col-span-4 flex flex-col items-start space-y-6">
            <div className="relative flex flex-col items-start gap-1">
              {/* Organic ambient gold radial glow behind the logo */}
              <div className="absolute -inset-10 bg-[radial-gradient(circle,rgba(231,194,184,0.08)_0%,transparent_70%)] pointer-events-none -z-10 blur-xl animate-pulse" style={{ animationDuration: '8s' }} />
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
                  href: "https://instagram.com/manasvi.fashion",
                  viewBox: "0 0 24 24",
                  svg: (
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.051C.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                  )
                },
                {
                  name: "Pinterest",
                  href: "https://pinterest.com/manasvifashion",
                  viewBox: "0 0 32 32",
                  svg: (
                    <path d="M16 2C8.268 2 2 8.268 2 16c0 5.922 3.67 10.988 8.847 13.018-.122-1.107-.23-2.805.048-4.013.25-1.088 1.613-6.837 1.613-6.837s-.412-.824-.412-2.043c0-1.913 1.11-3.34 2.49-3.34 1.173 0 1.74.88 1.74 1.937 0 1.18-.752 2.943-1.14 4.577-.323 1.369.69 2.485 2.04 2.485 2.447 0 4.33-2.58 4.33-6.305 0-3.298-2.37-5.602-5.753-5.602-3.92 0-6.22 2.94-6.22 5.98 0 1.183.456 2.453 1.025 3.143.113.137.13.257.095.395-.104.433-.336 1.37-.38 1.558-.06.248-.194.3-.448.182-1.67-.777-2.715-3.218-2.715-5.18 0-4.217 3.064-8.09 8.834-8.09 4.638 0 8.243 3.305 8.243 7.723 0 4.607-2.905 8.31-6.94 8.31-1.355 0-2.63-.703-3.065-1.533 0 0-.67 2.553-.833 3.178-.3.115-.6.257-.9.385C11.968 29.56 13.916 30 16 30c7.732 0 14-6.268 14-14S23.732 2 16 2z" />
                  )
                },
                {
                  name: "Facebook",
                  href: "https://facebook.com/manasvifashion",
                  viewBox: "0 0 32 32",
                  svg: (
                    <path d="M29 16c0-7.18-5.82-13-13-13S3 8.82 3 16c0 6.49 4.75 11.87 11 12.87v-9.1h-3.3v-3.77H14v-2.87c0-3.27 1.94-5.07 4.9-5.07 1.42 0 2.9.25 2.9.25v3.2h-1.64c-1.62 0-2.12 1.01-2.12 2.04v2.45h3.6l-.57 3.77h-3.03v9.1c6.25-1 11-6.38 11-12.87z" />
                  )
                },
                {
                  name: "YouTube",
                  href: "https://youtube.com/@manasvifashion",
                  viewBox: "0 0 32 32",
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
                  className="flex items-center justify-center w-11 h-11 rounded-full border border-white/10 bg-white/[0.02] backdrop-blur-md text-white/50 hover:text-white hover:border-[#E7C2B8]/40 hover:bg-[#E7C2B8]/10 hover:scale-110 active:scale-95 transition-all duration-300 ease-out cursor-pointer"
                >
                  <svg className="h-4.5 w-4.5 fill-current" viewBox={social.viewBox}>
                    {social.svg}
                  </svg>
                </a>
              ))}
            </div>
          </div>

          {/* Desktop Categories Grid (Columns 5-9) */}
          <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-4 md:col-span-2 lg:col-span-5 gap-8">
            
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
                    className="flex items-center justify-between w-full text-left focus:outline-none min-h-[44px] py-1 cursor-pointer"
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
          <div className="md:col-span-2 lg:col-span-3 flex flex-col space-y-4">
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
                    className="relative flex items-center border-b border-white/20 focus-within:border-[#E7C2B8] focus-within:shadow-[0_4px_20px_-4px_rgba(231,194,184,0.25)] transition-all duration-500"
                  >
                    <input
                      type="email"
                      value={newsletterEmail}
                      onChange={(e) => setNewsletterEmail(e.target.value)}
                      placeholder="YOUR EMAIL ADDRESS"
                      aria-label="Newsletter email"
                      className="w-full bg-transparent py-2.5 text-base md:text-xs tracking-widest text-[#FAF7F2] placeholder-white/30 focus:outline-none font-[var(--font-inter)]"
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
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 sm:gap-6 pt-8 sm:pt-10">
          
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
              className="fixed bottom-6 right-6 sm:bottom-8 sm:right-8 z-40 flex items-center justify-center w-11 h-11 rounded-full border border-[#E7C2B8]/30 bg-[#160E0C]/80 backdrop-blur-md text-[#FAF7F2] shadow-2xl hover:border-[#E7C2B8] hover:bg-[#160E0C] active:scale-95 transition-all duration-300 cursor-pointer"
            >
            <ArrowUp className="w-4 h-4 text-[#E7C2B8]" />
          </motion.button>
        )}
      </AnimatePresence>
    </footer>
  );
}
