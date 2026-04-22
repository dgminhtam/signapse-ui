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
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

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
      <Card>
        <CardHeader>
          <CardTitle>Chinh sua nguon tin</CardTitle>
          <CardDescription>
            Xem va cap nhat thong tin cua mot news outlet cu the.
          </CardDescription>
        </CardHeader>
        <Separator />
        <CardContent className="pt-6">
          <AccessDenied
            description="Ban khong co quyen cap nhat nguon tin."
            permission={NEWS_OUTLET_UPDATE_PERMISSION}
          />
        </CardContent>
      </Card>
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
            <ArrowLeft className="mr-2 h-4 w-4" data-icon="inline-start" />
            Quay lai danh sach
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader className="gap-3">
          <div className="flex flex-col gap-1">
            <CardTitle>Chinh sua nguon tin</CardTitle>
            <CardDescription>
              Quan ly thong tin cho nguon tin:{" "}
              <span className="font-semibold text-foreground">{newsOutlet.name}</span>
            </CardDescription>
          </div>
          <CardDescription>
            Ban co the cap nhat thong tin co ban, slug, dia chi RSS, va trang thai
            kich hoat cua news outlet nay.
          </CardDescription>
        </CardHeader>
        <Separator />
        <CardContent className="pt-6">
          <NewsOutletForm initialData={newsOutlet} />
        </CardContent>
      </Card>
    </div>
  )
}
