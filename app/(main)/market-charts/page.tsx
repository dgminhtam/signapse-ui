import { Suspense } from "react"

import { getWorkspaceWatchlistAssets } from "@/app/api/watchlists/action"
import {
  canAccessMarketChartWorkbench,
  MARKET_CHART_WORKBENCH_PERMISSIONS,
} from "@/app/lib/market-charts/permissions"
import { getCurrentPermissions } from "@/app/lib/permissions-server"
import { WorkspaceWatchlistAssetListItemResponse } from "@/app/lib/watchlists/definitions"
import { AccessDenied } from "@/components/access-denied"
import { Skeleton } from "@/components/ui/skeleton"

import { MarketChartWorkbench } from "./market-chart-workbench"

const WATCHLIST_CHART_ASSET_SEARCH = {
  filter: "",
  page: 0,
  size: 100,
  sort: [{ field: "createdDate", direction: "desc" as const }],
}

export default function MarketChartsPage() {
  return (
    <Suspense fallback={<MarketChartWorkbenchSkeleton />}>
      <MarketChartsContent />
    </Suspense>
  )
}

async function MarketChartsContent() {
  const permissions = await getCurrentPermissions()

  if (!canAccessMarketChartWorkbench(permissions)) {
    return (
      <AccessDenied
        description="Bạn cần quyền xem biểu đồ giá và quyền đọc watchlist của workspace để mở khu vực này."
        permission={MARKET_CHART_WORKBENCH_PERMISSIONS.join(", ")}
      />
    )
  }

  let watchlistAssets: WorkspaceWatchlistAssetListItemResponse[] = []
  let watchlistError: string | null = null

  try {
    const watchlistPage = await getWorkspaceWatchlistAssets(WATCHLIST_CHART_ASSET_SEARCH)
    watchlistAssets = watchlistPage.content ?? []
  } catch (error: unknown) {
    watchlistError =
      error instanceof Error
        ? error.message
        : "Không thể tải danh sách tài sản theo dõi của workspace."
  }

  return (
    <MarketChartWorkbench
      watchlistAssets={watchlistAssets}
      watchlistError={watchlistError}
    />
  )
}

function MarketChartWorkbenchSkeleton() {
  return (
    <div className="flex flex-col gap-6">
      <div className="rounded-2xl border bg-muted/15 p-4">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
          <div className="grid flex-1 gap-3 lg:grid-cols-[minmax(260px,1fr)_180px_auto] lg:items-end">
            <Skeleton className="h-16 w-full rounded-xl" />
            <Skeleton className="h-16 w-full rounded-xl" />
            <Skeleton className="h-10 w-full rounded-md lg:w-32" />
          </div>
          <Skeleton className="h-4 w-36 rounded-full lg:mb-3" />
        </div>
      </div>

      <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_minmax(300px,360px)]">
        <Skeleton className="h-[560px] w-full rounded-[28px]" />
        <Skeleton className="h-80 w-full rounded-2xl" />
      </div>
    </div>
  )
}
