import type { Dictionary } from "@/app/lib/i18n/dictionary-types"
import { formatMessage } from "@/app/lib/i18n/messages"
import {
  NewsPrimaryEventDerivationResult,
  PendingNewsEventDerivationBatchResult,
} from "@/app/lib/news-articles/definitions"

export function isPrimaryEventDerivationFailure(
  result: NewsPrimaryEventDerivationResult
) {
  return result.status === "DERIVATION_FAILED"
}

export function buildPrimaryEventDerivationSummary(
  result: NewsPrimaryEventDerivationResult,
  dictionary: Dictionary
) {
  const parts: string[] = []
  const summary = dictionary.newsArticles.derivationSummary

  switch (result.status) {
    case "EVENT_RESOLVED":
      switch (result.changeType) {
        case "CREATED":
          parts.push(summary.eventCreated)
          break
        case "UPDATED":
          parts.push(summary.eventUpdated)
          break
        case "NONE":
          parts.push(summary.eventUnchanged)
          break
        default:
          parts.push(summary.eventResolved)
          break
      }
      break
    case "NO_PRIMARY_EVENT":
      parts.push(summary.noPrimaryEvent)
      break
    case "DERIVATION_PENDING":
      parts.push(summary.pending)
      break
    case "DERIVATION_FAILED":
      parts.push(summary.failed)
      break
    case "CONTENT_FAILED":
      parts.push(summary.contentFailed)
      break
    case "INGESTED":
      parts.push(summary.ingested)
      break
    default:
      parts.push(summary.received)
      break
  }

  if (result.changeType && result.status !== "EVENT_RESOLVED") {
    parts.push(
      formatMessage(summary.changeStatus, {
        value: dictionary.newsArticles.changeTypeLabels[result.changeType],
      })
    )
  }

  if (result.status) {
    parts.push(
      formatMessage(summary.articleStatus, {
        value: dictionary.newsArticles.statusLabels[result.status],
      })
    )
  }

  if (result.eventCanonicalKey) {
    parts.push(formatMessage(summary.eventKey, { value: result.eventCanonicalKey }))
  } else if (typeof result.eventId === "number") {
    parts.push(formatMessage(summary.eventId, { value: result.eventId }))
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
  result: PendingNewsEventDerivationBatchResult,
  dictionary: Dictionary,
  formatNumberValue: (value: number) => string = String
) {
  const selectedCount = result.selectedCount ?? 0

  if (selectedCount === 0) {
    return dictionary.newsArticles.derivationSummary.noPending
  }

  return formatMessage(dictionary.newsArticles.derivationSummary.batch, {
    processed: formatNumberValue(result.processedCount ?? 0),
    selected: formatNumberValue(selectedCount),
    created: formatNumberValue(result.createdCount ?? 0),
    updated: formatNumberValue(result.updatedCount ?? 0),
    noEvent: formatNumberValue(result.noEventCount ?? 0),
    skipped: formatNumberValue(result.skippedCount ?? 0),
    failed: formatNumberValue(result.failedCount ?? 0),
  })
}
