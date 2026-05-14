"use client"

import * as React from "react"

import {
  Field,
  FieldContent,
  FieldDescription,
  FieldLabel,
} from "@/components/ui/field"
import { Switch } from "@/components/ui/switch"
import { cn } from "@/lib/utils"

type AppFormSwitchFieldProps = {
  id: string
  label: React.ReactNode
  description?: React.ReactNode
  checked: boolean
  onCheckedChange: React.ComponentProps<typeof Switch>["onCheckedChange"]
  disabled?: boolean
  className?: string
}

function AppFormSwitchField({
  id,
  label,
  description,
  checked,
  onCheckedChange,
  disabled,
  className,
}: AppFormSwitchFieldProps) {
  const descriptionId = description ? `${id}-description` : undefined

  return (
    <Field
      data-disabled={disabled ? true : undefined}
      className={cn(
        "flex-row items-center justify-between gap-4 rounded-lg border bg-card px-3 py-2.5",
        className
      )}
    >
      <FieldContent className="min-w-0 gap-1">
        <FieldLabel htmlFor={id}>{label}</FieldLabel>
        {description ? (
          <FieldDescription id={descriptionId} className="text-xs">
            {description}
          </FieldDescription>
        ) : null}
      </FieldContent>
      <Switch
        id={id}
        checked={checked}
        onCheckedChange={onCheckedChange}
        disabled={disabled}
        aria-describedby={descriptionId}
      />
    </Field>
  )
}

export { AppFormSwitchField }
