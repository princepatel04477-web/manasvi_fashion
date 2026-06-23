import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Designer Dresses in Surat | Premium One Piece & Western Wear - Manasvi Fashion",
  description: "Shop premium designer dresses in Surat. Discover our latest collection of elegant casual, party wear, western, and luxury one-piece dresses.",
  alternates: {
    canonical: "https://manasvifashionsurat.com/dresses",
  },
};

export default function DressesLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
