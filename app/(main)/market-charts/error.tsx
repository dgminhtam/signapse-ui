"use client"

import { useEffect } from "react"
import { ChartCandlestick, RotateCcw } from "lucide-react"

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
        <EmptyMedia variant="icon" className="bg-destructive/10 text-destructive">
          <ChartCandlestick />
        </EmptyMedia>
        <EmptyTitle>Không thể tải biểu đồ giá</EmptyTitle>
        <EmptyDescription>
          {error.message ||
            "Đã có lỗi xảy ra trong khi tải bề mặt biểu đồ giá thị trường."}
        </EmptyDescription>
      </EmptyHeader>

      <Button onClick={() => reset()} variant="outline">
        <RotateCcw data-icon="inline-start" />
        Thử lại
      </Button>
    </Empty>
  )
}
