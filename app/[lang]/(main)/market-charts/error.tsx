"use client"

import { useEffect } from "react"
import { ChartCandlestick, RotateCcw } from "lucide-react"

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
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  const { dictionary } = useLocalization()

  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <Empty className="min-h-[420px] rounded-[28px] border border-dashed border-destructive/20 bg-destructive/5">
      <EmptyHeader>
        <EmptyMedia variant="icon" className="bg-destructive/10 text-destructive">
          <ChartCandlestick />
        </EmptyMedia>
        <EmptyTitle>{dictionary.marketCharts.errorTitle}</EmptyTitle>
        <EmptyDescription>
          {error.message || dictionary.marketCharts.errorDescription}
        </EmptyDescription>
      </EmptyHeader>

      <Button onClick={() => reset()} variant="outline">
        <RotateCcw data-icon="inline-start" />
        {dictionary.common.retry}
      </Button>
    </Empty>
  )
}
