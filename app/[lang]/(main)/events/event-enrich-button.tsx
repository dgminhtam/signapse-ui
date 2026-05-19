"use client"

import { Sparkles } from "lucide-react"
import { useRouter } from "next/navigation"
import { useTransition } from "react"
import { toast } from "sonner"

import { enrichEventAssetsAndThemes } from "@/app/api/events/action"
import { useLocalization } from "@/app/lib/i18n/provider"
import { EVENT_ENRICH_PERMISSIONS } from "@/app/lib/events/permissions"
import { useHasAnyPermission } from "@/components/permission-provider"
import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"
import { cn } from "@/lib/utils"

import { buildEventEnrichmentSummary, isEventEnrichmentFailure } from "./event-presentation"

interface EventEnrichButtonProps {
  id: number
  variant?: "ghost" | "outline" | "default" | "secondary"
  size?: "default" | "sm" | "lg" | "icon" | "icon-sm"
  showText?: boolean
  className?: string
}

export function EventEnrichButton({
  id,
  variant = "default",
  size = "sm",
  showText = true,
  className,
}: EventEnrichButtonProps) {
  const { dictionary, formatNumber } = useLocalization()
  const canEnrich = useHasAnyPermission(EVENT_ENRICH_PERMISSIONS)
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  const handleEnrich = () => {
    startTransition(async () => {
      const result = await enrichEventAssetsAndThemes(id)

      if (!result.success) {
        toast.error(result.error || dictionary.events.enrichError)
        return
      }

      const summary = buildEventEnrichmentSummary(
        result.data,
        dictionary,
        formatNumber
      )
      if (isEventEnrichmentFailure(result.data)) {
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
      variant={variant}
      size={size}
      onClick={handleEnrich}
      disabled={isPending}
      className={cn(showText ? "gap-2" : undefined, className)}
      aria-label={dictionary.events.enrichAria}
    >
      {isPending ? (
        <Spinner data-icon="inline-start" />
      ) : (
        <Sparkles data-icon="inline-start" />
      )}
      {showText ? (
        <span>
          {isPending ? dictionary.events.enrichPending : dictionary.events.enrich}
        </span>
      ) : (
        <span className="sr-only">{dictionary.events.enrichAria}</span>
      )}
    </Button>
  )
}
