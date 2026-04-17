import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeft } from "lucide-react"

import { getAiProviderConfigById } from "@/app/api/ai-provider-configs/action"
import { hasPermission } from "@/app/lib/permissions"
import { getCurrentPermissions } from "@/app/lib/permissions-server"
import { AccessDenied } from "@/components/access-denied"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

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
      <Card>
        <CardHeader>
          <CardTitle>Chá»‰nh sá»­a cáº¥u hÃ¬nh nhÃ  cung cáº¥p AI</CardTitle>
          <CardDescription>
            Cáº­p nháº­t cáº¥u hÃ¬nh cho nhÃ  cung cáº¥p AI Ä‘Ã£ cÃ³.
          </CardDescription>
        </CardHeader>
        <Separator />
        <CardContent className="pt-6">
          <AccessDenied
            description="Báº¡n khÃ´ng cÃ³ quyá»n cáº­p nháº­t cáº¥u hÃ¬nh nhÃ  cung cáº¥p AI."
            permission="ai-provider-config:update"
          />
        </CardContent>
      </Card>
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

      <Card>
        <CardHeader>
          <CardTitle>Chỉnh sửa cấu hình nhà cung cấp AI</CardTitle>
          <CardDescription>
            Cập nhật cấu hình cho{" "}
            <span className="font-semibold text-foreground">{providerConfig.name}</span>.
          </CardDescription>
        </CardHeader>
        <Separator />
        <CardContent className="pt-6">
          <AiProviderConfigForm initialData={providerConfig} />
        </CardContent>
      </Card>
    </div>
  )
}
