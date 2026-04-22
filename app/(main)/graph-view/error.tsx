"use client"

import { useEffect } from "react"
import { RotateCcw, Share2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <Empty className="min-h-[420px] rounded-[28px] border border-dashed border-destructive/20 bg-destructive/5">
      <EmptyHeader>
        <EmptyMedia
          variant="icon"
          className="bg-destructive/10 text-destructive"
        >
          <Share2 />
        </EmptyMedia>
        <EmptyTitle>Không thể tải biểu đồ tri thức</EmptyTitle>
        <EmptyDescription>
          {error.message ||
            "Đã có lỗi xảy ra trong khi tải bề mặt duyệt tri thức."}
        </EmptyDescription>
      </EmptyHeader>

      <Button onClick={() => reset()} variant="outline">
        <RotateCcw data-icon="inline-start" />
        Thử lại
      </Button>
    </Empty>
  )
}
