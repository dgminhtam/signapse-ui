"use client"

import * as React from "react"
import { Dialog as DialogPrimitive } from "radix-ui"
import { RefreshCwIcon, XIcon } from "lucide-react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

import { addAssetToWatchlist, deleteWatchlistAsset, getWatchlists } from "@/app/api/watchlists/action"
import { AssetListResponse } from "@/app/lib/assets/definitions"
import { WorkspaceResponse } from "@/app/lib/workspaces/definitions"
import { Button } from "@/components/ui/button"
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

function mapWatchlistToAssets(items: Awaited<ReturnType<typeof getWatchlists>>["content"]): AssetListResponse[] {
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

  const canManageWatchlist =
    !!workspace &&
    canReadAsset &&
    canReadWatchlist &&
    canCreateWatchlist &&
    canDeleteWatchlist

  const loadWatchlistState = React.useCallback(async () => {
    if (!workspace) {
      return
    }

    setIsLoading(true)
    setLoadError(null)

    try {
      const response = await getWatchlists({
        filter: "",
        page: 0,
        size: 200,
        sort: [{ field: "createdDate", direction: "desc" }],
      })

      const assets = mapWatchlistToAssets(response.content)
      setInitialAssets(assets)
      setSelectedAssets(assets)
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to load watchlist"
      setLoadError(errorMessage)
      setInitialAssets([])
      setSelectedAssets([])
    } finally {
      setIsLoading(false)
    }
  }, [workspace])

  React.useEffect(() => {
    if (!open || !canManageWatchlist) {
      return
    }

    void loadWatchlistState()
  }, [canManageWatchlist, loadWatchlistState, open])

  function handleSave() {
    if (!workspace || !canManageWatchlist) {
      return
    }

    const initialIds = new Set(initialAssets.map((asset) => asset.id))
    const selectedIds = new Set(selectedAssets.map((asset) => asset.id))
    const assetsToRemove = initialAssets.filter((asset) => !selectedIds.has(asset.id))
    const assetsToAdd = selectedAssets.filter((asset) => !initialIds.has(asset.id))

    if (assetsToRemove.length === 0 && assetsToAdd.length === 0) {
      toast.success("Khong co thay doi can luu")
      onOpenChange(false)
      return
    }

    startTransition(async () => {
      const removeResults = await Promise.all(
        assetsToRemove.map((asset) => deleteWatchlistAsset(asset.id))
      )
      const addResults = await Promise.all(
        assetsToAdd.map((asset) => addAssetToWatchlist({ assetId: asset.id }))
      )

      const failedOperations = [...removeResults, ...addResults].filter((result) => !result.success)

      if (failedOperations.length > 0) {
        toast.error("Khong the dong bo day du danh sach asset theo doi")
        await loadWatchlistState()
        router.refresh()
        return
      }

      setInitialAssets(selectedAssets)
      toast.success(`Da cap nhat asset theo doi cho workspace "${workspace.name}"`)
      onOpenChange(false)
      router.refresh()
    })
  }

  return (
    <DialogPrimitive.Root open={canManageWatchlist && open} onOpenChange={onOpenChange}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-black/10 backdrop-blur-xs data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:animate-in data-[state=open]:fade-in-0" />
        <DialogPrimitive.Content className="fixed top-1/2 left-1/2 z-50 w-[min(720px,calc(100vw-2rem))] -translate-x-1/2 -translate-y-1/2 rounded-xl border bg-popover text-popover-foreground shadow-lg data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:animate-in data-[state=open]:fade-in-0">
          <div className="flex items-start justify-between gap-4 border-b px-6 py-5">
            <div className="flex flex-col gap-1">
              <DialogPrimitive.Title className="text-lg font-medium text-foreground">
                Chinh asset theo doi
              </DialogPrimitive.Title>
              <DialogPrimitive.Description className="text-sm text-muted-foreground">
                Danh sach nay duoc luu theo workspace dang active: {workspace?.name ?? "No workspace"}.
                Neu muon chinh workspace khac, hay switch workspace truoc.
              </DialogPrimitive.Description>
            </div>
            <DialogPrimitive.Close asChild>
              <Button type="button" variant="ghost" size="icon-sm">
                <XIcon />
                <span className="sr-only">Dong</span>
              </Button>
            </DialogPrimitive.Close>
          </div>

          <div className="flex flex-col gap-4 px-6 py-5">
            <div className="rounded-lg border bg-muted/20 p-4 text-sm text-muted-foreground">
              Asset catalog duoc load tu `/assets`, con thao tac them va xoa van dung current
              workspace watchlist API cua backend.
            </div>

            {loadError ? (
              <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-4">
                <div className="text-sm font-medium text-destructive">Khong the tai watchlist hien tai</div>
                <div className="mt-1 text-sm text-muted-foreground">{loadError}</div>
                <div className="mt-3">
                  <Button type="button" variant="outline" onClick={() => void loadWatchlistState()}>
                    <RefreshCwIcon data-icon="inline-start" />
                    Thu lai
                  </Button>
                </div>
              </div>
            ) : null}

            {isLoading ? (
              <div className="flex min-h-40 items-center justify-center rounded-lg border border-dashed">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Spinner />
                  Dang tai danh sach asset theo doi...
                </div>
              </div>
            ) : (
              <AssetMultiSelectCombobox
                selectedAssets={selectedAssets}
                onSelectedAssetsChange={setSelectedAssets}
                disabled={isPending || !!loadError}
              />
            )}
          </div>

          <div className="flex items-center justify-between gap-3 border-t px-6 py-4">
            <p className="text-sm text-muted-foreground">
              Da chon {selectedAssets.length} asset cho workspace nay.
            </p>
            <div className="flex items-center gap-3">
              <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>
                Huy
              </Button>
              <Button
                type="button"
                disabled={isPending || isLoading || !!loadError}
                onClick={handleSave}
              >
                {isPending ? "Dang luu..." : "Luu danh sach"}
              </Button>
            </div>
          </div>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  )
}
