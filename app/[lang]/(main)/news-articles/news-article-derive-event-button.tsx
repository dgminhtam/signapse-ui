"use client"

import { GitBranch } from "lucide-react"
import { useRouter } from "next/navigation"
import { useTransition } from "react"
import { toast } from "sonner"

import { derivePrimaryEventFromNewsArticle } from "@/app/api/news-articles/action"
import { useLocalization } from "@/app/lib/i18n/provider"
import { NEWS_ARTICLE_ANALYZE_PERMISSIONS } from "@/app/lib/news-articles/permissions"
import { useHasAnyPermission } from "@/components/permission-provider"
import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"

import {
  buildPrimaryEventDerivationSummary,
  isPrimaryEventDerivationFailure,
} from "./news-article-derivation"

interface NewsArticleDeriveEventButtonProps {
  id: number
  variant?: "ghost" | "outline" | "default" | "secondary"
  size?: "default" | "sm" | "lg" | "icon" | "icon-sm"
  showText?: boolean
  className?: string
}

export function NewsArticleDeriveEventButton({
  id,
  variant = "default",
  size = "sm",
  showText = true,
  className,
}: NewsArticleDeriveEventButtonProps) {
  const { dictionary } = useLocalization()
  const canDerive = useHasAnyPermission(NEWS_ARTICLE_ANALYZE_PERMISSIONS)
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  const handleDerive = () => {
    startTransition(async () => {
      const result = await derivePrimaryEventFromNewsArticle(id)

      if (!result.success) {
        toast.error(result.error || dictionary.newsArticles.deriveEventError)
        return
      }

      const summary = buildPrimaryEventDerivationSummary(
        result.data,
        dictionary
      )
      if (isPrimaryEventDerivationFailure(result.data)) {
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
      variant={variant}
      size={size}
      onClick={handleDerive}
      disabled={isPending}
      className={className}
      aria-label={showText ? dictionary.newsArticles.deriveEventAria : undefined}
    >
      {isPending ? (
        <Spinner data-icon="inline-start" />
      ) : (
        <GitBranch data-icon="inline-start" />
      )}
      {showText ? (
        <span>
          {isPending
            ? dictionary.newsArticles.deriveEventPending
            : dictionary.newsArticles.deriveEvent}
        </span>
      ) : (
        <span className="sr-only">
          {dictionary.newsArticles.deriveEventAria}
        </span>
      )}
    </Button>
  )
}
