import type { Metadata } from "next";
import { Cormorant_Garamond, DM_Sans } from "next/font/google";
import "./globals.css";
import { LenisProvider } from "@/components/layout/LenisProvider";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { CartDrawer } from "@/components/layout/CartDrawer";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-cormorant",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-dm-sans",
});

export const metadata: Metadata = {
  title: "Mansvi Fashion | Wear the Culture. Own the Grace.",
  description: "Premium Indian women's ethnic wear brand selling Kurtis, Anarkalis, Palazzo sets, casual cotton kurtas, and festive silk dresses.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${cormorant.variable} ${dmSans.variable} font-body antialiased bg-blush text-cocoa min-h-screen flex flex-col`}
      >
        <LenisProvider>
          <Navbar />
          <CartDrawer />
          <main className="flex-grow pt-24 md:pt-28">
            {children}
          </main>
          <Footer />
        </LenisProvider>
      </body>
    </html>
  );
}
