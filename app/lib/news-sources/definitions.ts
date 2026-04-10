export interface NewsSourceRequest {
  name: string
  description?: string
  url: string
  active?: boolean
}

export interface NewsSourceResponse {
  id: number
  name: string
  description: string
  url: string
  active: boolean
  createdDate: string
  lastModifiedDate: string
}

export interface NewsSourceListResponse {
  id: number
  name: string
  description: string
  url: string
  active: boolean
  createdDate: string
}
