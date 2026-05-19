"use client"

import { Sparkles } from "lucide-react"
import { useRouter } from "next/navigation"
import { useTransition } from "react"
import { toast } from "sonner"

import { enrichPendingEventAssetsAndThemes } from "@/app/api/events/action"
import { useLocalization } from "@/app/lib/i18n/provider"
import { EVENT_ENRICH_PERMISSIONS } from "@/app/lib/events/permissions"
import { useHasAnyPermission } from "@/components/permission-provider"
import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"
import { cn } from "@/lib/utils"

import {
  buildPendingEventEnrichmentSummary,
  hasOnlyFailedPendingEventEnrichment,
} from "./event-presentation"

interface EventEnrichPendingButtonProps {
  batchSize?: number
  className?: string
}

export function EventEnrichPendingButton({
  batchSize,
  className,
}: EventEnrichPendingButtonProps) {
  const { dictionary, formatNumber } = useLocalization()
  const canEnrich = useHasAnyPermission(EVENT_ENRICH_PERMISSIONS)
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  const handleEnrichPending = () => {
    startTransition(async () => {
      const result = await enrichPendingEventAssetsAndThemes(batchSize)

      if (!result.success) {
        toast.error(result.error || dictionary.events.enrichPendingError)
        return
      }

      const summary = buildPendingEventEnrichmentSummary(
        result.data,
        dictionary,
        formatNumber
      )
      if (hasOnlyFailedPendingEventEnrichment(result.data)) {
        toast.error(summary)
      } else {
        toast.success(summary)
      }

      router.refresh()
    })
  }

  if (!canEnrich) {
    return null
  }

  return (
    <Button
      type="button"
      variant="outline"
      onClick={handleEnrichPending}
      disabled={isPending}
      className={cn("gap-2", className)}
    >
      {isPending ? (
        <Spinner data-icon="inline-start" />
      ) : (
        <Sparkles data-icon="inline-start" />
      )}
      <span>
        {isPending
          ? dictionary.events.enrichPending
          : dictionary.events.enrichPendingBatch}
      </span>
    </Button>
  )
}
