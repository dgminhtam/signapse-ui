export interface TopicCreateRequest {
  name: string
  slug: string
  description?: string
  includeKeywords?: string[]
  excludeKeywords?: string[]
  entities?: string[]
  active?: boolean
}

export interface TopicUpdateRequest {
  name?: string
  slug?: string
  description?: string
  includeKeywords?: string[]
  excludeKeywords?: string[]
  entities?: string[]
  active?: boolean
}

export interface TopicResponse {
  id: number
  name: string
  slug: string
  description: string
  includeKeywords: string[]
  excludeKeywords: string[]
  entities: string[]
  active: boolean
  createdDate: string
  lastModifiedDate: string
}

export interface TopicListResponse {
  id: number
  name: string
  slug: string
  description: string
  includeKeywords: string[]
  excludeKeywords: string[]
  entities: string[]
  active: boolean
  createdDate: string
}
