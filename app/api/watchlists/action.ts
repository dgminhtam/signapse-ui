"use server"

import { fetchAuthenticated } from "@/app/api/auth/action"
import { ActionResult, Page, SearchParams } from "@/app/lib/definitions"
import { queryParamsToString } from "@/app/lib/utils"
import {
  CreateWatchlistRequest,
  WatchlistListResponse,
  WatchlistResponse,
} from "@/app/lib/watchlists/definitions"

export async function getWatchlists(
  searchParams: SearchParams
): Promise<Page<WatchlistListResponse>> {
  return fetchAuthenticated<Page<WatchlistListResponse>>(
    `/watchlists?${queryParamsToString(searchParams)}`
  )
}

export async function addAssetToWatchlist(
  request: CreateWatchlistRequest
): Promise<ActionResult<WatchlistResponse>> {
  try {
    const watchlist = await fetchAuthenticated<WatchlistResponse>("/watchlists", {
      method: "POST",
      body: JSON.stringify(request),
    })

    return { success: true, data: watchlist }
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "Failed to add asset to watchlist"
    return { success: false, error: errorMessage }
  }
}

export async function deleteWatchlistAsset(assetId: number): Promise<ActionResult> {
  try {
    await fetchAuthenticated<void>(`/watchlists/assets/${assetId}`, {
      method: "DELETE",
    })

    return { success: true, data: undefined }
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "Failed to remove asset from watchlist"
    return { success: false, error: errorMessage }
  }
}
