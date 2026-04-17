export type AssetType = "COMMODITY" | "CRYPTO" | "FX" | "INDEX" | string

export interface AssetListResponse {
  id: number
  name: string
  symbol: string
  type: AssetType
}

export interface AssetResponse extends AssetListResponse {
  createdDate: string
  lastModifiedDate: string
}
