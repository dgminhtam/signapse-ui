"use server"

import { fetchAuthenticated } from "@/app/api/auth/action"
import { SearchParams, Page, ActionResult } from "@/app/lib/definitions"
import { queryParamsToString } from "@/app/lib/utils"
import {
  NewsSourceRequest,
  NewsSourceResponse,
  NewsSourceListResponse,
} from "@/app/lib/news-sources/definitions"
import { revalidatePath } from "next/cache"

export async function getNewsSources(
  searchParams: SearchParams
): Promise<Page<NewsSourceListResponse>> {
  return fetchAuthenticated<Page<NewsSourceListResponse>>(
    `/news-sources?${queryParamsToString(searchParams)}`
  )
}

export async function getActiveNewsSources(): Promise<NewsSourceListResponse[]> {
  return fetchAuthenticated<NewsSourceListResponse[]>("/news-sources/active")
}

export async function getNewsSourceById(id: number): Promise<NewsSourceResponse> {
  return fetchAuthenticated<NewsSourceResponse>(`/news-sources/${id}`)
}

export async function createNewsSource(
  request: NewsSourceRequest
): Promise<ActionResult<NewsSourceResponse>> {
  try {
    const newsSource = await fetchAuthenticated<NewsSourceResponse>("/news-sources", {
      method: "POST",
      body: JSON.stringify(request),
    })
    revalidatePath("/news-sources")
    return { success: true, data: newsSource }
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Failed to create news source"
    return { success: false, error: errorMessage }
  }
}

export async function updateNewsSource(
  id: number,
  request: NewsSourceRequest
): Promise<ActionResult<NewsSourceResponse>> {
  try {
    const newsSource = await fetchAuthenticated<NewsSourceResponse>(`/news-sources/${id}`, {
      method: "PUT",
      body: JSON.stringify(request),
    })
    revalidatePath("/news-sources")
    revalidatePath(`/news-sources/${id}`)
    return { success: true, data: newsSource }
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Failed to update news source"
    return { success: false, error: errorMessage }
  }
}

export async function toggleNewsSourceActive(id: number): Promise<ActionResult<NewsSourceResponse>> {
  try {
    const newsSource = await fetchAuthenticated<NewsSourceResponse>(
      `/news-sources/${id}/toggle-active`,
      {
        method: "PATCH",
      }
    )
    revalidatePath("/news-sources")
    return { success: true, data: newsSource }
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Failed to toggle news source status"
    return { success: false, error: errorMessage }
  }
}

export async function deleteNewsSource(id: number): Promise<ActionResult> {
  try {
    await fetchAuthenticated<void>(`/news-sources/${id}`, {
      method: "DELETE",
    })
    revalidatePath("/news-sources")
    return { success: true, data: undefined }
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Failed to delete news source"
    return { success: false, error: errorMessage }
  }
}
