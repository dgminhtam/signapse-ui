import {
  hasAnyPermission,
  hasPermission,
  type PermissionCollection,
} from "@/app/lib/permissions"

export const PERSONAL_NOTE_READ_PERMISSION = "personal-note:read"
export const PERSONAL_NOTE_CREATE_PERMISSION = "personal-note:create"
export const PERSONAL_NOTE_UPDATE_PERMISSION = "personal-note:update"
export const PERSONAL_NOTE_DELETE_PERMISSION = "personal-note:delete"

export const PERSONAL_NOTE_READ_PERMISSIONS = [
  PERSONAL_NOTE_READ_PERMISSION,
] as const

export const PERSONAL_NOTE_NAV_PERMISSIONS = PERSONAL_NOTE_READ_PERMISSIONS

export function canReadPersonalNotes(
  permissions: PermissionCollection
): boolean {
  return hasAnyPermission(permissions, PERSONAL_NOTE_READ_PERMISSIONS)
}

export function canCreatePersonalNotes(
  permissions: PermissionCollection
): boolean {
  return hasPermission(permissions, PERSONAL_NOTE_CREATE_PERMISSION)
}

export function canUpdatePersonalNotes(
  permissions: PermissionCollection
): boolean {
  return hasPermission(permissions, PERSONAL_NOTE_UPDATE_PERMISSION)
}

export function canDeletePersonalNotes(
  permissions: PermissionCollection
): boolean {
  return hasPermission(permissions, PERSONAL_NOTE_DELETE_PERMISSION)
}
