import { hasAnyPermission, type PermissionCollection } from "@/app/lib/permissions"

export const SOURCE_DOCUMENT_READ_PERMISSIONS = ["source-document:read"] as const

export const SOURCE_DOCUMENT_ANALYZE_PERMISSIONS = ["source-document:analyze"] as const

export const SOURCE_DOCUMENT_UPDATE_PERMISSIONS = ["source-document:update"] as const

export const SOURCE_DOCUMENT_DELETE_PERMISSIONS = ["source-document:delete"] as const

export const SOURCE_DOCUMENT_NAV_PERMISSIONS = SOURCE_DOCUMENT_READ_PERMISSIONS

export function canReadSourceDocuments(permissions: PermissionCollection): boolean {
  return hasAnyPermission(permissions, SOURCE_DOCUMENT_READ_PERMISSIONS)
}

export function canAnalyzeSourceDocuments(permissions: PermissionCollection): boolean {
  return hasAnyPermission(permissions, SOURCE_DOCUMENT_ANALYZE_PERMISSIONS)
}

export function canDeleteSourceDocuments(permissions: PermissionCollection): boolean {
  return hasAnyPermission(permissions, SOURCE_DOCUMENT_DELETE_PERMISSIONS)
}
