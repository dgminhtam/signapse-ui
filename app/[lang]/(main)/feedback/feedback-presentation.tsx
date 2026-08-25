"use client"

import {
  CircleCheck,
  CircleDashed,
  CircleX,
  FileQuestion,
  Image as ImageIcon,
} from "lucide-react"

import type {
  FeedbackRecord,
  FeedbackStatus,
  FeedbackType,
} from "@/app/lib/feedback/definitions"
import { useLocalization } from "@/app/lib/i18n/provider"
import { Badge } from "@/components/ui/badge"

const statusIcons: Record<FeedbackStatus, typeof CircleDashed> = {
  PENDING_REVIEW: CircleDashed,
  PROMOTED: CircleCheck,
  DISMISSED: CircleX,
}

export function FeedbackStatusBadge({ status }: { status: FeedbackStatus }) {
  const { dictionary } = useLocalization()
  const Icon = statusIcons[status]
  const variant =
    status === "PROMOTED"
      ? "default"
      : status === "DISMISSED"
        ? "secondary"
        : "outline"

  return (
    <Badge variant={variant} className="gap-1.5 whitespace-nowrap">
      <Icon className="size-3.5" aria-hidden="true" />
      {dictionary.feedback.statuses[status]}
    </Badge>
  )
}

export function FeedbackTypeBadge({ type }: { type: FeedbackType }) {
  const { dictionary } = useLocalization()

  return (
    <Badge variant="outline" className="whitespace-nowrap">
      {dictionary.feedback.types[type]}
    </Badge>
  )
}

export function FeedbackScreenshotView({
  screenshot,
  compact = false,
}: {
  screenshot: FeedbackRecord["screenshot"]
  compact?: boolean
}) {
  const { dictionary, formatMessage, formatNumber } = useLocalization()

  if (!screenshot) {
    return (
      <span className="inline-flex items-center gap-1.5 text-sm text-muted-foreground">
        <ImageIcon className="size-4" aria-hidden="true" />
        {dictionary.feedback.screenshotAbsent}
      </span>
    )
  }

  if (screenshot.previewable && screenshot.previewUrl) {
    return (
      <div
        className={compact ? "flex items-center gap-2" : "flex flex-col gap-3"}
      >
        <img
          src={screenshot.previewUrl}
          alt={dictionary.feedback.screenshotPreviewAlt}
          className={
            compact
              ? "size-10 rounded object-cover"
              : "max-h-72 w-full rounded-lg border object-contain"
          }
        />
        {!compact ? (
          <span className="text-sm text-muted-foreground">
            {formatMessage(dictionary.feedback.screenshotMetadata, {
              name: screenshot.name,
              type: screenshot.mimeType,
              size: `${formatNumber(screenshot.size)} B`,
            })}
          </span>
        ) : null}
      </div>
    )
  }

  return (
    <span className="inline-flex min-w-0 items-start gap-2 text-sm text-muted-foreground">
      <FileQuestion className="size-4 shrink-0" aria-hidden="true" />
      <span className="min-w-0" title={screenshot.name}>
        <span className="block truncate">
          {dictionary.feedback.screenshotUnsupported}
        </span>
        {!compact ? (
          <span className="mt-1 block text-xs">
            {formatMessage(dictionary.feedback.screenshotMetadata, {
              name: screenshot.name,
              type: screenshot.mimeType,
              size: `${formatNumber(screenshot.size)} B`,
            })}
          </span>
        ) : null}
      </span>
    </span>
  )
}
