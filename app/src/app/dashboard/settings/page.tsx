"use client";

import { useEffect, useState } from "react";
import { Save, Settings, ShieldAlert, Truck, Sparkles, PhoneCall, Mail, ToggleLeft, ToggleRight, CheckCircle } from "lucide-react";
import { AppSettings } from "@/app/api/admin/settings/route";

export default function SettingsPage() {
  const [settings, setSettings] = useState<AppSettings>({
    storefrontOpen: true,
    freeShippingThreshold: 2999,
    gstRate: 5,
    contactEmail: "",
    supportPhone: "",
    announcementText: ""
  });

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  useEffect(() => {
    async function loadSettings() {
      try {
        const res = await fetch("/api/admin/settings");
        const data = await res.json();
        if (data.success) {
          setSettings(data.settings);
        } else {
          setError(data.message || "Failed to load shop settings.");
        }
      } catch (err) {
        setError("Error communicating with shop servers.");
      } finally {
        setLoading(false);
      }
    }
    loadSettings();
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    setSuccessMsg(null);

    try {
      const res = await fetch("/api/admin/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings)
      });
      const data = await res.json();
      if (data.success) {
        setSuccessMsg("Global configuration updated successfully!");
        setTimeout(() => setSuccessMsg(null), 4000);
      } else {
        setError(data.message || "Failed to update configurations.");
      }
    } catch (err) {
      setError("Failed to sync settings with server.");
    } finally {
      setSubmitting(false);
    }
  }

  function handleFieldChange<K extends keyof AppSettings>(field: K, value: AppSettings[K]) {
    setSettings(prev => ({ ...prev, [field]: value }));
  }

  if (loading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#8b6b61] border-t-transparent mx-auto"></div>
          <p className="mt-4 font-serif text-sm tracking-widest uppercase text-[#5c4a44]">Opening Settings Vault...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fadeIn max-w-4xl">
      {/* Header section */}
      <div className="border-b border-[#d9a58f22] pb-6">
        <h1 className="font-[var(--font-bodoni)] text-3xl md:text-4xl text-[#2a1d19]">Boutique Settings</h1>
        <p className="font-[var(--font-cormorant)] text-sm italic text-[#8b6b61] tracking-wider mt-1">
          Adjust global rules, shipping thresholds, tax rates, announcement tickers, and overall storefront status.
        </p>
      </div>

      {successMsg && (
        <div className="p-4 rounded-xl border border-green-200 bg-green-50 text-sm text-green-800 flex items-center gap-2">
          <CheckCircle size={16} />
          {successMsg}
        </div>
      )}

      {error && (
        <div className="p-4 rounded-xl border border-red-200 bg-red-50 text-sm text-red-800">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Storefront status card */}
        <div className="rounded-2xl border border-[#d9a58f22] bg-white p-6 space-y-4 shadow-xs">
          <h3 className="font-serif text-lg text-[#2a1d19] border-b border-[#d9a58f11] pb-3 mb-2 flex items-center gap-2">
            <Settings size={16} className="text-[#6e2b38]" />
            Boutique Operations State
          </h3>

          <div className="flex items-center justify-between p-4 rounded-xl bg-[#faf7f2]/50 border border-[#d9a58f11]">
            <div className="space-y-0.5">
              <h4 className="text-sm font-semibold text-[#2a1d19]">Storefront Status</h4>
              <p className="text-xs text-[#8b6b61]">Toggle between online store open or under scheduled system maintenance mode.</p>
            </div>
            <button
              type="button"
              onClick={() => handleFieldChange("storefrontOpen", !settings.storefrontOpen)}
              className="text-[#6e2b38] hover:scale-105 active:scale-95 transition-all"
            >
              {settings.storefrontOpen ? (
                <div className="flex items-center gap-1 text-emerald-700 font-semibold text-sm">
                  <span>LIVE & ONLINE</span>
                  <ToggleRight size={38} className="text-emerald-600" />
                </div>
              ) : (
                <div className="flex items-center gap-1 text-amber-700 font-semibold text-sm">
                  <span>MAINTENANCE MODE</span>
                  <ToggleLeft size={38} className="text-stone-400" />
                </div>
              )}
            </button>
          </div>
        </div>

        {/* Shipping & Tax thresholds */}
        <div className="rounded-2xl border border-[#d9a58f22] bg-white p-6 space-y-4 shadow-xs">
          <h3 className="font-serif text-lg text-[#2a1d19] border-b border-[#d9a58f11] pb-3 mb-2 flex items-center gap-2">
            <Truck size={16} className="text-[#6e2b38]" />
            Logistics & Fiscal Rules
          </h3>

          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#8b6b61] mb-1.5">
                Free Shipping Threshold (₹)
              </label>
              <input
                type="number"
                min="0"
                value={settings.freeShippingThreshold}
                onChange={(e) => handleFieldChange("freeShippingThreshold", Math.max(0, parseFloat(e.target.value) || 0))}
                className="w-full rounded-xl border border-[#d9a58f44] px-4 py-2.5 text-sm text-[#2a1d19] focus:outline-none focus:border-[#6e2b38]"
                required
              />
              <p className="mt-1 text-[10px] text-[#8b6b61] italic">
                Orders totaling above this amount qualify for complimentary delivery.
              </p>
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#8b6b61] mb-1.5">
                Standard GST Rate (%)
              </label>
              <input
                type="number"
                min="0"
                max="100"
                value={settings.gstRate}
                onChange={(e) => handleFieldChange("gstRate", Math.max(0, Math.min(100, parseFloat(e.target.value) || 0)))}
                className="w-full rounded-xl border border-[#d9a58f44] px-4 py-2.5 text-sm text-[#2a1d19] focus:outline-none"
                required
              />
              <p className="mt-1 text-[10px] text-[#8b6b61] italic">
                Default Goods and Services Tax percentage calculated during invoice generation.
              </p>
            </div>
          </div>
        </div>

        {/* Announcement Header bar */}
        <div className="rounded-2xl border border-[#d9a58f22] bg-white p-6 space-y-4 shadow-xs">
          <h3 className="font-serif text-lg text-[#2a1d19] border-b border-[#d9a58f11] pb-3 mb-2 flex items-center gap-2">
            <Sparkles size={16} className="text-[#6e2b38]" />
            Boutique Banners Ticker
          </h3>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#8b6b61] mb-1.5">
              Header Announcement Text
            </label>
            <input
              type="text"
              value={settings.announcementText}
              onChange={(e) => handleFieldChange("announcementText", e.target.value)}
              placeholder="e.g., Free shipping on all orders this weekend!"
              className="w-full rounded-xl border border-[#d9a58f44] px-4 py-2.5 text-sm text-[#2a1d19] focus:outline-none"
              required
            />
            <p className="mt-1 text-[10px] text-[#8b6b61] italic">
              Displayed in the scrolling announcement bar at the top of the storefront.
            </p>
          </div>
        </div>

        {/* Store Contacts */}
        <div className="rounded-2xl border border-[#d9a58f22] bg-white p-6 space-y-4 shadow-xs">
          <h3 className="font-serif text-lg text-[#2a1d19] border-b border-[#d9a58f11] pb-3 mb-2 flex items-center gap-2">
            <PhoneCall size={16} className="text-[#6e2b38]" />
            Customer Helpline Contacts
          </h3>

          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#8b6b61] mb-1.5">
                Support Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8b6b61]" size={14} />
                <input
                  type="email"
                  value={settings.contactEmail}
                  onChange={(e) => handleFieldChange("contactEmail", e.target.value)}
                  placeholder="care@manasvifashion.com"
                  className="w-full rounded-xl border border-[#d9a58f44] pl-9 pr-4 py-2.5 text-sm text-[#2a1d19] focus:outline-none"
                  required
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#8b6b61] mb-1.5">
                Helpline Phone
              </label>
              <div className="relative">
                <PhoneCall className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8b6b61]" size={14} />
                <input
                  type="text"
                  value={settings.supportPhone}
                  onChange={(e) => handleFieldChange("supportPhone", e.target.value)}
                  placeholder="+91 99887 76655"
                  className="w-full rounded-xl border border-[#d9a58f44] pl-9 pr-4 py-2.5 text-sm text-[#2a1d19] focus:outline-none"
                  required
                />
              </div>
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
            {submitting ? "Saving Configs..." : "Save Settings"}
          </button>
        </div>
      </form>
    </div>
  );
}
