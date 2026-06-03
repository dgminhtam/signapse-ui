import { Suspense, type ReactNode } from "react"
import {
  CalendarClockIcon,
  CircleSlashIcon,
  FolderOpenIcon,
  ScrollTextIcon,
  ShieldAlertIcon,
  TargetIcon,
} from "lucide-react"

import { getNarratives } from "@/app/api/narratives/action"
import { getWorkspaceWatchlistAssets } from "@/app/api/watchlists/action"
import { getMyWorkspaces } from "@/app/api/workspaces/action"
import type { AppLocale } from "@/app/lib/i18n/config"
import { getDictionary } from "@/app/lib/i18n/dictionaries"
import type { Dictionary } from "@/app/lib/i18n/dictionary-types"
import {
  formatDateTime as formatLocalizedDateTime,
  formatNumber,
  formatPercent,
} from "@/app/lib/i18n/format"
import { formatMessage } from "@/app/lib/i18n/messages"
import { getRequestLocale } from "@/app/lib/i18n/server"
import type {
  NarrativeStatus,
  NarrativeSummaryResponse,
} from "@/app/lib/narratives/definitions"
import { canReadNarratives } from "@/app/lib/narratives/permissions"
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

const NARRATIVE_PREVIEW_SEARCH = {
  filter: "",
  page: 0,
  size: 3,
  sort: [{ field: "lastUpdatedAt", direction: "desc" as const }],
}

interface WatchlistPreviewState {
  assets: WorkspaceWatchlistAssetListItemResponse[]
  error: string | null
  total: number
}

interface NarrativePreviewState {
  narratives: NarrativeSummaryResponse[]
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
  const canReadWorkspace = permissions.includes("workspace:read")
  const canReadAsset = permissions.includes("asset:read")
  const canReadWatchlist = permissions.includes("watchlist:read")
  const canCreateWatchlist = permissions.includes("watchlist:create")
  const canDeleteWatchlist = permissions.includes("watchlist:delete")
  const canReadNarrativePreview = canReadNarratives(permissions)

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

  const [watchlistPreview, narrativePreview] = await Promise.all([
    loadWatchlistPreview(canReadAsset && canReadWatchlist, dictionary),
    loadNarrativePreview(canReadNarrativePreview, dictionary),
  ])

  return (
    <WorkspaceOverviewShell>
      <div className="flex flex-col gap-6">
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
        <NarrativeOverviewSection
          canReadNarrativePreview={canReadNarrativePreview}
          narrativePreview={narrativePreview}
          dictionary={dictionary}
          locale={locale}
        />
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

async function loadNarrativePreview(
  canReadNarrativePreview: boolean,
  dictionary: Dictionary
): Promise<NarrativePreviewState> {
  if (!canReadNarrativePreview) {
    return { narratives: [], error: null }
  }

  try {
    const response = await getNarratives(NARRATIVE_PREVIEW_SEARCH)
    return {
      narratives: response.content ?? [],
      error: null,
    }
  } catch (error: unknown) {
    return {
      narratives: [],
      error: error instanceof Error
        ? error.message
        : dictionary.workspaceOverview.narrativesLoadError,
    }
  }
}

function WorkspaceOverviewShell({ children }: { children: ReactNode }) {
  return <>{children}</>
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
    <section className="flex flex-col gap-4 rounded-xl border p-5">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="flex min-w-0 flex-col gap-3">
          <h2 className="truncate text-2xl font-semibold tracking-tight text-foreground">
            {workspace.name}
          </h2>
          <p className="max-w-3xl text-sm leading-6 text-muted-foreground">
            {dictionary.workspaceOverview.description}
          </p>
          <div className="flex flex-wrap items-center gap-2">
            <AppTimeMetadata icon={CalendarClockIcon}>
              {formatWorkspaceOverviewDateTime(
                workspace.lastModifiedDate,
                dictionary,
                locale
              )}
            </AppTimeMetadata>
          </div>
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

      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="font-medium text-foreground">
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
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
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
        ) : null}
      </div>
    </section>
  )
}

function NarrativeOverviewSection({
  canReadNarrativePreview,
  narrativePreview,
  dictionary,
  locale,
}: {
  canReadNarrativePreview: boolean
  narrativePreview: NarrativePreviewState
  dictionary: Dictionary
  locale: AppLocale
}) {
  if (!canReadNarrativePreview) {
    return null
  }

  const visibleNarratives = narrativePreview.narratives.slice(
    0,
    NARRATIVE_PREVIEW_SEARCH.size
  )
  const hasNarratives = visibleNarratives.length > 0

  return (
    <section className="flex flex-col gap-4 rounded-xl border p-5">
      <div className="flex flex-col gap-1">
        <h3 className="font-medium text-foreground">
          {dictionary.workspaceOverview.narratives}
        </h3>
        <p className="text-sm text-muted-foreground">
          {dictionary.workspaceOverview.narrativesDescription}
        </p>
      </div>

      {narrativePreview.error ? (
        <Empty className="min-h-40 border">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <CircleSlashIcon />
            </EmptyMedia>
            <EmptyTitle>{dictionary.workspaceOverview.narrativesLoadErrorTitle}</EmptyTitle>
            <EmptyDescription>{narrativePreview.error}</EmptyDescription>
          </EmptyHeader>
        </Empty>
      ) : null}

      {!narrativePreview.error && !hasNarratives ? (
        <Empty className="min-h-40 border">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <ScrollTextIcon />
            </EmptyMedia>
            <EmptyTitle>{dictionary.workspaceOverview.noNarrativesTitle}</EmptyTitle>
            <EmptyDescription>
              {dictionary.workspaceOverview.noNarrativesDescription}
            </EmptyDescription>
          </EmptyHeader>
        </Empty>
      ) : null}

      {!narrativePreview.error && hasNarratives ? (
        <div className="divide-y">
          {visibleNarratives.map((narrative) => (
            <NarrativePreviewRow
              key={narrative.id}
              narrative={narrative}
              dictionary={dictionary}
              locale={locale}
            />
          ))}
        </div>
      ) : null}
    </section>
  )
}

function NarrativePreviewRow({
  narrative,
  dictionary,
  locale,
}: {
  narrative: NarrativeSummaryResponse
  dictionary: Dictionary
  locale: AppLocale
}) {
  const title = narrative.title?.trim() || dictionary.workspaceOverview.narrativeUntitled
  const body =
    narrative.thesis?.trim() ||
    narrative.summary?.trim() ||
    dictionary.workspaceOverview.narrativeSummaryEmpty
  const primaryAsset =
    narrative.primaryAssetSymbol?.trim() ||
    narrative.primaryAssetName?.trim() ||
    null

  return (
    <article className="flex flex-col gap-2 py-3 first:pt-0 last:pb-0">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
        <h4 className="min-w-0 text-sm font-medium text-foreground">
          {title}
        </h4>
        <div className="flex shrink-0 flex-wrap gap-2">
          {narrative.status ? (
            <Badge variant={getNarrativeStatusVariant(narrative.status)}>
              {getNarrativeStatusLabel(narrative.status, dictionary)}
            </Badge>
          ) : null}
          {typeof narrative.confidence === "number" ? (
            <Badge variant="outline">
              {formatMessage(dictionary.workspaceOverview.narrativeConfidence, {
                value: formatPercent(narrative.confidence, locale, {
                  maximumFractionDigits: 0,
                }),
              })}
            </Badge>
          ) : null}
        </div>
      </div>

      <p className="line-clamp-2 text-sm leading-6 text-muted-foreground">
        {body}
      </p>

      <div className="flex flex-wrap items-center gap-2">
        {primaryAsset ? (
          <Badge variant="secondary">{primaryAsset}</Badge>
        ) : null}
        {narrative.lastUpdatedAt ? (
          <AppTimeMetadata icon={CalendarClockIcon}>
            {formatWorkspaceOverviewDateTime(
              narrative.lastUpdatedAt,
              dictionary,
              locale
            )}
          </AppTimeMetadata>
        ) : null}
      </div>
    </article>
  )
}

function getNarrativeStatusLabel(
  status: NarrativeStatus,
  dictionary: Dictionary
) {
  const labels = dictionary.workspaceOverview.narrativeStatuses as Record<string, string>
  return labels[status] ?? status
}

function getNarrativeStatusVariant(
  status: NarrativeStatus
): "default" | "secondary" | "outline" | "destructive" {
  switch (status) {
    case "ACTIVE":
      return "default"
    case "EMERGING":
    case "WEAKENING":
      return "secondary"
    case "INVALIDATED":
      return "destructive"
    case "ARCHIVED":
    default:
      return "outline"
  }
}

function WorkspaceOverviewSkeleton() {
  return (
    <div className="flex flex-col gap-6">
      <div className="rounded-xl border p-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="flex flex-1 flex-col gap-3">
            <Skeleton className="h-8 w-full max-w-md" />
            <Skeleton className="h-4 w-full max-w-3xl" />
            <Skeleton className="h-4 w-48" />
          </div>
          <Skeleton className="h-9 w-44" />
        </div>
        <div className="mt-4 flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Skeleton className="h-5 w-40" />
            <Skeleton className="h-4 w-full max-w-lg" />
          </div>
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <Skeleton key={index} className="h-16 rounded-lg" />
            ))}
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-4 rounded-xl border p-5">
        <div className="flex flex-col gap-2">
          <Skeleton className="h-5 w-44" />
          <Skeleton className="h-4 w-full max-w-xl" />
        </div>
        <div className="divide-y">
          {Array.from({ length: 3 }).map((_, index) => (
            <div
              key={index}
              className="flex flex-col gap-2 py-3 first:pt-0 last:pb-0"
            >
              <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                <Skeleton className="h-4 w-full max-w-sm" />
                <div className="flex gap-2">
                  <Skeleton className="h-5 w-20" />
                  <Skeleton className="h-5 w-24" />
                </div>
              </div>
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-2/3" />
              <div className="flex gap-2">
                <Skeleton className="h-5 w-16" />
                <Skeleton className="h-4 w-36" />
              </div>
            </div>
          ))}
        </div>
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
