"use server"

import { fetchAuthenticated } from "@/app/api/auth/action"
import { SearchParams, Page } from "@/app/lib/definitions"
import { queryParamsToString } from "@/app/lib/utils"
import {
  CronjobRequest,
  CronjobResponse,
  CronjobListResponse,
} from "@/app/lib/cronjobs/definitions"
import { revalidatePath } from "next/cache"

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

export async function createCronjob(
  request: CronjobRequest
): Promise<CronjobResponse> {
  const cronjob = await fetchAuthenticated<CronjobResponse>("/cronjobs", {
    method: "POST",
    body: JSON.stringify(request),
  })
  revalidatePath("/cronjobs")
  return cronjob
}

export async function updateCronjob(
  id: number,
  request: CronjobRequest
): Promise<CronjobResponse> {
  const cronjob = await fetchAuthenticated<CronjobResponse>(`/cronjobs/${id}`, {
    method: "PATCH",
    body: JSON.stringify(request),
  })
  revalidatePath("/cronjobs")
  revalidatePath(`/cronjobs/${id}`)
  return cronjob
}

export async function deleteCronjob(id: number): Promise<void> {
  await fetchAuthenticated<void>(`/cronjobs/${id}`, {
    method: "DELETE",
  })
  revalidatePath("/cronjobs")
}

export async function startCronjob(id: number): Promise<CronjobResponse> {
  const cronjob = await fetchAuthenticated<CronjobResponse>(
    `/cronjobs/${id}/start`,
    {
      method: "POST",
    }
  )
  revalidatePath("/cronjobs")
  return cronjob
}

export async function pauseCronjob(id: number): Promise<CronjobResponse> {
  const cronjob = await fetchAuthenticated<CronjobResponse>(
    `/cronjobs/${id}/pause`,
    {
      method: "POST",
    }
  )
  revalidatePath("/cronjobs")
  return cronjob
}

export async function resumeCronjob(id: number): Promise<CronjobResponse> {
  const cronjob = await fetchAuthenticated<CronjobResponse>(
    `/cronjobs/${id}/resume`,
    {
      method: "POST",
    }
  )
  revalidatePath("/cronjobs")
  return cronjob
}
