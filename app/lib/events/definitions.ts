export type EventStatus = "EMERGING" | "CONFIRMED" | "RESOLVED" | "ARCHIVED"

export type EventEnrichmentStatus = "PENDING" | "SUCCESS" | "NO_MATCH" | "FAILED"

export type EventAssetType = "COMMODITY" | "CRYPTO" | "FX" | "INDEX"

export type EventAssetRelationType =
  | "PRIMARY_SUBJECT"
  | "AFFECTED_ASSET"
  | "REFERENCE_ASSET"

export type EventThemeRelationType = "PRIMARY_THEME" | "SECONDARY_THEME"

export type EventSourceDocumentEvidenceRole =
  | "PRIMARY"
  | "SUPPORTING"
  | "UPDATE"
  | "CONTRADICTING"

export type EventEnrichmentOutcome = EventEnrichmentStatus

export interface EventListResponse {
  id: number
  title: string
  slug?: string
  canonicalKey?: string
  summary?: string
  status: EventStatus
  confidence?: number
  active: boolean
  occurredAt?: string
  confirmedAt?: string
  enrichmentStatus?: EventEnrichmentStatus
  enrichmentAttemptedAt?: string
  enrichmentCompletedAt?: string
  createdDate: string
  lastModifiedDate?: string
}

export interface EventAssetSummaryResponse {
  assetId?: number
  assetName?: string
  assetSymbol?: string
  assetType?: EventAssetType
  relationType?: EventAssetRelationType
  weight?: number
}

export interface EventThemeSummaryResponse {
  themeId?: number
  themeTitle?: string
  themeSlug?: string
  relationType?: EventThemeRelationType
  weight?: number
}

export interface EventEvidenceSummaryResponse {
  sourceDocumentId?: number
  sourceDocumentTitle?: string
  sourceDocumentUrl?: string
  sourceName?: string
  publishedAt?: string
  documentType?: "NEWS" | "ECONOMIC_CALENDAR" | "RESEARCH" | "MARKET_DATA" | "SENTIMENT" | "OTHER"
  evidenceRole?: EventSourceDocumentEvidenceRole
  confidence?: number
  evidenceNote?: string
}

export interface EventResponse extends EventListResponse {
  description?: string
  enrichmentError?: string
  assets: EventAssetSummaryResponse[]
  themes: EventThemeSummaryResponse[]
  evidence: EventEvidenceSummaryResponse[]
}

export interface EventEnrichmentResult {
  eventId?: number
  eventTitle?: string
  eventCanonicalKey?: string
  outcome: EventEnrichmentOutcome
  assetLinkCount?: number
  themeLinkCount?: number
  message?: string
}

export interface PendingEventEnrichmentBatchResult {
  requestedBatchSize?: number
  selectedCount?: number
  processedCount?: number
  skippedCount?: number
  enrichedCount?: number
  noMatchCount?: number
  failedCount?: number
  results?: EventEnrichmentResult[]
}

export const EVENT_STATUS_LABELS: Record<EventStatus, string> = {
  EMERGING: "Mới nổi",
  CONFIRMED: "Đã xác nhận",
  RESOLVED: "Đã kết thúc",
  ARCHIVED: "Lưu trữ",
}

export const EVENT_ENRICHMENT_STATUS_LABELS: Record<EventEnrichmentStatus, string> = {
  PENDING: "Đang chờ",
  SUCCESS: "Thành công",
  NO_MATCH: "Không khớp",
  FAILED: "Thất bại",
}

export const EVENT_ASSET_TYPE_LABELS: Record<EventAssetType, string> = {
  COMMODITY: "Hàng hóa",
  CRYPTO: "Tiền mã hóa",
  FX: "Ngoại hối",
  INDEX: "Chỉ số",
}

export const EVENT_ASSET_RELATION_LABELS: Record<EventAssetRelationType, string> = {
  PRIMARY_SUBJECT: "Chủ thể chính",
  AFFECTED_ASSET: "Tài sản bị ảnh hưởng",
  REFERENCE_ASSET: "Tài sản tham chiếu",
}

export const EVENT_THEME_RELATION_LABELS: Record<EventThemeRelationType, string> = {
  PRIMARY_THEME: "Chủ đề chính",
  SECONDARY_THEME: "Chủ đề phụ",
}

export const EVENT_EVIDENCE_ROLE_LABELS: Record<EventSourceDocumentEvidenceRole, string> = {
  PRIMARY: "Chính",
  SUPPORTING: "Hỗ trợ",
  UPDATE: "Cập nhật",
  CONTRADICTING: "Mâu thuẫn",
}
