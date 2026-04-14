export interface WorkspaceCreateRequest {
  name: string
  slug?: string
}

export interface WorkspaceUpdateRequest {
  name?: string
  slug?: string
}

export interface WorkspaceResponse {
  id: number
  name: string
  slug: string
  personal: boolean
  active: boolean
  defaultWorkspace: boolean
  createdDate: string
  lastModifiedDate: string
}
