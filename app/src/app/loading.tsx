import { Skeleton } from "@/components/ui/skeleton";

export default function RootLoading() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8 animate-pulse">
      {/* Hero Banner Skeleton */}
      <Skeleton className="h-[50vh] w-full" variant="nude" />

      {/* Grid skeleton */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <div className="space-y-4">
          <Skeleton className="aspect-[3/4] w-full" variant="cream" />
          <Skeleton className="h-5 w-2/3" variant="cream" />
          <Skeleton className="h-4 w-1/3" variant="nude" />
        </div>
        <div className="space-y-4">
          <Skeleton className="aspect-[3/4] w-full" variant="cream" />
          <Skeleton className="h-5 w-2/3" variant="cream" />
          <Skeleton className="h-4 w-1/3" variant="nude" />
        </div>
        <div className="space-y-4">
          <Skeleton className="aspect-[3/4] w-full" variant="cream" />
          <Skeleton className="h-5 w-2/3" variant="cream" />
          <Skeleton className="h-4 w-1/3" variant="nude" />
        </div>
      </div>
    </div>
  );
}
