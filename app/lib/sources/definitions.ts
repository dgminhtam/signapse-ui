export interface SourceRequest {
  name: string
  description?: string
  url: string
  rssUrl?: string
  active?: boolean
}

export interface SourceResponse {
  id: number
  name: string
  description: string
  url: string
  rssUrl: string
  active: boolean
  createdDate: string
  lastModifiedDate: string
}

export interface SourceListResponse {
  id: number
  name: string
  description: string
  url: string
  rssUrl?: string
  active: boolean
  createdDate: string
}
