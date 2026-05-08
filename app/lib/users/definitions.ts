export interface BackendWorkspaceSummary {
  id: number
  name: string
}

export interface BackendMediaResponse {
  id: number
  name: string
  altText?: string
  urlOriginal: string
  urlLarge?: string
  urlMedium?: string
  urlThumbnail?: string
  size?: number
}

export interface BackendMeResponse {
  id: number
  email: string
  firstName: string | null
  lastName: string | null
  currentWorkspace: BackendWorkspaceSummary | null
  mainImage: BackendMediaResponse | null
  permissions: string[]
}
