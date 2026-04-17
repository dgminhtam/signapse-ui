"use client"

import { Button } from "@/components/ui/button"
import { Sparkles } from "lucide-react"
import { analyzeArticle } from "@/app/api/articles/action"
import { useTransition } from "react"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { Spinner } from "@/components/ui/spinner"
import { useHasPermission } from "@/components/permission-provider"
import { cn } from "@/lib/utils"

interface AnalyzeButtonProps {
  id: number
  variant?: "ghost" | "outline" | "default" | "secondary"
  size?: "default" | "sm" | "lg" | "icon"
  showText?: boolean
  className?: string
}

export function AnalyzeButton({
  id,
  variant = "ghost",
  size = "icon",
  showText = false,
  className
}: AnalyzeButtonProps) {
  const canAnalyzeArticle = useHasPermission("article:analyze")
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  const handleAnalyze = () => {
    startTransition(async () => {
      const result = await analyzeArticle(id)
      if (result.success) {
        toast.success("Article content analyzed and cleaned successfully")
        router.refresh()
      } else {
        toast.error(result.error || "Failed to analyze article")
      }
    })
  }

  if (!canAnalyzeArticle) {
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
        showText && "gap-2 px-3",
        className
      )}
    >
      {isPending ? (
        <Spinner className="h-4 w-4" data-icon="inline-start" />
      ) : (
        <Sparkles className="h-4 w-4" data-icon="inline-start" />
      )}
      {showText && <span>{isPending ? "Analyzing..." : "Analyze AI"}</span>}
      {!showText && <span className="sr-only">Analyze AI</span>}
    </Button>
  )
}
