"use client"

import { createContext, useContext } from "react"

import { hasAnyPermission, hasPermission } from "@/app/lib/permissions"

const PermissionContext = createContext<readonly string[]>([])

interface PermissionProviderProps {
  permissions: readonly string[]
  children: React.ReactNode
}

export function PermissionProvider({
  permissions,
  children,
}: PermissionProviderProps) {
  return (
    <PermissionContext.Provider value={permissions}>
      {children}
    </PermissionContext.Provider>
  )
}

export function usePermissions(): readonly string[] {
  return useContext(PermissionContext)
}

export function useHasPermission(permission?: string | null): boolean {
  const permissions = usePermissions()
  return hasPermission(permissions, permission)
}

export function useHasAnyPermission(permissionsToCheck: readonly string[]): boolean {
  const permissions = usePermissions()
  return hasAnyPermission(permissions, permissionsToCheck)
}

