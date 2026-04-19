export type AssetType = "COMMODITY" | "CRYPTO" | "FX" | "INDEX" | string

export interface AddWorkspaceWatchlistAssetRequest {
  assetId: number
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

export interface WorkspaceWatchlistAssetListItemResponse {
  id: number
  assetId: number
  assetName: string
  assetSymbol: string
  assetType: AssetType
  createdDate: string
}
