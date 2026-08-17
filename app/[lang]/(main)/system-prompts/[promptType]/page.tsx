import { LocalizedLink as Link } from "@/components/localized-link"
import { notFound } from "next/navigation"
import { ArrowLeft } from "lucide-react"

import { getSystemPromptByType } from "@/app/api/system-prompts/action"
import {
  isSystemPromptType,
  SystemPromptResponse,
} from "@/app/lib/system-prompts/definitions"
import { getServerDictionary } from "@/app/lib/i18n/server"
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
  const [permissions, dictionary] = await Promise.all([
    getCurrentPermissions(),
    getServerDictionary(),
  ])

  if (!canUpdateSystemPrompts(permissions)) {
    return (
      <AccessDenied
        description={dictionary.systemPrompts.updateDenied}
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
        <Button
          variant="secondary"
          size="sm"
          render={<Link href="/system-prompts" />}
        >
          <ArrowLeft data-icon="inline-start" />
          {dictionary.common.back}
        </Button>
      </div>

      <SystemPromptForm initialData={prompt} />
    </div>
  )
}
