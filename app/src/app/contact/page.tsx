"use client";

import { useEffect, useRef, useState } from "react";
import { animate } from "animejs";
import { Mail, Phone, Clock, MapPin, Check, AlertCircle, ChevronDown, ArrowRight } from "lucide-react";

type InquiryType = "styling" | "order" | "collaboration" | "general";

interface FormState {
  name: string;
  email: string;
  phone: string;
  inquiryType: InquiryType;
  message: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  phone?: string;
  inquiryType?: string;
  message?: string;
}

export default function ContactPage() {
  const [formData, setFormData] = useState<FormState>({
    name: "",
    email: "",
    phone: "",
    inquiryType: "general",
    message: "",
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitResult, setSubmitResult] = useState<{ success: boolean; message: string; reference?: string } | null>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Entrance animations
  useEffect(() => {
    // Fade in hero
    if (heroRef.current) {
      animate(heroRef.current, {
        opacity: [0, 1],
        translateY: [25, 0],
        duration: 1000,
        easing: "cubicBezier(0.16, 1, 0.3, 1)",
      });
    }

    // Fade in content columns
    animate(".contact-column", {
      opacity: [0, 1],
      translateY: [35, 0],
      duration: 1200,
      delay: (_el: unknown, i: number) => 200 + i * 200,
      easing: "cubicBezier(0.16, 1, 0.3, 1)",
    });
  }, []);

  const validateForm = (): boolean => {
    const tempErrors: FormErrors = {};
    let isValid = true;

    if (!formData.name.trim()) {
      tempErrors.name = "Please reveal your name to us.";
      isValid = false;
    } else if (formData.name.length < 2) {
      tempErrors.name = "Name must be at least 2 characters.";
      isValid = false;
    }

    if (!formData.email.trim()) {
      tempErrors.email = "An email address is required for connection.";
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      tempErrors.email = "Please share a valid email address.";
      isValid = false;
    }

    if (formData.phone.trim() && !/^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s\./0-9]*$/.test(formData.phone)) {
      tempErrors.phone = "Please check your phone number format.";
      isValid = false;
    }

    if (!formData.message.trim()) {
      tempErrors.message = "Please share your thoughts with us.";
      isValid = false;
    } else if (formData.message.trim().length < 10) {
      tempErrors.message = "Messages should breathe; please write at least 10 characters.";
      isValid = false;
    }

    setErrors(tempErrors);
    return isValid;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear validation error on change
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const selectInquiryType = (type: InquiryType) => {
    setFormData((prev) => ({ ...prev, inquiryType: type }));
    setDropdownOpen(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    setSubmitResult(null);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        setSubmitResult({
          success: true,
          message: data.message,
          reference: data.reference,
        });
        // Reset form data
        setFormData({
          name: "",
          email: "",
          phone: "",
          inquiryType: "general",
          message: "",
        });
      } else {
        setSubmitResult({
          success: false,
          message: data.message || "An unexpected shadow occurred. Please try again.",
        });
        if (data.errors) {
          const apiErrors: FormErrors = {};
          data.errors.forEach((err: { field: string; message: string }) => {
            apiErrors[err.field as keyof FormErrors] = err.message;
          });
          setErrors(apiErrors);
        }
      }
    } catch (err) {
      console.error(err);
      setSubmitResult({
        success: false,
        message: "We encountered a temporary connection failure. Please try again shortly.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const inquiryLabels: Record<InquiryType, string> = {
    styling: "Styling Inquiry / Appointment",
    order: "Order & Boutique Support",
    collaboration: "Creative Collaboration",
    general: "General Inquiry",
  };

  return (
    <main className="min-h-screen bg-[#FAF7F2] text-[#3B2B28] pt-32 pb-24 md:pb-36 px-6 relative overflow-hidden soft-grain">
      
      {/* BACKGROUND DECORATIVE GLOWS */}
      <div className="absolute top-[10%] left-[-10%] w-[45vw] h-[45vw] rounded-full bg-[#F4D7CF] opacity-25 filter blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[10%] right-[-15%] w-[50vw] h-[50vw] rounded-full bg-[#E7C2B8] opacity-20 filter blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* CONTACT HERO SECTION */}
        <div 
          ref={heroRef}
          className="max-w-3xl mb-16 md:mb-24 flex flex-col gap-4 opacity-0"
        >
          <h1 className="font-cormorant text-4xl sm:text-5xl md:text-6xl font-light italic leading-tight">
            Let&apos;s Connect
          </h1>
          <div className="w-12 h-[1px] bg-[#C98E87] my-1" />
          <p className="font-inter text-sm sm:text-base text-[#8B6B61] leading-relaxed font-light">
            We would love to hear from you — whether you wish to book a personalized styling appointment, inquire about an existing order, or discuss creative collaborations.
          </p>
        </div>

        {/* SPLIT SCREEN LAYOUT */}
        <div 
          ref={contentRef}
          className="grid gap-16 lg:grid-cols-12"
        >
          
          {/* LEFT COLUMN: Editorial boutique info */}
          <div className="contact-column lg:col-span-5 flex flex-col gap-10 opacity-0 lg:pr-12">
            
            {/* Studio Details Block */}
            <div className="flex flex-col gap-3">
              <h3 className="font-cormorant text-xs uppercase tracking-[0.2em] font-bold text-[#C98E87] mb-2">
                Our Atelier
              </h3>
              <div className="flex gap-4 items-start group">
                <MapPin className="w-5 h-5 text-[#8B6B61] mt-1 flex-shrink-0 transition-transform duration-300 group-hover:scale-110" />
                <div>
                  <p className="font-cormorant text-lg font-medium text-[#3B2B28]">Manasvi Fashion Surat</p>
                  <p className="font-inter text-xs sm:text-sm text-[#8B6B61] leading-relaxed font-light mt-1">
                    A, 61, Dharmanandan Row House,<br />
                    Mahadev Chowk, Mota Varachha,<br />
                    Surat, Gujarat - 394101, India.
                  </p>
                </div>
              </div>
            </div>

            {/* Inquiries Block */}
            <div className="flex flex-col gap-3">
              <h3 className="font-cormorant text-xs uppercase tracking-[0.2em] font-bold text-[#C98E87] mb-2">
                Direct Communications
              </h3>
              <div className="flex flex-col gap-4">
                <a 
                  href="mailto:concierge@manasvifashion.com" 
                  className="flex gap-4 items-center group w-fit"
                >
                  <Mail className="w-5 h-5 text-[#8B6B61] flex-shrink-0 transition-transform duration-300 group-hover:-translate-y-0.5" />
                  <span className="font-inter text-xs sm:text-sm text-[#8B6B61] font-light hover:text-[#3B2B28] border-b border-transparent hover:border-[#3B2B28]/30 transition-all duration-300">
                    concierge@manasvifashion.com
                  </span>
                </a>
                
                <a 
                  href="tel:+919099369035" 
                  className="flex gap-4 items-center group w-fit"
                >
                  <Phone className="w-5 h-5 text-[#8B6B61] flex-shrink-0 transition-transform duration-300 group-hover:scale-110" />
                  <span className="font-inter text-xs sm:text-sm text-[#8B6B61] font-light hover:text-[#3B2B28] border-b border-transparent hover:border-[#3B2B28]/30 transition-all duration-300">
                    +91 90993 69035
                  </span>
                </a>

                <a 
                  href="https://www.instagram.com/manasvi_fashion_/" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="flex gap-4 items-center group w-fit"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="w-5 h-5 text-[#8B6B61] flex-shrink-0 transition-transform duration-300 group-hover:rotate-6"
                  >
                    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
                  </svg>
                  <span className="font-inter text-xs sm:text-sm text-[#8B6B61] font-light hover:text-[#3B2B28] border-b border-transparent hover:border-[#3B2B28]/30 transition-all duration-300">
                    @manasvi_fashion_
                  </span>
                </a>
              </div>
            </div>

            {/* Atelier Hours Block */}
            <div className="flex flex-col gap-3">
              <h3 className="font-cormorant text-xs uppercase tracking-[0.2em] font-bold text-[#C98E87] mb-2">
                Atelier Hours
              </h3>
              <div className="flex gap-4 items-start">
                <Clock className="w-5 h-5 text-[#8B6B61] mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-inter text-xs sm:text-sm text-[#8B6B61] font-light leading-relaxed">
                    Monday &mdash; Saturday<br />
                    10:00 AM &mdash; 7:00 PM IST
                  </p>
                  <p className="font-cormorant text-xs italic text-[#8B6B61] mt-2">
                    * Private fittings by appointments only.
                  </p>
                </div>
              </div>
            </div>

            {/* Aesthetic Quote or Image */}
            <div className="mt-6 border-t border-[#E7C2B8]/40 pt-10">
              <p className="font-cormorant text-xl text-[#8B6B61] font-light italic leading-relaxed">
                &ldquo;Elegance is the only beauty that never fades.&rdquo;
              </p>
              <p className="font-inter text-[10px] tracking-widest text-[#C98E87] uppercase mt-2 font-semibold">
                &mdash; Audrey Hepburn
              </p>
            </div>

          </div>

          {/* RIGHT COLUMN: Luxury contact form */}
          <div className="contact-column lg:col-span-7 opacity-0">
            <div className="bg-white/80 backdrop-blur-md rounded-3xl border border-[#E7C2B8]/40 p-8 md:p-12 warm-shadow">
              
              <form onSubmit={handleSubmit} className="flex flex-col gap-8">
                
                {/* Name Field */}
                <div className="flex flex-col gap-2 relative">
                  <label htmlFor="name" className="font-cormorant text-sm text-[#8B6B61] uppercase tracking-[0.15em] font-semibold">
                    Your Name
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="e.g. Eleanor Vance"
                    className="luxury-input py-3 text-sm font-inter placeholder-[#8B6B61]/40"
                  />
                  {errors.name && (
                    <span className="font-cormorant text-xs italic text-[#C98E87] flex items-center gap-1.5 mt-1">
                      <AlertCircle className="w-3.5 h-3.5" />
                      {errors.name}
                    </span>
                  )}
                </div>

                {/* Grid for Email and Phone */}
                <div className="grid gap-8 sm:grid-cols-2">
                  
                  {/* Email Field */}
                  <div className="flex flex-col gap-2">
                    <label htmlFor="email" className="font-cormorant text-sm text-[#8B6B61] uppercase tracking-[0.15em] font-semibold">
                      Email Address
                    </label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="e.g. eleanor@example.com"
                      className="luxury-input py-3 text-sm font-inter placeholder-[#8B6B61]/40"
                    />
                    {errors.email && (
                      <span className="font-cormorant text-xs italic text-[#C98E87] flex items-center gap-1.5 mt-1">
                        <AlertCircle className="w-3.5 h-3.5" />
                        {errors.email}
                      </span>
                    )}
                  </div>

                  {/* Phone Field */}
                  <div className="flex flex-col gap-2">
                    <label htmlFor="phone" className="font-cormorant text-sm text-[#8B6B61] uppercase tracking-[0.15em] font-semibold">
                      Phone Number (Optional)
                    </label>
                    <input
                      id="phone"
                      name="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="e.g. +91 98765 43210"
                      className="luxury-input py-3 text-sm font-inter placeholder-[#8B6B61]/40"
                    />
                    {errors.phone && (
                      <span className="font-cormorant text-xs italic text-[#C98E87] flex items-center gap-1.5 mt-1">
                        <AlertCircle className="w-3.5 h-3.5" />
                        {errors.phone}
                      </span>
                    )}
                  </div>

                </div>

                {/* Custom Inquiry Type Dropdown */}
                <div className="flex flex-col gap-2" ref={dropdownRef}>
                  <label className="font-cormorant text-sm text-[#8B6B61] uppercase tracking-[0.15em] font-semibold">
                    Inquiry Category
                  </label>
                  
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => setDropdownOpen(!dropdownOpen)}
                      className="w-full flex justify-between items-center py-3 border-b border-[#8B6B61]/30 text-[#3B2B28] text-sm font-inter text-left focus:outline-none focus:border-[#8B6B61] transition-all duration-300"
                    >
                      <span className={formData.inquiryType ? "text-[#3B2B28]" : "text-[#8B6B61]/40"}>
                        {inquiryLabels[formData.inquiryType]}
                      </span>
                      <ChevronDown className={`w-4 h-4 text-[#8B6B61] transition-transform duration-500 ${dropdownOpen ? "rotate-180" : ""}`} />
                    </button>

                    {/* Custom Dropdown list */}
                    {dropdownOpen && (
                      <div className="absolute left-0 right-0 top-full mt-2 bg-white border border-[#E7C2B8]/40 rounded-2xl shadow-xl z-30 overflow-hidden py-1 transition-all duration-300">
                        {(["styling", "order", "collaboration", "general"] as InquiryType[]).map((type) => (
                          <button
                            key={type}
                            type="button"
                            onClick={() => selectInquiryType(type)}
                            className="w-full text-left px-5 py-3 text-xs md:text-sm font-inter text-[#8B6B61] hover:bg-[#FAF7F2] hover:text-[#3B2B28] transition-colors duration-200 flex justify-between items-center"
                          >
                            <span>{inquiryLabels[type]}</span>
                            {formData.inquiryType === type && <Check className="w-4 h-4 text-[#C98E87]" />}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Message Field */}
                <div className="flex flex-col gap-2">
                  <label htmlFor="message" className="font-cormorant text-sm text-[#8B6B61] uppercase tracking-[0.15em] font-semibold">
                    Your Inquiry
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={4}
                    value={formData.message}
                    onChange={handleInputChange}
                    placeholder="Describe your design, sizing, or support needs..."
                    className="luxury-input py-3 text-sm font-inter placeholder-[#8B6B61]/40 resize-none min-h-[100px]"
                  />
                  {errors.message && (
                    <span className="font-cormorant text-xs italic text-[#C98E87] flex items-center gap-1.5 mt-1">
                      <AlertCircle className="w-3.5 h-3.5" />
                      {errors.message}
                    </span>
                  )}
                </div>

                {/* Submit Action Button */}
                <div className="mt-4">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full md:w-auto px-10 py-4 bg-[#3B2B28] text-[#FAF7F2] rounded-xl font-cormorant text-xs uppercase tracking-[0.25em] font-semibold transition-all duration-400 hover:bg-[#8B6B61] disabled:bg-[#8B6B61]/50 cursor-pointer shadow-md hover:shadow-lg disabled:cursor-not-allowed flex items-center justify-center gap-3 relative overflow-hidden group"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        <span>transmitting...</span>
                      </>
                    ) : (
                      <>
                        <span>Send Message</span>
                        <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
                      </>
                    )}
                  </button>
                </div>

              </form>

              {/* SUCCESS / ERROR INLINE ALERT */}
              {submitResult && (
                <div className={`mt-8 p-6 rounded-2xl border flex gap-4 items-start transition-all duration-300 ${
                  submitResult.success 
                    ? "bg-[#FAF7F2] border-[#E7C2B8] text-[#3B2B28]" 
                    : "bg-red-50 border-red-200 text-red-800"
                }`}>
                  {submitResult.success ? (
                    <Check className="w-5 h-5 text-[#C98E87] mt-0.5 flex-shrink-0" />
                  ) : (
                    <AlertCircle className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
                  )}
                  <div>
                    <h4 className="font-cormorant text-lg font-medium">
                      {submitResult.success ? "Received with Grace" : "Unable to Deliver"}
                    </h4>
                    <p className="font-inter text-xs sm:text-sm text-[#8B6B61] font-light mt-1">
                      {submitResult.message}
                    </p>
                    {submitResult.reference && (
                      <p className="font-inter text-[10px] tracking-widest text-[#C98E87] uppercase mt-2 font-semibold">
                        Reference: {submitResult.reference}
                      </p>
                    )}
                  </div>
                </div>
              )}

            </div>
          </div>

        </div>

      </div>

    </main>
  );
}
