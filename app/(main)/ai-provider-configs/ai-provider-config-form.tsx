"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "next/navigation"
import { Controller, useForm } from "react-hook-form"
import { toast } from "sonner"
import * as z from "zod"

import {
  createAiProviderConfig,
  updateAiProviderConfig,
} from "@/app/api/ai-provider-configs/action"
import {
  AiProviderConfigRequest,
  AiProviderConfigResponse,
  AiProviderType,
} from "@/app/lib/ai-provider-configs/definitions"
import { Button } from "@/components/ui/button"
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
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

const providerOptions: { value: AiProviderType; label: string }[] = [
  { value: "GEMINI", label: "Gemini" },
  { value: "OPENAI", label: "OpenAI" },
]

const aiProviderConfigSchema = z.object({
  providerType: z.enum(["GEMINI", "OPENAI"]),
  name: z.string().min(1, "Name is required").max(255, "Name is too long"),
  description: z.string().max(500, "Description is too long").optional().or(z.literal("")),
  apiKey: z.string(),
  model: z.string().min(1, "Model is required").max(255, "Model is too long"),
  baseUrl: z.string().url("Invalid base URL").optional().or(z.literal("")),
  active: z.boolean().default(true),
  defaultProvider: z.boolean().default(false),
})

type AiProviderConfigFormValues = z.infer<typeof aiProviderConfigSchema>

interface AiProviderConfigFormProps {
  initialData?: AiProviderConfigResponse
}

export function AiProviderConfigForm({ initialData }: AiProviderConfigFormProps) {
  const router = useRouter()
  const isEdit = !!initialData

  const form = useForm<AiProviderConfigFormValues>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(aiProviderConfigSchema as any),
    defaultValues: {
      providerType: initialData?.providerType ?? "OPENAI",
      name: initialData?.name ?? "",
      description: initialData?.description ?? "",
      apiKey: "",
      model: initialData?.model ?? "",
      baseUrl: initialData?.baseUrl ?? "",
      active: initialData?.active ?? true,
      defaultProvider: initialData?.defaultProvider ?? false,
    },
  })

  async function onSubmit(values: AiProviderConfigFormValues) {
    const request: AiProviderConfigRequest = {
      providerType: values.providerType,
      name: values.name,
      description: values.description || "",
      model: values.model,
      baseUrl: values.baseUrl || "",
      active: values.active,
      defaultProvider: values.defaultProvider,
    }

    if (!isEdit || values.apiKey.trim()) {
      request.apiKey = values.apiKey.trim()
    }

    const result = isEdit
      ? await updateAiProviderConfig(initialData.id, request)
      : await createAiProviderConfig(request)

    if (result.success) {
      toast.success(
        isEdit
          ? "AI provider config updated successfully"
          : "AI provider config created successfully"
      )
      router.push("/ai-provider-configs")
      router.refresh()
      return
    }

    toast.error(result.error)
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      <FieldGroup>
        <Controller
          name="providerType"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="providerType">
                Provider Type <span className="text-destructive">*</span>
              </FieldLabel>
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger id="providerType">
                  <SelectValue placeholder="Select provider type" />
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
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Controller
          name="name"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="name">
                Display Name <span className="text-destructive">*</span>
              </FieldLabel>
              <Input {...field} id="name" placeholder="e.g. Primary OpenAI Production" />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Controller
          name="model"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="model">
                Model <span className="text-destructive">*</span>
              </FieldLabel>
              <Input {...field} id="model" placeholder="e.g. gpt-4o-mini or gemini-1.5-pro" />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Controller
          name="apiKey"
          control={form.control}
          rules={{
            validate: (value) =>
              isEdit || value.trim().length > 0 ? true : "API key is required",
          }}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="apiKey">
                API Key {!isEdit && <span className="text-destructive">*</span>}
              </FieldLabel>
              <Input
                {...field}
                id="apiKey"
                type="password"
                placeholder={
                  isEdit ? "Leave blank to keep the current API key" : "Paste provider API key"
                }
                autoComplete="new-password"
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Controller
          name="baseUrl"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="baseUrl">Base URL</FieldLabel>
              <Input {...field} id="baseUrl" placeholder="https://api.example.com/v1" />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Controller
          name="description"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="description">Description</FieldLabel>
              <Textarea
                {...field}
                id="description"
                placeholder="Optional context about how this provider config is used"
                rows={4}
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Controller
          name="active"
          control={form.control}
          render={({ field }) => (
            <Field className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FieldLabel className="text-base">Active</FieldLabel>
                <div className="text-sm text-muted-foreground">
                  Allow this provider config to be used by the system.
                </div>
              </div>
              <Switch checked={field.value} onCheckedChange={field.onChange} />
            </Field>
          )}
        />

        <Controller
          name="defaultProvider"
          control={form.control}
          render={({ field }) => (
            <Field className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FieldLabel className="text-base">Default Provider</FieldLabel>
                <div className="text-sm text-muted-foreground">
                  Mark this configuration as the default provider for AI operations.
                </div>
              </div>
              <Switch checked={field.value} onCheckedChange={field.onChange} />
            </Field>
          )}
        />
      </FieldGroup>

      <Separator className="my-8" />

      <div className="flex gap-4">
        <Button disabled={form.formState.isSubmitting} type="submit">
          {form.formState.isSubmitting ? (
            <>
              <Spinner data-icon="inline-start" />
              {isEdit ? "Updating..." : "Creating..."}
            </>
          ) : isEdit ? (
            "Update Config"
          ) : (
            "Create Config"
          )}
        </Button>
        <Button
          type="button"
          variant="ghost"
          onClick={() => {
            if (isEdit && initialData) {
              form.reset({
                providerType: initialData.providerType,
                name: initialData.name,
                description: initialData.description || "",
                apiKey: "",
                model: initialData.model,
                baseUrl: initialData.baseUrl || "",
                active: initialData.active,
                defaultProvider: initialData.defaultProvider,
              })
              return
            }
            form.reset()
          }}
        >
          Cancel
        </Button>
      </div>
    </form>
  )
}
