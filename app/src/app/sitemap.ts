import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://manasvifashionsurat.com";
  
  const staticRoutes = [
    "",
    "/about",
    "/contact",
    "/careers",
    "/faqs",
    "/journal",
    "/privacy-policy",
    "/terms",
    "/shipping",
    "/returns",
    "/size-guide",
    "/collections",
    "/kurtis",
    "/dresses",
    "/tunic-tops",
    "/one-piece",
    "/new-arrivals",
    "/fashion-store-surat",
    "/designer-kurtis-surat",
    "/premium-dresses-surat",
    "/tunics-surat",
    "/western-wear-surat",
    "/ethnic-wear-surat"
  ];

  return staticRoutes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: route === "" || route.includes("-surat") ? "daily" : "weekly",
    priority: route === "" ? 1.0 : route.includes("-surat") || ["/kurtis", "/dresses", "/tunic-tops"].includes(route) ? 0.9 : 0.7,
  }));
}
