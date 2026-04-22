"use server"

import { revalidatePath } from "next/cache"

import { fetchAuthenticated } from "@/app/api/auth/action"
import { ActionResult, Page, SearchParams } from "@/app/lib/definitions"
import {
  NewsOutletListResponse,
  NewsOutletRequest,
  NewsOutletResponse,
} from "@/app/lib/news-outlets/definitions"
import { queryParamsToString } from "@/app/lib/utils"

export async function getNewsOutlets(
  searchParams: SearchParams
): Promise<Page<NewsOutletListResponse>> {
  return fetchAuthenticated<Page<NewsOutletListResponse>>(
    `/news-outlets?${queryParamsToString(searchParams)}`
  )
}

export async function getActiveNewsOutlets(
  searchParams: SearchParams
): Promise<Page<NewsOutletListResponse>> {
  return fetchAuthenticated<Page<NewsOutletListResponse>>(
    `/news-outlets/active?${queryParamsToString(searchParams)}`
  )
}

export async function getNewsOutletById(id: number): Promise<NewsOutletResponse> {
  return fetchAuthenticated<NewsOutletResponse>(`/news-outlets/${id}`)
}

export async function createNewsOutlet(
  request: NewsOutletRequest
): Promise<ActionResult<NewsOutletResponse>> {
  try {
    const newsOutlet = await fetchAuthenticated<NewsOutletResponse>("/news-outlets", {
      method: "POST",
      body: JSON.stringify(request),
    })

    revalidatePath("/news-outlets")

    return { success: true, data: newsOutlet }
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "Khong the tao nguon tin moi"

    return { success: false, error: errorMessage }
  }
}

export async function updateNewsOutlet(
  id: number,
  request: NewsOutletRequest
): Promise<ActionResult<NewsOutletResponse>> {
  try {
    const newsOutlet = await fetchAuthenticated<NewsOutletResponse>(
      `/news-outlets/${id}`,
      {
        method: "PUT",
        body: JSON.stringify(request),
      }
    )

    revalidatePath("/news-outlets")
    revalidatePath(`/news-outlets/${id}`)

    return { success: true, data: newsOutlet }
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "Khong the cap nhat nguon tin"

    return { success: false, error: errorMessage }
  }
}

export async function toggleNewsOutletActive(
  id: number
): Promise<ActionResult<NewsOutletResponse>> {
  try {
    const newsOutlet = await fetchAuthenticated<NewsOutletResponse>(
      `/news-outlets/${id}/toggle-active`,
      {
        method: "PATCH",
      }
    )

    revalidatePath("/news-outlets")
    revalidatePath(`/news-outlets/${id}`)

    return { success: true, data: newsOutlet }
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error
        ? error.message
        : "Khong the cap nhat trang thai nguon tin"

    return { success: false, error: errorMessage }
  }
}

export async function deleteNewsOutlet(id: number): Promise<ActionResult> {
  try {
    await fetchAuthenticated<void>(`/news-outlets/${id}`, {
      method: "DELETE",
    })

    revalidatePath("/news-outlets")

    return { success: true, data: undefined }
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "Khong the xoa nguon tin"

    return { success: false, error: errorMessage }
  }
}
