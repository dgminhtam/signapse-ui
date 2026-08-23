"use server"

import { fetchAuthenticated } from "@/app/api/auth/action"
import { getDictionary } from "@/app/lib/i18n/dictionaries"
import { getRequestLocale } from "@/app/lib/i18n/server"
import { reportValidationFailure } from "@/app/lib/observability/server"
import { OBSERVABILITY_OPERATIONS } from "@/app/lib/observability/semantic"
import {
  dashboardSummaryResponseSchema,
  type DashboardSummaryResponse,
} from "@/app/lib/dashboard/definitions"

export async function getDashboardSummary(): Promise<DashboardSummaryResponse> {
  const dictionary = await getDictionary(await getRequestLocale())
  const response = await fetchAuthenticated<unknown>("/dashboard/summary")
  const parsedResponse = dashboardSummaryResponseSchema.safeParse(response)

  if (!parsedResponse.success) {
    reportValidationFailure(
      OBSERVABILITY_OPERATIONS.dashboardLoad,
      { feature: "dashboard", route: "/dashboard/summary" },
      parsedResponse.error.issues
    )
    throw new Error(
      dictionary.workspaceOverview.tradingSnapshot.summaryErrorDescription
    )
  }

  return parsedResponse.data
}
