import {
  EVENT_ENRICHMENT_STATUS_LABELS,
  EVENT_STATUS_LABELS,
  EventEnrichmentResult,
  EventEnrichmentStatus,
  EventStatus,
  PendingEventEnrichmentBatchResult,
} from "@/app/lib/events/definitions"

export function getEventStatusLabel(status: EventStatus) {
  return EVENT_STATUS_LABELS[status]
}

export function getEventStatusVariant(
  status: EventStatus
): "default" | "secondary" | "outline" {
  switch (status) {
    case "CONFIRMED":
      return "default"
    case "RESOLVED":
      return "secondary"
    case "EMERGING":
    case "ARCHIVED":
    default:
      return "outline"
  }
}

export function getEventEnrichmentLabel(status?: EventEnrichmentStatus) {
  if (!status) {
    return "Chưa làm giàu"
  }

  return EVENT_ENRICHMENT_STATUS_LABELS[status]
}

export function getEventEnrichmentVariant(
  status?: EventEnrichmentStatus
): "secondary" | "outline" | "destructive" {
  if (status === "FAILED") {
    return "destructive"
  }

  if (status === "SUCCESS") {
    return "secondary"
  }

  return "outline"
}

export function isEventEnrichmentFailure(result: EventEnrichmentResult) {
  return result.outcome === "FAILED"
}

export function buildEventEnrichmentSummary(result: EventEnrichmentResult) {
  const parts: string[] = []

  switch (result.outcome) {
    case "SUCCESS":
      parts.push("Đã làm giàu liên kết tài sản và chủ đề cho sự kiện.")
      break
    case "NO_MATCH":
      parts.push("Đã chạy làm giàu nhưng chưa tìm thấy liên kết phù hợp.")
      break
    case "PENDING":
      parts.push("Yêu cầu làm giàu sự kiện đã được tiếp nhận.")
      break
    case "FAILED":
      parts.push("Làm giàu liên kết tài sản và chủ đề không thành công.")
      break
  }

  if (
    typeof result.assetLinkCount === "number" ||
    typeof result.themeLinkCount === "number"
  ) {
    parts.push(
      `Tài sản: ${result.assetLinkCount ?? 0}, chủ đề: ${result.themeLinkCount ?? 0}.`
    )
  }

  if (result.message?.trim()) {
    parts.push(result.message.trim())
  }

  return parts.join(" ")
}

export function hasOnlyFailedPendingEventEnrichment(
  result: PendingEventEnrichmentBatchResult
) {
  return (result.failedCount ?? 0) > 0 && (result.enrichedCount ?? 0) === 0 && (result.noMatchCount ?? 0) === 0
}

export function buildPendingEventEnrichmentSummary(
  result: PendingEventEnrichmentBatchResult
) {
  const selectedCount = result.selectedCount ?? 0

  if (selectedCount === 0) {
    return "Không có sự kiện nào đang chờ làm giàu trong lô hiện tại."
  }

  const parts = [
    `đã xử lý ${result.processedCount ?? 0}/${selectedCount}`,
    `thành công ${result.enrichedCount ?? 0}`,
    `không khớp ${result.noMatchCount ?? 0}`,
    `bỏ qua ${result.skippedCount ?? 0}`,
    `lỗi ${result.failedCount ?? 0}`,
  ]

  return `Đã chạy làm giàu cho sự kiện chờ: ${parts.join(", ")}.`
}
