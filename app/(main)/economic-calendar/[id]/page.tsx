import { getEconomicEventById } from "@/app/api/economic-calendar/action"
import { notFound } from "next/navigation"
import { hasPermission } from "@/app/lib/permissions"
import { getCurrentPermissions } from "@/app/lib/permissions-server"
import { AccessDenied } from "@/components/access-denied"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Calendar, Globe, AlertTriangle, Minus, TrendingDown, Info, Clock, RefreshCcw } from "lucide-react"
import Link from "next/link"
import { format } from "date-fns"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"

interface DetailPageProps {
  params: Promise<{ id: string }>
}

function getImpactBadge(impact: string) {
  switch (impact) {
    case "HIGH":
      return (
        <Badge variant="destructive" className="gap-1 bg-red-500/10 text-red-700">
          <AlertTriangle className="h-3 w-3" /> HIGH
        </Badge>
      )
    case "MEDIUM":
      return (
        <Badge variant="secondary" className="gap-1 bg-yellow-500/10 text-yellow-700">
          <Minus className="h-3 w-3" /> MEDIUM
        </Badge>
      )
    case "LOW":
      return (
        <Badge variant="secondary" className="gap-1 bg-green-500/10 text-green-700">
          <TrendingDown className="h-3 w-3" /> LOW
        </Badge>
      )
    default:
      return <Badge variant="secondary">{impact}</Badge>
  }
}

export default async function EconomicEventDetailPage({ params }: DetailPageProps) {
  const permissions = await getCurrentPermissions()

  if (!hasPermission(permissions, "event:read")) {
    return (
      <Card className="border-border bg-card">
        <CardHeader>
          <CardTitle>Economic Event Detail</CardTitle>
          <CardDescription>
            Review the details of a single economic calendar event.
          </CardDescription>
        </CardHeader>
        <Separator />
        <CardContent className="pt-6">
          <AccessDenied
            description="You do not have permission to view economic event details."
            permission="event:read"
          />
        </CardContent>
      </Card>
    )
  }

  const { id } = await params
  const event = await getEconomicEventById(Number(id))

  if (!event) {
    notFound()
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center">
        <Button asChild variant="ghost" size="sm" className="-ml-2">
          <Link href="/economic-calendar">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to list
          </Link>
        </Button>
      </div>

      <Card className="border-border bg-card">
        <CardHeader>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="space-y-1">
              <CardTitle className="text-2xl font-bold">{event.title}</CardTitle>
              <CardDescription className="flex flex-wrap items-center gap-4">
                <span className="flex items-center gap-1">
                  <Globe className="h-4 w-4" /> {event.country}
                </span>
                <span className="flex items-center gap-1 tabular-nums">
                  <Calendar className="h-4 w-4" /> {format(new Date(event.eventDate), "dd/MM/yyyy HH:mm")}
                </span>
              </CardDescription>
            </div>
            <div className="shrink-0">
              {getImpactBadge(event.impact)}
            </div>
          </div>
        </CardHeader>

        <Separator />

        <CardContent className="pt-6">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            <div className="space-y-6">
              <div>
                <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-muted-foreground">Economic Indicators</h3>
                <div className="grid grid-cols-3 gap-4 rounded-lg bg-muted/50 p-4">
                  <div className="text-center">
                    <p className="text-xs text-muted-foreground">Forecast</p>
                    <p className="text-lg font-medium">{event.forecast || "-"}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-muted-foreground">Previous</p>
                    <p className="text-lg font-medium">{event.previous || "-"}</p>
                  </div>
                  <div className="text-center border-l border-border">
                    <p className="text-xs text-muted-foreground">Actual</p>
                    <p className="text-xl font-bold text-primary">{event.actual || "-"}</p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="mb-2 flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                  <Info className="h-4 w-4" /> Event Description
                </h3>
                <p className="text-sm leading-relaxed text-foreground/80">
                  {event.description || "No detailed description available for this event."}
                </p>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-muted-foreground">System Information</h3>
                <div className="space-y-3 rounded-lg border p-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">External ID:</span>
                    <span className="font-mono text-xs font-medium">{event.externalKey || "N/A"}</span>
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between text-sm">
                    <span className="flex items-center gap-1 text-muted-foreground">
                        <Clock className="h-3.5 w-3.5" /> Created Date:
                    </span>
                    <span className="tabular-nums">{format(new Date(event.createdDate), "dd/MM/yyyy HH:mm")}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="flex items-center gap-1 text-muted-foreground">
                        <RefreshCcw className="h-3.5 w-3.5" /> Last Updated:
                    </span>
                    <span className="tabular-nums">{format(new Date(event.lastModifiedDate), "dd/MM/yyyy HH:mm")}</span>
                  </div>
                </div>
              </div>

              {event.externalKey && (
                <div className="rounded-lg bg-primary/5 p-4 border border-primary/10">
                   <p className="mb-2 text-xs font-semibold text-primary uppercase tracking-wide">Data Source</p>
                   <p className="text-sm text-muted-foreground">
                     This event is automatically synchronized from international macroeconomic data sources. Actual data will be updated immediately after announcement.
                   </p>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
