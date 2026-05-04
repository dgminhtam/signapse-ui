import { Suspense } from "react"

import {
  canReadMarketCharts,
  MARKET_CHART_READ_PERMISSIONS,
} from "@/app/lib/market-charts/permissions"
import { getCurrentPermissions } from "@/app/lib/permissions-server"
import { AccessDenied } from "@/components/access-denied"
import { Skeleton } from "@/components/ui/skeleton"

import { MarketChartWorkbench } from "./market-chart-workbench"

export default async function MarketChartsPage() {
  const permissions = await getCurrentPermissions()

  if (!canReadMarketCharts(permissions)) {
    return (
      <AccessDenied
        description="Bạn không có quyền truy cập khu vực biểu đồ giá thị trường."
        permission={MARKET_CHART_READ_PERMISSIONS[0]}
      />
    )
  }

  return (
    <Suspense fallback={<MarketChartWorkbenchSkeleton />}>
      <MarketChartWorkbench />
    </Suspense>
  )
}

function MarketChartWorkbenchSkeleton() {
  return (
    <div className="flex flex-col gap-6">
      <div className="rounded-2xl border bg-muted/15 p-5">
        <div className="flex flex-col gap-5">
          <div className="flex flex-col gap-2">
            <Skeleton className="h-5 w-44" />
            <Skeleton className="h-4 w-full max-w-2xl" />
          </div>
          <div className="grid gap-4 lg:grid-cols-[minmax(220px,1fr)_160px_200px_200px_auto] lg:items-end">
            <Skeleton className="h-16 w-full rounded-xl" />
            <Skeleton className="h-16 w-full rounded-xl" />
            <Skeleton className="h-16 w-full rounded-xl" />
            <Skeleton className="h-16 w-full rounded-xl" />
            <Skeleton className="h-10 w-full rounded-md lg:w-32" />
          </div>
        </div>
      </div>

      <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_minmax(300px,360px)]">
        <Skeleton className="h-[560px] w-full rounded-[28px]" />
        <div className="flex flex-col gap-5">
          <Skeleton className="h-64 w-full rounded-2xl" />
          <Skeleton className="h-56 w-full rounded-2xl" />
        </div>
      </div>
    </div>
  )
}
