import Link from "next/link"
import { ArrowLeft } from "lucide-react"

import { hasPermission } from "@/app/lib/permissions"
import { getCurrentPermissions } from "@/app/lib/permissions-server"
import { AccessDenied } from "@/components/access-denied"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

import { AiProviderConfigForm } from "../ai-provider-config-form"

export default async function CreateAiProviderConfigPage() {
  const permissions = await getCurrentPermissions()

  if (!hasPermission(permissions, "ai-provider-config:create")) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Táº¡o cáº¥u hÃ¬nh nhÃ  cung cáº¥p AI</CardTitle>
          <CardDescription>
            Khai bÃ¡o nhÃ  cung cáº¥p AI má»›i vá»›i thÃ´ng tin xÃ¡c thá»±c, model vÃ  thiáº¿t láº­p máº·c Ä‘á»‹nh.
          </CardDescription>
        </CardHeader>
        <Separator />
        <CardContent className="pt-6">
          <AccessDenied
            description="Báº¡n khÃ´ng cÃ³ quyá»n táº¡o cáº¥u hÃ¬nh nhÃ  cung cáº¥p AI."
            permission="ai-provider-config:create"
          />
        </CardContent>
      </Card>
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

      <Card>
        <CardHeader>
          <CardTitle>Tạo cấu hình nhà cung cấp AI</CardTitle>
          <CardDescription>
            Khai báo nhà cung cấp AI mới với thông tin xác thực, model và thiết lập mặc định.
          </CardDescription>
        </CardHeader>
        <Separator />
        <CardContent className="pt-6">
          <AiProviderConfigForm />
        </CardContent>
      </Card>
    </div>
  )
}
