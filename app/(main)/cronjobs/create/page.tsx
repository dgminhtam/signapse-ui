import { CreateCronjobForm } from "./create-cronjob-form"
import { hasPermission } from "@/app/lib/permissions"
import { getCurrentPermissions } from "@/app/lib/permissions-server"
import { AccessDenied } from "@/components/access-denied"

export default async function Page() {
  const permissions = await getCurrentPermissions()

  if (!hasPermission(permissions, "cronjob:create")) {
    return (
      <AccessDenied
        description="Bạn không có quyền tạo tác vụ định kỳ."
        permission="cronjob:create"
      />
    )
  }

  return <CreateCronjobForm />
}
