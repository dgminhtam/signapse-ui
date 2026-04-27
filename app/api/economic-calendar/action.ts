"use server"

import { revalidatePath } from "next/cache"

import { fetchAuthenticated } from "@/app/api/auth/action"
import { ActionResult, Page, SearchParams } from "@/app/lib/definitions"
import {
  EconomicCalendarListResponse,
  EconomicCalendarResponse,
  EconomicCalendarSyncResponse,
} from "@/app/lib/economic-calendar/definitions"
import { queryParamsToString } from "@/app/lib/utils"

function revalidateEconomicCalendarRoutes(id?: number) {
  revalidatePath("/economic-calendar")

  if (typeof id === "number") {
    revalidatePath(`/economic-calendar/${id}`)
    return
  }

  revalidatePath("/economic-calendar/[id]", "page")
}

export async function getEconomicCalendarEntries(
  searchParams: SearchParams
): Promise<Page<EconomicCalendarListResponse>> {
  return fetchAuthenticated<Page<EconomicCalendarListResponse>>(
    `/economic-calendar?${queryParamsToString(searchParams)}`
  )
}

export async function getEconomicCalendarEntryById(
  id: number
): Promise<EconomicCalendarResponse> {
  return fetchAuthenticated<EconomicCalendarResponse>(`/economic-calendar/${id}`)
}

export async function syncEconomicCalendarEntries(): Promise<
  ActionResult<EconomicCalendarSyncResponse>
> {
  try {
    const data = await fetchAuthenticated<EconomicCalendarSyncResponse>(
      "/economic-calendar/sync",
      {
        method: "POST",
      }
    )

    revalidateEconomicCalendarRoutes()

    return { success: true, data }
  } catch (error: unknown) {
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Không thể đồng bộ dữ liệu lịch kinh tế.",
    }
  }
}
