"use client"

import { GitBranch } from "lucide-react"
import { useRouter } from "next/navigation"
import { useTransition } from "react"
import { toast } from "sonner"

import { derivePendingNewsArticleEvents } from "@/app/api/news-articles/action"
import { useLocalization } from "@/app/lib/i18n/provider"
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
  const { dictionary, formatNumber } = useLocalization()
  const canDerive = useHasAnyPermission(NEWS_ARTICLE_ANALYZE_PERMISSIONS)
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  const handleDerivePending = () => {
    startTransition(async () => {
      const result = await derivePendingNewsArticleEvents(batchSize)

      if (!result.success) {
        toast.error(result.error || dictionary.newsArticles.derivePendingError)
        return
      }

      const summary = buildPendingNewsEventDerivationSummary(
        result.data,
        dictionary,
        formatNumber
      )
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
        <Spinner data-icon="inline-start" />
      ) : (
        <GitBranch data-icon="inline-start" />
      )}
      <span>
        {isPending
          ? dictionary.newsArticles.deriveEventPending
          : dictionary.newsArticles.derivePending}
      </span>
    </Button>
  )
}
