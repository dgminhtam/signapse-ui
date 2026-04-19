import { ArrowLeft } from "lucide-react"
import Link from "next/link"

import { hasPermission } from "@/app/lib/permissions"
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

import { SourceForm } from "../source-form"

export default async function CreateSourcePage() {
  const permissions = await getCurrentPermissions()

  if (!hasPermission(permissions, "source:create")) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Thêm nguồn dữ liệu</CardTitle>
          <CardDescription>
            Tạo nguồn mới để hệ thống ingest dữ liệu từ website hoặc RSS.
          </CardDescription>
        </CardHeader>
        <Separator />
        <CardContent className="pt-6">
          <AccessDenied
            description="Bạn không có quyền tạo nguồn dữ liệu mới."
            permission="source:create"
          />
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center">
        <Button asChild variant="ghost" size="sm" className="-ml-2">
          <Link href="/sources">
            <ArrowLeft className="mr-2 h-4 w-4" data-icon="inline-start" />
            Quay lại danh sách
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Thêm nguồn dữ liệu</CardTitle>
          <CardDescription>
            Cấu hình thông tin cơ bản, đường dẫn website hoặc RSS, và trạng thái
            kích hoạt cho nguồn mới.
          </CardDescription>
        </CardHeader>
        <Separator />
        <CardContent className="pt-6">
          <SourceForm />
        </CardContent>
      </Card>
    </div>
  )
}
