"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "next/navigation"
import { useState, useTransition } from "react"
import { Controller, useForm } from "react-hook-form"
import { toast } from "sonner"
import * as z from "zod"

import {
  createAiProviderConfig,
  getAiProviderModelCatalog,
  updateAiProviderConfig,
} from "@/app/api/ai-provider-configs/action"
import {
  AiProviderConfigCreateRequest,
  AiProviderModelCatalogRequest,
  AiProviderModelOptionResponse,
  AiProviderConfigResponse,
  AiProviderType,
  AiProviderConfigUpdateRequest,
} from "@/app/lib/ai-provider-configs/definitions"
import { Button } from "@/components/ui/button"
import {
  Field,
  FieldDescription,
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
  { value: "ZAI", label: "ZAI" },
]

const aiProviderConfigSchema = z.object({
  providerType: z.enum(["GEMINI", "OPENAI", "ZAI"]),
  name: z.string().min(1, "Name is required").max(255, "Name is too long"),
  description: z.string().max(500, "Description is too long").optional().or(z.literal("")),
  apiKey: z.string(),
  model: z.string().min(1, "Model is required").max(255, "Model is too long"),
  baseUrl: z.string().max(500, "Base URL is too long").optional().or(z.literal("")),
  defaultProvider: z.boolean().default(false),
})

type AiProviderConfigFormValues = z.infer<typeof aiProviderConfigSchema>

interface AiProviderConfigFormProps {
  initialData?: AiProviderConfigResponse
}

export function AiProviderConfigForm({ initialData }: AiProviderConfigFormProps) {
  const router = useRouter()
  const isEdit = !!initialData
  const [modelOptions, setModelOptions] = useState<AiProviderModelOptionResponse[]>([])
  const [hasLoadedCatalog, setHasLoadedCatalog] = useState(false)
  const [isLoadingModels, startLoadingModels] = useTransition()

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
      defaultProvider: initialData?.defaultProvider ?? false,
    },
  })

  function resetModelCatalog() {
    setHasLoadedCatalog(false)
    setModelOptions([])

    if (!isEdit) {
      form.setValue("model", "", {
        shouldDirty: true,
        shouldTouch: true,
        shouldValidate: true,
      })
    }
  }

  async function handleLoadModels() {
    const values = form.getValues()
    const apiKey = values.apiKey.trim()

    if (!apiKey) {
      form.setError("apiKey", { message: "API key is required to load models" })
      return
    }

    form.clearErrors("apiKey")

    const request: AiProviderModelCatalogRequest = {
      providerType: values.providerType,
      apiKey,
      baseUrl: values.baseUrl?.trim() || undefined,
    }

    startLoadingModels(async () => {
      const result = await getAiProviderModelCatalog(request)

      if (result.success) {
        const fetchedOptions = result.data.models
        const currentModel = form.getValues("model")
        const hasCurrentModelInCatalog = fetchedOptions.some((option) => option.id === currentModel)
        const fallbackOption =
          isEdit && currentModel && !hasCurrentModelInCatalog
            ? [{ id: currentModel, label: currentModel }]
            : []

        setHasLoadedCatalog(true)
        setModelOptions([...fallbackOption, ...fetchedOptions])
        form.clearErrors("apiKey")
        toast.success(
          fetchedOptions.length > 0
            ? `Loaded ${fetchedOptions.length} models`
            : "No models were returned for this provider"
        )
        return
      }

      toast.error(result.error)
    })
  }

  async function onSubmit(values: AiProviderConfigFormValues) {
    const baseRequest = {
      providerType: values.providerType,
      name: values.name,
      description: values.description || "",
      model: values.model,
      baseUrl: values.baseUrl || "",
      defaultProvider: values.defaultProvider,
    }

    const result = isEdit
      ? await updateAiProviderConfig(initialData.id, {
          ...baseRequest,
          ...(values.apiKey.trim() ? { apiKey: values.apiKey.trim() } : {}),
        } satisfies AiProviderConfigUpdateRequest)
      : await createAiProviderConfig({
          ...baseRequest,
          apiKey: values.apiKey.trim(),
        } satisfies AiProviderConfigCreateRequest)

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
              <Select
                value={field.value}
                onValueChange={(value) => {
                  resetModelCatalog()
                  field.onChange(value)
                }}
              >
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
                onChange={(event) => {
                  form.clearErrors("apiKey")
                  resetModelCatalog()
                  field.onChange(event)
                }}
                placeholder={
                  isEdit ? "Leave blank to keep the current API key" : "Paste provider API key"
                }
                autoComplete="new-password"
              />
              <FieldDescription>
                {isEdit
                  ? "Nhập API key mới rồi bấm Load models để tải lại danh sách model."
                  : "Nhập API key rồi bấm Load models để lấy danh sách model."}
              </FieldDescription>
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
              <Input
                {...field}
                id="baseUrl"
                onChange={(event) => {
                  resetModelCatalog()
                  field.onChange(event)
                }}
                placeholder="https://api.example.com/v1"
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Controller
          name="model"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                <div className="space-y-1">
                  <FieldLabel htmlFor="model">
                    Model <span className="text-destructive">*</span>
                  </FieldLabel>
                  <FieldDescription>
                    Chọn model từ danh sách sau khi load catalog từ provider.
                  </FieldDescription>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  className="sm:w-auto"
                  onClick={handleLoadModels}
                  disabled={
                    isLoadingModels ||
                    !form.getValues("providerType") ||
                    !form.getValues("apiKey").trim()
                  }
                >
                  {isLoadingModels ? (
                    <>
                      <Spinner data-icon="inline-start" />
                      Loading models...
                    </>
                  ) : (
                    "Load models"
                  )}
                </Button>
              </div>

              <Select
                value={hasLoadedCatalog ? field.value || undefined : undefined}
                onValueChange={(value) =>
                  form.setValue("model", value, {
                    shouldDirty: true,
                    shouldTouch: true,
                    shouldValidate: true,
                  })
                }
                disabled={isLoadingModels || !hasLoadedCatalog}
              >
                <SelectTrigger id="model">
                  <SelectValue
                    placeholder={
                      hasLoadedCatalog
                        ? "Choose a model"
                        : isEdit
                          ? "Current model is shown below. Enter API key and load catalog to change it."
                          : "Enter API key and load models first"
                    }
                  />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {modelOptions.map((option) => (
                      <SelectItem key={option.id} value={option.id}>
                        {option.label || option.id}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>

              {!hasLoadedCatalog && isEdit && field.value && (
                <div className="rounded-md border border-dashed px-3 py-2 text-sm text-muted-foreground">
                  Current model: <span className="font-medium text-foreground">{field.value}</span>
                </div>
              )}

              {hasLoadedCatalog && modelOptions.length === 0 && (
                <div className="rounded-md border border-dashed px-3 py-2 text-sm text-muted-foreground">
                  Provider did not return any models for the current credentials.
                </div>
              )}

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
                defaultProvider: initialData.defaultProvider,
              })
              setHasLoadedCatalog(false)
              setModelOptions([])
              return
            }
            form.reset()
            setHasLoadedCatalog(false)
            setModelOptions([])
          }}
        >
          Cancel
        </Button>
      </div>
    </form>
  )
}
