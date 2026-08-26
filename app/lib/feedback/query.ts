import type {
  FeedbackStatus,
  FeedbackType,
} from "./definitions"
import {
  FEEDBACK_MODERATION_PAGE_SIZE_OPTIONS,
  FEEDBACK_PAGE_SIZE,
  isFeedbackStatus,
  isFeedbackType,
} from "./definitions"

export const FEEDBACK_DEFAULT_SORT = "createdDate_desc"

export interface FeedbackPersonalQuery {
  page: number
  size?: number
}

export interface FeedbackModerationQuery {
  search: string
  type: FeedbackType | null
  status: FeedbackStatus
  sort: "createdDate_asc" | "createdDate_desc"
  page: number
  size: number
}

function firstValue(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value
}

export function parseFeedbackModerationQuery(
  input: URLSearchParams | Record<string, string | string[] | undefined>
): FeedbackModerationQuery {
  const get = (key: string) =>
    input instanceof URLSearchParams
      ? input.get(key) ?? undefined
      : firstValue(input[key])
  const requestedPage = Number(get("page"))
  const requestedSize = Number(get("size"))
  const requestedType = get("type")
  const requestedStatus = get("status")
  const requestedSort = get("sort")

  return {
    search: (get("search") ?? "").trim(),
    type: isFeedbackType(requestedType) ? requestedType : null,
    status: isFeedbackStatus(requestedStatus)
      ? requestedStatus
      : "PENDING_REVIEW",
    sort:
      requestedSort === "createdDate_asc"
        ? "createdDate_asc"
        : FEEDBACK_DEFAULT_SORT,
    page: Number.isInteger(requestedPage) && requestedPage > 0
      ? requestedPage
      : 1,
    size: FEEDBACK_MODERATION_PAGE_SIZE_OPTIONS.includes(
      requestedSize as (typeof FEEDBACK_MODERATION_PAGE_SIZE_OPTIONS)[number]
    )
      ? requestedSize
      : FEEDBACK_PAGE_SIZE,
  }
}

function escapeFilterValue(value: string): string {
  return value.replace(/'/g, "''")
}

export function buildFeedbackFilter(query: FeedbackModerationQuery): string {
  const filters: string[] = []
  if (query.search) {
    filters.push(
      `containsIgnoreCase(title,'${escapeFilterValue(query.search)}')`
    )
  }
  if (query.type) {
    filters.push(`type eq ${query.type}`)
  }
  if (query.status) {
    filters.push(`status eq ${query.status}`)
  }
  return filters.join(" and ")
}

export function serializeFeedbackModerationQuery(
  query: FeedbackModerationQuery
): string {
  const params = new URLSearchParams()
  const filter = buildFeedbackFilter(query)
  if (filter) params.set("$filter", filter)
  params.set("page", String(Math.max(0, query.page - 1)))
  params.set("size", String(query.size))
  params.append(
    "sort",
    `createdDate,${query.sort === "createdDate_asc" ? "asc" : "desc"}`
  )
  params.append(
    "sort",
    `id,${query.sort === "createdDate_asc" ? "asc" : "desc"}`
  )
  return params.toString()
}

export function serializeFeedbackPersonalQuery(
  query: FeedbackPersonalQuery
): string {
  const params = new URLSearchParams()
  params.set("page", String(Math.max(0, query.page - 1)))
  params.set("size", String(query.size ?? FEEDBACK_PAGE_SIZE))
  params.append("sort", "createdDate,desc")
  params.append("sort", "id,desc")
  return params.toString()
}

export function serializeFeedbackModerationUrlQuery(
  query: FeedbackModerationQuery
): string {
  const params = new URLSearchParams()
  if (query.search) params.set("search", query.search)
  if (query.type) params.set("type", query.type)
  params.set("status", query.status)
  params.set("sort", query.sort)
  params.set("page", String(query.page))
  params.set("size", String(query.size))
  return params.toString()
}
