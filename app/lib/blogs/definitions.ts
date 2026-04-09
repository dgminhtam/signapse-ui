export interface BlogPost {
  id: number
  title: string
  slug: string
  content: string
  shortDescription: string
  isVisible: boolean
  publishedAt: string
  createdDate: string
  lastModifiedDate: string
}

export interface BlogPostListResponse {
  id: number
  title: string
  slug: string
  shortDescription: string
  isVisible: boolean
  publishedAt: string
  createdDate: string
}

export interface CreateBlogPostRequest {
  title: string
  slug: string
  content: string
  shortDescription: string
  isVisible: boolean
}

export interface UpdateBlogPostRequest {
  title?: string
  slug?: string
  content?: string
  shortDescription?: string
  isVisible?: boolean
}
