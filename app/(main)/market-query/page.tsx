import { Suspense } from "react"

import { getCurrentPermissions } from "@/app/lib/permissions-server"
import {
  canExecuteMarketQueries,
  MARKET_QUERY_EXECUTE_PERMISSIONS,
} from "@/app/lib/market-query/permissions"
import { AccessDenied } from "@/components/access-denied"
import { Skeleton } from "@/components/ui/skeleton"

import { MarketQueryWorkbench } from "./market-query-workbench"

export default async function MarketQueryPage() {
  const permissions = await getCurrentPermissions()

  if (!canExecuteMarketQueries(permissions)) {
    return (
      <AccessDenied
        description="Bạn không có quyền sử dụng công cụ truy vấn thị trường."
        permission={MARKET_QUERY_EXECUTE_PERMISSIONS[0]}
      />
    )
  }

  return (
    <Suspense fallback={<MarketQueryWorkbenchSkeleton />}>
      <MarketQueryWorkbench />
    </Suspense>
  )
}

function MarketQueryWorkbenchSkeleton() {
  return (
    <div className="flex flex-col gap-6">
      <div className="rounded-2xl border border-border bg-muted/15 p-5">
        <div className="flex flex-col gap-4">
          <Skeleton className="h-5 w-48" />
          <Skeleton className="h-36 w-full rounded-xl" />
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-wrap gap-2">
              <Skeleton className="h-9 w-44 rounded-full" />
              <Skeleton className="h-9 w-48 rounded-full" />
            </div>
            <Skeleton className="h-10 w-full rounded-md sm:w-32" />
          </div>
        </div>
      </div>

      <Skeleton className="h-28 w-full rounded-2xl" />

      <div className="grid gap-5 xl:grid-cols-[minmax(0,1.6fr)_minmax(280px,0.8fr)]">
        <Skeleton className="h-72 w-full rounded-2xl" />
        <Skeleton className="h-72 w-full rounded-2xl" />
      </div>

      <Skeleton className="h-72 w-full rounded-2xl" />
    </div>
  )
}
