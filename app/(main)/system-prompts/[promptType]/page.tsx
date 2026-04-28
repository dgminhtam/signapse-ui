import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeft } from "lucide-react"

import { getSystemPromptByType } from "@/app/api/system-prompts/action"
import {
  getSystemPromptTypeLabel,
  isSystemPromptType,
  SystemPromptResponse,
} from "@/app/lib/system-prompts/definitions"
import { canUpdateSystemPrompts } from "@/app/lib/system-prompts/permissions"
import { getCurrentPermissions } from "@/app/lib/permissions-server"
import { AccessDenied } from "@/components/access-denied"
import { Button } from "@/components/ui/button"

import { SystemPromptForm } from "../system-prompt-form"

interface EditSystemPromptPageProps {
  params: Promise<{ promptType: string }>
}

export default async function EditSystemPromptPage({
  params,
}: EditSystemPromptPageProps) {
  const permissions = await getCurrentPermissions()

  if (!canUpdateSystemPrompts(permissions)) {
    return (
      <AccessDenied
        description="Bạn không có quyền cập nhật prompt hệ thống."
        permission="system-prompt:update"
      />
    )
  }

  const { promptType: rawPromptType } = await params
  const promptType = decodeURIComponent(rawPromptType)

  if (!isSystemPromptType(promptType)) {
    notFound()
  }

  let prompt: SystemPromptResponse

  try {
    prompt = await getSystemPromptByType(promptType)
  } catch {
    notFound()
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

      <SystemPromptForm initialData={prompt} />
    </div>
  )
}
