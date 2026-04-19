"use client"

import { Sparkles } from "lucide-react"
import { useRouter } from "next/navigation"
import { useTransition } from "react"
import { toast } from "sonner"

import { enrichPendingEventAssetsAndThemes } from "@/app/api/events/action"
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
  const canEnrich = useHasAnyPermission(EVENT_ENRICH_PERMISSIONS)
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  const handleEnrichPending = () => {
    startTransition(async () => {
      const result = await enrichPendingEventAssetsAndThemes(batchSize)

      if (!result.success) {
        toast.error(result.error || "Không thể làm giàu các sự kiện đang chờ.")
        return
      }

      const summary = buildPendingEventEnrichmentSummary(result.data)
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
        <Spinner className="h-4 w-4" data-icon="inline-start" />
      ) : (
        <Sparkles className="h-4 w-4" data-icon="inline-start" />
      )}
      <span>{isPending ? "Đang làm giàu..." : "Làm giàu sự kiện chờ"}</span>
    </Button>
  )
}
