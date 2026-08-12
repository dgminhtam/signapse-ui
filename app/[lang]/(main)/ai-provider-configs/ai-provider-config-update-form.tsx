"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "next/navigation"
import { Controller, useForm } from "react-hook-form"
import { toast } from "sonner"
import * as z from "zod"

import { updateAiProviderConfig } from "@/app/api/ai-provider-configs/action"
import {
  AiProviderConfigResponse,
  AiProviderConfigUpdateRequest,
} from "@/app/lib/ai-provider-configs/definitions"
import type { Dictionary } from "@/app/lib/i18n/dictionary-types"
import { useLocalization } from "@/app/lib/i18n/provider"
import { useLocalizedPath } from "@/components/localized-link"
import {
  AppFormShell,
  AppFormShellBody,
  AppFormShellFooter,
} from "@/components/app-form-shell"
import { AppFormSwitchField } from "@/components/app-form-switch-field"
import { Button } from "@/components/ui/button"
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
import { Textarea } from "@/components/ui/textarea"

import { AI_PROVIDER_TYPES, providerOptions } from "./ai-provider-config-shared"

function getAiProviderConfigUpdateSchema(t: Dictionary["aiProviderConfigs"]) {
  return z.object({
    providerType: z.enum(AI_PROVIDER_TYPES),
    description: z
      .string()
      .max(500, t.descriptionTooLong)
      .optional()
      .or(z.literal("")),
    baseUrl: z.string().max(500, t.baseUrlTooLong).optional().or(z.literal("")),
    defaultProvider: z.boolean().default(false),
  })
}

type AiProviderConfigUpdateFormValues = z.infer<
  ReturnType<typeof getAiProviderConfigUpdateSchema>
>

interface AiProviderConfigUpdateFormProps {
  initialData: AiProviderConfigResponse
}

export function AiProviderConfigUpdateForm({
  initialData,
}: AiProviderConfigUpdateFormProps) {
  const router = useRouter()
  const { dictionary } = useLocalization()
  const aiProviderConfigsPath = useLocalizedPath("/ai-provider-configs")
  const t = dictionary.aiProviderConfigs
  const aiProviderConfigUpdateSchema = getAiProviderConfigUpdateSchema(t)

  const defaultValues: AiProviderConfigUpdateFormValues = {
    providerType: initialData.providerType,
    description: initialData.description || "",
    baseUrl: initialData.baseUrl || "",
    defaultProvider: initialData.defaultProvider ?? false,
  }

  const form = useForm<AiProviderConfigUpdateFormValues>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(aiProviderConfigUpdateSchema as any),
    defaultValues,
  })

  async function onSubmit(values: AiProviderConfigUpdateFormValues) {
    const result = await updateAiProviderConfig(initialData.id, {
      providerType: values.providerType,
      description: values.description?.trim() || undefined,
      baseUrl: values.baseUrl?.trim() || undefined,
      defaultProvider: values.defaultProvider,
    } satisfies AiProviderConfigUpdateRequest)

    if (result.success) {
      toast.success(t.updateSuccess)
      router.push(aiProviderConfigsPath)
      router.refresh()
      return
    }

    toast.error(result.error)
  }

  function handleCancel() {
    form.reset(defaultValues)
  }

  return (
    <AppFormShell
      title={t.updateTitle}
      description={t.updateDescription}
      width="lg"
    >
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <AppFormShellBody>
          <FieldGroup>
            <Controller
              name="providerType"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="providerType">
                    {t.provider} <span className="text-destructive">*</span>
                  </FieldLabel>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger
                      id="providerType"
                      aria-invalid={fieldState.invalid}
                    >
                      <SelectValue placeholder={t.providerPlaceholder} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        {providerOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                  {fieldState.invalid ? (
                    <FieldError errors={[fieldState.error]} />
                  ) : null}
                </Field>
              )}
            />

            <Controller
              name="baseUrl"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="baseUrl">Base URL</FieldLabel>
                  <Input
                    {...field}
                    id="baseUrl"
                    aria-invalid={fieldState.invalid}
                    placeholder="https://api.example.com/v1"
                  />
                  <FieldDescription>{t.baseUrlDescription}</FieldDescription>
                  {fieldState.invalid ? (
                    <FieldError errors={[fieldState.error]} />
                  ) : null}
                </Field>
              )}
            />

            <Controller
              name="description"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="description">{t.description}</FieldLabel>
                  <Textarea
                    {...field}
                    id="description"
                    aria-invalid={fieldState.invalid}
                    placeholder={t.descriptionPlaceholder}
                    rows={4}
                  />
                  {fieldState.invalid ? (
                    <FieldError errors={[fieldState.error]} />
                  ) : null}
                </Field>
              )}
            />

            <Controller
              name="defaultProvider"
              control={form.control}
              render={({ field }) => (
                <AppFormSwitchField
                  id="defaultProvider"
                  label={t.defaultProvider}
                  description={t.defaultProviderDescription}
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              )}
            />
          </FieldGroup>
        </AppFormShellBody>

        <AppFormShellFooter>
          <Button type="button" variant="ghost" onClick={handleCancel}>
            {dictionary.common.cancel}
          </Button>
          <Button disabled={form.formState.isSubmitting} type="submit">
            {form.formState.isSubmitting ? (
              <>
                <Spinner data-icon="inline-start" />
                {t.updatePending}
              </>
            ) : (
              t.saveChanges
            )}
          </Button>
        </AppFormShellFooter>
      </form>
    </AppFormShell>
  )
}
