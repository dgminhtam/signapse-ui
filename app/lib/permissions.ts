export type PermissionCollection = readonly string[]

export const DEV_AUTH_PERMISSION = "*"

export function hasPermission(
  permissions: PermissionCollection,
  requiredPermission?: string | null
): boolean {
  if (!requiredPermission) {
    return true
  }

  return (
    permissions.includes(DEV_AUTH_PERMISSION) ||
    permissions.includes(requiredPermission)
  )
}

export function hasAnyPermission(
  permissions: PermissionCollection,
  requiredPermissions: readonly string[]
): boolean {
  return requiredPermissions.some((permission) =>
    hasPermission(permissions, permission)
  )
}
