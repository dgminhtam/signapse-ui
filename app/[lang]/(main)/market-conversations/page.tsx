import { Suspense } from "react"

import { getMarketConversations } from "@/app/api/market-conversations/action"
import { getServerDictionary } from "@/app/lib/i18n/server"
import {
  canExecuteMarketQueries,
  MARKET_QUERY_EXECUTE_PERMISSIONS,
} from "@/app/lib/market-query/permissions"
import { getCurrentPermissions } from "@/app/lib/permissions-server"
import { AccessDenied } from "@/components/access-denied"
import { Skeleton } from "@/components/ui/skeleton"

import { MarketConversationListPage } from "./market-conversation-list"
import { getMarketConversationListRequest } from "./market-conversation-pagination"

interface MarketConversationsPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export default async function MarketConversationsPage({
  searchParams,
}: MarketConversationsPageProps) {
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

  return (
    <Suspense fallback={<MarketConversationListSkeleton />}>
      <MarketConversationListContent searchParamsPromise={searchParams} />
    </Suspense>
  )
}

async function MarketConversationListContent({
  searchParamsPromise,
}: {
  searchParamsPromise: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const resolvedParams = await searchParamsPromise
  const conversationPage = await getMarketConversations(
    getMarketConversationListRequest(resolvedParams)
  )

  return <MarketConversationListPage conversationPage={conversationPage} />
}

function MarketConversationListSkeleton() {
  return (
    <div className="flex min-h-[calc(100vh-12rem)] w-full flex-col gap-6">
      <div className="flex justify-end">
        <Skeleton className="h-9 w-44" />
      </div>

      <div className="flex flex-1 items-center justify-center py-10">
        <div className="flex w-full max-w-3xl flex-col gap-5">
          <Skeleton className="mx-auto h-8 w-72" />
          <Skeleton className="h-36 w-full rounded-lg" />
        </div>
      </div>
    </div>
  )
}
