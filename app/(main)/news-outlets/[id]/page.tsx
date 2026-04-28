import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { notFound } from "next/navigation"

import { getNewsOutletById } from "@/app/api/news-outlets/action"
import { hasPermission } from "@/app/lib/permissions"
import {
  NEWS_OUTLET_UPDATE_PERMISSION,
} from "@/app/lib/news-outlets/permissions"
import { getCurrentPermissions } from "@/app/lib/permissions-server"
import { AccessDenied } from "@/components/access-denied"
import { Button } from "@/components/ui/button"

import { NewsOutletForm } from "../news-outlet-form"

interface EditNewsOutletPageProps {
  params: Promise<{ id: string }>
}

export default async function EditNewsOutletPage({
  params,
}: EditNewsOutletPageProps) {
  const permissions = await getCurrentPermissions()

  if (!hasPermission(permissions, NEWS_OUTLET_UPDATE_PERMISSION)) {
    return (
      <AccessDenied
        description="Bạn không có quyền cập nhật nguồn tin."
        permission={NEWS_OUTLET_UPDATE_PERMISSION}
      />
    )
  }

  const { id } = await params
  const newsOutlet = await getNewsOutletById(Number(id))

  if (!newsOutlet) {
    notFound()
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

      <NewsOutletForm initialData={newsOutlet} />
    </div>
  )
}
