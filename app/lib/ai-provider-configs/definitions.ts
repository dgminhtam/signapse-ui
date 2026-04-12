export type AiProviderType = "GEMINI" | "OPENAI"

export interface AiProviderConfigRequest {
  providerType?: AiProviderType
  name: string
  description?: string
  apiKey?: string
  model: string
  baseUrl?: string
  active?: boolean
  defaultProvider?: boolean
}

export interface AiProviderConfigResponse {
  id: number
  providerType: AiProviderType
  name: string
  description: string
  apiKey: string
  model: string
  baseUrl: string
  active: boolean
  defaultProvider: boolean
  createdDate: string
  lastModifiedDate: string
}

export interface AiProviderConfigListResponse {
  id: number
  providerType: AiProviderType
  name: string
  description: string
  model: string
  baseUrl: string
  active: boolean
  defaultProvider: boolean
  createdDate: string
  lastModifiedDate: string
}
