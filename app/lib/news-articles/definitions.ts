export type NewsArticleStatus =
  | "INGESTED"
  | "DERIVATION_PENDING"
  | "EVENT_RESOLVED"
  | "NO_PRIMARY_EVENT"
  | "CONTENT_FAILED"
  | "DERIVATION_FAILED"

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

export interface NewsArticleListResponse {
  id: number
  title: string
  description?: string
  url: string
  featureImage?: MediaResponse
  newsOutletId?: number
  newsOutletName?: string
  publishedAt?: string
  status: NewsArticleStatus
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

export interface NewsArticleResponse extends NewsArticleListResponse {
  content?: string
  externalKey?: string
  linkedEvents?: LinkedEventSummaryResponse[]
  lastModifiedDate?: string
}

export interface NewsPrimaryEventDerivationResult {
  newsArticleId?: number
  newsArticleTitle?: string
  status?: NewsArticleStatus
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

export const NEWS_ARTICLE_STATUS_LABELS: Record<NewsArticleStatus, string> = {
  INGESTED: "Đã nạp",
  DERIVATION_PENDING: "Chờ suy diễn",
  EVENT_RESOLVED: "Đã gắn sự kiện",
  NO_PRIMARY_EVENT: "Không có sự kiện chính",
  CONTENT_FAILED: "Lỗi nội dung",
  DERIVATION_FAILED: "Lỗi suy diễn",
}

export const NEWS_PRIMARY_EVENT_DERIVATION_CHANGE_TYPE_LABELS: Record<
  NewsPrimaryEventDerivationChangeType,
  string
> = {
  CREATED: "Tạo mới",
  UPDATED: "Cập nhật",
  NONE: "Không đổi",
}

export const LINKED_EVENT_EVIDENCE_ROLE_LABELS: Record<LinkedEventEvidenceRole, string> = {
  PRIMARY: "Chính",
  SUPPORTING: "Hỗ trợ",
  UPDATE: "Cập nhật",
  CONTRADICTING: "Mâu thuẫn",
}

export function getNewsArticleStatusVariant(
  status?: NewsArticleStatus
): "outline" | "secondary" | "destructive" {
  if (!status) {
    return "outline"
  }

  if (status === "EVENT_RESOLVED") {
    return "secondary"
  }

  if (status === "CONTENT_FAILED" || status === "DERIVATION_FAILED") {
    return "destructive"
  }

  return "outline"
}
