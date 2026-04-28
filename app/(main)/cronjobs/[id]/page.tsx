import { getCronjobById } from "@/app/api/cronjobs/action"
import { hasPermission } from "@/app/lib/permissions"
import { getCurrentPermissions } from "@/app/lib/permissions-server"
import { AccessDenied } from "@/components/access-denied"
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
      <AccessDenied
        description="Bạn không có quyền cập nhật tác vụ định kỳ."
        permission="cronjob:update"
      />
    )
  }

  const { id } = await params
  const cronjobId = Number(id)

  return (
    <Suspense fallback={<UpdateCronjobSkeleton />}>
      <FetchCronjobData id={cronjobId} />
    </Suspense>
  )
}

async function FetchCronjobData({ id }: { id: number }) {
  const cronjob = await getCronjobById(id)

  if (!cronjob) {
    notFound()
  }

  return <UpdateCronjobForm cronjob={cronjob} />
}

function UpdateCronjobSkeleton() {
  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-2">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-10 w-full" />
      </div>

      <div className="flex flex-col gap-2">
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-10 w-full" />
      </div>

      <div className="flex flex-col gap-2">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-10 w-full" />
      </div>

      <div className="flex flex-col gap-2">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-10 w-full" />
      </div>

      <div className="flex flex-col gap-2">
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-10 w-full" />
      </div>

      <Separator />

      <div className="flex gap-4">
        <Skeleton className="h-10 w-32" />
        <Skeleton className="h-10 w-24" />
      </div>
    </div>
  )
}
