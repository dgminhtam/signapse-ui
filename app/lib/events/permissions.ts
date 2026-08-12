import {
  hasAnyPermission,
  type PermissionCollection,
} from "@/app/lib/permissions"

export const EVENT_READ_PERMISSIONS = ["event:read"] as const

// Backend gates event operators with the canon news-article permission, while
// the legacy source-document alias remains accepted during role migration.
export const EVENT_OPERATOR_PERMISSIONS = [
  "news-article:analyze",
  "source-document:analyze",
] as const

export const EVENT_ENRICH_PERMISSIONS = EVENT_OPERATOR_PERMISSIONS

// Market reaction derivation currently uses the same backend operator permission.
export const EVENT_MARKET_REACTION_DERIVE_PERMISSIONS =
  EVENT_OPERATOR_PERMISSIONS

export const EVENT_NAV_PERMISSIONS = EVENT_READ_PERMISSIONS

export function canReadEvents(permissions: PermissionCollection): boolean {
  return hasAnyPermission(permissions, EVENT_READ_PERMISSIONS)
}

export function canEnrichEvents(permissions: PermissionCollection): boolean {
  return hasAnyPermission(permissions, EVENT_ENRICH_PERMISSIONS)
}

export function canDeriveEventMarketReactions(
  permissions: PermissionCollection
): boolean {
  return hasAnyPermission(permissions, EVENT_MARKET_REACTION_DERIVE_PERMISSIONS)
}
