export type SourceDocumentType =
  | "NEWS"
  | "ECONOMIC_CALENDAR"
  | "RESEARCH"
  | "MARKET_DATA"
  | "SENTIMENT"
  | "OTHER"

export type SourceDocumentLifecycleStatus =
  | "DISCOVERED"
  | "RAW_CAPTURED"
  | "HYDRATED"
  | "NORMALIZED"
  | "FAILED"

export type SourceDocumentContentCrawlStatus = "PENDING" | "SUCCESS" | "FAILED"

export type SourceDocumentEventDerivationStatus =
  | "PENDING"
  | "SUCCESS"
  | "NO_EVENT"
  | "FAILED"

export type NewsPrimaryEventDerivationOutcome = SourceDocumentEventDerivationStatus

export type NewsPrimaryEventDerivationChangeType = "CREATED" | "UPDATED" | "NONE"

export type LinkedEventStatus = "EMERGING" | "CONFIRMED" | "RESOLVED" | "ARCHIVED"

export type LinkedEventEnrichmentStatus = "PENDING" | "SUCCESS" | "NO_MATCH" | "FAILED"

export type LinkedEventEvidenceRole = "PRIMARY" | "SUPPORTING" | "UPDATE" | "CONTRADICTING"

export interface MediaResponse {
  id: number
  name: string
  altText?: string
  urlOriginal: string
  urlLarge?: string
  urlMedium?: string
  urlThumbnail?: string
  size?: number
}

export interface MediaReferenceRequest {
  mediaId: number
}

export interface SourceDocumentListResponse {
  id: number
  title: string
  description?: string
  url: string
  featureImage?: MediaResponse
  sourceName: string
  publishedAt?: string
  documentType: SourceDocumentType
  lifecycleStatus: SourceDocumentLifecycleStatus
  contentCrawlStatus: SourceDocumentContentCrawlStatus
  eventDerivationStatus?: SourceDocumentEventDerivationStatus
  createdDate: string
}

export interface LinkedEventSummaryResponse {
  eventId?: number
  eventTitle?: string
  eventSlug?: string
  eventCanonicalKey?: string
  eventStatus?: LinkedEventStatus
  eventEnrichmentStatus?: LinkedEventEnrichmentStatus
  evidenceRole?: LinkedEventEvidenceRole
  evidenceConfidence?: number
  evidenceNote?: string
}

export interface SourceDocumentResponse extends SourceDocumentListResponse {
  content?: string
  author?: string
  externalId?: string
  externalKey?: string
  countryCode?: string
  importance?: string
  scheduledAt?: string
  actualizedAt?: string
  forecastValue?: string
  previousValue?: string
  actualValue?: string
  contentCrawlAttemptedAt?: string
  contentCrawlError?: string
  eventDerivationAttemptedAt?: string
  eventDerivationCompletedAt?: string
  eventDerivationError?: string
  linkedEvents?: LinkedEventSummaryResponse[]
  lastModifiedDate?: string
}

export interface NewsPrimaryEventDerivationResult {
  sourceDocumentId?: number
  sourceDocumentTitle?: string
  outcome: NewsPrimaryEventDerivationOutcome
  changeType?: NewsPrimaryEventDerivationChangeType
  eventId?: number
  eventCanonicalKey?: string
  message?: string
}

export interface PendingNewsEventDerivationBatchResult {
  requestedBatchSize?: number
  selectedCount?: number
  processedCount?: number
  skippedCount?: number
  createdCount?: number
  updatedCount?: number
  noEventCount?: number
  failedCount?: number
  results?: NewsPrimaryEventDerivationResult[]
}

export const SOURCE_DOCUMENT_TYPE_LABELS: Record<SourceDocumentType, string> = {
  NEWS: "Tin tức",
  ECONOMIC_CALENDAR: "Lịch kinh tế",
  RESEARCH: "Nghiên cứu",
  MARKET_DATA: "Dữ liệu thị trường",
  SENTIMENT: "Tâm lý thị trường",
  OTHER: "Khác",
}

export const SOURCE_DOCUMENT_CRAWL_STATUS_LABELS: Record<
  SourceDocumentContentCrawlStatus,
  string
> = {
  PENDING: "Đang chờ",
  SUCCESS: "Thành công",
  FAILED: "Thất bại",
}

export const SOURCE_DOCUMENT_LIFECYCLE_LABELS: Record<
  SourceDocumentLifecycleStatus,
  string
> = {
  DISCOVERED: "Mới phát hiện",
  RAW_CAPTURED: "Đã thu thập thô",
  HYDRATED: "Đã bổ sung nội dung",
  NORMALIZED: "Đã chuẩn hóa",
  FAILED: "Thất bại",
}

export const SOURCE_DOCUMENT_EVENT_DERIVATION_STATUS_LABELS: Record<
  SourceDocumentEventDerivationStatus,
  string
> = {
  PENDING: "Đang chờ",
  SUCCESS: "Thành công",
  NO_EVENT: "Không có sự kiện",
  FAILED: "Thất bại",
}

export const NEWS_PRIMARY_EVENT_DERIVATION_CHANGE_TYPE_LABELS: Record<
  NewsPrimaryEventDerivationChangeType,
  string
> = {
  CREATED: "Tạo mới",
  UPDATED: "Cập nhật",
  NONE: "Không thay đổi",
}

export const LINKED_EVENT_EVIDENCE_ROLE_LABELS: Record<LinkedEventEvidenceRole, string> = {
  PRIMARY: "Chính",
  SUPPORTING: "Hỗ trợ",
  UPDATE: "Cập nhật",
  CONTRADICTING: "Mâu thuẫn",
}
