import { ArrowLeft } from "lucide-react"
import Link from "next/link"

import { hasPermission } from "@/app/lib/permissions"
import {
  NEWS_OUTLET_CREATE_PERMISSION,
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

export default async function CreateNewsOutletPage() {
  const permissions = await getCurrentPermissions()

  if (!hasPermission(permissions, NEWS_OUTLET_CREATE_PERMISSION)) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Them nguon tin</CardTitle>
          <CardDescription>
            Tao news outlet moi de dong bo voi contract backend hien tai.
          </CardDescription>
        </CardHeader>
        <Separator />
        <CardContent className="pt-6">
          <AccessDenied
            description="Ban khong co quyen tao nguon tin moi."
            permission={NEWS_OUTLET_CREATE_PERMISSION}
          />
        </CardContent>
      </Card>
    )
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
        <CardHeader>
          <CardTitle>Them nguon tin</CardTitle>
          <CardDescription>
            Cau hinh thong tin co ban, slug, dia chi trang chu, RSS, va trang thai
            kich hoat cho news outlet moi.
          </CardDescription>
        </CardHeader>
        <Separator />
        <CardContent className="pt-6">
          <NewsOutletForm />
        </CardContent>
      </Card>
    </div>
  )
}
