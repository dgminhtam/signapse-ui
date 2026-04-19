"use client"

import { Sparkles } from "lucide-react"
import { useRouter } from "next/navigation"
import { useTransition } from "react"
import { toast } from "sonner"

import { enrichEventAssetsAndThemes } from "@/app/api/events/action"
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
  const canEnrich = useHasAnyPermission(EVENT_ENRICH_PERMISSIONS)
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  const handleEnrich = () => {
    startTransition(async () => {
      const result = await enrichEventAssetsAndThemes(id)

      if (!result.success) {
        toast.error(result.error || "Không thể làm giàu liên kết tài sản và chủ đề.")
        return
      }

      const summary = buildEventEnrichmentSummary(result.data)
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
    >
      {isPending ? (
        <Spinner className="h-4 w-4" data-icon="inline-start" />
      ) : (
        <Sparkles className="h-4 w-4" data-icon="inline-start" />
      )}
      {showText ? (
        <span>{isPending ? "Đang làm giàu..." : "Làm giàu tài sản/chủ đề"}</span>
      ) : (
        <span className="sr-only">Làm giàu tài sản và chủ đề</span>
      )}
    </Button>
  )
}
