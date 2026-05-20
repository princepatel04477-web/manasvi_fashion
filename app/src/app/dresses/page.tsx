import { ProductSection } from "@/components/page-shell";
export default function Page() { return <ProductSection title="Dresses Collection" filter={(p) => p.category === "dresses"} />; }
