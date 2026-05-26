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
  birthday: string
  phone: string
}

export interface BackendMeResponse {
  id: number
  email: string
  firstName: string | null
  lastName: string | null
  birthday?: string | null
  birthDay?: string | null
  dateOfBirth?: string | null
  phone?: string | number | null
  phoneNumber?: string | number | null
  mobilePhone?: string | number | null
  role_name: string | null
  currentWorkspace: BackendWorkspaceSummary | null
  mainImage: BackendMediaResponse | null
  permissions: string[]
}
