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

import { MarketChartSurfaceSkeleton } from "./market-chart-skeleton"
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
    <div className="w-full">
      <div className="flex flex-col gap-3">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex w-full min-w-0 flex-1 flex-col gap-4 sm:w-auto sm:flex-row sm:items-center">
            <Skeleton className="h-9 w-full rounded-lg sm:w-80 lg:w-96" />
          </div>
          <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:flex-wrap sm:items-center sm:justify-end">
            <Skeleton className="h-9 w-full rounded-lg sm:w-[180px]" />
            <Skeleton className="h-9 w-full rounded-lg sm:w-32" />
            <Skeleton className="h-9 w-full rounded-lg sm:w-24" />
          </div>
        </div>
      </div>

      <MarketChartSurfaceSkeleton className="mt-4" />
    </div>
  )
}
