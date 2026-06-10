"use client"

import { type FormEvent, type KeyboardEvent, useId } from "react"
import { ArrowUp } from "lucide-react"

import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupTextarea,
} from "@/components/ui/input-group"
import { Kbd } from "@/components/ui/kbd"
import { Spinner } from "@/components/ui/spinner"

interface MarketConversationComposerProps {
  value: string
  error: string | null
  isPending: boolean
  label: string
  placeholder: string
  submitLabel: string
  submittingLabel: string
  onChange: (value: string) => void
  onSubmit: (event: FormEvent<HTMLFormElement>) => void
  showEnterHint?: boolean
}

export function MarketConversationComposer({
  value,
  error,
  isPending,
  label,
  placeholder,
  submitLabel,
  submittingLabel,
  onChange,
  onSubmit,
  showEnterHint = false,
}: MarketConversationComposerProps) {
  const messageId = useId()

  function handleKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
    if (
      event.key === "Enter" &&
      !event.shiftKey &&
      !event.nativeEvent.isComposing
    ) {
      event.preventDefault()
      event.currentTarget.form?.requestSubmit()
    }
  }

  return (
    <form onSubmit={onSubmit} className="flex w-full flex-col gap-4">
      <FieldGroup>
        <Field data-invalid={!!error} data-disabled={isPending}>
          <FieldLabel htmlFor={messageId} className="sr-only">
            {label}
          </FieldLabel>
          <InputGroup className="rounded-3xl">
            <InputGroupTextarea
              id={messageId}
              value={value}
              onChange={(event) => onChange(event.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={placeholder}
              className="min-h-10 p-4"
              aria-invalid={error ? true : undefined}
              disabled={isPending}
              rows={4}
            />
            <InputGroupAddon align="block-end" className="justify-between">
              <InputGroupButton
                type="submit"
                variant="default"
                size="icon-sm"
                className="rounded-full"
                disabled={isPending}
                aria-label={isPending ? submittingLabel : submitLabel}
              >
                {isPending ? <Spinner /> : <ArrowUp />}
              </InputGroupButton>
            </InputGroupAddon>
          </InputGroup>
          <FieldError>{error}</FieldError>
        </Field>
      </FieldGroup>
    </form>
  )
}
