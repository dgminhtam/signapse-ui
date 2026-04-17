export type AssetType = "COMMODITY" | "CRYPTO" | "FX" | "INDEX" | string

export interface CreateWatchlistRequest {
  assetId: number
}

export interface WatchlistResponse {
  id: number
  assetId: number
  assetName: string
  assetSymbol: string
  assetType: AssetType
  createdDate: string
  lastModifiedDate: string
}

export interface WatchlistListResponse {
  id: number
  assetId: number
  assetName: string
  assetSymbol: string
  assetType: AssetType
  createdDate: string
}
