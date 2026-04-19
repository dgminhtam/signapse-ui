import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { notFound } from "next/navigation"

import { getSourceById } from "@/app/api/sources/action"
import { hasPermission } from "@/app/lib/permissions"
import { getCurrentPermissions } from "@/app/lib/permissions-server"
import { AccessDenied } from "@/components/access-denied"
import { Badge } from "@/components/ui/badge"
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

interface EditSourcePageProps {
  params: Promise<{ id: string }>
}

export default async function EditSourcePage({ params }: EditSourcePageProps) {
  const permissions = await getCurrentPermissions()

  if (!hasPermission(permissions, "source:update")) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Chỉnh sửa nguồn dữ liệu</CardTitle>
          <CardDescription>
            Xem và cập nhật thông tin của một nguồn dữ liệu cụ thể.
          </CardDescription>
        </CardHeader>
        <Separator />
        <CardContent className="pt-6">
          <AccessDenied
            description="Bạn không có quyền cập nhật nguồn dữ liệu."
            permission="source:update"
          />
        </CardContent>
      </Card>
    )
  }

  const { id } = await params
  const source = await getSourceById(Number(id))

  if (!source) {
    notFound()
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
        <CardHeader className="gap-3">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div className="flex flex-col gap-1">
              <CardTitle>Chỉnh sửa nguồn dữ liệu</CardTitle>
              <CardDescription>
                Quản lý thông tin cho nguồn:{" "}
                <span className="font-semibold text-foreground">{source.name}</span>
              </CardDescription>
            </div>
            {source.systemManaged ? (
              <Badge variant="secondary">Nguồn hệ thống</Badge>
            ) : null}
          </div>
          <CardDescription>
            {source.systemManaged
              ? "Nguồn này do hệ thống quản lý. Bạn có thể xem metadata nhưng không thể chỉnh sửa thủ công."
              : "Bạn có thể cập nhật thông tin cơ bản và trạng thái kích hoạt của nguồn dữ liệu này."}
          </CardDescription>
        </CardHeader>
        <Separator />
        <CardContent className="pt-6">
          <SourceForm initialData={source} />
        </CardContent>
      </Card>
    </div>
  )
}
