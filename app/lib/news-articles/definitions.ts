import type { EventStatus } from "@/app/lib/events/definitions"

export type NewsArticleStatus =
  | "INGESTED"
  | "DERIVATION_PENDING"
  | "EVENT_RESOLVED"
  | "NO_PRIMARY_EVENT"
  | "CONTENT_FAILED"
  | "DERIVATION_FAILED"

export type NewsPrimaryEventDerivationChangeType = "CREATED" | "UPDATED" | "NONE"

export type LinkedEventStatus = EventStatus

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
  eventCanonicalKey?: string
  eventStatus?: LinkedEventStatus
  evidenceRole?: LinkedEventEvidenceRole
  evidenceConfidence?: number
  evidenceNote?: string
}

export interface NewsArticleResponse extends NewsArticleListResponse {
  content?: string
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
