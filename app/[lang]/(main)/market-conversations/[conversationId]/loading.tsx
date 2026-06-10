import { Skeleton } from "@/components/ui/skeleton"
import { ScrollArea } from "@/components/ui/scroll-area"

export default function MarketConversationDetailLoading() {
  return (
    <div className="flex min-h-0 w-full flex-1 flex-col gap-4 overflow-hidden">
      <div className="flex shrink-0 flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex min-w-0 flex-col gap-2">
          <Skeleton className="h-9 w-40" />
          <Skeleton className="h-7 w-2/3" />
          <div className="flex gap-3">
            <Skeleton className="h-4 w-36" />
            <Skeleton className="h-4 w-36" />
          </div>
        </div>
        <Skeleton className="h-9 w-full sm:w-44" />
      </div>

      <div className="flex min-h-0 flex-1">
        <ScrollArea className="min-h-0 flex-1">
          <div className="flex flex-col gap-4 pr-4">
            <div className="flex justify-end">
              <Skeleton className="h-28 w-full max-w-[52rem] rounded-xl" />
            </div>
            <Skeleton className="h-48 w-full max-w-[52rem] rounded-xl" />
            <div className="flex justify-end">
              <Skeleton className="h-24 w-full max-w-[44rem] rounded-xl" />
            </div>
          </div>
        </ScrollArea>
      </div>

      <Skeleton className="h-28 w-full shrink-0 rounded-3xl" />
    </div>
  )
}
