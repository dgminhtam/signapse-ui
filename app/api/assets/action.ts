"use server"

import { fetchAuthenticated } from "@/app/api/auth/action"
import { Page, SearchParams } from "@/app/lib/definitions"
import { queryParamsToString } from "@/app/lib/utils"
import { AssetListResponse, AssetResponse } from "@/app/lib/assets/definitions"

export async function getAssets(
  searchParams: SearchParams
): Promise<Page<AssetListResponse>> {
  return fetchAuthenticated<Page<AssetListResponse>>(
    `/assets?${queryParamsToString(searchParams)}`
  )
}

export async function getAssetById(id: number): Promise<AssetResponse> {
  return fetchAuthenticated<AssetResponse>(`/assets/${id}`)
}
