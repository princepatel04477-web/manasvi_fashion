import { Metadata } from "next";
import HomeClient from "./HomeClient";

export const metadata: Metadata = {
  title: "Manasvi Fashion | Premium Women's Fashion Store in Surat",
  description: "Discover premium kurtis, tunics, dresses, western wear, and ethnic fashion at Manasvi Fashion Surat. Explore luxury women's clothing crafted for modern elegance.",
  keywords: [
    "fashion store surat", "women fashion surat", "ladies fashion surat", "designer kurtis surat", "premium kurtis surat",
    "kurti shop surat", "ethnic wear surat", "western wear surat", "women clothing surat", "fashion boutique surat",
    "designer dresses surat", "tunics surat", "one piece dresses surat", "cotton kurtis surat", "party wear dresses surat",
    "casual wear surat", "women apparel surat", "ladies clothing store surat", "surat fashion brand", "best fashion store in surat",
    "premium women fashion in surat", "designer ethnic wear in surat", "women dress collection surat", "stylish kurtis in surat",
    "designer tunics in surat", "premium dresses in surat", "western dresses in surat", "women apparel store surat",
    "affordable fashion surat", "luxury women fashion surat"
  ],
  alternates: {
    canonical: "https://manasvifashionsurat.com",
  },
  openGraph: {
    title: "Manasvi Fashion | Premium Women's Fashion Store in Surat",
    description: "Discover premium kurtis, tunics, dresses, western wear, and ethnic fashion at Manasvi Fashion Surat. Explore luxury women's clothing crafted for modern elegance.",
    url: "https://manasvifashionsurat.com",
    siteName: "Manasvi Fashion",
    images: [
      {
        url: "https://manasvifashionsurat.com/bg_less_man_logo.png",
        width: 800,
        height: 600,
        alt: "Manasvi Fashion Surat Logo",
      },
    ],
    locale: "en_IN",
    type: "website",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "ClothingStore",
  "name": "Manasvi Fashion",
  "image": "https://manasvifashionsurat.com/bg_less_man_logo.png",
  "url": "https://manasvifashionsurat.com",
  "telephone": "+919099369035",
  "priceRange": "$$",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "A, 61, Dharmanandan Row House, Mahadev Chowk, Mota Varachha",
    "addressLocality": "Surat",
    "addressRegion": "Gujarat",
    "postalCode": "394101",
    "addressCountry": "IN"
  },
  "geo": {
    "@type": "GeoCoordinates",
    "latitude": "21.2357798",
    "longitude": "72.8837189"
  },
  "openingHoursSpecification": {
    "@type": "OpeningHoursSpecification",
    "dayOfWeek": [
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday"
    ],
    "opens": "10:00",
    "closes": "19:00"
  },
  "sameAs": [
    "https://www.instagram.com/manasvi_fashion_/",
    "https://www.facebook.com/176294456208042",
    "https://www.youtube.com/@ManasviFashionsurat"
  ]
};

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <HomeClient />
    </>
  );
}
