"use client"

import { format } from "date-fns"
import { RefreshCcw } from "lucide-react"
import { useRouter } from "next/navigation"
import { useTransition } from "react"
import { toast } from "sonner"

import { syncEconomicCalendarEntries } from "@/app/api/economic-calendar/action"
import type { EconomicCalendarSyncResponse } from "@/app/lib/economic-calendar/definitions"
import { ECONOMIC_CALENDAR_SYNC_PERMISSIONS } from "@/app/lib/economic-calendar/permissions"
import { useHasAnyPermission } from "@/components/permission-provider"
import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"
import { cn } from "@/lib/utils"

interface EconomicCalendarSyncButtonProps {
  className?: string
}

function formatDateTime(value?: string) {
  if (!value) {
    return null
  }

  const date = new Date(value)

  if (Number.isNaN(date.getTime())) {
    return null
  }

  return format(date, "dd/MM/yyyy HH:mm")
}

function buildSyncSummary(result: EconomicCalendarSyncResponse) {
  const parts = [
    `đã lấy ${result.fetchedCount ?? 0}`,
    `tạo mới ${result.createdCount ?? 0}`,
    `cập nhật ${result.updatedCount ?? 0}`,
    `bỏ qua ${result.skippedCount ?? 0}`,
  ]
  const syncedAt = formatDateTime(result.syncedAt)

  return syncedAt
    ? `Đã đồng bộ lịch kinh tế: ${parts.join(", ")}. Thời điểm đồng bộ: ${syncedAt}.`
    : `Đã đồng bộ lịch kinh tế: ${parts.join(", ")}.`
}

export function EconomicCalendarSyncButton({
  className,
}: EconomicCalendarSyncButtonProps) {
  const canSync = useHasAnyPermission(ECONOMIC_CALENDAR_SYNC_PERMISSIONS)
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  const handleSync = () => {
    startTransition(async () => {
      const result = await syncEconomicCalendarEntries()

      if (!result.success) {
        toast.error(result.error || "Không thể đồng bộ lịch kinh tế.")
        return
      }

      toast.success(buildSyncSummary(result.data))
      router.refresh()
    })
  }

  if (!canSync) {
    return null
  }

  return (
    <Button
      type="button"
      variant="outline"
      onClick={handleSync}
      disabled={isPending}
      className={cn("gap-2", className)}
    >
      {isPending ? (
        <Spinner className="h-4 w-4" data-icon="inline-start" />
      ) : (
        <RefreshCcw className="h-4 w-4" data-icon="inline-start" />
      )}
      <span>{isPending ? "Đang đồng bộ..." : "Đồng bộ lịch kinh tế"}</span>
    </Button>
  )
}
