import { type FormEvent } from "react"
import { ChevronRight, SearchCheck, Sparkles } from "lucide-react"

import { useLocalization } from "@/app/lib/i18n/provider"
import { Button } from "@/components/ui/button"
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Spinner } from "@/components/ui/spinner"
import { Textarea } from "@/components/ui/textarea"

import { getExamplePrompts } from "./market-query-format"
import { SectionHeading } from "./market-query-section"

interface MarketQueryComposerProps {
  question: string
  questionId: string
  questionError: string | null
  isPending: boolean
  showExamples: boolean
  onQuestionChange: (value: string) => void
  onExampleClick: (prompt: string) => void
  onSubmit: (event: FormEvent<HTMLFormElement>) => void
}

export function MarketQueryComposer({
  question,
  questionId,
  questionError,
  isPending,
  showExamples,
  onQuestionChange,
  onExampleClick,
  onSubmit,
}: MarketQueryComposerProps) {
  const { dictionary } = useLocalization()
  const examplePrompts = getExamplePrompts(dictionary)

  return (
    <section className="rounded-2xl border border-border bg-muted/15 p-5">
      <form onSubmit={onSubmit} className="flex flex-col gap-5">
        <SectionHeading
          icon={SearchCheck}
          title={dictionary.marketQuery.composer.title}
          description={dictionary.marketQuery.composer.description}
        />

        <FieldGroup>
          <Field data-invalid={!!questionError}>
            <FieldLabel htmlFor={questionId}>
              {dictionary.marketQuery.composer.questionLabel}
            </FieldLabel>
            <Textarea
              id={questionId}
              value={question}
              onChange={(event) => onQuestionChange(event.target.value)}
              placeholder={dictionary.marketQuery.composer.questionPlaceholder}
              className="min-h-[150px] resize-y bg-background"
              aria-invalid={questionError ? true : undefined}
              disabled={isPending}
            />
            <FieldDescription>
              {dictionary.marketQuery.composer.questionDescription}
            </FieldDescription>
            <FieldError>{questionError}</FieldError>
          </Field>

          {showExamples ? (
            <Field>
              <FieldLabel>{dictionary.marketQuery.composer.examplesLabel}</FieldLabel>
              <div className="grid gap-2 lg:grid-cols-3">
                {examplePrompts.map((prompt) => (
                  <Button
                    key={prompt}
                    type="button"
                    variant="outline"
                    className="h-auto justify-start py-3 text-left whitespace-normal"
                    disabled={isPending}
                    onClick={() => onExampleClick(prompt)}
                  >
                    <ChevronRight data-icon="inline-start" />
                    {prompt}
                  </Button>
                ))}
              </div>
              <FieldDescription>
                {dictionary.marketQuery.composer.examplesDescription}
              </FieldDescription>
            </Field>
          ) : null}

          <Field className="items-start sm:items-end">
            <FieldLabel className="sr-only">
              {dictionary.marketQuery.composer.submitLabel}
            </FieldLabel>
            <Button type="submit" size="lg" disabled={isPending} className="w-full sm:w-auto">
              {isPending ? <Spinner data-icon="inline-start" /> : <Sparkles data-icon="inline-start" />}
              {isPending
                ? dictionary.marketQuery.composer.analyzing
                : dictionary.marketQuery.composer.analyze}
            </Button>
            <FieldDescription>
              {dictionary.marketQuery.composer.currentTimeDescription}
            </FieldDescription>
          </Field>
        </FieldGroup>
      </form>
    </section>
  )
}
