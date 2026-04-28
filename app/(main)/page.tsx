import { Suspense, type ElementType, type ReactNode } from "react"
import {
  ActivityIcon,
  BriefcaseBusinessIcon,
  CalendarClockIcon,
  CircleSlashIcon,
  FolderOpenIcon,
  ShieldAlertIcon,
  TargetIcon,
} from "lucide-react"

import { getWorkspaceWatchlistAssets } from "@/app/api/watchlists/action"
import { getMyWorkspaces } from "@/app/api/workspaces/action"
import { getCurrentPermissions } from "@/app/lib/permissions-server"
import { resolveActiveWorkspace } from "@/app/lib/workspaces/active"
import { WorkspaceResponse } from "@/app/lib/workspaces/definitions"
import { WorkspaceWatchlistAssetListItemResponse } from "@/app/lib/watchlists/definitions"
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
  const permissions = await getCurrentPermissions()
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
            <EmptyTitle>Bạn chưa có quyền xem không gian làm việc</EmptyTitle>
            <EmptyDescription>
              Tài khoản hiện tại cần quyền đọc không gian làm việc để xem tổng quan
              và các dữ liệu theo phạm vi workspace.
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
      error instanceof Error ? error.message : "Không thể tải không gian làm việc."
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
            <EmptyTitle>Không thể tải tổng quan không gian làm việc</EmptyTitle>
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
            <EmptyTitle>Chưa có không gian làm việc đang hoạt động</EmptyTitle>
            <EmptyDescription>
              Hãy tạo hoặc chọn một không gian làm việc để bắt đầu theo dõi tài sản,
              truy vấn thị trường và khám phá dữ liệu theo đúng phạm vi.
            </EmptyDescription>
          </EmptyHeader>
        </Empty>
      </WorkspaceOverviewShell>
    )
  }

  const watchlistPreview = await loadWatchlistPreview(canReadAsset && canReadWatchlist)

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
        />

        <div className="grid gap-6 xl:grid-cols-[minmax(0,1.2fr)_minmax(320px,0.8fr)]">
          <TrackedAssetsSummary
            workspace={currentWorkspace}
            preview={watchlistPreview}
            canReadAsset={canReadAsset}
            canReadWatchlist={canReadWatchlist}
            canCreateWatchlist={canCreateWatchlist}
            canDeleteWatchlist={canDeleteWatchlist}
          />
          <WorkspaceTechnicalDetails workspace={currentWorkspace} />
        </div>
      </div>
    </WorkspaceOverviewShell>
  )
}

async function loadWatchlistPreview(canReadTrackedAssets: boolean): Promise<WatchlistPreviewState> {
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
      error: error instanceof Error ? error.message : "Không thể tải tài sản theo dõi.",
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
}: {
  workspace: WorkspaceResponse
  trackedAssetTotal: number
  canReadAsset: boolean
  canReadWatchlist: boolean
  canCreateWatchlist: boolean
  canDeleteWatchlist: boolean
}) {
  return (
    <section className="rounded-xl border bg-muted/20 p-5">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
        <div className="flex min-w-0 flex-col gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="secondary">Đang hoạt động</Badge>
            <span className="text-sm text-muted-foreground">
              Phạm vi hiện tại của các tính năng workspace
            </span>
          </div>
          <div className="flex flex-col gap-2">
            <h2 className="truncate text-2xl font-semibold tracking-tight text-foreground">
              {workspace.name}
            </h2>
            <p className="max-w-3xl text-sm leading-6 text-muted-foreground">
              Không gian này quyết định danh sách tài sản theo dõi và là ngữ cảnh
              chính cho các luồng phân tích thị trường trong Signapse.
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

      <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <OverviewStat
          icon={BriefcaseBusinessIcon}
          label="Không gian"
          value={workspace.slug || "Chưa có slug"}
          description="Định danh ngắn của workspace"
        />
        <OverviewStat
          icon={TargetIcon}
          label="Tài sản theo dõi"
          value={trackedAssetTotal.toLocaleString("vi-VN")}
          description="Đang dùng cho phạm vi workspace"
        />
        <OverviewStat
          icon={ActivityIcon}
          label="Trạng thái"
          value="Đang hoạt động"
          description="Được backend đánh dấu là current"
        />
        <OverviewStat
          icon={CalendarClockIcon}
          label="Cập nhật"
          value={formatDateTime(workspace.lastModifiedDate)}
          description="Lần ghi nhận gần nhất"
        />
      </div>
    </section>
  )
}

function OverviewStat({
  icon: Icon,
  label,
  value,
  description,
}: {
  icon: ElementType
  label: string
  value: string
  description: string
}) {
  return (
    <div className="flex min-w-0 flex-col gap-3 rounded-lg border bg-background p-4">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Icon className="size-4" />
        <span>{label}</span>
      </div>
      <div className="truncate text-lg font-semibold text-foreground">{value}</div>
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
}: {
  workspace: WorkspaceResponse
  preview: WatchlistPreviewState
  canReadAsset: boolean
  canReadWatchlist: boolean
  canCreateWatchlist: boolean
  canDeleteWatchlist: boolean
}) {
  const canReadTrackedAssets = canReadAsset && canReadWatchlist
  const canManageTrackedAssets = canReadTrackedAssets && canCreateWatchlist && canDeleteWatchlist
  const hasAssets = preview.assets.length > 0

  return (
    <section className="flex flex-col gap-4 rounded-xl border p-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex flex-col gap-1">
          <h3 className="font-medium text-foreground">Tài sản theo dõi</h3>
          <p className="text-sm text-muted-foreground">
            Danh sách này được lưu theo không gian làm việc đang hoạt động.
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
            <EmptyTitle>Chưa có quyền xem tài sản theo dõi</EmptyTitle>
            <EmptyDescription>
              Tài khoản cần quyền đọc tài sản và danh sách theo dõi để xem module này.
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
            <EmptyTitle>Không thể tải tài sản theo dõi</EmptyTitle>
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
            <EmptyTitle>Workspace chưa theo dõi tài sản nào</EmptyTitle>
            <EmptyDescription>
              Thêm các mã tài sản quan trọng để các màn hình phân tích có phạm vi
              theo dõi rõ ràng hơn.
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

function WorkspaceTechnicalDetails({ workspace }: { workspace: WorkspaceResponse }) {
  return (
    <section className="flex flex-col gap-4 rounded-xl border p-5">
      <div className="flex flex-col gap-1">
        <h3 className="font-medium text-foreground">Thông tin kỹ thuật</h3>
        <p className="text-sm text-muted-foreground">
          Các trường định danh thấp hơn, dùng cho kiểm tra và đối soát dữ liệu.
        </p>
      </div>

      <div className="grid gap-3">
        <TechnicalDetail label="ID workspace" value={workspace.id.toString()} />
        <TechnicalDetail label="Slug" value={workspace.slug || "Chưa có slug"} />
        <TechnicalDetail label="Tạo lúc" value={formatDateTime(workspace.createdDate)} />
        <TechnicalDetail
          label="Cập nhật"
          value={formatDateTime(workspace.lastModifiedDate)}
        />
      </div>
    </section>
  )
}

function TechnicalDetail({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-lg bg-muted/30 px-3 py-2">
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className="truncate text-right text-sm font-medium text-foreground">{value}</span>
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
        <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
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

function formatDateTime(value?: string | null) {
  if (!value) {
    return "Chưa có dữ liệu"
  }

  const date = new Date(value)

  if (Number.isNaN(date.getTime())) {
    return "Ngày không hợp lệ"
  }

  return new Intl.DateTimeFormat("vi-VN", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date)
}
