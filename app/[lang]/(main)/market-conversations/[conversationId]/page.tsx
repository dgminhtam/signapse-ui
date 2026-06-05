import { notFound } from "next/navigation"

import { getMarketConversationById } from "@/app/api/market-conversations/action"
import { getTelegramDestinations } from "@/app/api/telegram/action"
import { canReadEconomicCalendar } from "@/app/lib/economic-calendar/permissions"
import { canReadEvents } from "@/app/lib/events/permissions"
import { getServerDictionary } from "@/app/lib/i18n/server"
import {
  canExecuteMarketQueries,
  MARKET_QUERY_EXECUTE_PERMISSIONS,
} from "@/app/lib/market-query/permissions"
import { canReadNarratives } from "@/app/lib/narratives/permissions"
import { canReadNewsArticles } from "@/app/lib/news-articles/permissions"
import { getCurrentPermissions } from "@/app/lib/permissions-server"
import { TELEGRAM_DESTINATION_READ_PERMISSION } from "@/app/lib/telegram/permissions"
import { AccessDenied } from "@/components/access-denied"

import { MarketConversationDetailPage } from "./market-conversation-detail"

interface MarketConversationDetailRouteProps {
  params: Promise<{ conversationId: string }>
}

export default async function MarketConversationDetailRoute({
  params,
}: MarketConversationDetailRouteProps) {
  const { conversationId } = await params
  const id = Number(conversationId)

  if (!Number.isInteger(id) || id <= 0) {
    notFound()
  }

  const [permissions, dictionary] = await Promise.all([
    getCurrentPermissions(),
    getServerDictionary(),
  ])

  if (!canExecuteMarketQueries(permissions)) {
    return (
      <AccessDenied
        description={dictionary.marketConversations.readDenied}
        permission={MARKET_QUERY_EXECUTE_PERMISSIONS[0]}
      />
    )
  }

  const canReadTelegramDestinations = permissions.includes(
    TELEGRAM_DESTINATION_READ_PERMISSION
  )
  const [conversation, telegramDestinations] = await Promise.all([
    getMarketConversationById(id),
    canReadTelegramDestinations ? getTelegramDestinations() : [],
  ])

  return (
    <MarketConversationDetailPage
      conversation={conversation}
      telegramDestinations={telegramDestinations}
      permissions={{
        events: canReadEvents(permissions),
        newsArticles: canReadNewsArticles(permissions),
        narratives: canReadNarratives(permissions),
        economicCalendar: canReadEconomicCalendar(permissions),
      }}
    />
  )
}
