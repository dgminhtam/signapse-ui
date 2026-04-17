export interface PermissionResponse {
  id: number
  key: string
  name: string
  description: string | null
}

export interface RoleResponse {
  id: number
  key: string
  name: string
  description: string | null
  permissions: PermissionResponse[]
}

export interface UpdateRolePermissionsRequest {
  permissionKeys: string[]
}

export interface PermissionGroup {
  key: string
  title: string
  permissions: PermissionResponse[]
}

const LEGACY_PERMISSION_GROUP_KEY = "legacy"

function getPermissionGroupKey(permissionKey: string): string {
  const [prefix] = permissionKey.split(":")
  return prefix?.trim() || LEGACY_PERMISSION_GROUP_KEY
}

function formatPermissionGroupTitle(groupKey: string): string {
  if (groupKey === LEGACY_PERMISSION_GROUP_KEY) {
    return "Unknown/Legacy"
  }

  return groupKey
    .split(/[-_]/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ")
}

export function groupPermissionsByResource(
  permissions: PermissionResponse[]
): PermissionGroup[] {
  const grouped = new Map<string, PermissionResponse[]>()

  for (const permission of permissions) {
    const groupKey = getPermissionGroupKey(permission.key)
    const currentPermissions = grouped.get(groupKey) ?? []
    currentPermissions.push(permission)
    grouped.set(groupKey, currentPermissions)
  }

  return Array.from(grouped.entries())
    .sort(([left], [right]) => {
      if (left === LEGACY_PERMISSION_GROUP_KEY) return 1
      if (right === LEGACY_PERMISSION_GROUP_KEY) return -1
      return left.localeCompare(right)
    })
    .map(([key, groupedPermissions]) => ({
      key,
      title: formatPermissionGroupTitle(key),
      permissions: [...groupedPermissions].sort((left, right) =>
        left.key.localeCompare(right.key)
      ),
    }))
}

export function mergePermissionsWithLegacy(
  availablePermissions: PermissionResponse[],
  selectedPermissions: PermissionResponse[]
): PermissionResponse[] {
  const availableByKey = new Map(
    availablePermissions.map((permission) => [permission.key, permission])
  )
  const mergedPermissions = [...availablePermissions]

  for (const permission of selectedPermissions) {
    if (!availableByKey.has(permission.key)) {
      mergedPermissions.push({
        ...permission,
        name: permission.name || permission.key,
      })
    }
  }

  return mergedPermissions
}
