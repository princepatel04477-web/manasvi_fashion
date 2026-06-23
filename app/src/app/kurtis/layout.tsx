import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Designer Kurtis in Surat | Premium Cotton Kurti Store - Manasvi Fashion",
  description: "Explore the latest kurti collection at Manasvi Fashion Surat. Shop designer cotton, printed, office wear, daily wear, and party wear kurtis crafted for elegance.",
  alternates: {
    canonical: "https://manasvifashionsurat.com/kurtis",
  },
};

export default function KurtisLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
