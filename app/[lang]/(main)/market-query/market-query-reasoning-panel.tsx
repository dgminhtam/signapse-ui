import { ChevronRight, Layers3 } from "lucide-react"

import { useLocalization } from "@/app/lib/i18n/provider"
import { Button } from "@/components/ui/button"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { cn } from "@/lib/utils"

import { SectionEmpty, SectionHeading } from "./market-query-section"

export function ReasoningPanel({ reasoningChain }: { reasoningChain: string[] }) {
  const { dictionary, formatMessage, formatNumber } = useLocalization()

  return (
    <Collapsible className="group/collapsible rounded-2xl bg-muted/10 p-5">
      <div className="flex flex-col gap-5">
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <SectionHeading
            icon={Layers3}
            title={dictionary.marketQuery.reasoning.title}
            description={dictionary.marketQuery.reasoning.description}
          />

          <CollapsibleTrigger asChild>
            <Button variant="outline" size="sm">
              <ChevronRight
                className="transition-transform group-data-[state=open]/collapsible:rotate-90"
                data-icon="inline-start"
              />
              {reasoningChain.length > 0
                ? formatMessage(dictionary.marketQuery.reasoning.viewSteps, {
                    count: formatNumber(reasoningChain.length),
                  })
                : dictionary.marketQuery.reasoning.viewDetails}
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
              title={dictionary.marketQuery.reasoning.emptyTitle}
              description={dictionary.marketQuery.reasoning.emptyDescription}
            />
          )}
        </CollapsibleContent>
      </div>
    </Collapsible>
  )
}
