import { buildSortQuery } from "@/app/lib/utils"

type MarketConversationSearchParams = {
  [key: string]: string | string[] | undefined
}

export function getMarketConversationListRequest(
  searchParams: MarketConversationSearchParams
) {
  const { page = "1", size = "10", sort } = searchParams
  const pageIndex = Math.max(0, Number(page) - 1)
  const normalizedSort = normalizeMarketConversationSort(sort)

  return {
    filter: "",
    page: pageIndex,
    size: Number(size),
    sort: buildSortQuery(normalizedSort),
  }
}

function normalizeMarketConversationSort(sort: string | string[] | undefined) {
  const value = Array.isArray(sort) ? sort[0] : sort

  if (!value) {
    return "lastModifiedDate_desc"
  }

  return value
}
