import Link from "next/link"
import { ArrowLeft } from "lucide-react"

import { canCreateSystemPrompts } from "@/app/lib/system-prompts/permissions"
import { getCurrentPermissions } from "@/app/lib/permissions-server"
import { AccessDenied } from "@/components/access-denied"
import { Button } from "@/components/ui/button"

import { SystemPromptForm } from "../system-prompt-form"

export default async function CreateSystemPromptPage() {
  const permissions = await getCurrentPermissions()

  if (!canCreateSystemPrompts(permissions)) {
    return (
      <AccessDenied
        description="Bạn không có quyền tạo prompt hệ thống."
        permission="system-prompt:create"
      />
    )
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center">
        <Button asChild variant="ghost" size="sm" className="-ml-2">
          <Link href="/system-prompts">
            <ArrowLeft data-icon="inline-start" />
            Quay lại danh sách
          </Link>
        </Button>
      </div>

      <SystemPromptForm />
    </div>
  )
}
