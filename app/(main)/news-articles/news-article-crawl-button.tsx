"use client"

import { RefreshCcw } from "lucide-react"
import { useRouter } from "next/navigation"
import { useTransition } from "react"
import { toast } from "sonner"

import { crawlNewsArticleFullContent } from "@/app/api/news-articles/action"
import { NEWS_ARTICLE_ANALYZE_PERMISSIONS } from "@/app/lib/news-articles/permissions"
import { useHasAnyPermission } from "@/components/permission-provider"
import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"
import { cn } from "@/lib/utils"

interface NewsArticleCrawlButtonProps {
  id: number
  variant?: "ghost" | "outline" | "default" | "secondary"
  size?: "default" | "sm" | "lg" | "icon" | "icon-sm"
  showText?: boolean
  className?: string
}

export function NewsArticleCrawlButton({
  id,
  variant = "outline",
  size = "sm",
  showText = true,
  className,
}: NewsArticleCrawlButtonProps) {
  const canCrawl = useHasAnyPermission(NEWS_ARTICLE_ANALYZE_PERMISSIONS)
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  const handleCrawl = () => {
    startTransition(async () => {
      const result = await crawlNewsArticleFullContent(id)

      if (result.success) {
        toast.success("Đã yêu cầu tải lại nội dung đầy đủ.")
        router.refresh()
        return
      }

      toast.error(result.error || "Không thể tải lại nội dung đầy đủ.")
    })
  }

  if (!canCrawl) {
    return null
  }

  return (
    <Button
      variant={variant}
      size={size}
      onClick={handleCrawl}
      disabled={isPending}
      className={cn(showText ? "gap-2" : undefined, className)}
    >
      {isPending ? (
        <Spinner className="h-4 w-4" data-icon="inline-start" />
      ) : (
        <RefreshCcw className="h-4 w-4" data-icon="inline-start" />
      )}
      {showText ? (
        <span>{isPending ? "Đang tải..." : "Tải lại nội dung"}</span>
      ) : (
        <span className="sr-only">Tải lại nội dung bài viết</span>
      )}
    </Button>
  )
}
