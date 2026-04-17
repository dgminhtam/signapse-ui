import { getCronjobById } from "@/app/api/cronjobs/action"
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
import { Skeleton } from "@/components/ui/skeleton"
import { notFound } from "next/navigation"
import { Suspense } from "react"
import { UpdateCronjobForm } from "./update-cronjob-form"

interface PageProps {
  params: Promise<{
    id: string
  }>
}

export default async function EditCronjobPage({ params }: PageProps) {
  const permissions = await getCurrentPermissions()

  if (!hasPermission(permissions, "cronjob:update")) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Edit Cronjob</CardTitle>
          <CardDescription>
            Update detailed information and cronjob configuration.
          </CardDescription>
        </CardHeader>

        <Separator />

        <CardContent className="pt-6">
          <AccessDenied
            description="You do not have permission to update cronjobs."
            permission="cronjob:update"
          />
        </CardContent>
      </Card>
    )
  }

  const { id } = await params
  const cronjobId = Number(id)

  return (
    <Card>
      <CardHeader>
        <CardTitle>Edit Cronjob</CardTitle>
        <CardDescription>
          Update detailed information and cronjob configuration.
        </CardDescription>
      </CardHeader>

      <Separator />

      <Suspense fallback={<UpdateCronjobSkeleton />}>
        <FetchCronjobData id={cronjobId} />
      </Suspense>
    </Card>
  )
}

async function FetchCronjobData({ id }: { id: number }) {
  const cronjob = await getCronjobById(id)

  if (!cronjob) {
    notFound()
  }

  return (
    <CardContent className="pt-6">
      <UpdateCronjobForm cronjob={cronjob} />
    </CardContent>
  )
}

function UpdateCronjobSkeleton() {
  return (
    <CardContent className="space-y-8 pt-6">
      <div className="space-y-2">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-10 w-full" />
      </div>

      <div className="space-y-2">
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-10 w-full" />
      </div>

      <div className="space-y-2">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-10 w-full" />
      </div>

      <div className="space-y-2">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-10 w-full" />
      </div>

      <div className="space-y-2">
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-10 w-full" />
      </div>

      <Separator />

      <div className="flex gap-4">
        <Skeleton className="h-10 w-32" />
        <Skeleton className="h-10 w-24" />
      </div>
    </CardContent>
  )
}
