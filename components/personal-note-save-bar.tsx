"use client"

import { SaveIcon } from "lucide-react"

import { useLocalization } from "@/app/lib/i18n/provider"
import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"
import { cn } from "@/lib/utils"

interface PersonalNoteSaveBarProps {
  canSave: boolean
  className?: string
  dirty: boolean
  isPending: boolean
  onCancel?: () => void
  onSave: () => void
  savedLabel?: string
}

function PersonalNoteSaveBar({
  canSave,
  className,
  dirty,
  isPending,
  onCancel,
  onSave,
  savedLabel,
}: PersonalNoteSaveBarProps) {
  const { dictionary } = useLocalization()
  const resolvedSavedLabel = savedLabel ?? dictionary.personalNotes.unsaved
  const statusLabel = isPending
    ? dictionary.personalNotes.saving
    : dirty
      ? dictionary.personalNotes.dirty
      : resolvedSavedLabel

  return (
    <div
      className={cn(
        "flex flex-col gap-2 border-t bg-muted/20 p-4 sm:flex-row sm:items-center sm:justify-between",
        className
      )}
    >
      <p className="text-xs text-muted-foreground">{statusLabel}</p>
      <div className="flex flex-col gap-2 sm:flex-row sm:justify-end">
        {onCancel ? (
          <Button
            type="button"
            variant="ghost"
            disabled={isPending}
            onClick={onCancel}
          >
            {dictionary.common.cancel}
          </Button>
        ) : null}
        <Button
          type="button"
          disabled={!canSave || isPending}
          onClick={onSave}
        >
          {isPending ? (
            <Spinner data-icon="inline-start" />
          ) : (
            <SaveIcon data-icon="inline-start" />
          )}
          {dictionary.common.save}
        </Button>
      </div>
    </div>
  )
}

export { PersonalNoteSaveBar }
