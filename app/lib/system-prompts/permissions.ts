import { hasAnyPermission, type PermissionCollection } from "@/app/lib/permissions"

export const SYSTEM_PROMPT_READ_PERMISSIONS = ["system-prompt:read"] as const

export const SYSTEM_PROMPT_CREATE_PERMISSIONS = ["system-prompt:create"] as const

export const SYSTEM_PROMPT_UPDATE_PERMISSIONS = ["system-prompt:update"] as const

export const SYSTEM_PROMPT_DELETE_PERMISSIONS = ["system-prompt:delete"] as const

export const SYSTEM_PROMPT_NAV_PERMISSIONS = SYSTEM_PROMPT_READ_PERMISSIONS

export function canReadSystemPrompts(permissions: PermissionCollection): boolean {
  return hasAnyPermission(permissions, SYSTEM_PROMPT_READ_PERMISSIONS)
}

export function canCreateSystemPrompts(permissions: PermissionCollection): boolean {
  return hasAnyPermission(permissions, SYSTEM_PROMPT_CREATE_PERMISSIONS)
}

export function canUpdateSystemPrompts(permissions: PermissionCollection): boolean {
  return hasAnyPermission(permissions, SYSTEM_PROMPT_UPDATE_PERMISSIONS)
}

export function canDeleteSystemPrompts(permissions: PermissionCollection): boolean {
  return hasAnyPermission(permissions, SYSTEM_PROMPT_DELETE_PERMISSIONS)
}
