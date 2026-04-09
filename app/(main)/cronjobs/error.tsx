"use client"

import { Button } from "@/components/ui/button"
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"
import { AlertCircle, RefreshCcw } from "lucide-react"

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
          <EmptyMedia
            variant="icon"
            className="bg-destructive/10 text-destructive"
          >
            <AlertCircle />
          </EmptyMedia>
          <EmptyTitle>Something went wrong</EmptyTitle>
          <EmptyDescription>
            {error.message ||
              "Could not load cronjob list due to an internal connection error."}
          </EmptyDescription>
        </EmptyHeader>
        <div className="mt-4 flex justify-center">
          <Button onClick={() => reset()} variant="outline">
            <RefreshCcw data-icon="inline-start" /> Try Again
          </Button>
        </div>
      </Empty>
    </div>
  )
}
