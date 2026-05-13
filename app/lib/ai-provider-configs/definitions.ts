export const AI_PROVIDER_TYPES = ["GEMINI", "GROQ", "OPENAI", "ZAI"] as const

export type AiProviderType = (typeof AI_PROVIDER_TYPES)[number]

export interface AiProviderCredentialCreateRequest {
  label?: string
  apiKey: string
}

export interface AiProviderCredentialUpdateRequest {
  label?: string
  apiKey?: string
}

export interface AiProviderCredentialResponse {
  id: number
  label?: string
  keyPreview?: string
  lastUsedDate?: string
  rateLimitedUntil?: string
  createdDate?: string
  lastModifiedDate?: string
}

export interface AiProviderConfigCreateRequest {
  providerType: AiProviderType
  name: string
  description?: string
  model: string
  baseUrl?: string
  defaultProvider?: boolean
  credentials: AiProviderCredentialCreateRequest[]
}

export interface AiProviderConfigUpdateRequest {
  providerType?: AiProviderType
  name?: string
  description?: string
  model?: string
  baseUrl?: string
  defaultProvider?: boolean
}

interface AiProviderConfigPublicFields {
  id: number
  providerType: AiProviderType
  name: string
  description: string
  model: string
  baseUrl: string
  defaultProvider: boolean
  createdDate: string
  lastModifiedDate: string
  credentials: AiProviderCredentialResponse[]
}

export type AiProviderConfigResponse = AiProviderConfigPublicFields

export type AiProviderConfigListResponse = AiProviderConfigPublicFields

export interface AiProviderModelCatalogRequest {
  providerType: AiProviderType
  apiKey: string
  baseUrl?: string
}

export interface AiProviderModelOptionResponse {
  id: string
  label: string
}

export interface AiProviderModelCatalogResponse {
  providerType: AiProviderType
  models: AiProviderModelOptionResponse[]
}
