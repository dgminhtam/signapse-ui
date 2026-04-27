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

const SYSTEM_PROMPT_TYPE_LABELS: Record<SystemPromptType, string> = {
  NEWS_FILTER: "Lọc tin tức",
  NEWS_ANALYSIS: "Phân tích tin tức",
  SIGNAL_GENERATION: "Tạo tín hiệu",
  DECISION_MAKING: "Ra quyết định",
  CONTENT_EXTRACTION: "Trích xuất nội dung",
  SENTIMENT_ANALYSIS: "Phân tích cảm xúc",
  TITLE_GENERATION: "Tạo tiêu đề",
  SUMMARY_GENERATION: "Tạo tóm tắt",
  CONTENT_CLEANING: "Làm sạch nội dung",
  FIRECRAWL_SOURCE_DOCUMENT_FILTER: "Lọc tài liệu Firecrawl",
  NEWS_PRIMARY_EVENT_DERIVATION: "Suy luận sự kiện chính từ tin tức",
  EVENT_ASSET_THEME_ENRICHMENT: "Làm giàu tài sản và chủ đề",
  EVENT_GROUNDED_MARKET_QUERY_SYNTHESIS: "Tổng hợp truy vấn thị trường",
}

const SYSTEM_PROMPT_TYPE_GROUPS: Record<SystemPromptType, string> = {
  NEWS_FILTER: "Tin tức",
  NEWS_ANALYSIS: "Tin tức",
  SIGNAL_GENERATION: "Giao dịch / quyết định",
  DECISION_MAKING: "Giao dịch / quyết định",
  CONTENT_EXTRACTION: "Nội dung",
  SENTIMENT_ANALYSIS: "Nội dung",
  TITLE_GENERATION: "Nội dung",
  SUMMARY_GENERATION: "Nội dung",
  CONTENT_CLEANING: "Nội dung",
  FIRECRAWL_SOURCE_DOCUMENT_FILTER: "Tin tức",
  NEWS_PRIMARY_EVENT_DERIVATION: "Sự kiện",
  EVENT_ASSET_THEME_ENRICHMENT: "Sự kiện",
  EVENT_GROUNDED_MARKET_QUERY_SYNTHESIS: "Truy vấn thị trường",
}

export const SYSTEM_PROMPT_TYPE_OPTIONS = SYSTEM_PROMPT_TYPES.map((type) => ({
  value: type,
  label: SYSTEM_PROMPT_TYPE_LABELS[type],
  group: SYSTEM_PROMPT_TYPE_GROUPS[type],
}))

export function isSystemPromptType(value: string): value is SystemPromptType {
  return SYSTEM_PROMPT_TYPES.includes(value as SystemPromptType)
}

export function getSystemPromptTypeLabel(promptType: string) {
  if (isSystemPromptType(promptType)) {
    return SYSTEM_PROMPT_TYPE_LABELS[promptType]
  }

  return promptType
}

export function getSystemPromptWorkflowGroup(promptType: string) {
  if (isSystemPromptType(promptType)) {
    return SYSTEM_PROMPT_TYPE_GROUPS[promptType]
  }

  return "Khác"
}

export function formatSystemPromptContentLength(content?: string) {
  const length = content?.length ?? 0
  return `${length.toLocaleString("vi-VN")} ký tự`
}
