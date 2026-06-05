import { Suspense } from "react"

import { getMarketConversations } from "@/app/api/market-conversations/action"
import { getServerDictionary } from "@/app/lib/i18n/server"
import {
  canExecuteMarketQueries,
  MARKET_QUERY_EXECUTE_PERMISSIONS,
} from "@/app/lib/market-query/permissions"
import { getCurrentPermissions } from "@/app/lib/permissions-server"
import { buildSortQuery } from "@/app/lib/utils"
import { AccessDenied } from "@/components/access-denied"
import { AppListTable, AppListTableHead, AppListTableHeaderRow } from "@/components/app-list-table"
import { Skeleton } from "@/components/ui/skeleton"
import { Table, TableBody, TableCell, TableHeader, TableRow } from "@/components/ui/table"

import { MarketConversationListPage } from "./market-conversation-list"

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
  const { page = "1", size = "10", sort } = resolvedParams
  const pageIndex = Math.max(0, Number(page) - 1)
  const normalizedSort = normalizeMarketConversationSort(sort)

  const conversationPage = await getMarketConversations({
    filter: "",
    page: pageIndex,
    size: Number(size),
    sort: buildSortQuery(normalizedSort),
  })

  return <MarketConversationListPage conversationPage={conversationPage} />
}

function normalizeMarketConversationSort(sort: string | string[] | undefined) {
  const value = Array.isArray(sort) ? sort[0] : sort

  if (!value || value === "updatedAt_desc") {
    return "lastModifiedDate_desc"
  }

  if (value === "updatedAt_asc") {
    return "lastModifiedDate_asc"
  }

  return value
}

function MarketConversationListSkeleton() {
  return (
    <div className="grid w-full gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(360px,420px)]">
      <div className="rounded-xl border bg-card xl:order-2 xl:sticky xl:top-20 xl:self-start">
        <div className="flex flex-col gap-4 p-5">
          <Skeleton className="h-5 w-48" />
          <Skeleton className="h-28 w-full" />
          <div className="flex justify-end">
            <Skeleton className="h-9 w-full sm:w-36 xl:w-full" />
          </div>
        </div>
      </div>

      <div className="flex min-w-0 flex-col xl:order-1">
        <div className="flex flex-col gap-4 sm:flex-row sm:justify-between">
          <Skeleton className="h-9 w-48" />
          <Skeleton className="h-9 w-full sm:w-[120px]" />
        </div>

        <AppListTable>
          <Table>
            <TableHeader>
              <AppListTableHeaderRow>
                <AppListTableHead className="w-[52%]">
                  <Skeleton className="h-4 w-32" />
                </AppListTableHead>
                <AppListTableHead className="w-44">
                  <Skeleton className="h-4 w-28" />
                </AppListTableHead>
                <AppListTableHead className="w-44">
                  <Skeleton className="h-4 w-28" />
                </AppListTableHead>
                <AppListTableHead className="w-28 text-right">
                  <Skeleton className="ml-auto h-4 w-20" />
                </AppListTableHead>
              </AppListTableHeaderRow>
            </TableHeader>
            <TableBody>
              {Array.from({ length: 5 }).map((_, index) => (
                <TableRow key={index}>
                  <TableCell className="align-top whitespace-normal">
                    <div className="flex min-w-0 flex-col gap-2">
                      <Skeleton className="h-4 w-3/4" />
                      <Skeleton className="h-3 w-1/2" />
                    </div>
                  </TableCell>
                  <TableCell className="w-44">
                    <Skeleton className="h-4 w-32" />
                  </TableCell>
                  <TableCell className="w-44">
                    <Skeleton className="h-4 w-32" />
                  </TableCell>
                  <TableCell className="w-28 text-right">
                    <Skeleton className="ml-auto h-8 w-8" />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </AppListTable>

        <Skeleton className="mt-4 h-16 w-full rounded-xl" />
      </div>
    </div>
  )
}
