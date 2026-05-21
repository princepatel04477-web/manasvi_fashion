"use client";

import { useEffect, useState } from "react";
import { Save, Image as ImageIcon, Home as HomeIcon, CheckCircle } from "lucide-react";

interface CmsConfig {
  heroBanner: string;
  heroTitle: string;
  heroSubtitle: string;
  sectionTunicImage: string;
  sectionTunicLink: string;
  sectionTunicAlt: string;
  sectionKurtiImage: string;
  sectionKurtiLink: string;
  sectionKurtiAlt: string;
}

export default function CmsControlPage() {
  const [config, setConfig] = useState<CmsConfig>({
    heroBanner: "",
    heroTitle: "",
    heroSubtitle: "",
    sectionTunicImage: "",
    sectionTunicLink: "",
    sectionTunicAlt: "",
    sectionKurtiImage: "",
    sectionKurtiLink: "",
    sectionKurtiAlt: ""
  });
  
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  useEffect(() => {
    async function loadCms() {
      try {
        const res = await fetch("/api/cms");
        const data = await res.json();
        if (data && !data.error) {
          setConfig(data);
        } else {
          setError("Failed to fetch homepage configurations.");
        }
      } catch (err) {
        setError("Network error loading CMS settings.");
      } finally {
        setLoading(false);
      }
    }
    loadCms();
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    setSuccessMsg(null);

    try {
      const res = await fetch("/api/admin/cms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(config)
      });
      const data = await res.json();
      if (data.success) {
        setSuccessMsg("Boutique storefront updated successfully!");
        setTimeout(() => setSuccessMsg(null), 4000);
      } else {
        setError(data.message || "Failed to update homepage CMS settings.");
      }
    } catch (err) {
      setError("Failed to sync homepage config with server.");
    } finally {
      setSubmitting(false);
    }
  }

  function handleFieldChange(field: keyof CmsConfig, value: string) {
    setConfig(prev => ({ ...prev, [field]: value }));
  }

  if (loading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#8b6b61] border-t-transparent mx-auto"></div>
          <p className="mt-4 font-serif text-sm tracking-widest uppercase text-[#5c4a44]">Opening CMS Studio...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fadeIn max-w-4xl">
      {/* Header section */}
      <div className="border-b border-[#d9a58f22] pb-6">
        <h1 className="font-[var(--font-bodoni)] text-3xl md:text-4xl text-[#2a1d19]">Homepage CMS</h1>
        <p className="font-[var(--font-cormorant)] text-sm italic text-[#8b6b61] tracking-wider mt-1">
          Adjust the visual editorial look, hero messaging, and direct links on the main page.
        </p>
      </div>

      {error && (
        <div className="p-4 rounded-xl border border-red-200 bg-red-50 text-sm text-red-800">
          {error}
        </div>
      )}

      {successMsg && (
        <div className="p-4 rounded-xl border border-green-200 bg-green-50 text-sm text-green-800 flex items-center gap-2">
          <CheckCircle size={16} />
          {successMsg}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Section 1: Hero Banner */}
        <div className="rounded-2xl border border-[#d9a58f22] bg-white p-6 space-y-4">
          <h3 className="font-serif text-lg text-[#2a1d19] border-b border-[#d9a58f11] pb-3 mb-2 flex items-center gap-2">
            <HomeIcon size={16} className="text-[#6e2b38]" />
            Hero Banner Section
          </h3>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-[#8b6b61] mb-1.5">
                Hero Image URL
              </label>
              <input
                type="text"
                value={config.heroBanner}
                onChange={(e) => handleFieldChange("heroBanner", e.target.value)}
                placeholder="https://images.unsplash.com/... or relative path"
                className="w-full rounded-xl border border-[#d9a58f44] px-4 py-2.5 text-sm text-[#2a1d19] focus:outline-none focus:border-[#6e2b38]"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#8b6b61] mb-1.5">
                Hero Title Headline
              </label>
              <input
                type="text"
                value={config.heroTitle}
                onChange={(e) => handleFieldChange("heroTitle", e.target.value)}
                placeholder="e.g., Summer Elegance"
                className="w-full rounded-xl border border-[#d9a58f44] px-4 py-2.5 text-sm text-[#2a1d19] focus:outline-none focus:border-[#6e2b38]"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#8b6b61] mb-1.5">
                Hero Subtitle copy
              </label>
              <input
                type="text"
                value={config.heroSubtitle}
                onChange={(e) => handleFieldChange("heroSubtitle", e.target.value)}
                placeholder="e.g., Exquisite silhouettes handcrafted with love."
                className="w-full rounded-xl border border-[#d9a58f44] px-4 py-2.5 text-sm text-[#2a1d19] focus:outline-none focus:border-[#6e2b38]"
                required
              />
            </div>
          </div>
        </div>

        {/* Section 2: Tunic Tops Block */}
        <div className="rounded-2xl border border-[#d9a58f22] bg-white p-6 space-y-4">
          <h3 className="font-serif text-lg text-[#2a1d19] border-b border-[#d9a58f11] pb-3 mb-2 flex items-center gap-2">
            <ImageIcon size={16} className="text-[#6e2b38]" />
            Tunic Tops Banner Block
          </h3>

          <div className="grid gap-4 sm:grid-cols-3">
            <div className="sm:col-span-3">
              <label className="block text-xs font-bold uppercase tracking-wider text-[#8b6b61] mb-1.5">
                Tunic Block Image URL
              </label>
              <input
                type="text"
                value={config.sectionTunicImage}
                onChange={(e) => handleFieldChange("sectionTunicImage", e.target.value)}
                className="w-full rounded-xl border border-[#d9a58f44] px-4 py-2.5 text-sm text-[#2a1d19] focus:outline-none"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#8b6b61] mb-1.5">
                Redirect Path Link
              </label>
              <input
                type="text"
                value={config.sectionTunicLink}
                onChange={(e) => handleFieldChange("sectionTunicLink", e.target.value)}
                placeholder="/shop?category=tunic_tops"
                className="w-full rounded-xl border border-[#d9a58f44] px-4 py-2.5 text-sm text-[#2a1d19] focus:outline-none"
                required
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-[#8b6b61] mb-1.5">
                A11y Alt Text description
              </label>
              <input
                type="text"
                value={config.sectionTunicAlt}
                onChange={(e) => handleFieldChange("sectionTunicAlt", e.target.value)}
                placeholder="Description of the image for screen readers"
                className="w-full rounded-xl border border-[#d9a58f44] px-4 py-2.5 text-sm text-[#2a1d19] focus:outline-none"
                required
              />
            </div>
          </div>
        </div>

        {/* Section 3: Kurtis Block */}
        <div className="rounded-2xl border border-[#d9a58f22] bg-white p-6 space-y-4">
          <h3 className="font-serif text-lg text-[#2a1d19] border-b border-[#d9a58f11] pb-3 mb-2 flex items-center gap-2">
            <ImageIcon size={16} className="text-[#6e2b38]" />
            Kurtis Banner Block
          </h3>

          <div className="grid gap-4 sm:grid-cols-3">
            <div className="sm:col-span-3">
              <label className="block text-xs font-bold uppercase tracking-wider text-[#8b6b61] mb-1.5">
                Kurtis Block Image URL
              </label>
              <input
                type="text"
                value={config.sectionKurtiImage}
                onChange={(e) => handleFieldChange("sectionKurtiImage", e.target.value)}
                className="w-full rounded-xl border border-[#d9a58f44] px-4 py-2.5 text-sm text-[#2a1d19] focus:outline-none"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#8b6b61] mb-1.5">
                Redirect Path Link
              </label>
              <input
                type="text"
                value={config.sectionKurtiLink}
                onChange={(e) => handleFieldChange("sectionKurtiLink", e.target.value)}
                placeholder="/shop?category=kurtis"
                className="w-full rounded-xl border border-[#d9a58f44] px-4 py-2.5 text-sm text-[#2a1d19] focus:outline-none"
                required
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-[#8b6b61] mb-1.5">
                A11y Alt Text description
              </label>
              <input
                type="text"
                value={config.sectionKurtiAlt}
                onChange={(e) => handleFieldChange("sectionKurtiAlt", e.target.value)}
                placeholder="Description of the image for screen readers"
                className="w-full rounded-xl border border-[#d9a58f44] px-4 py-2.5 text-sm text-[#2a1d19] focus:outline-none"
                required
              />
            </div>
          </div>
        </div>

        {/* Submit */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#d9a58f22]">
          <button
            type="submit"
            disabled={submitting}
            className="px-8 py-3 rounded-xl bg-[#6e2b38] hover:bg-[#521e28] text-white text-xs font-semibold uppercase tracking-widest transition-colors flex items-center gap-2"
          >
            <Save size={14} />
            {submitting ? "Saving Configs..." : "Save Layout Settings"}
          </button>
        </div>
      </form>
    </div>
  );
}
