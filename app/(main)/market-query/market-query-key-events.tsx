import { GitBranch } from "lucide-react"
import Link from "next/link"

import type { MarketQueryKeyEventResponse } from "@/app/lib/market-query/definitions"
import { Badge } from "@/components/ui/badge"

import {
  formatConfidence,
  formatDateTime,
  formatEventFallbackMeta,
  getConfidenceVariant,
} from "./market-query-format"
import { SectionEmpty, SectionHeading } from "./market-query-section"

export function KeyEventsList({
  keyEvents,
  canReadEvents,
}: {
  keyEvents: MarketQueryKeyEventResponse[]
  canReadEvents: boolean
}) {
  return (
    <section className="rounded-2xl bg-muted/10 p-5">
      <div className="flex flex-col gap-5">
        <SectionHeading
          icon={GitBranch}
          title="Sự kiện trọng yếu"
          description="Những diễn biến nổi bật để đối chiếu thêm sau khi đã đọc kết luận và bằng chứng."
        />

        {keyEvents.length > 0 ? (
          <div className="grid gap-4 xl:grid-cols-2">
            {keyEvents.map((event, index) => (
              <KeyEventCard
                key={`${event.id ?? "event"}-${index}`}
                event={event}
                canReadEvents={canReadEvents}
              />
            ))}
          </div>
        ) : (
          <SectionEmpty
            title="Chưa có sự kiện trọng yếu"
            description="Truy vấn này chưa trả về danh sách sự kiện nổi bật để đối chiếu thêm."
          />
        )}
      </div>
    </section>
  )
}

function KeyEventCard({
  event,
  canReadEvents,
}: {
  event: MarketQueryKeyEventResponse
  canReadEvents: boolean
}) {
  const title = event.title?.trim() || "Sự kiện chưa có tiêu đề"
  const fallbackMeta = !event.title?.trim() ? formatEventFallbackMeta(event.id) : null
  const canOpenEvent = canReadEvents && typeof event.id === "number"

  return (
    <article className="flex h-full flex-col gap-4 rounded-xl border border-border bg-background/75 p-4">
      <div className="flex flex-wrap items-center gap-2">
        <Badge variant={getConfidenceVariant(event.confidence)}>
          Độ tin cậy {formatConfidence(event.confidence)}
        </Badge>
        {event.occurredAt ? <Badge variant="outline">{formatDateTime(event.occurredAt)}</Badge> : null}
      </div>

      <div className="flex flex-col gap-2">
        {canOpenEvent ? (
          <Link href={`/events/${event.id}`} className="font-semibold text-foreground hover:underline">
            {title}
          </Link>
        ) : (
          <p className="font-semibold text-foreground">{title}</p>
        )}
        {fallbackMeta ? <p className="text-xs leading-5 text-muted-foreground">{fallbackMeta}</p> : null}
        <p className="text-sm leading-6 text-muted-foreground">
          {event.summary?.trim() || "Chưa có tóm tắt chi tiết cho sự kiện này."}
        </p>
      </div>

      <div className="mt-auto grid gap-3 sm:grid-cols-2">
        <div className="flex flex-col gap-2">
          <span className="text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground">
            Tài sản liên quan
          </span>
          {event.assetSymbols && event.assetSymbols.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {event.assetSymbols.map((assetSymbol) => (
                <Badge key={assetSymbol} variant="secondary">
                  {assetSymbol}
                </Badge>
              ))}
            </div>
          ) : (
            <span className="text-sm text-muted-foreground">Chưa có tài sản liên quan.</span>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <span className="text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground">
            Chủ đề
          </span>
          {event.themeSlugs && event.themeSlugs.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {event.themeSlugs.map((themeSlug) => (
                <Badge key={themeSlug} variant="outline">
                  {themeSlug}
                </Badge>
              ))}
            </div>
          ) : (
            <span className="text-sm text-muted-foreground">Chưa có chủ đề liên quan.</span>
          )}
        </div>
      </div>
    </article>
  )
}
