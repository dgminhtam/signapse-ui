import { hasAnyPermission, type PermissionCollection } from "@/app/lib/permissions"

export const MARKET_CHART_READ_PERMISSIONS = ["market-chart:read"] as const

export const MARKET_CHART_NAV_PERMISSIONS = MARKET_CHART_READ_PERMISSIONS

export function canReadMarketCharts(permissions: PermissionCollection): boolean {
  return hasAnyPermission(permissions, MARKET_CHART_READ_PERMISSIONS)
}
