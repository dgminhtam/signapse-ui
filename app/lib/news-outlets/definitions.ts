export interface NewsOutletRequest {
  name: string
  slug?: string
  description?: string
  homepageUrl: string
  rssUrl?: string
  active?: boolean
}

export interface NewsOutletResponse {
  id: number
  name: string
  slug?: string
  description?: string
  homepageUrl: string
  rssUrl?: string
  active: boolean
  createdDate: string
  lastModifiedDate?: string
}

export interface NewsOutletListResponse {
  id: number
  name: string
  slug?: string
  description?: string
  homepageUrl: string
  rssUrl?: string
  active: boolean
  createdDate: string
}
