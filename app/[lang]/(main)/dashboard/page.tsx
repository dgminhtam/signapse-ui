import { Suspense, type ReactNode } from "react"
import {
  CalendarClockIcon,
  CircleSlashIcon,
  FolderOpenIcon,
  ShieldAlertIcon,
  TargetIcon,
} from "lucide-react"

import { getDashboardSummary } from "@/app/api/dashboard/action"
import { getNewsArticles } from "@/app/api/news-articles/action"
import { getWorkspaceWatchlistAssets } from "@/app/api/watchlists/action"
import { getMyWorkspaces } from "@/app/api/workspaces/action"
import type { DashboardSummaryResponse } from "@/app/lib/dashboard/definitions"
import type { AppLocale } from "@/app/lib/i18n/config"
import { getDictionary } from "@/app/lib/i18n/dictionaries"
import type { Dictionary } from "@/app/lib/i18n/dictionary-types"
import { canReadGraphView } from "@/app/lib/graph-view/permissions"
import {
  formatDateTime as formatLocalizedDateTime,
  formatNumber,
} from "@/app/lib/i18n/format"
import { getRequestLocale } from "@/app/lib/i18n/server"
import { canAccessMarketChartWorkbench } from "@/app/lib/market-charts/permissions"
import type { NewsArticleListResponse } from "@/app/lib/news-articles/definitions"
import { canReadNewsArticles } from "@/app/lib/news-articles/permissions"
import { hasPermission } from "@/app/lib/permissions"
import { getCurrentPermissions } from "@/app/lib/permissions-server"
import { resolveActiveWorkspace } from "@/app/lib/workspaces/active"
import { WorkspaceResponse } from "@/app/lib/workspaces/definitions"
import { WorkspaceWatchlistAssetListItemResponse } from "@/app/lib/watchlists/definitions"
import { AppTimeMetadata } from "@/components/app-time-metadata"
import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemTitle,
} from "@/components/ui/item"
import { Skeleton } from "@/components/ui/skeleton"

import {
  TradingSnapshot,
  TradingSnapshotSkeleton,
} from "./trading-snapshot"
import { AssetsInFocus, AssetsInFocusSkeleton } from "./assets-in-focus"
import { EventTimeline, EventTimelineSkeleton } from "./event-timeline"
import { LatestNews, LatestNewsSkeleton } from "./latest-news"
import { DashboardQuickDetailProvider } from "./dashboard-quick-detail"
import { WorkspaceOverviewActions } from "../workspace-overview-actions"

const WORKSPACE_SEARCH = {
  filter: "",
  page: 0,
  size: 100,
  sort: [{ field: "id", direction: "asc" as const }],
}

const WATCHLIST_PREVIEW_SEARCH = {
  filter: "",
  page: 0,
  size: 6,
  sort: [{ field: "createdDate", direction: "desc" as const }],
}

const LATEST_NEWS_SEARCH = {
  filter: "",
  page: 0,
  size: 5,
  sort: [{ field: "publishedAt", direction: "desc" as const }],
}

interface WatchlistPreviewState {
  assets: WorkspaceWatchlistAssetListItemResponse[]
  error: string | null
  total: number
}

interface DashboardSummaryState {
  error: string | null
  summary: DashboardSummaryResponse | null
}

interface LatestNewsState {
  articles: NewsArticleListResponse[]
  error: string | null
}

export default function Page() {
  return (
    <Suspense fallback={<WorkspaceOverviewSkeleton />}>
      <WorkspaceOverview />
    </Suspense>
  )
}

async function WorkspaceOverview() {
  const [permissions, locale] = await Promise.all([
    getCurrentPermissions(),
    getRequestLocale(),
  ])
  const dictionary = await getDictionary(locale)
  const canReadWorkspace = hasPermission(permissions, "workspace:read")
  const canReadAsset = hasPermission(permissions, "asset:read")
  const canReadWatchlist = hasPermission(permissions, "watchlist:read")
  const canReadNews = canReadNewsArticles(permissions)
  const canReadGraph = canReadGraphView(permissions)
  const canAccessMarketCharts = canAccessMarketChartWorkbench(permissions)
  const canCreateWatchlist = hasPermission(permissions, "watchlist:create")
  const canDeleteWatchlist = hasPermission(permissions, "watchlist:delete")

  if (!canReadWorkspace) {
    return (
      <WorkspaceOverviewShell>
        <Empty className="min-h-[360px] border">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <ShieldAlertIcon />
            </EmptyMedia>
            <EmptyTitle>{dictionary.workspaceOverview.noReadTitle}</EmptyTitle>
            <EmptyDescription>
              {dictionary.workspaceOverview.noReadDescription}
            </EmptyDescription>
          </EmptyHeader>
        </Empty>
      </WorkspaceOverviewShell>
    )
  }

  let workspaces: WorkspaceResponse[] = []
  let workspaceLoadError: string | null = null

  try {
    const workspacePage = await getMyWorkspaces(WORKSPACE_SEARCH)
    workspaces = workspacePage.content ?? []
  } catch (error: unknown) {
    workspaceLoadError =
      error instanceof Error
        ? error.message
        : dictionary.workspaceOverview.workspaceLoadError
  }

  const currentWorkspace = resolveActiveWorkspace(workspaces)

  if (workspaceLoadError) {
    return (
      <WorkspaceOverviewShell>
        <Empty className="min-h-[360px] border">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <CircleSlashIcon />
            </EmptyMedia>
            <EmptyTitle>{dictionary.workspaceOverview.overviewLoadErrorTitle}</EmptyTitle>
            <EmptyDescription>{workspaceLoadError}</EmptyDescription>
          </EmptyHeader>
        </Empty>
      </WorkspaceOverviewShell>
    )
  }

  if (!currentWorkspace) {
    return (
      <WorkspaceOverviewShell>
        <Empty className="min-h-[360px] border">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <FolderOpenIcon />
            </EmptyMedia>
            <EmptyTitle>{dictionary.workspaceOverview.noActiveTitle}</EmptyTitle>
            <EmptyDescription>
              {dictionary.workspaceOverview.noActiveDescription}
            </EmptyDescription>
          </EmptyHeader>
        </Empty>
      </WorkspaceOverviewShell>
    )
  }

  const [watchlistPreview, dashboardSummary, latestNews] = await Promise.all([
    loadWatchlistPreview(canReadAsset && canReadWatchlist, dictionary),
    loadDashboardSummary(dictionary),
    loadLatestNews(canReadNews, dictionary),
  ])

  const eventTimeline = (
    <EventTimeline
      dictionary={dictionary}
      error={dashboardSummary.error}
      locale={locale}
      metric={dashboardSummary.summary?.recentEvents ?? null}
    />
  )

  return (
    <WorkspaceOverviewShell>
      <>
        <WorkspaceOverviewPanel
          workspace={currentWorkspace}
          preview={watchlistPreview}
          canReadAsset={canReadAsset}
          canReadWatchlist={canReadWatchlist}
          canCreateWatchlist={canCreateWatchlist}
          canDeleteWatchlist={canDeleteWatchlist}
          dictionary={dictionary}
          locale={locale}
        />
        <TradingSnapshot
          dictionary={dictionary}
          error={dashboardSummary.error}
          locale={locale}
          summary={dashboardSummary.summary}
        />
        <DashboardQuickDetailProvider>
          {canReadNews ? (
            <div className="grid min-w-0 gap-4 lg:grid-cols-12">
              <div className="min-w-0 lg:col-span-8">{eventTimeline}</div>
              <div className="min-w-0 lg:col-span-4">
                <LatestNews
                  articles={latestNews.articles}
                  dictionary={dictionary}
                  error={latestNews.error}
                  locale={locale}
                />
              </div>
            </div>
          ) : (
            eventTimeline
          )}
        </DashboardQuickDetailProvider>
        <AssetsInFocus
          canAccessMarketCharts={canAccessMarketCharts}
          canReadGraphView={canReadGraph}
          dictionary={dictionary}
          error={dashboardSummary.error}
          locale={locale}
          metric={dashboardSummary.summary?.assetsInFocus ?? null}
        />
      </>
    </WorkspaceOverviewShell>
  )
}

async function loadWatchlistPreview(
  canReadTrackedAssets: boolean,
  dictionary: Dictionary
): Promise<WatchlistPreviewState> {
  if (!canReadTrackedAssets) {
    return { assets: [], error: null, total: 0 }
  }

  try {
    const response = await getWorkspaceWatchlistAssets(WATCHLIST_PREVIEW_SEARCH)
    return {
      assets: response.content ?? [],
      error: null,
      total: response.totalElements ?? response.content?.length ?? 0,
    }
  } catch (error: unknown) {
    return {
      assets: [],
      error: error instanceof Error
        ? error.message
        : dictionary.workspaceOverview.watchlistLoadError,
      total: 0,
    }
  }
}

async function loadDashboardSummary(
  dictionary: Dictionary
): Promise<DashboardSummaryState> {
  try {
    return {
      error: null,
      summary: await getDashboardSummary(),
    }
  } catch (error: unknown) {
    return {
      error:
        error instanceof Error
          ? error.message
          : dictionary.workspaceOverview.tradingSnapshot.summaryErrorDescription,
      summary: null,
    }
  }
}

async function loadLatestNews(
  canReadNews: boolean,
  dictionary: Dictionary
): Promise<LatestNewsState> {
  if (!canReadNews) {
    return { articles: [], error: null }
  }

  try {
    const response = await getNewsArticles(LATEST_NEWS_SEARCH)
    return {
      articles: (response.content ?? []).slice(0, LATEST_NEWS_SEARCH.size),
      error: null,
    }
  } catch (error: unknown) {
    return {
      articles: [],
      error:
        error instanceof Error
          ? error.message
          : dictionary.workspaceOverview.latestNews.errorDescription,
    }
  }
}

function WorkspaceOverviewShell({ children }: { children: ReactNode }) {
  return <div className="flex min-w-0 flex-col gap-4 sm:gap-6">{children}</div>
}

function WorkspaceOverviewPanel({
  workspace,
  preview,
  canReadAsset,
  canReadWatchlist,
  canCreateWatchlist,
  canDeleteWatchlist,
  dictionary,
  locale,
}: {
  workspace: WorkspaceResponse
  preview: WatchlistPreviewState
  canReadAsset: boolean
  canReadWatchlist: boolean
  canCreateWatchlist: boolean
  canDeleteWatchlist: boolean
  dictionary: Dictionary
  locale: AppLocale
}) {
  const canReadTrackedAssets = canReadAsset && canReadWatchlist
  const canManageTrackedAssets = canReadTrackedAssets && canCreateWatchlist && canDeleteWatchlist
  const hasAssets = preview.assets.length > 0

  return (
    <Card size="sm">
      <CardHeader>
        <CardTitle>
          <h2 className="text-2xl font-semibold tracking-tight">
            {workspace.name}
          </h2>
        </CardTitle>
        <CardDescription>{dictionary.workspaceOverview.description}</CardDescription>
        {canManageTrackedAssets ? (
          <CardAction>
            <WorkspaceOverviewActions
              workspace={workspace}
              canReadAsset={canReadAsset}
              canReadWatchlist={canReadWatchlist}
              canCreateWatchlist={canCreateWatchlist}
              canDeleteWatchlist={canDeleteWatchlist}
              variant="outline"
            />
          </CardAction>
        ) : null}
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-2">
          <AppTimeMetadata icon={CalendarClockIcon}>
            {formatWorkspaceOverviewDateTime(
              workspace.lastModifiedDate,
              dictionary,
              locale
            )}
          </AppTimeMetadata>
          <div className="flex flex-col gap-1">
            <div className="flex flex-wrap items-center gap-2">
              <h3
                id="dashboard-workspace-assets-label"
                className="text-sm font-medium"
              >
                {dictionary.workspaceOverview.trackedAssets}
              </h3>
              {canReadTrackedAssets ? (
                <Badge variant="secondary">{formatNumber(preview.total, locale)}</Badge>
              ) : null}
            </div>
            <p className="text-sm text-muted-foreground">
              {dictionary.workspaceOverview.trackedAssetsDescription}
            </p>
          </div>

          {!canReadTrackedAssets ? (
            <Empty className="min-h-56 border">
              <EmptyHeader>
                <EmptyMedia variant="icon">
                  <ShieldAlertIcon />
                </EmptyMedia>
                <EmptyTitle>{dictionary.workspaceOverview.trackedAssetsDeniedTitle}</EmptyTitle>
                <EmptyDescription>
                  {dictionary.workspaceOverview.trackedAssetsDeniedDescription}
                </EmptyDescription>
              </EmptyHeader>
            </Empty>
          ) : null}

          {canReadTrackedAssets && preview.error ? (
            <Empty className="min-h-56 border">
              <EmptyHeader>
                <EmptyMedia variant="icon">
                  <CircleSlashIcon />
                </EmptyMedia>
                <EmptyTitle>{dictionary.workspaceOverview.trackedAssetsLoadErrorTitle}</EmptyTitle>
                <EmptyDescription>{preview.error}</EmptyDescription>
              </EmptyHeader>
            </Empty>
          ) : null}

          {canReadTrackedAssets && !preview.error && !hasAssets ? (
            <Empty className="min-h-56 border">
              <EmptyHeader>
                <EmptyMedia variant="icon">
                  <TargetIcon />
                </EmptyMedia>
                <EmptyTitle>{dictionary.workspaceOverview.noTrackedAssetsTitle}</EmptyTitle>
                <EmptyDescription>
                  {dictionary.workspaceOverview.noTrackedAssetsDescription}
                </EmptyDescription>
              </EmptyHeader>
            </Empty>
          ) : null}

          {canReadTrackedAssets && !preview.error && hasAssets ? (
            <ItemGroup
              aria-labelledby="dashboard-workspace-assets-label"
              className="grid gap-2 sm:grid-cols-2 xl:grid-cols-4"
            >
              {preview.assets.map((asset) => (
                <Item
                  key={asset.id}
                  role="listitem"
                  size="sm"
                  variant="outline"
                >
                  <ItemContent className="min-w-0">
                    <ItemTitle className="line-clamp-none break-words">
                      {asset.assetName}
                    </ItemTitle>
                    <ItemDescription>
                      <span className="font-mono">{asset.assetSymbol}</span>
                    </ItemDescription>
                  </ItemContent>
                  <ItemActions className="shrink-0">
                    <Badge variant="secondary">{asset.assetType}</Badge>
                  </ItemActions>
                </Item>
              ))}
            </ItemGroup>
          ) : null}
        </div>
      </CardContent>
    </Card>
  )
}

function WorkspaceOverviewSkeleton() {
  return (
    <WorkspaceOverviewShell>
      <>
        <Card size="sm">
          <CardHeader>
            <CardTitle>
              <Skeleton className="h-7 w-full max-w-md" />
            </CardTitle>
            <CardDescription>
              <Skeleton className="h-4 w-full max-w-3xl" />
            </CardDescription>
            <CardAction>
              <Skeleton className="h-9 w-44" />
            </CardAction>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-2">
              <Skeleton className="h-4 w-48" />
              <div className="flex flex-col gap-1">
                <Skeleton className="h-5 w-40" />
                <Skeleton className="h-4 w-full max-w-lg" />
              </div>
              <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-4">
                {Array.from({ length: 8 }).map((_, index) => (
                  <Skeleton key={index} className="h-16 rounded-lg" />
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
        <TradingSnapshotSkeleton />
        <div className="grid min-w-0 gap-4 lg:grid-cols-12">
          <div className="min-w-0 lg:col-span-8">
            <EventTimelineSkeleton />
          </div>
          <div className="min-w-0 lg:col-span-4">
            <LatestNewsSkeleton />
          </div>
        </div>
        <AssetsInFocusSkeleton />
      </>
    </WorkspaceOverviewShell>
  )
}

function formatWorkspaceOverviewDateTime(
  value: string | null | undefined,
  dictionary: Dictionary,
  locale: AppLocale
) {
  if (!value) {
    return dictionary.workspaceOverview.noData
  }

  return formatLocalizedDateTime(
    value,
    locale,
    {
      dateStyle: "medium",
      timeStyle: "short",
    },
    dictionary.workspaceOverview.invalidDate
  )
}
