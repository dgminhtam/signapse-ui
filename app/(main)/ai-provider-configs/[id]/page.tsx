import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeft } from "lucide-react"

import { getAiProviderConfigById } from "@/app/api/ai-provider-configs/action"
import { hasPermission } from "@/app/lib/permissions"
import { getCurrentPermissions } from "@/app/lib/permissions-server"
import { AccessDenied } from "@/components/access-denied"
import { Button } from "@/components/ui/button"

import { AiProviderConfigForm } from "../ai-provider-config-form"

interface EditAiProviderConfigPageProps {
  params: Promise<{ id: string }>
}

export default async function EditAiProviderConfigPage({
  params,
}: EditAiProviderConfigPageProps) {
  const permissions = await getCurrentPermissions()

  if (!hasPermission(permissions, "ai-provider-config:update")) {
    return (
      <AccessDenied
        description="Bạn không có quyền cập nhật cấu hình nhà cung cấp AI."
        permission="ai-provider-config:update"
      />
    )
  }

  const { id } = await params
  const providerConfig = await getAiProviderConfigById(Number(id))

  if (!providerConfig) {
    notFound()
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

      <AiProviderConfigForm initialData={providerConfig} />
    </div>
  )
}
