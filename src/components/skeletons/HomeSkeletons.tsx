import { Skeleton } from "../ui/skeleton";

export const FoodCardSkeleton = () => (
  <div className="rounded-2xl overflow-hidden bg-card border border-border/50 shadow-card">
    <Skeleton className="aspect-square w-full rounded-none" />
    <div className="p-4 space-y-2">
      <Skeleton className="h-4 w-3/4" />
      <Skeleton className="h-3 w-1/2" />
      <div className="flex items-center justify-between pt-2">
        <Skeleton className="h-5 w-16" />
        <Skeleton className="h-8 w-8 rounded-full" />
      </div>
    </div>
  </div>
);

export const CategorySkeleton = () => (
  <div className="flex flex-col items-center gap-2 p-3 rounded-2xl bg-muted/50">
    <Skeleton className="w-14 h-14 rounded-full" />
    <Skeleton className="h-3 w-12" />
  </div>
);

export const HeroSkeleton = () => (
  <Skeleton className="w-full h-44 sm:h-56 rounded-3xl my-4" />
);

export const HomeSkeleton = () => (
  <div className="space-y-6">
    <Skeleton className="h-12 w-full rounded-2xl" />
    <HeroSkeleton />
    <div>
      <Skeleton className="h-5 w-32 mb-4" />
      <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <CategorySkeleton key={i} />
        ))}
      </div>
    </div>
    <div>
      <Skeleton className="h-5 w-32 mb-4" />
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <FoodCardSkeleton key={i} />
        ))}
      </div>
    </div>
  </div>
);
