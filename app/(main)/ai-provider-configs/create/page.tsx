import Link from "next/link"
import { ArrowLeft } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

import { AiProviderConfigForm } from "../ai-provider-config-form"

export default function CreateAiProviderConfigPage() {
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
