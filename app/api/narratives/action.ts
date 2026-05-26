"use server"

import { fetchAuthenticated } from "@/app/api/auth/action"
import { SearchParams } from "@/app/lib/definitions"
import { getDictionary } from "@/app/lib/i18n/dictionaries"
import { getRequestLocale } from "@/app/lib/i18n/server"
import {
  NarrativeSummaryPageResponse,
  narrativeSummaryPageResponseSchema,
} from "@/app/lib/narratives/definitions"
import { queryParamsToString } from "@/app/lib/utils"

export async function getNarratives(
  searchParams: SearchParams
): Promise<NarrativeSummaryPageResponse> {
  const dictionary = await getDictionary(await getRequestLocale())
  const response = await fetchAuthenticated<unknown>(
    `/narratives?${queryParamsToString(searchParams)}`
  )
  const parsedResponse = narrativeSummaryPageResponseSchema.safeParse(response)

  if (!parsedResponse.success) {
    console.error(
      "Narrative response validation failed",
      parsedResponse.error.issues
    )
    throw new Error(dictionary.workspaceOverview.narrativesLoadError)
  }

  return parsedResponse.data
}
