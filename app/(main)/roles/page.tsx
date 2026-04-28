import { getPermissions, getRoles } from "@/app/api/roles/action"
import { hasPermission } from "@/app/lib/permissions"
import { getCurrentPermissions } from "@/app/lib/permissions-server"
import { AccessDenied } from "@/components/access-denied"

import { RoleListPage } from "./role-list"

export default async function RolesPage() {
  const currentPermissions = await getCurrentPermissions()

  if (!hasPermission(currentPermissions, "role:update")) {
    return (
      <AccessDenied
        title="Bạn không có quyền truy cập"
        description="Bạn không có quyền xem hoặc cập nhật danh mục vai trò."
        permission="role:update"
      />
    )
  }

  const [roles, permissionCatalog] = await Promise.all([getRoles(), getPermissions()])

  return <RoleListPage roles={roles} permissions={permissionCatalog} />
}
