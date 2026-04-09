export interface ArticleResponse {
  id: number
  title: string
  description: string
  content?: string
  url: string
  imageUrl?: string
  author?: string
  sourceName: string
  publishedAt: string
  createdDate: string
  lastModifiedDate?: string
}

export interface ArticleListResponse {
  id: number
  title: string
  description: string
  url: string
  imageUrl?: string
  sourceName: string
  publishedAt: string
  createdDate: string
}
