import { Suspense } from "react"

import {
  getTelegramBotConnections,
  getTelegramDestinations,
  getTelegramFeatureSettings,
  getTelegramMarketAnalysisSchedules,
} from "@/app/api/telegram/action"
import { getWorkspaceWatchlistAssets } from "@/app/api/watchlists/action"
import { getServerDictionary } from "@/app/lib/i18n/server"
import { hasPermission } from "@/app/lib/permissions"
import { getCurrentPermissions } from "@/app/lib/permissions-server"
import {
  canReadTelegramConfiguration,
  getTelegramManageAccess,
  getTelegramSectionAccess,
} from "@/app/lib/telegram/permissions"
import { getActiveWorkspaceForCurrentUser } from "@/app/lib/workspaces/current"
import { AccessDenied } from "@/components/access-denied"

import {
  TelegramConfigurationPage,
  TelegramConfigurationSkeleton,
} from "./telegram-configuration"

const WATCHLIST_ASSET_SEARCH = {
  filter: "",
  page: 0,
  size: 100,
  sort: [{ field: "assetSymbol", direction: "asc" as const }],
}

export default async function TelegramPage() {
  const [permissions, dictionary] = await Promise.all([
    getCurrentPermissions(),
    getServerDictionary(),
  ])
  const sectionAccess = getTelegramSectionAccess(permissions)
  const manageAccess = getTelegramManageAccess(permissions)

  if (!canReadTelegramConfiguration(permissions)) {
    return (
      <AccessDenied
        description={dictionary.telegram.readDenied}
        permission="telegram-bot-connection:read"
      />
    )
  }

  return (
    <Suspense fallback={<TelegramConfigurationSkeleton />}>
      <TelegramConfigurationContent
        sectionAccess={sectionAccess}
        manageAccess={manageAccess}
        canReadWorkspace={hasPermission(permissions, "workspace:read")}
      />
    </Suspense>
  )
}

async function TelegramConfigurationContent({
  sectionAccess,
  manageAccess,
  canReadWorkspace,
}: {
  sectionAccess: ReturnType<typeof getTelegramSectionAccess>
  manageAccess: ReturnType<typeof getTelegramManageAccess>
  canReadWorkspace: boolean
}) {
  const currentWorkspace = canReadWorkspace
    ? await getActiveWorkspaceForCurrentUser()
    : null

  const [
    botConnections,
    destinations,
    featureSettings,
    schedules,
    watchlistAssetsPage,
  ] = await Promise.all([
    sectionAccess.botConnections ? getTelegramBotConnections() : [],
    sectionAccess.destinations ? getTelegramDestinations() : [],
    sectionAccess.featureSettings ? getTelegramFeatureSettings() : [],
    sectionAccess.schedules ? getTelegramMarketAnalysisSchedules() : [],
    sectionAccess.watchlistAssets && currentWorkspace
      ? getWorkspaceWatchlistAssets(WATCHLIST_ASSET_SEARCH)
      : null,
  ])

  return (
    <TelegramConfigurationPage
      data={{
        botConnections,
        destinations,
        featureSettings,
        schedules,
        currentWorkspace,
        watchlistAssets: watchlistAssetsPage?.content ?? [],
        sectionAccess,
        manageAccess,
      }}
    />
  )
}
