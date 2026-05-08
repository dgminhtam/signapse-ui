import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"

function MarketChartPlotSkeleton() {
  return (
    <div className="relative mt-3 min-h-0 flex-1 overflow-hidden rounded-lg border border-border/50 bg-muted/20">
      <div className="absolute inset-x-6 top-1/4 h-px bg-border/70" />
      <div className="absolute inset-x-6 top-1/2 h-px bg-border/70" />
      <div className="absolute inset-x-6 top-3/4 h-px bg-border/70" />
      <div className="absolute inset-y-6 left-1/4 w-px bg-border/70" />
      <div className="absolute inset-y-6 left-1/2 w-px bg-border/70" />
      <div className="absolute inset-y-6 left-3/4 w-px bg-border/70" />
      <Skeleton className="absolute top-[28%] left-[14%] h-16 w-24 rounded-lg opacity-60" />
      <Skeleton className="absolute top-[42%] left-[36%] h-24 w-28 rounded-lg opacity-70" />
      <Skeleton className="absolute top-[24%] right-[18%] h-20 w-24 rounded-lg opacity-60" />
      <Skeleton className="absolute right-6 bottom-6 h-3 w-20 rounded-full" />
    </div>
  )
}

function MarketChartVolumeSkeleton() {
  return (
    <div className="mt-3 border-t border-border/60 pt-3">
      <div className="flex flex-wrap gap-3">
        <Skeleton className="h-3 w-24 rounded-full" />
        <Skeleton className="h-3 w-16 rounded-full" />
        <Skeleton className="h-3 w-16 rounded-full" />
        <Skeleton className="h-3 w-20 rounded-full" />
      </div>
      <div className="mt-3 flex h-20 items-end gap-1.5 rounded-lg bg-muted/20 px-3 pb-2">
        {["h-6", "h-10", "h-4", "h-14", "h-8", "h-12", "h-5", "h-16"].map(
          (height, index) => (
            <Skeleton
              key={`${height}-${index}`}
              className={cn("w-3 rounded-sm", height)}
            />
          )
        )}
      </div>
    </div>
  )
}

function MarketChartStatusRailSkeleton() {
  return (
    <div className="border-t bg-muted/10 p-3">
      <div className="flex min-h-4 flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <Skeleton className="h-3 w-32 rounded-full" />
        <Skeleton className="h-3 w-40 rounded-full" />
      </div>
    </div>
  )
}

function MarketChartSkeletonContent({ className }: { className?: string }) {
  return (
    <div className={cn("flex min-h-[500px] flex-col p-3", className)}>
      <div className="flex flex-wrap gap-4 px-1">
        <Skeleton className="h-3 w-36 rounded-full" />
        <Skeleton className="h-3 w-20 rounded-full" />
        <Skeleton className="h-3 w-20 rounded-full" />
        <Skeleton className="h-3 w-20 rounded-full" />
        <Skeleton className="h-3 w-20 rounded-full" />
        <Skeleton className="h-3 w-24 rounded-full" />
      </div>
      <MarketChartPlotSkeleton />
      <MarketChartVolumeSkeleton />
    </div>
  )
}

function MarketChartSurfaceSkeleton({
  className,
  embedded = false,
  showStatusRail = true,
}: {
  className?: string
  embedded?: boolean
  showStatusRail?: boolean
}) {
  if (embedded) {
    return <MarketChartSkeletonContent className={className} />
  }

  return (
    <section className={cn("rounded-xl border border-border bg-card", className)}>
      <div
        className={cn(
          "min-h-[520px] bg-card p-2",
          showStatusRail ? "rounded-t-xl" : "rounded-xl"
        )}
      >
        <MarketChartSkeletonContent />
      </div>
      {showStatusRail ? <MarketChartStatusRailSkeleton /> : null}
    </section>
  )
}

export { MarketChartSurfaceSkeleton }
