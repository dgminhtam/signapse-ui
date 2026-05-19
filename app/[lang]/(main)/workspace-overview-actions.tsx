"use client"

import * as React from "react"
import { ListPlusIcon } from "lucide-react"

import { useLocalization } from "@/app/lib/i18n/provider"
import { WorkspaceResponse } from "@/app/lib/workspaces/definitions"
import { Button } from "@/components/ui/button"
import { WorkspaceWatchlistEditor } from "@/components/workspace-watchlist-editor"

interface WorkspaceOverviewActionsProps {
  workspace: WorkspaceResponse
  canReadAsset: boolean
  canReadWatchlist: boolean
  canCreateWatchlist: boolean
  canDeleteWatchlist: boolean
  variant?: React.ComponentProps<typeof Button>["variant"]
}

export function WorkspaceOverviewActions({
  workspace,
  canReadAsset,
  canReadWatchlist,
  canCreateWatchlist,
  canDeleteWatchlist,
  variant,
}: WorkspaceOverviewActionsProps) {
  const { dictionary } = useLocalization()
  const [isWatchlistOpen, setIsWatchlistOpen] = React.useState(false)

  const canManageTrackedAssets =
    canReadAsset && canReadWatchlist && canCreateWatchlist && canDeleteWatchlist

  if (!canManageTrackedAssets) {
    return null
  }

  return (
    <>
      <Button type="button" variant={variant} onClick={() => setIsWatchlistOpen(true)}>
        <ListPlusIcon data-icon="inline-start" />
        {dictionary.workspaceOverview.manageTrackedAssets}
      </Button>
      <WorkspaceWatchlistEditor
        open={isWatchlistOpen}
        onOpenChange={setIsWatchlistOpen}
        workspace={workspace}
        canReadAsset={canReadAsset}
        canReadWatchlist={canReadWatchlist}
        canCreateWatchlist={canCreateWatchlist}
        canDeleteWatchlist={canDeleteWatchlist}
      />
    </>
  )
}
