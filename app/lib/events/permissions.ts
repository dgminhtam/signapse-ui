import {
  hasAnyPermission,
  type PermissionCollection,
} from "@/app/lib/permissions"

export const EVENT_READ_PERMISSIONS = ["event:read"] as const

// Event enrich operators are intentionally gated by source-document analyze permission.
export const EVENT_ENRICH_PERMISSIONS = ["source-document:analyze"] as const

// Market reaction derivation currently uses the same backend operator permission.
export const EVENT_MARKET_REACTION_DERIVE_PERMISSIONS = EVENT_ENRICH_PERMISSIONS

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
