"use client"

import * as React from "react"
import { FolderOpenIcon, RefreshCwIcon, ShieldAlertIcon } from "lucide-react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

import {
  addAssetToWorkspaceWatchlist,
  getWorkspaceWatchlistAssets,
  removeAssetFromWorkspaceWatchlist,
} from "@/app/api/watchlists/action"
import { AssetListResponse } from "@/app/lib/assets/definitions"
import { useLocalization } from "@/app/lib/i18n/provider"
import { WorkspaceResponse } from "@/app/lib/workspaces/definitions"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
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
  const { dictionary, formatMessage, formatNumber } = useLocalization()
  const [isPending, startTransition] = React.useTransition()
  const [isLoading, setIsLoading] = React.useState(false)
  const [loadError, setLoadError] = React.useState<string | null>(null)
  const [initialAssets, setInitialAssets] = React.useState<AssetListResponse[]>(
    []
  )
  const [selectedAssets, setSelectedAssets] = React.useState<
    AssetListResponse[]
  >([])

  const canReadWorkspaceWatchlist =
    !!workspace && canReadAsset && canReadWatchlist
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
        error instanceof Error
          ? error.message
          : dictionary.watchlist.loadErrorFallback
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
    const assetsToRemove = initialAssets.filter(
      (asset) => !selectedIds.has(asset.id)
    )
    const assetsToAdd = selectedAssets.filter(
      (asset) => !initialIds.has(asset.id)
    )

    if (assetsToRemove.length === 0 && assetsToAdd.length === 0) {
      toast.success(dictionary.watchlist.noChanges)
      onOpenChange(false)
      return
    }

    startTransition(async () => {
      const removeResults = await Promise.all(
        assetsToRemove.map((asset) =>
          removeAssetFromWorkspaceWatchlist(asset.id)
        )
      )
      const addResults = await Promise.all(
        assetsToAdd.map((asset) =>
          addAssetToWorkspaceWatchlist({ assetId: asset.id })
        )
      )

      const failedOperations = [...removeResults, ...addResults].filter(
        (result) => !result.success
      )

      if (failedOperations.length > 0) {
        toast.error(dictionary.watchlist.partialFailure)
        await loadWorkspaceWatchlistState()
        router.refresh()
        return
      }

      setInitialAssets([...selectedAssets])
      toast.success(formatMessage(dictionary.watchlist.updated, { name: workspace.name }))
      onOpenChange(false)
      router.refresh()
    })
  }

  const isMissingWorkspace = !workspace
  const isBlockedByPermissions = !!workspace && !canManageWorkspaceWatchlist
  const canShowEditorBody = !isMissingWorkspace && !isBlockedByPermissions

  return (
    <Dialog open={open} onOpenChange={handleDialogOpenChange}>
      <DialogContent className="sm:max-w-[720px]">
        <DialogHeader>
          <DialogTitle>{dictionary.watchlist.title}</DialogTitle>
          <DialogDescription>
            {formatMessage(dictionary.watchlist.description, {
              name: workspace?.name ?? dictionary.watchlist.noWorkspaceName,
            })}
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-4">
          {isMissingWorkspace ? (
            <Empty className="min-h-64 border">
              <EmptyHeader>
                <EmptyMedia variant="icon">
                  <FolderOpenIcon />
                </EmptyMedia>
                <EmptyTitle>
                  {dictionary.watchlist.noWorkspaceTitle}
                </EmptyTitle>
                <EmptyDescription>
                  {dictionary.watchlist.noWorkspaceDescription}
                </EmptyDescription>
              </EmptyHeader>
            </Empty>
          ) : null}

          {isBlockedByPermissions ? (
            <Empty className="min-h-64 border">
              <EmptyHeader>
                <EmptyMedia variant="icon">
                  <ShieldAlertIcon />
                </EmptyMedia>
                <EmptyTitle>
                  {dictionary.watchlist.permissionTitle}
                </EmptyTitle>
                <EmptyDescription>
                  {dictionary.watchlist.permissionDescription}
                </EmptyDescription>
              </EmptyHeader>
            </Empty>
          ) : null}

          {canShowEditorBody ? (
            <>
              <div className="rounded-lg border bg-muted/20 p-4 text-sm text-muted-foreground">
                {dictionary.watchlist.helper}
              </div>

              {loadError ? (
                <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-4">
                  <div className="text-sm font-medium text-destructive">
                    {dictionary.watchlist.loadErrorTitle}
                  </div>
                  <div className="mt-1 text-sm text-muted-foreground">
                    {loadError}
                  </div>
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
                      {dictionary.common.retry}
                    </Button>
                  </div>
                </div>
              ) : null}

              {isLoading ? (
                <div className="flex min-h-40 items-center justify-center rounded-lg border border-dashed">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Spinner />
                    {dictionary.watchlist.loading}
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

        <p className="text-sm text-muted-foreground">
          {canShowEditorBody
            ? formatMessage(dictionary.watchlist.selectedCount, {
              count: formatNumber(selectedAssets.length),
            })
            : dictionary.watchlist.blockedSummary}
        </p>

        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="ghost" disabled={isPending}>
              {canShowEditorBody ? dictionary.common.cancel : dictionary.common.close}
            </Button>
          </DialogClose>
          {canManageWorkspaceWatchlist ? (
            <Button
              type="button"
              disabled={isPending || isLoading || !!loadError}
              onClick={handleSave}
            >
              {isPending ? (
                <>
                  <Spinner data-icon="inline-start" />
                  {dictionary.watchlist.saving}
                </>
              ) : (
                dictionary.watchlist.saveList
              )}
            </Button>
          ) : null}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
