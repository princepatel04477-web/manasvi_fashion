import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/dashboard/", "/auth/", "/cart", "/checkout/", "/api/"],
    },
    sitemap: "https://manasvifashionsurat.com/sitemap.xml",
  };
}
