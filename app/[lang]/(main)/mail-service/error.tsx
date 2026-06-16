"use client"

import { useLocalization } from "@/app/lib/i18n/provider"
import { Button } from "@/components/ui/button"

export default function MailServiceError({
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  const { dictionary } = useLocalization()

  return (
    <div className="rounded-xl border bg-card p-6">
      <div className="flex max-w-2xl flex-col gap-4">
        <div className="flex flex-col gap-2">
          <h2 className="text-xl font-semibold tracking-tight">
            {dictionary.mailService.loadErrorTitle}
          </h2>
          <p className="text-sm text-muted-foreground">
            {dictionary.mailService.loadErrorDescription}
          </p>
        </div>
        <div>
          <Button type="button" onClick={reset}>
            {dictionary.common.retry}
          </Button>
        </div>
      </div>
    </div>
  )
}
