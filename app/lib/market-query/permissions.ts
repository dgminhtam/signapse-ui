import { hasAnyPermission, type PermissionCollection } from "@/app/lib/permissions"

export const MARKET_QUERY_EXECUTE_PERMISSIONS = ["query:execute"] as const

// Prefer the canon news-article permission, but keep the legacy alias for
// roles that have not finished migrating yet.
export const MARKET_QUERY_SOURCE_DOCUMENT_READ_PERMISSIONS = [
  "news-article:read",
  "source-document:read",
] as const

export function canExecuteMarketQueries(permissions: PermissionCollection): boolean {
  return hasAnyPermission(permissions, MARKET_QUERY_EXECUTE_PERMISSIONS)
}
