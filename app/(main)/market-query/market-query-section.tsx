import { Layers3, type LucideIcon } from "lucide-react"

import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"
import { cn } from "@/lib/utils"

export function SectionHeading({
  icon: Icon,
  title,
  description,
}: {
  icon: LucideIcon
  title: string
  description?: string
}) {
  return (
    <div className="flex items-start gap-3">
      <div className="flex size-10 shrink-0 items-center justify-center rounded-xl border border-border bg-muted/30">
        <Icon className="size-4 text-muted-foreground" />
      </div>
      <div className="flex flex-col gap-1">
        <h2 className="text-sm font-semibold uppercase tracking-[0.18em] text-muted-foreground">
          {title}
        </h2>
        {description ? (
          <p className="text-sm leading-6 text-muted-foreground">{description}</p>
        ) : null}
      </div>
    </div>
  )
}

export function SectionEmpty({
  title,
  description,
}: {
  title: string
  description: string
}) {
  return (
    <Empty className="min-h-[180px] rounded-2xl border border-dashed border-border bg-muted/10">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <Layers3 className="size-5 text-muted-foreground" />
        </EmptyMedia>
        <EmptyTitle>{title}</EmptyTitle>
        <EmptyDescription>{description}</EmptyDescription>
      </EmptyHeader>
    </Empty>
  )
}

export function DetailValue({
  label,
  value,
  meta,
  valueClassName,
}: {
  label: string
  value: string
  meta?: string | null
  valueClassName?: string
}) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground">
        {label}
      </span>
      <p className={cn("text-sm leading-6 text-foreground", valueClassName)}>{value}</p>
      {meta ? <p className="text-xs leading-5 text-muted-foreground">{meta}</p> : null}
    </div>
  )
}
