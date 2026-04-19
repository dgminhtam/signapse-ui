"use server"

import { revalidatePath } from "next/cache"

import { fetchAuthenticated } from "@/app/api/auth/action"
import { ActionResult, Page, SearchParams } from "@/app/lib/definitions"
import {
  EventEnrichmentResult,
  EventListResponse,
  EventResponse,
  PendingEventEnrichmentBatchResult,
} from "@/app/lib/events/definitions"
import { queryParamsToString } from "@/app/lib/utils"

function revalidateEventRoutes(id?: number) {
  revalidatePath("/events")

  if (typeof id === "number") {
    revalidatePath(`/events/${id}`)
    return
  }

  revalidatePath("/events/[id]", "page")
}

export async function getEvents(searchParams: SearchParams): Promise<Page<EventListResponse>> {
  return fetchAuthenticated<Page<EventListResponse>>(
    `/events?${queryParamsToString(searchParams)}`
  )
}

export async function getEventById(id: number): Promise<EventResponse> {
  return fetchAuthenticated<EventResponse>(`/events/${id}`)
}

export async function enrichEventAssetsAndThemes(
  id: number
): Promise<ActionResult<EventEnrichmentResult>> {
  try {
    const data = await fetchAuthenticated<EventEnrichmentResult>(
      `/events/${id}/enrich-assets-and-themes`,
      {
        method: "POST",
      }
    )

    revalidateEventRoutes(id)

    return { success: true, data }
  } catch (error: unknown) {
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Không thể làm giàu liên kết tài sản và chủ đề cho sự kiện",
    }
  }
}

export async function enrichPendingEventAssetsAndThemes(
  batchSize?: number
): Promise<ActionResult<PendingEventEnrichmentBatchResult>> {
  try {
    const query = typeof batchSize === "number" ? `?batchSize=${batchSize}` : ""
    const data = await fetchAuthenticated<PendingEventEnrichmentBatchResult>(
      `/events/enrich-pending-assets-and-themes${query}`,
      {
        method: "POST",
      }
    )

    revalidateEventRoutes()

    return { success: true, data }
  } catch (error: unknown) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Không thể làm giàu các sự kiện đang chờ",
    }
  }
}
