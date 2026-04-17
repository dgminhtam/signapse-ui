"use client"

import { EconomicEventListResponse } from "@/app/lib/economic-calendar/definitions"
import { Page } from "@/app/lib/definitions"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { AppPagination } from "@/components/app-pagination"
import { AppSelectPageSize } from "@/components/app-select-page-size"
import { useHasPermission } from "@/components/permission-provider"
import { SortSelect } from "@/components/sort-select"
import { EconomicCalendarSearch } from "./economic-calendar-search"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Empty,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
  EmptyDescription,
} from "@/components/ui/empty"
import {
  AlertTriangle,
  Minus,
  TrendingDown,
  Trash2,
  CalendarDays,
  Eye,
  RefreshCcw,
} from "lucide-react"
import Link from "next/link"
import { format } from "date-fns"
import { crawlEconomicEvents, deleteEconomicEvent } from "@/app/api/economic-calendar/action"
import { useRouter } from "next/navigation"
import { useTransition, useState } from "react"
import { toast } from "sonner"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Spinner } from "@/components/ui/spinner"

interface EconomicCalendarListProps {
  eventPage: Page<EconomicEventListResponse>
}

function getImpactBadge(impact: string) {
  switch (impact) {
    case "HIGH":
      return (
        <Badge variant="destructive" className="gap-1 bg-red-500/10 text-red-700 hover:bg-red-500/20">
          <AlertTriangle className="h-3 w-3" /> HIGH
        </Badge>
      )
    case "MEDIUM":
      return (
        <Badge variant="secondary" className="gap-1 bg-yellow-500/10 text-yellow-700 hover:bg-yellow-500/20">
          <Minus className="h-3 w-3" /> MEDIUM
        </Badge>
      )
    case "LOW":
      return (
        <Badge variant="secondary" className="gap-1 bg-green-500/10 text-green-700 hover:bg-green-500/20">
          <TrendingDown className="h-3 w-3" /> LOW
        </Badge>
      )
    default:
      return <Badge variant="secondary">{impact}</Badge>
  }
}

export function EconomicCalendarList({ eventPage }: EconomicCalendarListProps) {
  const events = eventPage?.content || []
  const canCrawlEvents = useHasPermission("event:crawl")
  const canDeleteEvent = useHasPermission("event:delete")

  return (
    <div className="w-full">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex w-full flex-1 items-center gap-4 sm:w-auto">
          {canCrawlEvents ? <CrawlButton /> : null}
          <EconomicCalendarSearch />
        </div>
        <div className="flex items-center gap-2">
          <SortSelect
            options={[
              { label: "Latest", value: "eventDate_desc" },
              { label: "Oldest", value: "eventDate_asc" },
              { label: "Title (A-Z)", value: "title_asc" },
              { label: "Country", value: "country_asc" },
            ]}
          />
        </div>
      </div>

      <div className="space-y-4">
        <div className="rounded-md border border-border bg-card">
          <Table>
            <TableHeader>
              <TableRow className="border-border hover:bg-transparent">
                <TableHead className="font-semibold text-foreground">Event / Country</TableHead>
                <TableHead className="text-center font-semibold text-foreground">Date</TableHead>
                <TableHead className="text-center font-semibold text-foreground">Impact</TableHead>
                <TableHead className="text-center font-semibold text-foreground">Previous</TableHead>
                <TableHead className="text-center font-semibold text-foreground">Forecast</TableHead>
                <TableHead className="text-center font-semibold text-foreground">Actual</TableHead>
                <TableHead className="text-center font-semibold text-foreground">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {events.length > 0 ? (
                events.map((event) => (
                  <TableRow key={event.id} className="border-border transition-colors hover:bg-muted/50">
                    <TableCell className="font-medium text-foreground">
                      <Link href={`/economic-calendar/${event.id}`} className="hover:underline">
                        {event.title}
                      </Link>
                      <div className="text-xs text-muted-foreground">{event.country}</div>
                    </TableCell>
                    <TableCell className="text-center text-muted-foreground tabular-nums">
                      {format(new Date(event.eventDate), "dd/MM/yyyy HH:mm")}
                    </TableCell>
                    <TableCell className="text-center">
                      {getImpactBadge(event.impact)}
                    </TableCell>
                    <TableCell className="text-center text-sm text-muted-foreground">
                      {event.previous || "-"}
                    </TableCell>
                    <TableCell className="text-center text-sm text-muted-foreground">
                      {event.forecast || "-"}
                    </TableCell>
                    <TableCell className="text-center text-sm font-semibold text-primary">
                      {event.actual || "-"}
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="flex items-center justify-center gap-1">
                        <Button asChild variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground">
                          <Link href={`/economic-calendar/${event.id}`}>
                            <Eye className="h-4 w-4" />
                          </Link>
                        </Button>
                        {canDeleteEvent ? <DeleteEventButton id={event.id} /> : null}
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="py-24 text-center">
                    <Empty>
                      <EmptyHeader>
                        <EmptyMedia variant="icon"><CalendarDays /></EmptyMedia>
                        <EmptyTitle>No events found</EmptyTitle>
                        <EmptyDescription>Try changing the filters or click Crawl to update the data.</EmptyDescription>
                      </EmptyHeader>
                    </Empty>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      <div className="my-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <AppSelectPageSize />
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">
             Page {(eventPage?.number ?? 0) + 1} of {eventPage?.totalPages ?? 0} ({eventPage?.totalElements ?? 0} events)
          </span>
        </div>
        <div className="flex gap-2">
          <AppPagination
            totalElements={eventPage?.totalElements ?? 0}
            itemsPerPage={eventPage?.size ?? 12}
          />
        </div>
      </div>
    </div>
  )
}

function CrawlButton() {
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  const handleCrawl = () => {
    startTransition(async () => {
      const result = await crawlEconomicEvents()
      if (result.success) {
        if (result.data && result.data > 0) {
          toast.success(`Crawl completed. ${result.data} event(s) imported.`)
        } else {
          toast.info("Crawl completed. No new events found.")
        }
        router.refresh()
      } else {
        toast.error(result.error)
      }
    })
  }

  return (
    <Button onClick={handleCrawl} disabled={isPending}>
      {isPending ? <Spinner className="size-4 mr-2" /> : <RefreshCcw className="h-4 w-4 mr-2" />}
      Crawl Events
    </Button>
  )
}

function DeleteEventButton({ id }: { id: number }) {
  const [isPending, startTransition] = useTransition()
  const [open, setOpen] = useState(false)
  const router = useRouter()

  const handleDelete = () => {
    startTransition(async () => {
      const result = await deleteEconomicEvent(id)
      if (result.success) {
        toast.success("Event deleted successfully")
        setOpen(false)
        router.refresh()
      } else {
        toast.error(result.error)
      }
    })
  }

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:bg-destructive/10 hover:text-destructive" title="Delete">
          <Trash2 className="h-4 w-4" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This event will be permanently removed from the system.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={(e) => { e.preventDefault(); handleDelete(); }} disabled={isPending} className="bg-red-500 hover:bg-red-600">
            {isPending ? "Deleting..." : "Delete"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
