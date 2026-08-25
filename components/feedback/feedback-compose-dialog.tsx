"use client"

import * as React from "react"
import { z } from "zod"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { FileImage, FileQuestion, ImagePlus, X } from "lucide-react"

import { useFeedbackFixture } from "@/app/lib/feedback/fixture-provider"
import type {
  FeedbackSubmitInput,
  FeedbackTechnicalContext,
  FeedbackType,
} from "@/app/lib/feedback/definitions"
import { useLocalization } from "@/app/lib/i18n/provider"
import { useLocalizedPath } from "@/components/localized-link"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Spinner } from "@/components/ui/spinner"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"

interface FeedbackComposeDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

interface ComposeValues {
  type: FeedbackType
  title: string
  description: string
  expectedOutcome: string
  reproductionSteps: string
}

interface SelectedScreenshot {
  file: File
  previewUrl?: string
}

type ComposeField = keyof ComposeValues

const initialValues: ComposeValues = {
  type: "BUG",
  title: "",
  description: "",
  expectedOutcome: "",
  reproductionSteps: "",
}

function getTechnicalContext(locale: "vi" | "en"): FeedbackTechnicalContext {
  const userAgent = typeof navigator === "undefined" ? "" : navigator.userAgent
  const platform = typeof navigator === "undefined" ? "" : navigator.platform

  return {
    pagePath: typeof window === "undefined" ? "/" : window.location.pathname,
    appVersion: "fixture-0.1",
    browser: userAgent || "Unknown browser",
    operatingSystem: platform || "Unknown operating system",
    locale,
    observedAt: new Date().toISOString(),
  }
}

function formatFileSize(bytes: number, locale: "vi" | "en") {
  if (bytes < 1024) {
    return `${bytes} B`
  }

  return `${new Intl.NumberFormat(locale === "vi" ? "vi-VN" : "en-US", {
    maximumFractionDigits: 1,
  }).format(bytes / 1024)} KB`
}

export function FeedbackComposeDialog({
  open,
  onOpenChange,
}: FeedbackComposeDialogProps) {
  const {
    dictionary,
    locale,
    formatMessage: localizeMessage,
  } = useLocalization()
  const t = dictionary.feedback
  const router = useRouter()
  const historyPath = useLocalizedPath("/feedback")
  const { createSubmission, getMutationMode } = useFeedbackFixture()
  const [values, setValues] = React.useState<ComposeValues>(initialValues)
  const [errors, setErrors] = React.useState<
    Partial<Record<ComposeField, string>>
  >({})
  const [includeContext, setIncludeContext] = React.useState(true)
  const [technicalContext, setTechnicalContext] =
    React.useState<FeedbackTechnicalContext | null>(null)
  const [screenshot, setScreenshot] = React.useState<SelectedScreenshot | null>(
    null
  )
  const [isDiscardOpen, setIsDiscardOpen] = React.useState(false)
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const fieldRefs = React.useRef<
    Partial<
      Record<
        ComposeField,
        HTMLInputElement | HTMLTextAreaElement | HTMLButtonElement | null
      >
    >
  >({})

  const schema = React.useMemo(
    () =>
      z.object({
        type: z.enum(["BUG", "IDEA"]),
        title: z
          .string()
          .trim()
          .min(1, t.titleRequired)
          .min(5, t.titleTooShort)
          .max(150, t.titleTooLong),
        description: z
          .string()
          .trim()
          .min(1, t.descriptionRequired)
          .min(20, t.descriptionTooShort)
          .max(5000, t.descriptionTooLong),
        expectedOutcome: z
          .string()
          .trim()
          .min(1, t.expectedOutcomeRequired)
          .min(10, t.expectedOutcomeTooShort)
          .max(3000, t.expectedOutcomeTooLong),
        reproductionSteps: z.string().max(5000, t.reproductionStepsTooLong),
      }),
    [t]
  )

  React.useEffect(() => {
    return () => {
      if (screenshot?.previewUrl) {
        URL.revokeObjectURL(screenshot.previewUrl)
      }
    }
  }, [screenshot?.previewUrl])

  React.useEffect(() => {
    if (!open) {
      return
    }

    // Opening a new controlled Dialog starts a fresh draft session.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setValues(initialValues)
    setErrors({})
    setIncludeContext(true)
    setTechnicalContext(getTechnicalContext(locale))
    setScreenshot(null)
    setIsDiscardOpen(false)
  }, [locale, open])

  const isDirty =
    values.title.trim() !== "" ||
    values.description.trim() !== "" ||
    values.expectedOutcome.trim() !== "" ||
    values.reproductionSteps.trim() !== "" ||
    values.type !== initialValues.type ||
    !includeContext ||
    screenshot !== null

  function requestClose() {
    if (isSubmitting) {
      return
    }

    if (isDirty) {
      setIsDiscardOpen(true)
      return
    }

    onOpenChange(false)
  }

  function updateValue(field: ComposeField, value: string) {
    setValues((current) => ({ ...current, [field]: value }))
    setErrors((current) => ({ ...current, [field]: undefined }))
  }

  function validate() {
    const parsed = schema.safeParse(values)
    if (parsed.success) {
      setErrors({})
      return parsed.data
    }

    const nextErrors: Partial<Record<ComposeField, string>> = {}
    for (const issue of parsed.error.issues) {
      const field = issue.path[0] as ComposeField
      if (!nextErrors[field]) {
        nextErrors[field] = issue.message
      }
    }
    setErrors(nextErrors)

    const firstInvalidField = Object.keys(values).find((field) =>
      Boolean(nextErrors[field as ComposeField])
    ) as ComposeField | undefined
    if (firstInvalidField) {
      fieldRefs.current[firstInvalidField]?.focus()
    }
    return null
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (isSubmitting) {
      return
    }

    const parsed = validate()
    if (!parsed) {
      return
    }

    setIsSubmitting(true)
    const selectedScreenshot = screenshot
      ? {
          name: screenshot.file.name,
          mimeType: screenshot.file.type || "application/octet-stream",
          size: screenshot.file.size,
          previewable: Boolean(screenshot.previewUrl),
        }
      : undefined
    const payload: FeedbackSubmitInput = {
      type: parsed.type,
      title: parsed.title,
      description: parsed.description,
      expectedOutcome: parsed.expectedOutcome,
      reproductionSteps:
        parsed.type === "BUG" ? parsed.reproductionSteps : undefined,
      clientContext: includeContext
        ? (technicalContext ?? undefined)
        : undefined,
      screenshot: selectedScreenshot,
    }
    const result = await createSubmission(payload)
    setIsSubmitting(false)

    if (!result.success) {
      toast.error(
        getMutationMode("compose") === "validation-error"
          ? t.submitError
          : localizeMessage(t.submitError, {})
      )
      return
    }

    toast.success(t.submitSuccess, {
      action: {
        label: t.viewHistoryAction,
        onClick: () => router.push(historyPath),
      },
    })
    setValues(initialValues)
    setErrors({})
    setScreenshot(null)
    onOpenChange(false)
  }

  function handleScreenshotChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    event.target.value = ""
    if (!file) {
      return
    }

    const previewUrl = file.type.startsWith("image/")
      ? URL.createObjectURL(file)
      : undefined
    setScreenshot({ file, previewUrl })
  }

  function discardDraft() {
    setIsDiscardOpen(false)
    setValues(initialValues)
    setErrors({})
    setScreenshot(null)
    setIncludeContext(true)
    onOpenChange(false)
  }

  const renderError = (field: ComposeField) =>
    errors[field] ? <FieldError>{errors[field]}</FieldError> : null

  return (
    <>
      <Dialog
        open={open}
        onOpenChange={(nextOpen) => {
          if (nextOpen) {
            onOpenChange(true)
          } else {
            requestClose()
          }
        }}
      >
        <DialogContent
          showCloseButton={false}
          className="max-h-[calc(100vh-2rem)] overflow-y-auto sm:max-w-2xl"
        >
          <DialogHeader>
            <div className="flex items-start justify-between gap-4">
              <div className="flex min-w-0 flex-col gap-2">
                <DialogTitle>{t.composeTitle}</DialogTitle>
                <DialogDescription>{t.composeDescription}</DialogDescription>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                aria-label={t.closeAction}
                onClick={requestClose}
              >
                <X />
              </Button>
            </div>
          </DialogHeader>

          <form onSubmit={handleSubmit} noValidate>
            <FieldGroup>
              <Field data-invalid={Boolean(errors.type)}>
                <FieldLabel htmlFor="feedback-type">{t.typeLabel}</FieldLabel>
                <Select
                  value={values.type}
                  onValueChange={(value) =>
                    updateValue("type", (value ?? "BUG") as FeedbackType)
                  }
                  items={[
                    { value: "BUG", label: t.typeBug },
                    { value: "IDEA", label: t.typeIdea },
                  ]}
                >
                  <SelectTrigger
                    id="feedback-type"
                    ref={(element) => {
                      fieldRefs.current.type = element
                    }}
                    aria-label={t.typeLabel}
                    aria-invalid={Boolean(errors.type)}
                  >
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="BUG">{t.typeBug}</SelectItem>
                      <SelectItem value="IDEA">{t.typeIdea}</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
                {renderError("type")}
              </Field>

              <Field data-invalid={Boolean(errors.title)}>
                <FieldLabel htmlFor="feedback-title">{t.titleLabel}</FieldLabel>
                <Input
                  id="feedback-title"
                  ref={(element) => {
                    fieldRefs.current.title = element
                  }}
                  value={values.title}
                  onChange={(event) => updateValue("title", event.target.value)}
                  placeholder={t.titlePlaceholder}
                  maxLength={150}
                  aria-invalid={Boolean(errors.title)}
                  aria-describedby={
                    errors.title ? "feedback-title-error" : undefined
                  }
                />
                {errors.title ? (
                  <div id="feedback-title-error">{renderError("title")}</div>
                ) : null}
              </Field>

              <Field data-invalid={Boolean(errors.description)}>
                <FieldLabel htmlFor="feedback-description">
                  {t.descriptionLabel}
                </FieldLabel>
                <Textarea
                  id="feedback-description"
                  ref={(element) => {
                    fieldRefs.current.description = element
                  }}
                  value={values.description}
                  onChange={(event) =>
                    updateValue("description", event.target.value)
                  }
                  placeholder={t.descriptionPlaceholder}
                  maxLength={5000}
                  rows={5}
                  aria-invalid={Boolean(errors.description)}
                  aria-describedby={
                    errors.description
                      ? "feedback-description-error"
                      : undefined
                  }
                />
                {errors.description ? (
                  <div id="feedback-description-error">
                    {renderError("description")}
                  </div>
                ) : null}
              </Field>

              <Field data-invalid={Boolean(errors.expectedOutcome)}>
                <FieldLabel htmlFor="feedback-expected-outcome">
                  {t.expectedOutcomeLabel}
                </FieldLabel>
                <Textarea
                  id="feedback-expected-outcome"
                  ref={(element) => {
                    fieldRefs.current.expectedOutcome = element
                  }}
                  value={values.expectedOutcome}
                  onChange={(event) =>
                    updateValue("expectedOutcome", event.target.value)
                  }
                  placeholder={t.expectedOutcomePlaceholder}
                  maxLength={3000}
                  rows={3}
                  aria-invalid={Boolean(errors.expectedOutcome)}
                  aria-describedby={
                    errors.expectedOutcome
                      ? "feedback-expected-outcome-error"
                      : undefined
                  }
                />
                {errors.expectedOutcome ? (
                  <div id="feedback-expected-outcome-error">
                    {renderError("expectedOutcome")}
                  </div>
                ) : null}
              </Field>

              {values.type === "BUG" ? (
                <Field data-invalid={Boolean(errors.reproductionSteps)}>
                  <FieldLabel htmlFor="feedback-reproduction-steps">
                    {t.reproductionStepsLabel}
                  </FieldLabel>
                  <Textarea
                    id="feedback-reproduction-steps"
                    ref={(element) => {
                      fieldRefs.current.reproductionSteps = element
                    }}
                    value={values.reproductionSteps}
                    onChange={(event) =>
                      updateValue("reproductionSteps", event.target.value)
                    }
                    placeholder={t.reproductionStepsPlaceholder}
                    maxLength={5000}
                    rows={4}
                    aria-invalid={Boolean(errors.reproductionSteps)}
                    aria-describedby={
                      errors.reproductionSteps
                        ? "feedback-reproduction-steps-error"
                        : undefined
                    }
                  />
                  {errors.reproductionSteps ? (
                    <div id="feedback-reproduction-steps-error">
                      {renderError("reproductionSteps")}
                    </div>
                  ) : null}
                </Field>
              ) : null}

              <Field className="rounded-lg border p-3">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex min-w-0 flex-col gap-1">
                    <FieldLabel htmlFor="feedback-technical-context">
                      {t.technicalContextLabel}
                    </FieldLabel>
                    <FieldDescription>
                      {t.technicalContextDescription}
                    </FieldDescription>
                  </div>
                  <Switch
                    id="feedback-technical-context"
                    checked={includeContext}
                    onCheckedChange={setIncludeContext}
                    aria-label={t.technicalContextLabel}
                  />
                </div>
                {includeContext && technicalContext ? (
                  <details className="mt-3 rounded-md border bg-muted/20 p-3">
                    <summary className="cursor-pointer text-sm font-medium">
                      {t.detailTechnicalContext}
                    </summary>
                    <dl className="mt-3 grid gap-2 text-sm sm:grid-cols-2">
                      <ContextValue
                        label={t.technicalContextFields.pagePath}
                        value={technicalContext.pagePath}
                      />
                      <ContextValue
                        label={t.technicalContextFields.appVersion}
                        value={technicalContext.appVersion}
                      />
                      <ContextValue
                        label={t.technicalContextFields.browser}
                        value={technicalContext.browser}
                      />
                      <ContextValue
                        label={t.technicalContextFields.operatingSystem}
                        value={technicalContext.operatingSystem}
                      />
                      <ContextValue
                        label={t.technicalContextFields.locale}
                        value={technicalContext.locale}
                      />
                      <ContextValue
                        label={t.technicalContextFields.observedAt}
                        value={technicalContext.observedAt}
                      />
                    </dl>
                  </details>
                ) : null}
              </Field>

              <Field>
                <FieldLabel htmlFor="feedback-screenshot">
                  {t.screenshotLabel}
                </FieldLabel>
                <FieldDescription>{t.screenshotDescription}</FieldDescription>
                <div className="flex flex-wrap items-center gap-3">
                  <label
                    htmlFor="feedback-screenshot"
                    className="inline-flex min-h-9 cursor-pointer items-center gap-2 rounded-lg border border-input px-3 py-2 text-sm font-medium transition-colors focus-within:ring-3 focus-within:ring-ring/50 hover:bg-muted"
                  >
                    <ImagePlus className="size-4" />
                    {screenshot ? t.changeScreenshot : t.chooseScreenshot}
                  </label>
                  <Input
                    id="feedback-screenshot"
                    type="file"
                    accept="image/*,.pdf,.txt"
                    className="sr-only"
                    onChange={handleScreenshotChange}
                  />
                  {!screenshot ? (
                    <span className="text-sm text-muted-foreground">
                      {t.screenshotEmpty}
                    </span>
                  ) : null}
                </div>
                {screenshot ? (
                  <div className="mt-3 flex flex-col gap-3 rounded-lg border bg-muted/20 p-3 sm:flex-row sm:items-start">
                    {screenshot.previewUrl ? (
                      <img
                        src={screenshot.previewUrl}
                        alt={t.screenshotPreviewAlt}
                        className="max-h-40 w-full rounded-md border object-contain sm:w-52"
                      />
                    ) : (
                      <div className="flex size-20 shrink-0 items-center justify-center rounded-md border bg-background text-muted-foreground">
                        <FileQuestion aria-hidden="true" />
                      </div>
                    )}
                    <div className="flex min-w-0 flex-1 flex-col gap-1">
                      <div className="flex items-center gap-2 font-medium">
                        {screenshot.previewUrl ? (
                          <FileImage className="size-4" aria-hidden="true" />
                        ) : null}
                        <span className="break-words">
                          {screenshot.file.name}
                        </span>
                      </div>
                      {screenshot.previewUrl ? (
                        <p className="text-sm text-muted-foreground">
                          {localizeMessage(t.screenshotMetadata, {
                            name: screenshot.file.name,
                            type: screenshot.file.type || "file",
                            size: formatFileSize(screenshot.file.size, locale),
                          })}
                        </p>
                      ) : (
                        <div className="flex flex-col gap-1 text-sm text-muted-foreground">
                          <span>{t.screenshotUnsupported}</span>
                          <span className="text-xs">
                            {localizeMessage(t.screenshotMetadata, {
                              name: screenshot.file.name,
                              type: screenshot.file.type || "file",
                              size: formatFileSize(
                                screenshot.file.size,
                                locale
                              ),
                            })}
                          </span>
                        </div>
                      )}
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="mt-1 w-fit"
                        onClick={() => setScreenshot(null)}
                      >
                        {t.removeScreenshot}
                      </Button>
                    </div>
                  </div>
                ) : null}
              </Field>
            </FieldGroup>

            <div className="mt-4 min-h-6" aria-live="polite" aria-atomic="true">
              {isSubmitting ? (
                <p className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Spinner /> {t.pending}
                </p>
              ) : null}
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={requestClose}>
                {t.cancelAction}
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? <Spinner data-icon="inline-start" /> : null}
                {isSubmitting ? t.pending : t.submitAction}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={isDiscardOpen} onOpenChange={setIsDiscardOpen}>
        <DialogContent showCloseButton={false} className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{t.discardTitle}</DialogTitle>
            <DialogDescription>{t.discardDescription}</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsDiscardOpen(false)}
            >
              {t.keepEditingAction}
            </Button>
            <Button
              type="button"
              variant="destructive"
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={discardDraft}
            >
              {t.discardAction}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

function ContextValue({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-0">
      <dt className="text-xs text-muted-foreground">{label}</dt>
      <dd className="truncate font-medium text-foreground" title={value}>
        {value}
      </dd>
    </div>
  )
}
