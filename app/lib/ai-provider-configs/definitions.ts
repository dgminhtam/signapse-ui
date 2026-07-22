export const AI_PROVIDER_TYPES = [
  "DEEPSEEK",
  "GEMINI",
  "GROQ",
  "OPENAI",
  "ZAI",
] as const

export type AiProviderType = (typeof AI_PROVIDER_TYPES)[number]

export interface AiProviderCredentialCreateRequest {
  apiKey: string
  model: string
}

export interface AiProviderCredentialUpdateRequest {
  apiKey?: string
  model?: string
}

export interface AiProviderCredentialResponse {
  id: number
  model?: string
  keyPreview?: string
  lastUsedDate?: string
  rateLimitedUntil?: string
  createdDate?: string
  lastModifiedDate?: string
}

export interface AiProviderConfigCreateRequest {
  providerType: AiProviderType
  description?: string
  baseUrl?: string
  defaultProvider?: boolean
  credentials: AiProviderCredentialCreateRequest[]
}

export interface AiProviderConfigUpdateRequest {
  providerType?: AiProviderType
  description?: string
  baseUrl?: string
  defaultProvider?: boolean
}

interface AiProviderConfigPublicFields {
  id: number
  providerType: AiProviderType
  description?: string
  baseUrl?: string
  defaultProvider?: boolean
  createdDate?: string
  lastModifiedDate?: string
  credentials?: AiProviderCredentialResponse[]
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
