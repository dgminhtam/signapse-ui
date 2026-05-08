export interface WorkspaceCreateRequest {
  name: string
}

export interface WorkspaceUpdateRequest {
  name?: string
}

export interface WorkspaceResponse {
  id: number
  name: string
  currentWorkspace: boolean
  createdDate: string
  lastModifiedDate: string
}
