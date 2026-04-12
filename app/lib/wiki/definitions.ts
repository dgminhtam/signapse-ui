export type WikiPageType = "INDEX" | "SOURCE_SUMMARY"

export interface WikiPageResponse {
  id: number
  title: string
  slug: string
  pageType: WikiPageType
  summary?: string
  content?: string
  sourceCount: number
  lastSynthesizedAt?: string
  active: boolean
  createdDate: string
  lastModifiedDate: string
}

export interface WikiPageSourceRefResponse {
  articleId: number
  articleTitle: string
  articleUrl: string
  sourceName: string
  publishedAt: string
  referenceNote?: string
}
