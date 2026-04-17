export interface BackendWorkspaceSummary {
  id: number
  name: string
  slug: string
  personal: boolean
}

export interface BackendMeResponse {
  id: number
  email: string
  firstName: string | null
  lastName: string | null
  workspace: BackendWorkspaceSummary | null
  mainImage: string | null
  permissions: string[]
}
