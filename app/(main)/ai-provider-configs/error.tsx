"use client"

import { AlertCircle, RefreshCcw } from "lucide-react"

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
  return (
    <div className="flex h-[400px] w-full items-center justify-center">
      <Empty>
        <EmptyHeader>
          <EmptyMedia variant="icon" className="bg-destructive/10 text-destructive">
            <AlertCircle />
          </EmptyMedia>
          <EmptyTitle>Đã xảy ra lỗi</EmptyTitle>
          <EmptyDescription>
            {error.message || "Không thể tải cấu hình nhà cung cấp AI do lỗi hệ thống."}
          </EmptyDescription>
        </EmptyHeader>
        <div className="mt-4 flex justify-center">
          <Button onClick={() => reset()} variant="outline">
            <RefreshCcw data-icon="inline-start" />
            Thử lại
          </Button>
        </div>
      </Empty>
    </div>
  )
}
