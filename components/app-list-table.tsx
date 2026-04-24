"use client"

import * as React from "react"

import {
  Empty,
} from "@/components/ui/empty"
import {
  TableCell,
  TableHead,
  TableRow,
} from "@/components/ui/table"
import { cn } from "@/lib/utils"

function AppListTable({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="app-list-table"
      className={cn(
        "overflow-hidden rounded-md border border-border bg-card",
        className
      )}
      {...props}
    />
  )
}

function AppListTableHeaderRow({
  className,
  ...props
}: React.ComponentProps<typeof TableRow>) {
  return (
    <TableRow
      data-slot="app-list-table-header-row"
      className={cn("border-border bg-muted/40 hover:bg-muted/40", className)}
      {...props}
    />
  )
}

function AppListTableHead({
  className,
  ...props
}: React.ComponentProps<typeof TableHead>) {
  return (
    <TableHead
      data-slot="app-list-table-head"
      className={cn("font-semibold text-foreground", className)}
      {...props}
    />
  )
}

interface AppListTableEmptyStateProps {
  cellClassName?: string
  className?: string
  colSpan: number
  children: React.ReactNode
}

function AppListTableEmptyState({
  cellClassName,
  className,
  colSpan,
  children,
}: AppListTableEmptyStateProps) {
  return (
    <TableRow data-slot="app-list-table-empty-row">
      <TableCell colSpan={colSpan} className={cn("p-0", cellClassName)}>
        <Empty
          className={cn("min-h-[240px] rounded-none border-0 px-6 py-16", className)}
        >
          {children}
        </Empty>
      </TableCell>
    </TableRow>
  )
}

export {
  AppListTable,
  AppListTableEmptyState,
  AppListTableHead,
  AppListTableHeaderRow,
}
