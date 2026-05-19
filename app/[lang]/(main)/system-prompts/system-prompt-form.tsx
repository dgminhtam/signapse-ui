"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { FileText } from "lucide-react"
import { useRouter } from "next/navigation"
import { Controller, useForm } from "react-hook-form"
import { toast } from "sonner"
import * as z from "zod"

import {
  createSystemPrompt,
  updateSystemPrompt,
} from "@/app/api/system-prompts/action"
import {
  CreateSystemPromptRequest,
  getSystemPromptTypeOptions,
  getSystemPromptTypeLabel,
  getSystemPromptWorkflowGroup,
  SYSTEM_PROMPT_TYPES,
  SystemPromptResponse,
  SystemPromptType,
  UpdateSystemPromptRequest,
} from "@/app/lib/system-prompts/definitions"
import { useLocalization } from "@/app/lib/i18n/provider"
import { useLocalizedPath } from "@/components/localized-link"
import {
  AppFormShell,
  AppFormShellBody,
  AppFormShellFooter,
} from "@/components/app-form-shell"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  InputGroupTextarea,
} from "@/components/ui/input-group"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Spinner } from "@/components/ui/spinner"

const MAX_PROMPT_CONTENT_LENGTH = 10000

interface SystemPromptFormValues {
  promptType: SystemPromptType
  content: string
}

interface SystemPromptFormProps {
  initialData?: SystemPromptResponse
}

export function SystemPromptForm({ initialData }: SystemPromptFormProps) {
  const router = useRouter()
  const isEdit = Boolean(initialData)
  const { dictionary, formatMessage, formatNumber } = useLocalization()
  const systemPromptsPath = useLocalizedPath("/system-prompts")
  const t = dictionary.systemPrompts
  const formattedMaxLength = formatNumber(MAX_PROMPT_CONTENT_LENGTH)
  const systemPromptFormSchema = z.object({
    promptType: z.enum(SYSTEM_PROMPT_TYPES),
    content: z
      .string()
      .max(
        MAX_PROMPT_CONTENT_LENGTH,
        formatMessage(t.contentTooLong, { max: formattedMaxLength })
      )
      .refine((value) => value.trim().length > 0, {
        message: t.contentRequired,
      }),
  })
  const promptTypeOptions = getSystemPromptTypeOptions(dictionary)

  const form = useForm<SystemPromptFormValues>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(systemPromptFormSchema as any),
    defaultValues: {
      promptType: initialData?.promptType ?? "NEWS_FILTER",
      content: initialData?.content ?? "",
    },
  })

  // eslint-disable-next-line react-hooks/incompatible-library
  const contentValue = form.watch("content")
  const promptType = form.watch("promptType")
  const contentLength = contentValue?.length ?? 0
  const isOverLimit = contentLength > MAX_PROMPT_CONTENT_LENGTH

  async function onSubmit(values: SystemPromptFormValues) {
    const content = values.content.trim()
    const result = isEdit
      ? await updateSystemPrompt(initialData!.promptType, {
          content,
        } satisfies UpdateSystemPromptRequest)
      : await createSystemPrompt({
          promptType: values.promptType,
          content,
        } satisfies CreateSystemPromptRequest)

    if (result.success) {
      toast.success(isEdit ? t.updateSuccess : t.createSuccess)
      router.push(systemPromptsPath)
      router.refresh()
      return
    }

    toast.error(result.error)
  }

  function handleCancel() {
    if (isEdit && initialData) {
      form.reset({
        promptType: initialData.promptType,
        content: initialData.content,
      })
      return
    }

    router.push(systemPromptsPath)
  }

  return (
    <AppFormShell
      title={isEdit ? t.updateTitle : t.createTitle}
      description={isEdit ? t.updateDescription : t.createDescription}
      width="lg"
    >
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <AppFormShellBody>
          <FieldGroup>
        {isEdit && initialData ? (
          <Field>
            <FieldLabel>{t.promptType}</FieldLabel>
            <div className="rounded-lg border border-border bg-muted/20 p-4">
              <div className="flex flex-wrap items-center gap-2">
                <Badge>
                  {getSystemPromptTypeLabel(initialData.promptType, dictionary)}
                </Badge>
                <Badge variant="secondary">
                  {getSystemPromptWorkflowGroup(
                    initialData.promptType,
                    dictionary
                  )}
                </Badge>
              </div>
              <p className="mt-3 break-all font-mono text-sm text-muted-foreground">
                {initialData.promptType}
              </p>
            </div>
            <FieldDescription>
              {t.promptTypeLockedDescription}
            </FieldDescription>
          </Field>
        ) : (
          <Controller
            name="promptType"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="promptType">
                  {t.promptType} <span className="text-destructive">*</span>
                </FieldLabel>
                <Select
                  value={field.value}
                  onValueChange={(value) => field.onChange(value as SystemPromptType)}
                >
                  <SelectTrigger id="promptType" aria-invalid={fieldState.invalid}>
                    <SelectValue placeholder={t.promptTypePlaceholder} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {promptTypeOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label} · {option.group}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
                <FieldDescription>
                  {t.promptTypeDescription}
                </FieldDescription>
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />
        )}

        <Controller
          name="content"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="content">
                {t.content} <span className="text-destructive">*</span>
              </FieldLabel>
              <InputGroup>
                <InputGroupTextarea
                  {...field}
                  id="content"
                  rows={18}
                  aria-invalid={fieldState.invalid}
                  className="min-h-[460px] resize-y font-mono text-sm leading-6"
                  placeholder={t.contentPlaceholder}
                />
                <InputGroupAddon align="block-end">
                  <InputGroupText
                    className={
                      isOverLimit
                        ? "text-xs tabular-nums text-destructive"
                        : "text-xs tabular-nums"
                    }
                  >
                    {formatMessage(t.contentCounter, {
                      count: formatNumber(contentLength),
                      max: formattedMaxLength,
                    })}
                  </InputGroupText>
                </InputGroupAddon>
              </InputGroup>
              <FieldDescription>
                {t.contentDescription}
              </FieldDescription>
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        {!isEdit ? (
          <div className="rounded-lg border border-dashed bg-muted/20 p-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-2 font-medium text-foreground">
              <FileText className="h-4 w-4" />
              {t.selectedPrompt}
            </div>
            <p className="mt-2">
              {getSystemPromptTypeLabel(promptType, dictionary)} ·{" "}
              {getSystemPromptWorkflowGroup(promptType, dictionary)}
            </p>
          </div>
        ) : null}
          </FieldGroup>
        </AppFormShellBody>

        <AppFormShellFooter>

      <div className="flex flex-col-reverse gap-3 sm:flex-row">
        <Button disabled={form.formState.isSubmitting} type="submit">
          {form.formState.isSubmitting ? (
            <>
              <Spinner data-icon="inline-start" />
              {isEdit ? t.updatePending : t.createPending}
            </>
          ) : isEdit ? (
            t.saveChanges
          ) : (
            t.createAction
          )}
        </Button>
        <Button type="button" variant="ghost" onClick={handleCancel}>
          {dictionary.common.cancel}
        </Button>
      </div>
        </AppFormShellFooter>
      </form>
    </AppFormShell>
  )
}
