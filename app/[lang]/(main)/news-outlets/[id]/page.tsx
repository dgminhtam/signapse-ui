import { ArrowLeft } from "lucide-react"
import { LocalizedLink as Link } from "@/components/localized-link"
import { notFound } from "next/navigation"

import { getNewsOutletById } from "@/app/api/news-outlets/action"
import { getServerDictionary } from "@/app/lib/i18n/server"
import { hasPermission } from "@/app/lib/permissions"
import { NEWS_OUTLET_UPDATE_PERMISSION } from "@/app/lib/news-outlets/permissions"
import { getCurrentPermissions } from "@/app/lib/permissions-server"
import { AccessDenied } from "@/components/access-denied"
import { buttonVariants } from "@/components/ui/button"

import { NewsOutletUpdateForm } from "../news-outlet-update-form"

interface EditNewsOutletPageProps {
  params: Promise<{ id: string }>
}

export default async function EditNewsOutletPage({
  params,
}: EditNewsOutletPageProps) {
  const permissions = await getCurrentPermissions()
  const dictionary = await getServerDictionary()

  if (!hasPermission(permissions, NEWS_OUTLET_UPDATE_PERMISSION)) {
    return (
      <AccessDenied
        description={dictionary.newsOutlets.updateDenied}
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
        <Link
          href="/news-outlets"
          className={buttonVariants({ variant: "secondary", size: "sm" })}
        >
          <ArrowLeft data-icon="inline-start" />
          {dictionary.common.back}
        </Link>
      </div>

      <NewsOutletUpdateForm newsOutlet={newsOutlet} />
    </div>
  )
}
