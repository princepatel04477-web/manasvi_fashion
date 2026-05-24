import { CollectionBannerSkeleton, ProductGridSkeleton } from "@/components/ui/skeleton";

export default function CollectionsLoading() {
  return (
    <div className="space-y-8 max-w-7xl mx-auto px-4 py-8">
      <CollectionBannerSkeleton />
      <ProductGridSkeleton count={3} />
    </div>
  );
}
