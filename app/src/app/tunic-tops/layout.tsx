import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Designer Tunics in Surat | Premium Tunic Tops Online - Manasvi Fashion",
  description: "Shop designer tunic tops in Surat. Explore our collection of premium cotton, casual, office wear, and stylish tunics at Manasvi Fashion.",
  alternates: {
    canonical: "https://manasvifashionsurat.com/tunic-tops",
  },
};

export default function TunicTopsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
