"use client"

import * as React from "react"
import { Dialog as DialogPrimitive } from "radix-ui"
import {
  FolderOpenIcon,
  RefreshCwIcon,
  ShieldAlertIcon,
  XIcon,
} from "lucide-react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

import {
  addAssetToWorkspaceWatchlist,
  getWorkspaceWatchlistAssets,
  removeAssetFromWorkspaceWatchlist,
} from "@/app/api/watchlists/action"
import { AssetListResponse } from "@/app/lib/assets/definitions"
import { WorkspaceResponse } from "@/app/lib/workspaces/definitions"
import { Button } from "@/components/ui/button"
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"
import { Spinner } from "@/components/ui/spinner"

import { AssetMultiSelectCombobox } from "./asset-multi-select-combobox"

interface WorkspaceWatchlistEditorProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  workspace: WorkspaceResponse | null
  canReadAsset: boolean
  canReadWatchlist: boolean
  canCreateWatchlist: boolean
  canDeleteWatchlist: boolean
}

function mapWorkspaceWatchlistAssets(
  items: Awaited<ReturnType<typeof getWorkspaceWatchlistAssets>>["content"]
): AssetListResponse[] {
  return items.map((item) => ({
    id: item.assetId,
    name: item.assetName,
    symbol: item.assetSymbol,
    type: item.assetType,
  }))
}

export function WorkspaceWatchlistEditor({
  open,
  onOpenChange,
  workspace,
  canReadAsset,
  canReadWatchlist,
  canCreateWatchlist,
  canDeleteWatchlist,
}: WorkspaceWatchlistEditorProps) {
  const router = useRouter()
  const [isPending, startTransition] = React.useTransition()
  const [isLoading, setIsLoading] = React.useState(false)
  const [loadError, setLoadError] = React.useState<string | null>(null)
  const [initialAssets, setInitialAssets] = React.useState<AssetListResponse[]>([])
  const [selectedAssets, setSelectedAssets] = React.useState<AssetListResponse[]>([])

  const canReadWorkspaceWatchlist = !!workspace && canReadAsset && canReadWatchlist
  const canManageWorkspaceWatchlist =
    canReadWorkspaceWatchlist && canCreateWatchlist && canDeleteWatchlist

  const loadWorkspaceWatchlistState = React.useCallback(async () => {
    if (!workspace || !canReadWorkspaceWatchlist) {
      return
    }

    setIsLoading(true)
    setLoadError(null)

    try {
      const response = await getWorkspaceWatchlistAssets({
        filter: "",
        page: 0,
        size: 200,
        sort: [{ field: "createdDate", direction: "desc" }],
      })

      const assets = mapWorkspaceWatchlistAssets(response.content)
      setInitialAssets(assets)
      setSelectedAssets(assets)
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Không thể tải tài sản theo dõi."
      setLoadError(errorMessage)
      setInitialAssets([])
      setSelectedAssets([])
    } finally {
      setIsLoading(false)
    }
  }, [canReadWorkspaceWatchlist, workspace])

  React.useEffect(() => {
    if (!open || !canReadWorkspaceWatchlist) {
      return
    }

    void loadWorkspaceWatchlistState()
  }, [canReadWorkspaceWatchlist, loadWorkspaceWatchlistState, open])

  function handleDialogOpenChange(nextOpen: boolean) {
    if (isPending) {
      return
    }

    onOpenChange(nextOpen)
  }

  function handleSave() {
    if (!workspace || !canManageWorkspaceWatchlist) {
      return
    }

    const initialIds = new Set(initialAssets.map((asset) => asset.id))
    const selectedIds = new Set(selectedAssets.map((asset) => asset.id))
    const assetsToRemove = initialAssets.filter((asset) => !selectedIds.has(asset.id))
    const assetsToAdd = selectedAssets.filter((asset) => !initialIds.has(asset.id))

    if (assetsToRemove.length === 0 && assetsToAdd.length === 0) {
      toast.success("Không có thay đổi để lưu.")
      onOpenChange(false)
      return
    }

    startTransition(async () => {
      const removeResults = await Promise.all(
        assetsToRemove.map((asset) => removeAssetFromWorkspaceWatchlist(asset.id))
      )
      const addResults = await Promise.all(
        assetsToAdd.map((asset) => addAssetToWorkspaceWatchlist({ assetId: asset.id }))
      )

      const failedOperations = [...removeResults, ...addResults].filter(
        (result) => !result.success
      )

      if (failedOperations.length > 0) {
        toast.error(
          "Không thể đồng bộ đầy đủ tài sản theo dõi. Dữ liệu mới nhất đã được tải lại."
        )
        await loadWorkspaceWatchlistState()
        router.refresh()
        return
      }

      setInitialAssets([...selectedAssets])
      toast.success(`Đã cập nhật tài sản theo dõi cho "${workspace.name}".`)
      onOpenChange(false)
      router.refresh()
    })
  }

  const isMissingWorkspace = !workspace
  const isBlockedByPermissions = !!workspace && !canManageWorkspaceWatchlist
  const canShowEditorBody = !isMissingWorkspace && !isBlockedByPermissions

  return (
    <DialogPrimitive.Root open={open} onOpenChange={handleDialogOpenChange}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-black/10 backdrop-blur-xs data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:animate-in data-[state=open]:fade-in-0" />
        <DialogPrimitive.Content className="fixed top-1/2 left-1/2 z-50 w-[min(720px,calc(100vw-2rem))] -translate-x-1/2 -translate-y-1/2 rounded-xl border bg-popover text-popover-foreground shadow-lg data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:animate-in data-[state=open]:fade-in-0">
          <div className="flex items-start justify-between gap-4 border-b px-6 py-5">
            <div className="flex flex-col gap-1">
              <DialogPrimitive.Title className="text-lg font-medium text-foreground">
                Quản lý tài sản theo dõi
              </DialogPrimitive.Title>
              <DialogPrimitive.Description className="text-sm text-muted-foreground">
                Danh sách này được lưu theo không gian làm việc đang hoạt động:{" "}
                {workspace?.name ?? "chưa có không gian làm việc"}.
              </DialogPrimitive.Description>
            </div>
            <DialogPrimitive.Close asChild>
              <Button type="button" variant="ghost" size="icon-sm" disabled={isPending}>
                <XIcon />
                <span className="sr-only">Đóng</span>
              </Button>
            </DialogPrimitive.Close>
          </div>

          <div className="flex flex-col gap-4 px-6 py-5">
            {isMissingWorkspace ? (
              <Empty className="min-h-64 rounded-lg border border-dashed">
                <EmptyHeader>
                  <EmptyMedia variant="icon">
                    <FolderOpenIcon />
                  </EmptyMedia>
                  <EmptyTitle>Chưa có không gian làm việc đang hoạt động</EmptyTitle>
                  <EmptyDescription>
                    Hãy chọn một không gian làm việc trước khi quản lý tài sản theo dõi.
                  </EmptyDescription>
                </EmptyHeader>
              </Empty>
            ) : null}

            {isBlockedByPermissions ? (
              <Empty className="min-h-64 rounded-lg border border-dashed">
                <EmptyHeader>
                  <EmptyMedia variant="icon">
                    <ShieldAlertIcon />
                  </EmptyMedia>
                  <EmptyTitle>Bạn chưa có quyền quản lý tài sản theo dõi</EmptyTitle>
                  <EmptyDescription>
                    Tài khoản hiện tại cần quyền đọc, thêm và gỡ tài sản trong danh sách
                    theo dõi của không gian làm việc này.
                  </EmptyDescription>
                </EmptyHeader>
              </Empty>
            ) : null}

            {canShowEditorBody ? (
              <>
                <div className="rounded-lg border bg-muted/20 p-4 text-sm text-muted-foreground">
                  Tìm tài sản theo tên hoặc mã. Mọi thay đổi sẽ được đồng bộ với danh sách
                  tài sản theo dõi của không gian làm việc hiện tại.
                </div>

                {loadError ? (
                  <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-4">
                    <div className="text-sm font-medium text-destructive">
                      Không thể tải tài sản theo dõi hiện tại
                    </div>
                    <div className="mt-1 text-sm text-muted-foreground">{loadError}</div>
                    <div className="mt-3">
                      <Button
                        type="button"
                        variant="outline"
                        disabled={isLoading}
                        onClick={() => void loadWorkspaceWatchlistState()}
                      >
                        {isLoading ? (
                          <Spinner data-icon="inline-start" />
                        ) : (
                          <RefreshCwIcon data-icon="inline-start" />
                        )}
                        Thử lại
                      </Button>
                    </div>
                  </div>
                ) : null}

                {isLoading ? (
                  <div className="flex min-h-40 items-center justify-center rounded-lg border border-dashed">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Spinner />
                      Đang tải tài sản theo dõi...
                    </div>
                  </div>
                ) : (
                  <AssetMultiSelectCombobox
                    selectedAssets={selectedAssets}
                    onSelectedAssetsChange={setSelectedAssets}
                    disabled={isPending || !!loadError}
                  />
                )}
              </>
            ) : null}
          </div>

          <div className="flex items-center justify-between gap-3 border-t px-6 py-4">
            <p className="text-sm text-muted-foreground">
              {canShowEditorBody
                ? `Đã chọn ${selectedAssets.length} tài sản cho không gian làm việc này.`
                : "Chỉ có thể quản lý tài sản theo dõi khi đã chọn không gian làm việc phù hợp."}
            </p>
            <div className="flex items-center gap-3">
              <Button
                type="button"
                variant="ghost"
                disabled={isPending}
                onClick={() => onOpenChange(false)}
              >
                {canShowEditorBody ? "Hủy" : "Đóng"}
              </Button>
              {canManageWorkspaceWatchlist ? (
                <Button
                  type="button"
                  disabled={isPending || isLoading || !!loadError}
                  onClick={handleSave}
                >
                  {isPending ? (
                    <>
                      <Spinner data-icon="inline-start" />
                      Đang lưu...
                    </>
                  ) : (
                    "Lưu danh sách"
                  )}
                </Button>
              ) : null}
            </div>
          </div>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  )
}
