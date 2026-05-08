import { ArrowLeft } from "lucide-react"
import Link from "next/link"

import { hasPermission } from "@/app/lib/permissions"
import { NEWS_OUTLET_CREATE_PERMISSION } from "@/app/lib/news-outlets/permissions"
import { getCurrentPermissions } from "@/app/lib/permissions-server"
import { AccessDenied } from "@/components/access-denied"
import { Button } from "@/components/ui/button"

import { NewsOutletCreateForm } from "../news-outlet-create-form"

export default async function CreateNewsOutletPage() {
  const permissions = await getCurrentPermissions()

  if (!hasPermission(permissions, NEWS_OUTLET_CREATE_PERMISSION)) {
    return (
      <AccessDenied
        description="Bạn không có quyền tạo nguồn tin mới."
        permission={NEWS_OUTLET_CREATE_PERMISSION}
      />
    )
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center">
        <Button asChild variant="ghost" size="sm" className="-ml-2">
          <Link href="/news-outlets">
            <ArrowLeft data-icon="inline-start" />
            Quay lại danh sách
          </Link>
        </Button>
      </div>

      <NewsOutletCreateForm />
    </div>
  )
}
