"use server"

import { fetchAuthenticated } from '@/app/api/auth/action'
import { SearchParams, Page, ActionResult } from '@/app/lib/definitions'
import { queryParamsToString } from '@/app/lib/utils'
import { EconomicEventListResponse, EconomicEventResponse } from '@/app/lib/economic-calendar/definitions'
import { revalidatePath } from 'next/cache'

export async function getEconomicEvents(
  searchParams: SearchParams
): Promise<Page<EconomicEventListResponse>> {
  return fetchAuthenticated<Page<EconomicEventListResponse>>(
    `/economic-calendar?${queryParamsToString(searchParams)}`
  )
}

export async function getEconomicEventById(id: number): Promise<EconomicEventResponse> {
  return fetchAuthenticated<EconomicEventResponse>(`/economic-calendar/${id}`)
}

export async function crawlEconomicEvents(): Promise<ActionResult<number>> {
  try {
    const count = await fetchAuthenticated<number>("/economic-calendar/crawl", {
      method: "POST",
    })
    revalidatePath("/economic-calendar")
    return { success: true, data: count }
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Failed to crawl economic events"
    return { success: false, error: errorMessage }
  }
}

export async function deleteEconomicEvent(id: number): Promise<ActionResult> {
  try {
    await fetchAuthenticated<void>(`/economic-calendar/${id}`, {
      method: "DELETE",
    })
    revalidatePath("/economic-calendar")
    return { success: true, data: undefined }
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Failed to delete economic event"
    return { success: false, error: errorMessage }
  }
}
