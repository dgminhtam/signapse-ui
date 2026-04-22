import {
  hasAnyPermission,
  type PermissionCollection,
} from "@/app/lib/permissions"

export const GRAPH_VIEW_READ_PERMISSIONS = ["graph-view:read"] as const

export const GRAPH_VIEW_NAV_PERMISSIONS = GRAPH_VIEW_READ_PERMISSIONS

export function canReadGraphView(permissions: PermissionCollection): boolean {
  return hasAnyPermission(permissions, GRAPH_VIEW_READ_PERMISSIONS)
}
