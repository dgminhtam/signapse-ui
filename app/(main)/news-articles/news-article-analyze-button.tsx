"use client"

import { Sparkles } from "lucide-react"
import { useRouter } from "next/navigation"
import { useTransition } from "react"
import { toast } from "sonner"

import { analyzeNewsArticle } from "@/app/api/news-articles/action"
import { NEWS_ARTICLE_ANALYZE_PERMISSIONS } from "@/app/lib/news-articles/permissions"
import { useHasAnyPermission } from "@/components/permission-provider"
import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"
import { cn } from "@/lib/utils"

interface NewsArticleAnalyzeButtonProps {
  id: number
  variant?: "ghost" | "outline" | "default" | "secondary"
  size?: "default" | "sm" | "lg" | "icon" | "icon-sm"
  showText?: boolean
  className?: string
}

export function NewsArticleAnalyzeButton({
  id,
  variant = "ghost",
  size = "icon-sm",
  showText = false,
  className,
}: NewsArticleAnalyzeButtonProps) {
  const canAnalyze = useHasAnyPermission(NEWS_ARTICLE_ANALYZE_PERMISSIONS)
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  const handleAnalyze = () => {
    startTransition(async () => {
      const result = await analyzeNewsArticle(id)

      if (result.success) {
        toast.success("Da phan tich lai bai viet tin tuc.")
        router.refresh()
        return
      }

      toast.error(result.error || "Khong the phan tich bai viet tin tuc.")
    })
  }

  if (!canAnalyze) {
    return null
  }

  return (
    <Button
      variant={variant}
      size={size}
      onClick={handleAnalyze}
      disabled={isPending}
      className={cn(
        "text-primary hover:bg-primary/10 hover:text-primary",
        showText ? "gap-2 px-3" : undefined,
        className
      )}
    >
      {isPending ? (
        <Spinner className="h-4 w-4" data-icon="inline-start" />
      ) : (
        <Sparkles className="h-4 w-4" data-icon="inline-start" />
      )}
      {showText ? (
        <span>{isPending ? "Dang phan tich..." : "Phan tich AI"}</span>
      ) : (
        <span className="sr-only">Phan tich bai viet tin tuc</span>
      )}
    </Button>
  )
}
