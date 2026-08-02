import { getDictionary } from "@/app/lib/i18n/dictionaries"
import { getRequestLocale } from "@/app/lib/i18n/server"

import { DashboardPrototypeView } from "./dashboard-prototype-view"
import { normalizeDashboardPrototypeScenario } from "./dashboard-prototype-scenario"

interface DashboardPrototypePageProps {
  searchParams: Promise<{ scenario?: string | string[] }>
}

export default async function DashboardPrototypePage({
  searchParams,
}: DashboardPrototypePageProps) {
  const [locale, params] = await Promise.all([getRequestLocale(), searchParams])
  const dictionary = await getDictionary(locale)

  return (
    <DashboardPrototypeView
      dictionary={dictionary}
      locale={locale}
      scenario={normalizeDashboardPrototypeScenario(params.scenario)}
    />
  )
}
