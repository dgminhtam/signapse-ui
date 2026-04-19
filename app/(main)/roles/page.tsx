import { getPermissions, getRoles } from "@/app/api/roles/action"
import { hasPermission } from "@/app/lib/permissions"
import { getCurrentPermissions } from "@/app/lib/permissions-server"
import { AccessDenied } from "@/components/access-denied"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

import { RoleListPage } from "./role-list"

export default async function RolesPage() {
  const currentPermissions = await getCurrentPermissions()

  if (!hasPermission(currentPermissions, "role:update")) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Quản lý vai trò</CardTitle>
          <CardDescription>
            Màn hình này chỉ dành cho người dùng có quyền quản trị vai trò và phân quyền.
          </CardDescription>
        </CardHeader>
        <Separator />
        <CardContent className="pt-6">
          <AccessDenied
            title="Bạn không có quyền truy cập"
            description="Bạn không có quyền xem hoặc cập nhật danh mục vai trò."
            permission="role:update"
          />
        </CardContent>
      </Card>
    )
  }

  const [roles, permissionCatalog] = await Promise.all([getRoles(), getPermissions()])

  return (
    <Card>
      <CardHeader>
        <CardTitle>Quản lý vai trò</CardTitle>
        <CardDescription>
          Rà soát vai trò trong hệ thống, kiểm tra quyền đang gán và cập nhật truy cập cho từng vai trò.
        </CardDescription>
      </CardHeader>

      <Separator />

      <CardContent className="pt-6">
        <RoleListPage roles={roles} permissions={permissionCatalog} />
      </CardContent>
    </Card>
  )
}
