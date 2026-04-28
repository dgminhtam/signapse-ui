import Link from "next/link"
import { ArrowLeft } from "lucide-react"

import { hasPermission } from "@/app/lib/permissions"
import { getCurrentPermissions } from "@/app/lib/permissions-server"
import { AccessDenied } from "@/components/access-denied"
import { Button } from "@/components/ui/button"

import { AiProviderConfigForm } from "../ai-provider-config-form"

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

      <AiProviderConfigForm />
    </div>
  )
}
