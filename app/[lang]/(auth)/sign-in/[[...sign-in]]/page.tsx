import { SignIn } from "@clerk/nextjs"

import { DEFAULT_APP_LOCALE } from "@/app/lib/i18n/config"
import { hasLocale } from "@/app/lib/i18n/dictionaries"
import { withLocalePath } from "@/app/lib/i18n/routing"

export default async function Page({
  params,
}: {
  params: Promise<{ lang: string }>
}) {
  const { lang } = await params
  const locale = hasLocale(lang) ? lang : DEFAULT_APP_LOCALE
  const dashboardHref = withLocalePath("/dashboard", locale)

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <SignIn fallbackRedirectUrl={dashboardHref} />
      </div>
    </div>
  )
}
