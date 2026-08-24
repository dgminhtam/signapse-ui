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

export default function Error({
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  const { dictionary } = useLocalization()

  return (
    <div
      className="mx-auto flex min-h-72 w-full max-w-3xl items-center justify-center"
      role="alert"
    >
      <Empty className="w-full">
        <EmptyHeader>
          <EmptyMedia
            variant="icon"
            className="bg-destructive/10 text-destructive"
          >
            <AlertCircle />
          </EmptyMedia>
          <EmptyTitle>{dictionary.accountProfile.errorTitle}</EmptyTitle>
          <EmptyDescription>
            {dictionary.accountProfile.errorDescription}
          </EmptyDescription>
        </EmptyHeader>
        <div className="mt-4 flex justify-center">
          <Button onClick={() => reset()} variant="outline">
            <RefreshCcw data-icon="inline-start" />
            {dictionary.common.retry}
          </Button>
        </div>
      </Empty>
    </div>
  )
}
