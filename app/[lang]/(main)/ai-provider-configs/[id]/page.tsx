import { LocalizedLink as Link } from "@/components/localized-link"
import { notFound } from "next/navigation"
import { ArrowLeft } from "lucide-react"

import { getAiProviderConfigById } from "@/app/api/ai-provider-configs/action"
import { getServerDictionary } from "@/app/lib/i18n/server"
import { hasPermission } from "@/app/lib/permissions"
import { getCurrentPermissions } from "@/app/lib/permissions-server"
import { AccessDenied } from "@/components/access-denied"
import { Button } from "@/components/ui/button"

import { AiProviderCredentialPanel } from "../ai-provider-credential-panel"
import { AiProviderConfigUpdateForm } from "../ai-provider-config-update-form"

interface EditAiProviderConfigPageProps {
  params: Promise<{ id: string }>
}

export default async function EditAiProviderConfigPage({
  params,
}: EditAiProviderConfigPageProps) {
  const [permissions, dictionary] = await Promise.all([
    getCurrentPermissions(),
    getServerDictionary(),
  ])

  if (!hasPermission(permissions, "ai-provider-config:update")) {
    return (
      <AccessDenied
        description={dictionary.aiProviderConfigs.updateDenied}
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
            {dictionary.aiProviderConfigs.backToList}
          </Link>
        </Button>
      </div>

      <AiProviderConfigUpdateForm initialData={providerConfig} />
      <AiProviderCredentialPanel provider={providerConfig} />
    </div>
  )
}
