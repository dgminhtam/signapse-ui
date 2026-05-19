import type { Dictionary } from "@/app/lib/i18n/dictionary-types"
import { formatMessage } from "@/app/lib/i18n/messages"

export const SYSTEM_PROMPT_TYPES = [
  "NEWS_FILTER",
  "NEWS_ANALYSIS",
  "SIGNAL_GENERATION",
  "DECISION_MAKING",
  "CONTENT_EXTRACTION",
  "SENTIMENT_ANALYSIS",
  "TITLE_GENERATION",
  "SUMMARY_GENERATION",
  "CONTENT_CLEANING",
  "FIRECRAWL_SOURCE_DOCUMENT_FILTER",
  "NEWS_PRIMARY_EVENT_DERIVATION",
  "EVENT_ASSET_THEME_ENRICHMENT",
  "EVENT_MARKET_REACTION_DERIVATION",
  "EVENT_GROUNDED_MARKET_QUERY_SYNTHESIS",
] as const

export type SystemPromptType = (typeof SYSTEM_PROMPT_TYPES)[number]

export interface SystemPromptResponse {
  id: number
  promptType: SystemPromptType
  content: string
  createdDate?: string
  lastModifiedDate?: string
}

export interface CreateSystemPromptRequest {
  promptType: SystemPromptType
  content: string
}

export interface UpdateSystemPromptRequest {
  content: string
}

export function isSystemPromptType(value: string): value is SystemPromptType {
  return SYSTEM_PROMPT_TYPES.includes(value as SystemPromptType)
}

export function getSystemPromptTypeLabel(
  promptType: string,
  dictionary: Dictionary
) {
  if (isSystemPromptType(promptType)) {
    return dictionary.systemPrompts.typeLabels[promptType]
  }

  return promptType
}

export function getSystemPromptWorkflowGroup(
  promptType: string,
  dictionary: Dictionary
) {
  if (isSystemPromptType(promptType)) {
    return dictionary.systemPrompts.workflowGroups[promptType]
  }

  return dictionary.systemPrompts.otherGroup
}

export function getSystemPromptTypeOptions(dictionary: Dictionary) {
  return SYSTEM_PROMPT_TYPES.map((type) => ({
    value: type,
    label: dictionary.systemPrompts.typeLabels[type],
    group: dictionary.systemPrompts.workflowGroups[type],
  }))
}

export function formatSystemPromptContentLength(
  content: string | undefined,
  dictionary: Dictionary,
  formatNumber: (value: number) => string = String
) {
  const length = content?.length ?? 0
  return formatMessage(dictionary.systemPrompts.contentLength, {
    count: formatNumber(length),
  })
}
