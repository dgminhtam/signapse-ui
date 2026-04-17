import { CreateCronjobForm } from "./create-cronjob-form"
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

export default async function Page() {
  const permissions = await getCurrentPermissions()

  if (!hasPermission(permissions, "cronjob:create")) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Create New Cronjob</CardTitle>
          <CardDescription>
            Provide the details below to add a new cronjob to the system.
          </CardDescription>
        </CardHeader>

        <Separator />

        <CardContent className="pt-6">
          <AccessDenied
            description="You do not have permission to create cronjobs."
            permission="cronjob:create"
          />
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create New Cronjob</CardTitle>
        <CardDescription>
          Provide the details below to add a new cronjob to the system.
        </CardDescription>
      </CardHeader>

      <Separator />

      <CardContent className="pt-6">
        <CreateCronjobForm />
      </CardContent>
    </Card>
  )
}
