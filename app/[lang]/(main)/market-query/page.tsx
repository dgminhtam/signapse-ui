import { redirect } from "next/navigation"

import { parseAppLocale } from "@/app/lib/i18n/config"
import { withLocalePath } from "@/app/lib/i18n/routing"

interface MarketQueryRedirectPageProps {
  params: Promise<{ lang: string }>
}

export default async function MarketQueryRedirectPage({
  params,
}: MarketQueryRedirectPageProps) {
  const { lang } = await params

  redirect(withLocalePath("/market-conversations", parseAppLocale(lang)))
}
