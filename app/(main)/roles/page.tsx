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
          <CardTitle>Manage Roles</CardTitle>
          <CardDescription>
            This screen is restricted to users who can manage role permissions.
          </CardDescription>
        </CardHeader>
        <Separator />
        <CardContent className="pt-6">
          <AccessDenied
            description="You do not have permission to view or modify the role catalog."
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
        <CardTitle>Manage Roles</CardTitle>
        <CardDescription>
          Review system roles, inspect assigned permissions, and update access for each role.
        </CardDescription>
      </CardHeader>

      <Separator />

      <CardContent className="pt-6">
        <RoleListPage roles={roles} permissions={permissionCatalog} />
      </CardContent>
    </Card>
  )
}
