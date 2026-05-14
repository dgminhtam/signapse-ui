import Link from "next/link"
import { Suspense } from "react"
import { ArrowLeft } from "lucide-react"

import { hasPermission } from "@/app/lib/permissions"
import { getCurrentPermissions } from "@/app/lib/permissions-server"
import { AccessDenied } from "@/components/access-denied"
import { AppFormShellSkeleton } from "@/components/app-form-shell"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"

import { AiProviderConfigCreateForm } from "../ai-provider-config-create-form"

export default async function CreateAiProviderConfigPage() {
  const permissions = await getCurrentPermissions()

  if (!hasPermission(permissions, "ai-provider-config:create")) {
    return (
      <AccessDenied
        description="Bạn không có quyền tạo cấu hình nhà cung cấp AI."
        permission="ai-provider-config:create"
      />
    )
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center">
        <Button asChild variant="ghost" size="sm" className="-ml-2">
          <Link href="/ai-provider-configs">
            <ArrowLeft data-icon="inline-start" />
            Quay lại danh sách
          </Link>
        </Button>
      </div>

      <Suspense fallback={<AiProviderConfigCreateSkeleton />}>
        <AiProviderConfigCreateForm />
      </Suspense>
    </div>
  )
}

function AiProviderConfigCreateSkeleton() {
  return (
    <AppFormShellSkeleton width="lg">
      <div className="flex flex-col gap-2 px-6 pt-6">
        <Skeleton className="h-6 w-72 max-w-full" />
        <Skeleton className="h-4 w-full max-w-xl" />
      </div>

      <div className="px-6 py-6">
        <div className="flex flex-col gap-7">
          <Skeleton className="h-9 w-full" />

          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
              <div className="flex flex-col gap-2">
                <Skeleton className="h-5 w-40" />
                <Skeleton className="h-4 w-64 max-w-full" />
              </div>
              <Skeleton className="h-9 w-36" />
            </div>

            <div className="flex flex-col gap-4 rounded-lg border p-4">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <Skeleton className="h-3 w-24" />
                <div className="flex gap-2">
                  <Skeleton className="h-8 w-36" />
                  <Skeleton className="size-8" />
                </div>
              </div>
              <div className="grid gap-3 md:grid-cols-[minmax(0,1fr)_minmax(14rem,0.75fr)]">
                <div className="flex flex-col gap-2">
                  <Skeleton className="h-4 w-16" />
                  <Skeleton className="h-9 w-full" />
                </div>
                <div className="flex flex-col gap-2">
                  <Skeleton className="h-4 w-16" />
                  <Skeleton className="h-9 w-full" />
                </div>
              </div>
            </div>
          </div>

          <Skeleton className="h-9 w-full" />
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-16 w-full" />
        </div>
      </div>

      <div className="flex flex-col-reverse gap-3 border-t bg-muted/20 px-6 py-4 sm:flex-row sm:justify-end">
        <Skeleton className="h-9 w-full sm:w-20" />
        <Skeleton className="h-9 w-full sm:w-32" />
      </div>
    </AppFormShellSkeleton>
  )
}
