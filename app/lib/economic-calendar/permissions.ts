import { hasAnyPermission, type PermissionCollection } from "@/app/lib/permissions"

export const ECONOMIC_CALENDAR_READ_PERMISSIONS = ["economic-calendar:read"] as const

export const ECONOMIC_CALENDAR_SYNC_PERMISSIONS = ["economic-calendar:sync"] as const

export const ECONOMIC_CALENDAR_NAV_PERMISSIONS = ECONOMIC_CALENDAR_READ_PERMISSIONS

export function canReadEconomicCalendar(permissions: PermissionCollection): boolean {
  return hasAnyPermission(permissions, ECONOMIC_CALENDAR_READ_PERMISSIONS)
}

export function canSyncEconomicCalendar(permissions: PermissionCollection): boolean {
  return hasAnyPermission(permissions, ECONOMIC_CALENDAR_SYNC_PERMISSIONS)
}
