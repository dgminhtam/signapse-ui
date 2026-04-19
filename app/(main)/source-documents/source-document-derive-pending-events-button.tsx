"use client"

import { GitBranch } from "lucide-react"
import { useRouter } from "next/navigation"
import { useTransition } from "react"
import { toast } from "sonner"

import { derivePendingNewsEvents } from "@/app/api/source-documents/action"
import { SOURCE_DOCUMENT_ANALYZE_PERMISSIONS } from "@/app/lib/source-documents/permissions"
import { useHasAnyPermission } from "@/components/permission-provider"
import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"
import { cn } from "@/lib/utils"

import {
  buildPendingNewsEventDerivationSummary,
  hasOnlyFailedPendingNewsEventDerivation,
} from "./source-document-event-derivation"

interface SourceDocumentDerivePendingEventsButtonProps {
  batchSize?: number
  className?: string
}

export function SourceDocumentDerivePendingEventsButton({
  batchSize,
  className,
}: SourceDocumentDerivePendingEventsButtonProps) {
  const canDerive = useHasAnyPermission(SOURCE_DOCUMENT_ANALYZE_PERMISSIONS)
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  const handleDerivePending = () => {
    startTransition(async () => {
      const result = await derivePendingNewsEvents(batchSize)

      if (!result.success) {
        toast.error(result.error || "Không thể suy diễn các tài liệu tin tức chờ.")
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
      <span>{isPending ? "Đang suy diễn..." : "Suy diễn tin chờ"}</span>
    </Button>
  )
}
