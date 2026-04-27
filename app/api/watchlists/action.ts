"use server"

import { fetchAuthenticated } from "@/app/api/auth/action"
import { ActionResult, Page, SearchParams } from "@/app/lib/definitions"
import { queryParamsToString } from "@/app/lib/utils"
import {
  AddWorkspaceWatchlistAssetRequest,
  WorkspaceWatchlistAssetListItemResponse,
  WorkspaceWatchlistAssetResponse,
} from "@/app/lib/watchlists/definitions"

export async function getWorkspaceWatchlistAssets(
  searchParams: SearchParams
): Promise<Page<WorkspaceWatchlistAssetListItemResponse>> {
  return fetchAuthenticated<Page<WorkspaceWatchlistAssetListItemResponse>>(
    `/watchlists?${queryParamsToString(searchParams)}`
  )
}

export async function addAssetToWorkspaceWatchlist(
  request: AddWorkspaceWatchlistAssetRequest
): Promise<ActionResult<WorkspaceWatchlistAssetResponse>> {
  try {
    const watchlistAsset = await fetchAuthenticated<WorkspaceWatchlistAssetResponse>("/watchlists", {
      method: "POST",
      body: JSON.stringify(request),
    })

    return { success: true, data: watchlistAsset }
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "Không thể thêm tài sản vào danh sách theo dõi."
    return { success: false, error: errorMessage }
  }
}

export async function removeAssetFromWorkspaceWatchlist(assetId: number): Promise<ActionResult> {
  try {
    await fetchAuthenticated<void>(`/watchlists/assets/${assetId}`, {
      method: "DELETE",
    })

    return { success: true, data: undefined }
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "Không thể gỡ tài sản khỏi danh sách theo dõi."
    return { success: false, error: errorMessage }
  }
}
