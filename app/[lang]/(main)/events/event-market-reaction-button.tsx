"use client"

import { TrendingUp } from "lucide-react"
import { useRouter } from "next/navigation"
import { useTransition } from "react"
import { toast } from "sonner"

import { deriveEventMarketReactions } from "@/app/api/events/action"
import { useLocalization } from "@/app/lib/i18n/provider"
import { EVENT_MARKET_REACTION_DERIVE_PERMISSIONS } from "@/app/lib/events/permissions"
import { useHasAnyPermission } from "@/components/permission-provider"
import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"
import { cn } from "@/lib/utils"

import { buildEventMarketReactionDerivationSummary } from "./event-presentation"

interface EventMarketReactionButtonProps {
  id: number
  variant?: "ghost" | "outline" | "default" | "secondary"
  size?: "default" | "sm" | "lg" | "icon" | "icon-sm"
  showText?: boolean
  className?: string
}

export function EventMarketReactionButton({
  id,
  variant = "default",
  size = "sm",
  showText = true,
  className,
}: EventMarketReactionButtonProps) {
  const { dictionary, formatNumber } = useLocalization()
  const canDerive = useHasAnyPermission(
    EVENT_MARKET_REACTION_DERIVE_PERMISSIONS
  )
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  const handleDerive = () => {
    startTransition(async () => {
      const result = await deriveEventMarketReactions(id)

      if (!result.success) {
        toast.error(result.error || dictionary.events.marketReactionError)
        return
      }

      toast.success(
        buildEventMarketReactionDerivationSummary(
          result.data,
          dictionary,
          formatNumber
        )
      )
      router.refresh()
    })
  }

  if (!canDerive) {
    return null
  }

  return (
    <Button
      type="button"
      variant={variant}
      size={size}
      onClick={handleDerive}
      disabled={isPending}
      className={cn(showText ? "gap-2" : undefined, className)}
      aria-label={dictionary.events.marketReactionAria}
    >
      {isPending ? (
        <Spinner data-icon="inline-start" />
      ) : (
        <TrendingUp data-icon="inline-start" />
      )}
      {showText ? (
        <span>
          {isPending
            ? dictionary.events.marketReactionPending
            : dictionary.events.marketReaction}
        </span>
      ) : (
        <span className="sr-only">{dictionary.events.marketReactionAria}</span>
      )}
    </Button>
  )
}
