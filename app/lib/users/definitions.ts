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

export interface UpdateUserProfileRequest {
  firstName: string
  lastName: string
  birthDay: string
  mobilePhone: string
}

export interface BackendMeResponse {
  id: number
  email: string
  firstName: string | null
  lastName: string | null
  dateOfBirth: string | null
  birthDay?: string | null
  phoneNumber: string | null
  mobilePhone?: string | null
  role_name: string | null
  currentWorkspace: BackendWorkspaceSummary | null
  mainImage: BackendMediaResponse | null
  permissions: string[]
}
