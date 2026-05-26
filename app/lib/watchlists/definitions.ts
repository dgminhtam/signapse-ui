export type AssetType = "COMMODITY" | "CRYPTO" | "FX" | "INDEX" | string

export interface BulkCreateWorkspaceWatchlistAssetsRequest {
  assetIds: number[]
}

export interface WorkspaceWatchlistAssetResponse {
  id: number
  assetId: number
  assetName: string
  assetSymbol: string
  assetType: AssetType
  createdDate: string
  lastModifiedDate: string
}

export interface BulkCreateWorkspaceWatchlistAssetsResponse {
  items: WorkspaceWatchlistAssetResponse[]
  createdAssetIds: number[]
  existingAssetIds: number[]
}

export interface WorkspaceWatchlistAssetListItemResponse {
  id: number
  assetId: number
  assetName: string
  assetSymbol: string
  assetType: AssetType
  createdDate: string
}
