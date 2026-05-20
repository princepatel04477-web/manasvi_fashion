import { ProductSection } from "@/components/page-shell";
export default function Page() { return <ProductSection title="New Arrivals" filter={(p) => Boolean(p.isNew)} />; }
