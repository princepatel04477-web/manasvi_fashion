import { ProductGridSkeleton } from "@/components/ui/skeleton";

export default function ProductsLoading() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      {/* Editorial Title Placeholder */}
      <div className="h-8 w-48 bg-[#E7C2B8]/20 rounded-md animate-pulse mb-8" />
      <ProductGridSkeleton count={6} />
    </div>
  );
}
