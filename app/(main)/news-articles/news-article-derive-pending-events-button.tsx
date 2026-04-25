"use client"

import { GitBranch } from "lucide-react"
import { useRouter } from "next/navigation"
import { useTransition } from "react"
import { toast } from "sonner"

import { derivePendingNewsArticleEvents } from "@/app/api/news-articles/action"
import { NEWS_ARTICLE_ANALYZE_PERMISSIONS } from "@/app/lib/news-articles/permissions"
import { useHasAnyPermission } from "@/components/permission-provider"
import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"
import { cn } from "@/lib/utils"

import {
  buildPendingNewsEventDerivationSummary,
  hasOnlyFailedPendingNewsEventDerivation,
} from "./news-article-derivation"

interface NewsArticleDerivePendingEventsButtonProps {
  batchSize?: number
  className?: string
}

export function NewsArticleDerivePendingEventsButton({
  batchSize,
  className,
}: NewsArticleDerivePendingEventsButtonProps) {
  const canDerive = useHasAnyPermission(NEWS_ARTICLE_ANALYZE_PERMISSIONS)
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  const handleDerivePending = () => {
    startTransition(async () => {
      const result = await derivePendingNewsArticleEvents(batchSize)

      if (!result.success) {
        toast.error(result.error || "Không thể suy diễn lô bài viết đang chờ.")
        return
      }

      const summary = buildPendingNewsEventDerivationSummary(result.data)
      if (hasOnlyFailedPendingNewsEventDerivation(result.data)) {
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
        <Spinner className="h-4 w-4" data-icon="inline-start" />
      ) : (
        <GitBranch className="h-4 w-4" data-icon="inline-start" />
      )}
      <span>{isPending ? "Đang suy diễn..." : "Suy diễn bài viết chờ"}</span>
    </Button>
  )
}
