"use client"

import { AlertCircle, RefreshCcw } from "lucide-react"

import { useLocalization } from "@/app/lib/i18n/provider"
import { Button } from "@/components/ui/button"
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"

export default function FeedbackSubmissionsError({
  reset,
}: {
  reset: () => void
}) {
  const { dictionary } = useLocalization()
  return (
    <Empty className="min-h-[360px] border">
      <EmptyHeader>
        <EmptyMedia
          variant="icon"
          className="bg-destructive text-destructive-foreground"
        >
          <AlertCircle />
        </EmptyMedia>
        <EmptyTitle>{dictionary.feedback.queueErrorTitle}</EmptyTitle>
        <EmptyDescription>
          {dictionary.feedback.queueErrorDescription}
        </EmptyDescription>
      </EmptyHeader>
      <Button type="button" variant="outline" onClick={reset}>
        <RefreshCcw data-icon="inline-start" />
        {dictionary.feedback.queueRetry}
      </Button>
    </Empty>
  )
}
