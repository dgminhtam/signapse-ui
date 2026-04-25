"use client"

import { GitBranch } from "lucide-react"
import { useRouter } from "next/navigation"
import { useTransition } from "react"
import { toast } from "sonner"

import { derivePrimaryEventFromNewsArticle } from "@/app/api/news-articles/action"
import { NEWS_ARTICLE_ANALYZE_PERMISSIONS } from "@/app/lib/news-articles/permissions"
import { useHasAnyPermission } from "@/components/permission-provider"
import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"
import { cn } from "@/lib/utils"

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
  const canDerive = useHasAnyPermission(NEWS_ARTICLE_ANALYZE_PERMISSIONS)
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  const handleDerive = () => {
    startTransition(async () => {
      const result = await derivePrimaryEventFromNewsArticle(id)

      if (!result.success) {
        toast.error(result.error || "Không thể suy diễn sự kiện chính.")
        return
      }

      const summary = buildPrimaryEventDerivationSummary(result.data)
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
      className={cn(showText ? "gap-2" : undefined, className)}
    >
      {isPending ? (
        <Spinner className="h-4 w-4" data-icon="inline-start" />
      ) : (
        <GitBranch className="h-4 w-4" data-icon="inline-start" />
      )}
      {showText ? (
        <span>{isPending ? "Đang suy diễn..." : "Suy diễn sự kiện chính"}</span>
      ) : (
        <span className="sr-only">Suy diễn sự kiện chính</span>
      )}
    </Button>
  )
}
