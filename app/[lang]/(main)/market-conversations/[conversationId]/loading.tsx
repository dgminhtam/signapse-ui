import { Skeleton } from "@/components/ui/skeleton"

export default function MarketConversationDetailLoading() {
  return (
    <div className="flex w-full flex-col gap-6">
      <div className="flex flex-col gap-3">
        <Skeleton className="h-9 w-40" />
        <Skeleton className="h-7 w-2/3" />
        <div className="flex gap-3">
          <Skeleton className="h-4 w-36" />
          <Skeleton className="h-4 w-36" />
        </div>
      </div>
      <div className="flex justify-end">
        <Skeleton className="h-32 w-full max-w-[52rem] rounded-xl" />
      </div>
      <Skeleton className="h-56 w-full max-w-[52rem] rounded-xl" />
      <Skeleton className="h-40 w-full rounded-xl" />
    </div>
  )
}
