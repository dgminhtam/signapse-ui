"use client"

import { useEffect } from "react"
import { AlertCircle, RotateCcw } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

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
    <div className="flex min-h-[400px] items-center justify-center p-4">
      <Card className="max-w-md border-destructive/20 shadow-lg">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10">
            <AlertCircle className="h-6 w-6 text-destructive" />
          </div>
          <CardTitle className="text-xl font-bold">Không thể tải sự kiện</CardTitle>
          <CardDescription className="mt-2 text-muted-foreground">
            {error.message || "Đã có lỗi xảy ra trong khi tải dữ liệu sự kiện."}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center pb-8">
          <Button onClick={() => reset()} className="gap-2">
            <RotateCcw className="h-4 w-4" data-icon="inline-start" />
            Thử lại
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
