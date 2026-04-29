import { Suspense } from "react"
import { notFound } from "next/navigation"

import { getCronjobById } from "@/app/api/cronjobs/action"
import { hasPermission } from "@/app/lib/permissions"
import { getCurrentPermissions } from "@/app/lib/permissions-server"
import { AccessDenied } from "@/components/access-denied"
import { AppFormShellSkeleton } from "@/components/app-form-shell"
import { Skeleton } from "@/components/ui/skeleton"

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
    <AppFormShellSkeleton width="md">
      <div className="flex flex-col gap-2 px-6 pt-6">
        <Skeleton className="h-6 w-56" />
        <Skeleton className="h-4 w-full max-w-md" />
      </div>

      <div className="flex flex-col gap-7 px-6 py-6">
        {Array.from({ length: 5 }).map((_, index) => (
          <div key={index} className="flex flex-col gap-2">
            <Skeleton className="h-4 w-28" />
            <Skeleton className="h-10 w-full" />
          </div>
        ))}
      </div>

      <div className="flex justify-end gap-3 border-t bg-muted/20 px-6 py-4">
        <Skeleton className="h-10 w-24" />
        <Skeleton className="h-10 w-32" />
      </div>
    </AppFormShellSkeleton>
  )
}
