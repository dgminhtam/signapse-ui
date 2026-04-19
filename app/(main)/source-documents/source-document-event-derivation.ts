import {
  NEWS_PRIMARY_EVENT_DERIVATION_CHANGE_TYPE_LABELS,
  NewsPrimaryEventDerivationResult,
  PendingNewsEventDerivationBatchResult,
  SOURCE_DOCUMENT_EVENT_DERIVATION_STATUS_LABELS,
  SourceDocumentEventDerivationStatus,
} from "@/app/lib/source-documents/definitions"

export function getSourceDocumentEventDerivationLabel(
  status?: SourceDocumentEventDerivationStatus
) {
  if (!status) {
    return "Chưa suy diễn"
  }

  return SOURCE_DOCUMENT_EVENT_DERIVATION_STATUS_LABELS[status]
}

export function getSourceDocumentEventDerivationVariant(
  status?: SourceDocumentEventDerivationStatus
): "outline" | "secondary" | "destructive" {
  if (status === "FAILED") {
    return "destructive"
  }

  if (status === "SUCCESS") {
    return "secondary"
  }

  return "outline"
}

export function isPrimaryEventDerivationFailure(
  result: NewsPrimaryEventDerivationResult
) {
  return result.outcome === "FAILED"
}

export function buildPrimaryEventDerivationSummary(
  result: NewsPrimaryEventDerivationResult
) {
  const parts: string[] = []

  switch (result.outcome) {
    case "SUCCESS":
      switch (result.changeType) {
        case "CREATED":
          parts.push("Đã suy diễn và tạo sự kiện mới.")
          break
        case "UPDATED":
          parts.push("Đã suy diễn và cập nhật sự kiện hiện có.")
          break
        case "NONE":
          parts.push("Đã suy diễn nhưng không thay đổi sự kiện hiện có.")
          break
        default:
          parts.push("Đã suy diễn sự kiện chính thành công.")
          break
      }
      break
    case "NO_EVENT":
      parts.push("Đã suy diễn nhưng chưa tìm thấy sự kiện phù hợp.")
      break
    case "PENDING":
      parts.push("Yêu cầu suy diễn đã được tiếp nhận.")
      break
    case "FAILED":
      parts.push("Suy diễn sự kiện chính không thành công.")
      break
  }

  if (result.changeType && result.outcome !== "SUCCESS") {
    parts.push(
      `Trạng thái thay đổi: ${NEWS_PRIMARY_EVENT_DERIVATION_CHANGE_TYPE_LABELS[
        result.changeType
      ].toLowerCase()}.`
    )
  }

  if (result.eventCanonicalKey) {
    parts.push(`Khóa sự kiện: ${result.eventCanonicalKey}.`)
  } else if (typeof result.eventId === "number") {
    parts.push(`ID sự kiện: ${result.eventId}.`)
  }

  if (result.message?.trim()) {
    parts.push(result.message.trim())
  }

  return parts.join(" ")
}

export function hasOnlyFailedPendingNewsEventDerivation(
  result: PendingNewsEventDerivationBatchResult
) {
  const successfulCount =
    (result.createdCount ?? 0) +
    (result.updatedCount ?? 0) +
    (result.noEventCount ?? 0)

  return (result.failedCount ?? 0) > 0 && successfulCount === 0
}

export function buildPendingNewsEventDerivationSummary(
  result: PendingNewsEventDerivationBatchResult
) {
  const selectedCount = result.selectedCount ?? 0

  if (selectedCount === 0) {
    return "Không có tài liệu tin tức chờ suy diễn trong lô hiện tại."
  }

  const parts = [
    `đã xử lý ${result.processedCount ?? 0}/${selectedCount}`,
    `tạo mới ${result.createdCount ?? 0}`,
    `cập nhật ${result.updatedCount ?? 0}`,
    `không có sự kiện ${result.noEventCount ?? 0}`,
    `bỏ qua ${result.skippedCount ?? 0}`,
    `lỗi ${result.failedCount ?? 0}`,
  ]

  return `Đã chạy suy diễn cho tài liệu tin tức chờ: ${parts.join(", ")}.`
}
