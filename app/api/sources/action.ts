"use server"

import { fetchAuthenticated } from "@/app/api/auth/action"
import { SearchParams, Page, ActionResult } from "@/app/lib/definitions"
import { queryParamsToString } from "@/app/lib/utils"
import {
  SourceRequest,
  SourceResponse,
  SourceListResponse,
} from "@/app/lib/sources/definitions"
import { revalidatePath } from "next/cache"

export async function getSources(
  searchParams: SearchParams
): Promise<Page<SourceListResponse>> {
  return fetchAuthenticated<Page<SourceListResponse>>(
    `/sources?${queryParamsToString(searchParams)}`
  )
}

export async function getActiveSources(): Promise<SourceListResponse[]> {
  return fetchAuthenticated<SourceListResponse[]>("/sources/active")
}

export async function getSourceById(id: number): Promise<SourceResponse> {
  return fetchAuthenticated<SourceResponse>(`/sources/${id}`)
}

export async function createSource(
  request: SourceRequest
): Promise<ActionResult<SourceResponse>> {
  try {
    const source = await fetchAuthenticated<SourceResponse>("/sources", {
      method: "POST",
      body: JSON.stringify(request),
    })
    revalidatePath("/sources")
    return { success: true, data: source }
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "Không thể tạo nguồn dữ liệu"
    return { success: false, error: errorMessage }
  }
}

export async function updateSource(
  id: number,
  request: SourceRequest
): Promise<ActionResult<SourceResponse>> {
  try {
    const source = await fetchAuthenticated<SourceResponse>(`/sources/${id}`, {
      method: "PUT",
      body: JSON.stringify(request),
    })
    revalidatePath("/sources")
    revalidatePath(`/sources/${id}`)
    return { success: true, data: source }
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "Không thể cập nhật nguồn dữ liệu"
    return { success: false, error: errorMessage }
  }
}

export async function toggleSourceActive(id: number): Promise<ActionResult<SourceResponse>> {
  try {
    const source = await fetchAuthenticated<SourceResponse>(
      `/sources/${id}/toggle-active`,
      {
        method: "PATCH",
      }
    )
    revalidatePath("/sources")
    return { success: true, data: source }
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "Không thể cập nhật trạng thái nguồn dữ liệu"
    return { success: false, error: errorMessage }
  }
}

export async function deleteSource(id: number): Promise<ActionResult> {
  try {
    await fetchAuthenticated<void>(`/sources/${id}`, {
      method: "DELETE",
    })
    revalidatePath("/sources")
    return { success: true, data: undefined }
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "Không thể xóa nguồn dữ liệu"
    return { success: false, error: errorMessage }
  }
}
