"use client"

import * as React from "react"

import { cn } from "@/lib/utils"

function AppListToolbar({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="app-list-toolbar"
      className={cn(
        "mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between",
        className
      )}
      {...props}
    />
  )
}

function AppListToolbarLeading({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="app-list-toolbar-leading"
      className={cn(
        "flex w-full min-w-0 flex-1 flex-col gap-4 sm:w-auto sm:flex-row sm:items-center",
        className
      )}
      {...props}
    />
  )
}

function AppListToolbarTrailing({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="app-list-toolbar-trailing"
      className={cn(
        "flex w-full flex-col gap-2 rounded-xl border border-border/60 bg-muted/20 p-2 sm:w-auto sm:flex-row sm:flex-wrap sm:items-center sm:justify-end",
        className
      )}
      {...props}
    />
  )
}

export { AppListToolbar, AppListToolbarLeading, AppListToolbarTrailing }
