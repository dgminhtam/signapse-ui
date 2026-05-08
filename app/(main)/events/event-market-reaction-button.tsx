"use client"

import { TrendingUp } from "lucide-react"
import { useRouter } from "next/navigation"
import { useTransition } from "react"
import { toast } from "sonner"

import { deriveEventMarketReactions } from "@/app/api/events/action"
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
  const canDerive = useHasAnyPermission(
    EVENT_MARKET_REACTION_DERIVE_PERMISSIONS
  )
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  const handleDerive = () => {
    startTransition(async () => {
      const result = await deriveEventMarketReactions(id)

      if (!result.success) {
        toast.error(
          result.error || "Không thể suy luận tác động thị trường cho sự kiện."
        )
        return
      }

      toast.success(buildEventMarketReactionDerivationSummary(result.data))
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
      aria-label="Suy luận tác động thị trường"
    >
      {isPending ? (
        <Spinner data-icon="inline-start" />
      ) : (
        <TrendingUp data-icon="inline-start" />
      )}
      {showText ? (
        <span>
          {isPending ? "Đang suy luận..." : "Tác động"}
        </span>
      ) : (
        <span className="sr-only">Suy luận tác động thị trường</span>
      )}
    </Button>
  )
}
