"use client"

import { useRouter } from "next/navigation"
import { Sparkles } from "lucide-react"
import { useTransition } from "react"
import { toast } from "sonner"

import { analyzeSourceDocument } from "@/app/api/source-documents/action"
import { SOURCE_DOCUMENT_ANALYZE_PERMISSIONS } from "@/app/lib/source-documents/permissions"
import { useHasAnyPermission } from "@/components/permission-provider"
import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"
import { cn } from "@/lib/utils"

interface SourceDocumentAnalyzeButtonProps {
  id: number
  variant?: "ghost" | "outline" | "default" | "secondary"
  size?: "default" | "sm" | "lg" | "icon" | "icon-sm"
  showText?: boolean
  className?: string
}

export function SourceDocumentAnalyzeButton({
  id,
  variant = "ghost",
  size = "icon-sm",
  showText = false,
  className,
}: SourceDocumentAnalyzeButtonProps) {
  const canAnalyze = useHasAnyPermission(SOURCE_DOCUMENT_ANALYZE_PERMISSIONS)
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  const handleAnalyze = () => {
    startTransition(async () => {
      const result = await analyzeSourceDocument(id)

      if (result.success) {
        toast.success("Đã phân tích lại tài liệu nguồn.")
        router.refresh()
        return
      }

      toast.error(result.error || "Không thể phân tích tài liệu nguồn.")
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
        <span>{isPending ? "Đang phân tích..." : "Phân tích AI"}</span>
      ) : (
        <span className="sr-only">Phân tích tài liệu nguồn</span>
      )}
    </Button>
  )
}
