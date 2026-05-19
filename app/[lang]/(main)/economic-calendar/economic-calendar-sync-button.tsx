"use client"

import { RefreshCcw } from "lucide-react"
import { useRouter } from "next/navigation"
import { useTransition } from "react"
import { toast } from "sonner"

import { syncEconomicCalendarEntries } from "@/app/api/economic-calendar/action"
import { useLocalization } from "@/app/lib/i18n/provider"
import { ECONOMIC_CALENDAR_SYNC_PERMISSIONS } from "@/app/lib/economic-calendar/permissions"
import { useHasAnyPermission } from "@/components/permission-provider"
import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"
import { cn } from "@/lib/utils"

interface EconomicCalendarSyncButtonProps {
  className?: string
}

export function EconomicCalendarSyncButton({
  className,
}: EconomicCalendarSyncButtonProps) {
  const { dictionary, formatDateTime, formatMessage, formatNumber } =
    useLocalization()
  const canSync = useHasAnyPermission(ECONOMIC_CALENDAR_SYNC_PERMISSIONS)
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  const handleSync = () => {
    startTransition(async () => {
      const result = await syncEconomicCalendarEntries()

      if (!result.success) {
        toast.error(result.error || dictionary.economicCalendar.syncError)
        return
      }

      const syncedAt = result.data.syncedAt
        ? formatDateTime(
            result.data.syncedAt,
            {
              year: "numeric",
              month: "2-digit",
              day: "2-digit",
              hour: "2-digit",
              minute: "2-digit",
            },
            ""
          )
        : ""

      toast.success(
        formatMessage(
          syncedAt
            ? dictionary.economicCalendar.syncSummaryWithTime
            : dictionary.economicCalendar.syncSummary,
          {
            fetched: formatNumber(result.data.fetchedCount ?? 0),
            created: formatNumber(result.data.createdCount ?? 0),
            updated: formatNumber(result.data.updatedCount ?? 0),
            skipped: formatNumber(result.data.skippedCount ?? 0),
            time: syncedAt,
          }
        )
      )
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
        <Spinner data-icon="inline-start" />
      ) : (
        <RefreshCcw data-icon="inline-start" />
      )}
      <span>
        {isPending
          ? dictionary.economicCalendar.syncPending
          : dictionary.economicCalendar.sync}
      </span>
    </Button>
  )
}
