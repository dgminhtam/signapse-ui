import Link from "next/link"
import { ArrowLeft } from "lucide-react"

import { canCreateSystemPrompts } from "@/app/lib/system-prompts/permissions"
import { getCurrentPermissions } from "@/app/lib/permissions-server"
import { AccessDenied } from "@/components/access-denied"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

import { SystemPromptForm } from "../system-prompt-form"

export default async function CreateSystemPromptPage() {
  const permissions = await getCurrentPermissions()

  if (!canCreateSystemPrompts(permissions)) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Tạo prompt hệ thống</CardTitle>
          <CardDescription>
            Thêm prompt điều khiển một workflow AI trong hệ thống.
          </CardDescription>
        </CardHeader>
        <Separator />
        <CardContent className="pt-6">
          <AccessDenied
            description="Bạn không có quyền tạo prompt hệ thống."
            permission="system-prompt:create"
          />
        </CardContent>
      </Card>
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

      <Card>
        <CardHeader>
          <CardTitle>Tạo prompt hệ thống</CardTitle>
          <CardDescription>
            Chọn loại prompt và khai báo nội dung hướng dẫn cho workflow AI tương
            ứng.
          </CardDescription>
        </CardHeader>
        <Separator />
        <CardContent className="pt-6">
          <SystemPromptForm />
        </CardContent>
      </Card>
    </div>
  )
}
