"use client"

import { useRouter } from "next/navigation"
import { RefreshCcw } from "lucide-react"
import { useTransition } from "react"
import { toast } from "sonner"

import { crawlSourceDocumentFullContent } from "@/app/api/source-documents/action"
import { SOURCE_DOCUMENT_ANALYZE_PERMISSIONS } from "@/app/lib/source-documents/permissions"
import { useHasAnyPermission } from "@/components/permission-provider"
import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"
import { cn } from "@/lib/utils"

interface SourceDocumentCrawlButtonProps {
  id: number
  variant?: "ghost" | "outline" | "default" | "secondary"
  size?: "default" | "sm" | "lg" | "icon" | "icon-sm"
  showText?: boolean
  className?: string
}

export function SourceDocumentCrawlButton({
  id,
  variant = "outline",
  size = "sm",
  showText = true,
  className,
}: SourceDocumentCrawlButtonProps) {
  const canCrawl = useHasAnyPermission(SOURCE_DOCUMENT_ANALYZE_PERMISSIONS)
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  const handleCrawl = () => {
    startTransition(async () => {
      const result = await crawlSourceDocumentFullContent(id)

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
        <span className="sr-only">Tải lại nội dung</span>
      )}
    </Button>
  )
}
