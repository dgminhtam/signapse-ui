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
  currentWorkspace: boolean
  createdDate: string
  lastModifiedDate: string
}
