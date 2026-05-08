export interface CreateNewsOutletRequest {
  name: string
  description?: string
  homepageUrl: string
  rssUrl?: string
  active?: boolean
}

export interface UpdateNewsOutletRequest {
  name?: string
  description?: string
  homepageUrl?: string
  rssUrl?: string
  active?: boolean
}

export interface NewsOutletResponse {
  id: number
  name: string
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
  homepageUrl: string
  rssUrl?: string
  active: boolean
  createdDate: string
}
