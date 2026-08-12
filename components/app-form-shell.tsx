import * as React from "react"

import { cn } from "@/lib/utils"

type AppFormShellWidth = "sm" | "md" | "lg"

const widthClassName: Record<AppFormShellWidth, string> = {
  sm: "max-w-xl",
  md: "max-w-2xl",
  lg: "max-w-3xl",
}

function AppFormShell({
  title,
  description,
  width = "md",
  className,
  children,
  ...props
}: React.ComponentProps<"section"> & {
  title: React.ReactNode
  description?: React.ReactNode
  width?: AppFormShellWidth
}) {
  return (
    <section
      data-slot="app-form-shell"
      className={cn(
        "w-full overflow-hidden rounded-xl border bg-card shadow-sm",
        widthClassName[width],
        className
      )}
      {...props}
    >
      <header className="flex flex-col gap-2 px-6 pt-6">
        <h1 className="text-xl font-semibold tracking-tight text-card-foreground">
          {title}
        </h1>
        {description ? (
          <p className="text-sm leading-6 text-muted-foreground">
            {description}
          </p>
        ) : null}
      </header>
      {children}
    </section>
  )
}

function AppFormShellBody({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="app-form-shell-body"
      className={cn("px-6 py-6", className)}
      {...props}
    />
  )
}

function AppFormShellFooter({
  className,
  ...props
}: React.ComponentProps<"footer">) {
  return (
    <footer
      data-slot="app-form-shell-footer"
      className={cn(
        "flex flex-col-reverse gap-3 border-t bg-muted/20 px-6 py-4 sm:flex-row sm:justify-end",
        className
      )}
      {...props}
    />
  )
}

function AppFormShellSkeleton({
  width = "md",
  className,
  children,
  ...props
}: React.ComponentProps<"section"> & {
  width?: AppFormShellWidth
}) {
  return (
    <section
      data-slot="app-form-shell-skeleton"
      className={cn(
        "w-full overflow-hidden rounded-xl border bg-card shadow-sm",
        widthClassName[width],
        className
      )}
      {...props}
    >
      {children}
    </section>
  )
}

export {
  AppFormShell,
  AppFormShellBody,
  AppFormShellFooter,
  AppFormShellSkeleton,
}
