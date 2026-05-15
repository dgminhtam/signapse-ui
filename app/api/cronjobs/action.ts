"use server"

import { fetchAuthenticated } from "@/app/api/auth/action"
import { SearchParams, Page, ActionResult } from "@/app/lib/definitions"
import { queryParamsToString } from "@/app/lib/utils"
import {
  CronjobRequest,
  CronjobResponse,
  CronjobListResponse,
} from "@/app/lib/cronjobs/definitions"
import { revalidatePath } from "next/cache"

function getErrorMessage(error: unknown, fallback: string) {
  return error instanceof Error ? error.message : fallback
}

export async function getCronjobs(
  searchParams: SearchParams
): Promise<Page<CronjobListResponse>> {
  return fetchAuthenticated<Page<CronjobListResponse>>(
    `/cronjobs?${queryParamsToString(searchParams)}`
  )
}

export async function getCronjobById(id: number): Promise<CronjobResponse> {
  return fetchAuthenticated<CronjobResponse>(`/cronjobs/${id}`)
}

export async function updateCronjob(
  id: number,
  request: CronjobRequest
): Promise<ActionResult<CronjobResponse>> {
  try {
    const cronjob = await fetchAuthenticated<CronjobResponse>(
      `/cronjobs/${id}`,
      {
        method: "PATCH",
        body: JSON.stringify(request),
      }
    )
    revalidatePath("/cronjobs")
    return { success: true, data: cronjob }
  } catch (error: unknown) {
    return {
      success: false,
      error: getErrorMessage(error, "Failed to update cronjob"),
    }
  }
}

export async function startCronjob(
  id: number
): Promise<ActionResult<CronjobResponse>> {
  try {
    const cronjob = await fetchAuthenticated<CronjobResponse>(
      `/cronjobs/${id}/start`,
      {
        method: "POST",
      }
    )
    revalidatePath("/cronjobs")
    return { success: true, data: cronjob }
  } catch (error: unknown) {
    return {
      success: false,
      error: getErrorMessage(error, "Failed to start cronjob"),
    }
  }
}

export async function pauseCronjob(
  id: number
): Promise<ActionResult<CronjobResponse>> {
  try {
    const cronjob = await fetchAuthenticated<CronjobResponse>(
      `/cronjobs/${id}/pause`,
      {
        method: "POST",
      }
    )
    revalidatePath("/cronjobs")
    return { success: true, data: cronjob }
  } catch (error: unknown) {
    return {
      success: false,
      error: getErrorMessage(error, "Failed to pause cronjob"),
    }
  }
}

export async function resumeCronjob(
  id: number
): Promise<ActionResult<CronjobResponse>> {
  try {
    const cronjob = await fetchAuthenticated<CronjobResponse>(
      `/cronjobs/${id}/resume`,
      {
        method: "POST",
      }
    )
    revalidatePath("/cronjobs")
    return { success: true, data: cronjob }
  } catch (error: unknown) {
    return {
      success: false,
      error: getErrorMessage(error, "Failed to resume cronjob"),
    }
  }
}
