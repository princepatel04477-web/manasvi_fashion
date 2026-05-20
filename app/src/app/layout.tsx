import type { Metadata } from "next";
import localFont from "next/font/local";
import { Bodoni_Moda, Cormorant_Garamond, DM_Serif_Display, IM_Fell_Great_Primer, Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import Header from "@/components/header";
import Footer from "@/components/footer";
import Providers from "@/components/providers";

const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-playfair", weight: ["400", "500", "600", "700", "800", "900"] });
const imFell = IM_Fell_Great_Primer({ subsets: ["latin"], variable: "--font-im-fell", weight: ["400"], display: "swap" });
const cormorant = Cormorant_Garamond({ subsets: ["latin"], variable: "--font-cormorant", weight: ["400", "500", "600", "700"] });
const dm = DM_Serif_Display({ subsets: ["latin"], variable: "--font-dm", weight: ["400"] });
const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const bodoni = Bodoni_Moda({ subsets: ["latin"], variable: "--font-bodoni", weight: "variable", axes: ["opsz"], display: "swap" });
const grance = localFont({ src: "../../grance/GRANCE-DEMO.otf", variable: "--font-grance", display: "swap" });

export const metadata: Metadata = { title: "Manasvi Fashion", description: "Luxury women\'s kurtis & dresses" };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${playfair.variable} ${imFell.variable} ${cormorant.variable} ${dm.variable} ${inter.variable} ${bodoni.variable} ${grance.variable}`}>
      <body className="font-[var(--font-inter)]"><Providers><Header />{children}<Footer /></Providers></body>
    </html>
  );
}
