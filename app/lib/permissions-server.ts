import { cache } from "react"

import { getMe } from "@/app/api/user/action"
import {
  getDevAuthPermissions,
  isDevAuthModeEnabled,
} from "@/app/lib/dev-auth-mode"
import { hasPermission } from "@/app/lib/permissions"

export const getCurrentPermissions = cache(async (): Promise<string[]> => {
  if (isDevAuthModeEnabled()) {
    return getDevAuthPermissions()
  }

  try {
    const me = await getMe()
    return me.permissions ?? []
  } catch {
    return []
  }
})

export async function userHasPermission(permission: string): Promise<boolean> {
  const permissions = await getCurrentPermissions()
  return hasPermission(permissions, permission)
}
