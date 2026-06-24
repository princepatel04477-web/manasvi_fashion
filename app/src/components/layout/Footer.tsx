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
        { label: "Orders", href: "/order-tracking" },
        { label: "Seller Portal", href: "/seller/dashboard" }
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
              <Link href="/" className="group flex items-center gap-3">
                <img
                  src="/Man_logo.png"
                  alt="Manasvi Logo"
                  className="h-14 w-14 rounded-full object-cover opacity-90 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500"
                />
                <div className="flex flex-col items-start gap-0.5">
                  <span className="font-[var(--font-grance)] text-2xl font-semibold tracking-[0.06em] text-white group-hover:text-[#E7C2B8] transition-colors duration-500">
                    MANASVI
                  </span>
                  <span className="font-[var(--font-cormorant)] text-[10px] font-semibold uppercase tracking-[0.3em] text-[#E7C2B8] opacity-90 pl-0.5">
                    Fashion
                  </span>
                </div>
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
                  href: "https://www.instagram.com/manasvi_fashion_/",
                  viewBox: "0 0 24 24",
                  svg: (
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.051C.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                  )
                },
                {
                  name: "WhatsApp",
                  href: "https://wa.me/919099369035",
                  viewBox: "0 0 24 24",
                  svg: (
                    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.731-1.456L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436 0 9.86-4.42 9.864-9.864.002-2.637-1.03-5.118-2.91-6.993-1.88-1.875-4.38-2.907-7.025-2.908-5.43 0-9.855 4.417-9.86 9.862-.002 1.712.453 3.382 1.32 4.821L1.116 22.91l6.19-1.622zM17.52 14.33c-.324-.162-1.92-.949-2.217-1.058-.297-.11-.513-.162-.73.162-.217.324-.838 1.058-1.027 1.274-.19.217-.378.243-.702.08-1.68-.838-2.73-1.47-3.8-3.32-.284-.488.284-.452.812-1.507.09-.176.04-.328-.02-.49-.06-.162-.513-1.243-.702-1.698-.184-.44-.369-.38-.513-.38-.135 0-.297-.01-.459-.01-.162 0-.432.06-.658.307-.225.247-.86.84-.86 2.048 0 1.208.878 2.373.999 2.535.122.162 1.73 2.637 4.19 3.7c.585.25 1.04.4 1.398.514.588.187 1.122.16 1.545.097.47-.071 1.44-.588 1.643-1.155.203-.568.203-1.055.142-1.157-.061-.101-.225-.162-.549-.324z" />
                  )
                },
                {
                  name: "Facebook",
                  href: "https://www.facebook.com/176294456208042",
                  viewBox: "0 0 32 32",
                  svg: (
                    <path d="M29 16c0-7.18-5.82-13-13-13S3 8.82 3 16c0 6.49 4.75 11.87 11 12.87v-9.1h-3.3v-3.77H14v-2.87c0-3.27 1.94-5.07 4.9-5.07 1.42 0 2.9.25 2.9.25v3.2h-1.64c-1.62 0-2.12 1.01-2.12 2.04v2.45h3.6l-.57 3.77h-3.03v9.1c6.25-1 11-6.38 11-12.87z" />
                  )
                },
                {
                  name: "YouTube",
                  href: "https://www.youtube.com/@ManasviFashionsurat",
                  viewBox: "0 0 32 32",
                  svg: (
                    <path d="M29.58 9.48a3.64 3.64 0 00-2.56-2.58C24.76 6.3 16 6.3 16 6.3s-8.76 0-11.02.6a3.64 3.64 0 00-2.56 2.58C1.82 11.76 1.82 16 1.82 16s0 4.24.6 6.52a3.64 3.64 0 002.56 2.58c2.26.6 11.02.6 11.02.6s8.76 0 11.02-.6a3.64 3.64 0 002.56-2.58c.6-2.28.6-6.52.6-6.52s0-4.24-.6-6.52zM13.2 20.36V11.64L20.8 16l-7.6 4.36z" />
                  )
                },
                {
                  name: "Google Maps",
                  href: "https://www.google.com/maps/place/Dharma+Nandan+Scoiety-2,+Mota+Varachha,+Surat,+Gujarat+394101/data=!4m6!3m5!1s0x3be04f445e723b45:0xa659c7c4bb074276!7e2!8m2!3d21.2357798!4d72.88371889999999?entry=gps&coh=192189&g_ep=CAESBzI1LjI3LjQYACCenQoqhwEsOTQyNzUzMTQsOTQyMjMyOTksOTQyMTY0MTMsOTQyODA1NzYsOTQyMTI0OTYsOTQyMDczOTQsOTQyMDc1MDYsOTQyMDg1MDYsOTQyMTc1MjMsOTQyMTg2NTMsOTQyMjk4MzksOTQyNzUxNjgsNDcwODQzOTMsOTQyMTMyMDAsOTQyNTgzMjVCAklO&skid=7d802069-66b8-45a1-9c92-f1b561228263",
                  viewBox: "0 0 24 24",
                  svg: (
                    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
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

        {/* Local SEO Footer Block */}
        <div className="border-t border-white/[0.06] pt-10 pb-2 text-center">
          <p className="font-[var(--font-inter)] text-[10px] tracking-[0.25em] text-white/40 uppercase mb-4 font-semibold">
            Boutique Collections & Sourcing
          </p>
          <p className="font-[var(--font-inter)] text-[11px] leading-relaxed text-white/30 tracking-wide max-w-4xl mx-auto text-justify lg:text-center">
            As a leading <strong>Women&apos;s Fashion Brand in Surat</strong>, Manasvi Fashion offers a curated experience for those seeking a premium <strong>Fashion Store in Surat</strong>. Our collections feature high-quality <strong>Designer Kurtis in Surat</strong>, a modern <strong>Tunics Collection in Surat</strong>, and <strong>Premium Dresses in Surat</strong> for every occasion, from casual wear to formal outings. Whether you are looking for classic <strong>Ethnic Wear in Surat</strong>, contemporary <strong>Western Wear in Surat</strong>, or elegant <strong>One Piece Dresses in Surat</strong>, our <strong>Fashion Boutique in Surat Gujarat</strong> provides customized fits and exceptional sourcing. We aim to be the preferred <strong>Ladies Clothing Store in Surat</strong> and the ultimate <strong>Women&apos;s Clothing Store in Surat</strong> for discerning clients. Enjoy seamless <strong>Online Fashion Shopping in Surat</strong> with global delivery, or visit our atelier to experience Surat&apos;s textile craftsmanship firsthand.
          </p>
        </div>

        {/* Bottom Bar Section */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 sm:gap-6 pt-8 sm:pt-10">
          
          {/* Copyright & Sign-off */}
          <div className="flex flex-col items-center md:items-start gap-1.5 text-center md:text-left">
            <span className="font-[var(--font-inter)] text-[11px] tracking-widest text-white/35 uppercase">
              © {new Date().getFullYear()} Manasvi Fashion. All Rights Reserved.
            </span>
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-x-2 gap-y-1 font-[var(--font-cormorant)] text-xs text-white/50 tracking-wider">
              <span className="italic text-[#E7C2B8]/60">Designed with elegance</span>
              <span className="text-white/20">•</span>
              <span className="font-[var(--font-inter)] text-[10px] tracking-wider uppercase text-white/40">
                Made by{" "}
                <a
                  href="https://varunyatechnologies.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="relative text-[#E7C2B8] hover:text-white transition-colors duration-300 group/link"
                >
                  Varunya Technologies
                  <span className="absolute bottom-0 left-0 w-full h-[1px] bg-[#E7C2B8] origin-right scale-x-0 transition-transform duration-300 group-hover/link:scale-x-100 group-hover/link:origin-left" />
                </a>
              </span>
              <span className="text-white/20">•</span>
              <a
                href="mailto:varunyatechnologies@gmail.com"
                className="font-[var(--font-inter)] text-[9px] tracking-wider text-white/30 hover:text-[#E7C2B8] transition-colors duration-300"
              >
                varunyatechnologies@gmail.com
              </a>
              <span className="text-white/20">•</span>
              <Link
                href="/seller/dashboard"
                className="font-[var(--font-inter)] text-[9px] tracking-widest text-[#E7C2B8] hover:text-white uppercase transition-colors duration-300 font-semibold"
              >
                Seller Portal
              </Link>
            </div>
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
