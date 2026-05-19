import { Suspense, type ElementType, type ReactNode } from "react"
import {
  ActivityIcon,
  CalendarClockIcon,
  CircleSlashIcon,
  FolderOpenIcon,
  ShieldAlertIcon,
  TargetIcon,
} from "lucide-react"

import { getWorkspaceWatchlistAssets } from "@/app/api/watchlists/action"
import { getMyWorkspaces } from "@/app/api/workspaces/action"
import type { AppLocale } from "@/app/lib/i18n/config"
import { getDictionary } from "@/app/lib/i18n/dictionaries"
import type { Dictionary } from "@/app/lib/i18n/dictionary-types"
import {
  formatDateTime as formatLocalizedDateTime,
  formatNumber,
} from "@/app/lib/i18n/format"
import { getRequestLocale } from "@/app/lib/i18n/server"
import { getCurrentPermissions } from "@/app/lib/permissions-server"
import { resolveActiveWorkspace } from "@/app/lib/workspaces/active"
import { WorkspaceResponse } from "@/app/lib/workspaces/definitions"
import { WorkspaceWatchlistAssetListItemResponse } from "@/app/lib/watchlists/definitions"
import { AppTimeMetadata } from "@/components/app-time-metadata"
import { Badge } from "@/components/ui/badge"
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"
import { Skeleton } from "@/components/ui/skeleton"

import { WorkspaceOverviewActions } from "./workspace-overview-actions"

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

interface WatchlistPreviewState {
  assets: WorkspaceWatchlistAssetListItemResponse[]
  error: string | null
  total: number
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
  const canReadWorkspace = permissions.includes("workspace:read")
  const canReadAsset = permissions.includes("asset:read")
  const canReadWatchlist = permissions.includes("watchlist:read")
  const canCreateWatchlist = permissions.includes("watchlist:create")
  const canDeleteWatchlist = permissions.includes("watchlist:delete")

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

  const watchlistPreview = await loadWatchlistPreview(
    canReadAsset && canReadWatchlist,
    dictionary
  )

  return (
    <WorkspaceOverviewShell>
      <div className="flex flex-col gap-6">
        <WorkspaceHero
          workspace={currentWorkspace}
          trackedAssetTotal={watchlistPreview.total}
          canReadAsset={canReadAsset}
          canReadWatchlist={canReadWatchlist}
          canCreateWatchlist={canCreateWatchlist}
          canDeleteWatchlist={canDeleteWatchlist}
          dictionary={dictionary}
          locale={locale}
        />

        <div className="grid gap-6 xl:grid-cols-[minmax(0,1.2fr)_minmax(320px,0.8fr)]">
          <TrackedAssetsSummary
            workspace={currentWorkspace}
            preview={watchlistPreview}
            canReadAsset={canReadAsset}
            canReadWatchlist={canReadWatchlist}
            canCreateWatchlist={canCreateWatchlist}
            canDeleteWatchlist={canDeleteWatchlist}
            dictionary={dictionary}
          />
          <WorkspaceTechnicalDetails
            workspace={currentWorkspace}
            dictionary={dictionary}
            locale={locale}
          />
        </div>
      </div>
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

function WorkspaceOverviewShell({ children }: { children: ReactNode }) {
  return <>{children}</>
}

function WorkspaceHero({
  workspace,
  trackedAssetTotal,
  canReadAsset,
  canReadWatchlist,
  canCreateWatchlist,
  canDeleteWatchlist,
  dictionary,
  locale,
}: {
  workspace: WorkspaceResponse
  trackedAssetTotal: number
  canReadAsset: boolean
  canReadWatchlist: boolean
  canCreateWatchlist: boolean
  canDeleteWatchlist: boolean
  dictionary: Dictionary
  locale: AppLocale
}) {
  return (
    <section className="rounded-xl border bg-muted/20 p-5">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
        <div className="flex min-w-0 flex-col gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="secondary">{dictionary.workspaceOverview.active}</Badge>
            <span className="text-sm text-muted-foreground">
              {dictionary.workspaceOverview.currentScope}
            </span>
          </div>
          <div className="flex flex-col gap-2">
            <h2 className="truncate text-2xl font-semibold tracking-tight text-foreground">
              {workspace.name}
            </h2>
            <p className="max-w-3xl text-sm leading-6 text-muted-foreground">
              {dictionary.workspaceOverview.heroDescription}
            </p>
          </div>
        </div>

        <WorkspaceOverviewActions
          workspace={workspace}
          canReadAsset={canReadAsset}
          canReadWatchlist={canReadWatchlist}
          canCreateWatchlist={canCreateWatchlist}
          canDeleteWatchlist={canDeleteWatchlist}
        />
      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        <OverviewStat
          icon={TargetIcon}
          label={dictionary.workspaceOverview.trackedAssets}
          value={formatNumber(trackedAssetTotal, locale)}
          description={dictionary.workspaceOverview.trackedAssetsStatDescription}
        />
        <OverviewStat
          icon={ActivityIcon}
          label={dictionary.workspaceOverview.status}
          value={dictionary.workspaceOverview.active}
          description={dictionary.workspaceOverview.statusDescription}
        />
        <OverviewStat
          icon={CalendarClockIcon}
          label={dictionary.workspaceOverview.updated}
          valueNode={
            <AppTimeMetadata icon={CalendarClockIcon}>
              {formatWorkspaceOverviewDateTime(
                workspace.lastModifiedDate,
                dictionary,
                locale
              )}
            </AppTimeMetadata>
          }
          description={dictionary.workspaceOverview.lastRecorded}
        />
      </div>
    </section>
  )
}

function OverviewStat({
  icon: Icon,
  label,
  value,
  valueNode,
  description,
}: {
  icon: ElementType
  label: string
  value?: string
  valueNode?: ReactNode
  description: string
}) {
  return (
    <div className="flex min-w-0 flex-col gap-3 rounded-lg border bg-background p-4">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Icon className="size-4" />
        <span>{label}</span>
      </div>
      {valueNode ?? (
        <div className="truncate text-lg font-semibold text-foreground">{value}</div>
      )}
      <div className="text-xs text-muted-foreground">{description}</div>
    </div>
  )
}

function TrackedAssetsSummary({
  workspace,
  preview,
  canReadAsset,
  canReadWatchlist,
  canCreateWatchlist,
  canDeleteWatchlist,
  dictionary,
}: {
  workspace: WorkspaceResponse
  preview: WatchlistPreviewState
  canReadAsset: boolean
  canReadWatchlist: boolean
  canCreateWatchlist: boolean
  canDeleteWatchlist: boolean
  dictionary: Dictionary
}) {
  const canReadTrackedAssets = canReadAsset && canReadWatchlist
  const canManageTrackedAssets = canReadTrackedAssets && canCreateWatchlist && canDeleteWatchlist
  const hasAssets = preview.assets.length > 0

  return (
    <section className="flex flex-col gap-4 rounded-xl border p-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex flex-col gap-1">
          <h3 className="font-medium text-foreground">
            {dictionary.workspaceOverview.trackedAssets}
          </h3>
          <p className="text-sm text-muted-foreground">
            {dictionary.workspaceOverview.trackedAssetsDescription}
          </p>
        </div>
        {canManageTrackedAssets ? (
          <WorkspaceOverviewActions
            workspace={workspace}
            canReadAsset={canReadAsset}
            canReadWatchlist={canReadWatchlist}
            canCreateWatchlist={canCreateWatchlist}
            canDeleteWatchlist={canDeleteWatchlist}
            variant="outline"
          />
        ) : null}
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
        <div className="flex flex-col gap-4">
          <div className="flex flex-wrap gap-2">
            {preview.assets.map((asset) => (
              <Badge key={asset.assetId} variant="outline">
                {asset.assetSymbol}
              </Badge>
            ))}
          </div>
          <div className="grid gap-3 md:grid-cols-2">
            {preview.assets.map((asset) => (
              <div
                key={asset.id}
                className="flex min-w-0 items-center justify-between gap-3 rounded-lg border bg-muted/20 p-3"
              >
                <div className="min-w-0">
                  <div className="truncate text-sm font-medium text-foreground">
                    {asset.assetName}
                  </div>
                  <div className="truncate text-xs text-muted-foreground">
                    {asset.assetSymbol}
                  </div>
                </div>
                <Badge variant="secondary">{asset.assetType}</Badge>
              </div>
            ))}
          </div>
        </div>
      ) : null}
    </section>
  )
}

function WorkspaceTechnicalDetails({
  workspace,
  dictionary,
  locale,
}: {
  workspace: WorkspaceResponse
  dictionary: Dictionary
  locale: AppLocale
}) {
  return (
    <section className="flex flex-col gap-4 rounded-xl border p-5">
      <div className="flex flex-col gap-1">
        <h3 className="font-medium text-foreground">
          {dictionary.workspaceOverview.technicalTitle}
        </h3>
        <p className="text-sm text-muted-foreground">
          {dictionary.workspaceOverview.technicalDescription}
        </p>
      </div>

      <div className="grid gap-3">
        <TechnicalDetail
          label={dictionary.workspaceOverview.workspaceId}
          value={workspace.id.toString()}
        />
        <TechnicalDetail
          label={dictionary.workspaceOverview.createdAt}
          valueNode={
            <AppTimeMetadata icon={CalendarClockIcon}>
              {formatWorkspaceOverviewDateTime(
                workspace.createdDate,
                dictionary,
                locale
              )}
            </AppTimeMetadata>
          }
        />
        <TechnicalDetail
          label={dictionary.workspaceOverview.updated}
          valueNode={
            <AppTimeMetadata icon={CalendarClockIcon}>
              {formatWorkspaceOverviewDateTime(
                workspace.lastModifiedDate,
                dictionary,
                locale
              )}
            </AppTimeMetadata>
          }
        />
      </div>
    </section>
  )
}

function TechnicalDetail({
  label,
  value,
  valueNode,
}: {
  label: string
  value?: string
  valueNode?: ReactNode
}) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-lg bg-muted/30 px-3 py-2">
      <span className="text-sm text-muted-foreground">{label}</span>
      {valueNode ?? (
        <span className="truncate text-right text-sm font-medium text-foreground">
          {value}
        </span>
      )}
    </div>
  )
}

function WorkspaceOverviewSkeleton() {
  return (
    <div className="flex flex-col gap-6">
      <div className="rounded-xl border bg-muted/20 p-5">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
          <div className="flex flex-1 flex-col gap-3">
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-8 w-full max-w-md" />
            <Skeleton className="h-4 w-full max-w-2xl" />
          </div>
          <Skeleton className="h-9 w-44" />
        </div>
        <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="rounded-lg border bg-background p-4">
              <Skeleton className="h-4 w-28" />
              <Skeleton className="mt-3 h-6 w-full" />
              <Skeleton className="mt-3 h-3 w-32" />
            </div>
          ))}
        </div>
      </div>
      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.2fr)_minmax(320px,0.8fr)]">
        <Skeleton className="h-80 rounded-xl" />
        <Skeleton className="h-80 rounded-xl" />
      </div>
    </div>
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
