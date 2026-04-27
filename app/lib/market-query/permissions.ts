import { hasAnyPermission, type PermissionCollection } from "@/app/lib/permissions"

export const MARKET_QUERY_EXECUTE_PERMISSIONS = ["query:execute"] as const

export const MARKET_QUERY_NAV_PERMISSIONS = MARKET_QUERY_EXECUTE_PERMISSIONS

export const MARKET_QUERY_SOURCE_DOCUMENT_READ_PERMISSIONS = [
  "source-document:read",
  "news-article:read",
] as const

export function canExecuteMarketQueries(permissions: PermissionCollection): boolean {
  return hasAnyPermission(permissions, MARKET_QUERY_EXECUTE_PERMISSIONS)
}
