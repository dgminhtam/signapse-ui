import { hasPermission, type PermissionCollection } from "@/app/lib/permissions"

export const NARRATIVE_READ_PERMISSION = "narrative:read"

export function canReadNarratives(permissions: PermissionCollection): boolean {
  return hasPermission(permissions, NARRATIVE_READ_PERMISSION)
}
