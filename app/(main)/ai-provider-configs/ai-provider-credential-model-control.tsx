"use client"

import { KeyRound } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"
import { cn } from "@/lib/utils"

interface AiProviderCredentialModelActionButtonProps {
  model: string
  isPending: boolean
  disabled: boolean
  onClick: () => void
  className?: string
}

export function AiProviderCredentialModelActionButton({
  model,
  isPending,
  disabled,
  onClick,
  className,
}: AiProviderCredentialModelActionButtonProps) {
  const label = isPending
    ? "Đang kiểm tra..."
    : model
      ? "Đổi model"
      : "Chọn model"

  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      className={cn("min-w-36 justify-start", className)}
      onClick={onClick}
      disabled={disabled}
      aria-label="Xác thực API key và chọn model"
    >
      {isPending ? (
        <Spinner data-icon="inline-start" />
      ) : (
        <KeyRound data-icon="inline-start" />
      )}
      {label}
    </Button>
  )
}

interface AiProviderCredentialModelSummaryProps {
  model: string
  invalid?: boolean
}

export function AiProviderCredentialModelSummary({
  model,
  invalid,
}: AiProviderCredentialModelSummaryProps) {
  return (
    <div
      className={cn(
        "flex h-9 w-full min-w-0 items-center rounded-lg border border-dashed border-border bg-muted/20 px-2.5 py-1 text-sm transition-[color,box-shadow]",
        "aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 dark:bg-input/30 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40"
      )}
      aria-invalid={invalid || undefined}
    >
      <span
        className={cn(
          "min-w-0 truncate",
          model ? "text-foreground" : "text-muted-foreground"
        )}
      >
        {model || "Chưa chọn model"}
      </span>
    </div>
  )
}
