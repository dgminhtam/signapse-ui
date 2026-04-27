import { ChevronRight, Layers3 } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { cn } from "@/lib/utils"

import { SectionEmpty, SectionHeading } from "./market-query-section"

export function ReasoningPanel({ reasoningChain }: { reasoningChain: string[] }) {
  return (
    <Collapsible className="group/collapsible rounded-2xl bg-muted/10 p-5">
      <div className="flex flex-col gap-5">
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <SectionHeading
            icon={Layers3}
            title="Quá trình tổng hợp"
            description="Được thu gọn mặc định để giữ nhịp đọc khi bạn chỉ cần kết luận và bằng chứng."
          />

          <CollapsibleTrigger asChild>
            <Button variant="outline" size="sm">
              <ChevronRight
                className="transition-transform group-data-[state=open]/collapsible:rotate-90"
                data-icon="inline-start"
              />
              {reasoningChain.length > 0
                ? `Xem ${reasoningChain.length} bước tổng hợp`
                : "Xem chi tiết tổng hợp"}
            </Button>
          </CollapsibleTrigger>
        </div>

        <CollapsibleContent className="overflow-hidden">
          {reasoningChain.length > 0 ? (
            <ol className="flex flex-col gap-3">
              {reasoningChain.map((step, index) => (
                <li
                  key={`${step}-${index}`}
                  className={cn(
                    "grid gap-3 rounded-xl border border-border bg-background/70 p-4",
                    "md:grid-cols-[auto_minmax(0,1fr)] md:items-start"
                  )}
                >
                  <div className="flex size-8 items-center justify-center rounded-full border border-border bg-background text-sm font-semibold text-foreground">
                    {index + 1}
                  </div>
                  <p className="text-sm leading-7 text-foreground/90">{step}</p>
                </li>
              ))}
            </ol>
          ) : (
            <SectionEmpty
              title="Chưa có chuỗi tổng hợp"
              description="Hệ thống chưa trả về chuỗi tổng hợp cho truy vấn này."
            />
          )}
        </CollapsibleContent>
      </div>
    </Collapsible>
  )
}
