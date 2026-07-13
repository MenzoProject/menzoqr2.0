import { Skeleton } from "@/components/ui/skeleton";

export function MenuSkeleton() {
  return (
    <div className="mx-auto max-w-lg px-4 py-4">
      <div className="mb-4 flex items-center gap-3">
        <Skeleton className="h-11 w-11 rounded-card" />
        <Skeleton className="h-5 w-40" />
      </div>
      <div className="mb-6 flex gap-2">
        {[0, 1, 2, 3].map((key) => (
          <Skeleton key={key} className="h-9 w-24 rounded-full" />
        ))}
      </div>
      <div className="grid grid-cols-2 gap-3">
        {[0, 1, 2, 3, 4, 5].map((key) => (
          <div key={key} className="flex flex-col gap-2">
            <Skeleton className="aspect-[4/3] w-full rounded-card-lg" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/3" />
          </div>
        ))}
      </div>
    </div>
  );
}
