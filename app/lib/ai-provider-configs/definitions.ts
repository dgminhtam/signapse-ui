export type AiProviderType = "GEMINI" | "OPENAI" | "ZAI"

export interface AiProviderConfigCreateRequest {
  providerType: AiProviderType
  name: string
  description?: string
  apiKey: string
  model: string
  baseUrl?: string
  defaultProvider?: boolean
}

export interface AiProviderConfigUpdateRequest {
  providerType?: AiProviderType
  name?: string
  description?: string
  apiKey?: string
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
}

export interface AiProviderConfigResponse extends AiProviderConfigPublicFields {}

export interface AiProviderConfigListResponse extends AiProviderConfigPublicFields {}

export interface AiProviderConfigServerResponse extends AiProviderConfigPublicFields {
  apiKey: string
}

export function sanitizeAiProviderConfig(
  config: AiProviderConfigServerResponse
): AiProviderConfigResponse {
  const { apiKey: _apiKey, ...publicConfig } = config
  return publicConfig
}

export function sanitizeAiProviderConfigListItem(
  config: AiProviderConfigServerResponse
): AiProviderConfigListResponse {
  const { apiKey: _apiKey, ...publicConfig } = config
  return publicConfig
}

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
