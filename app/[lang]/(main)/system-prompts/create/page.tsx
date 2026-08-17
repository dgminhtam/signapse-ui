import { LocalizedLink as Link } from "@/components/localized-link"
import { ArrowLeft } from "lucide-react"

import { getServerDictionary } from "@/app/lib/i18n/server"
import { canCreateSystemPrompts } from "@/app/lib/system-prompts/permissions"
import { getCurrentPermissions } from "@/app/lib/permissions-server"
import { AccessDenied } from "@/components/access-denied"
import { Button } from "@/components/ui/button"

import { SystemPromptForm } from "../system-prompt-form"

export default async function CreateSystemPromptPage() {
  const [permissions, dictionary] = await Promise.all([
    getCurrentPermissions(),
    getServerDictionary(),
  ])

  if (!canCreateSystemPrompts(permissions)) {
    return (
      <AccessDenied
        description={dictionary.systemPrompts.createDenied}
        permission="system-prompt:create"
      />
    )
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

      <SystemPromptForm />
    </div>
  )
}
