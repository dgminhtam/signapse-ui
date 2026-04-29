"use client"

import { TrendingUp } from "lucide-react"
import { useRouter } from "next/navigation"
import { useTransition } from "react"
import { toast } from "sonner"

import { derivePendingEventMarketReactions } from "@/app/api/events/action"
import { EVENT_MARKET_REACTION_DERIVE_PERMISSIONS } from "@/app/lib/events/permissions"
import { useHasAnyPermission } from "@/components/permission-provider"
import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"
import { cn } from "@/lib/utils"

import {
  buildPendingEventMarketReactionDerivationSummary,
  hasOnlyFailedPendingEventMarketReactionDerivation,
} from "./event-presentation"

interface EventMarketReactionPendingButtonProps {
  batchSize?: number
  className?: string
}

export function EventMarketReactionPendingButton({
  batchSize,
  className,
}: EventMarketReactionPendingButtonProps) {
  const canDerive = useHasAnyPermission(
    EVENT_MARKET_REACTION_DERIVE_PERMISSIONS
  )
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  const handleDerivePending = () => {
    startTransition(async () => {
      const result = await derivePendingEventMarketReactions(batchSize)

      if (!result.success) {
        toast.error(
          result.error ||
            "Không thể suy luận tác động thị trường cho các sự kiện đang chờ."
        )
        return
      }

      const summary = buildPendingEventMarketReactionDerivationSummary(
        result.data
      )
      if (hasOnlyFailedPendingEventMarketReactionDerivation(result.data)) {
        toast.error(summary)
      } else {
        toast.success(summary)
      }

      router.refresh()
    })
  }

  if (!canDerive) {
    return null
  }

  return (
    <Button
      type="button"
      variant="outline"
      onClick={handleDerivePending}
      disabled={isPending}
      className={cn("gap-2", className)}
    >
      {isPending ? (
        <Spinner data-icon="inline-start" />
      ) : (
        <TrendingUp data-icon="inline-start" />
      )}
      <span>
        {isPending ? "Đang suy luận..." : "Suy luận tác động hàng loạt"}
      </span>
    </Button>
  )
}
