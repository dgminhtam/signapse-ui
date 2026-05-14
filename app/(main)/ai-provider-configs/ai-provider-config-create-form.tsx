"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { Plus, Trash2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState, useTransition } from "react"
import { Controller, useFieldArray, useForm } from "react-hook-form"
import { toast } from "sonner"
import * as z from "zod"

import {
  createAiProviderConfig,
  getAiProviderModelCatalog,
} from "@/app/api/ai-provider-configs/action"
import {
  AiProviderConfigCreateRequest,
  AiProviderModelCatalogRequest,
  AiProviderModelOptionResponse,
} from "@/app/lib/ai-provider-configs/definitions"
import {
  AppFormShell,
  AppFormShellBody,
  AppFormShellFooter,
} from "@/components/app-form-shell"
import { AppFormSwitchField } from "@/components/app-form-switch-field"
import { useHasPermission } from "@/components/permission-provider"
import { Button } from "@/components/ui/button"
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldSet,
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

import {
  AiProviderCredentialModelActionButton,
  AiProviderCredentialModelSummary,
} from "./ai-provider-credential-model-control"
import { AI_PROVIDER_TYPES, providerOptions } from "./ai-provider-config-shared"
import { AiProviderModelPickerDialog } from "./ai-provider-model-picker-dialog"

const credentialCreateSchema = z.object({
  apiKey: z.string().trim().min(1, "Vui lòng nhập API key"),
  model: z.string().trim().min(1, "Vui lòng xác thực và chọn model"),
})

const aiProviderConfigCreateSchema = z.object({
  providerType: z.enum(AI_PROVIDER_TYPES),
  description: z
    .string()
    .max(500, "Mô tả không được vượt quá 500 ký tự")
    .optional()
    .or(z.literal("")),
  credentials: z
    .array(credentialCreateSchema)
    .min(1, "Vui lòng thêm ít nhất một credential"),
  baseUrl: z
    .string()
    .max(500, "Base URL không được vượt quá 500 ký tự")
    .optional()
    .or(z.literal("")),
  defaultProvider: z.boolean().default(false),
})

type AiProviderConfigCreateFormValues = z.infer<
  typeof aiProviderConfigCreateSchema
>

const emptyCredential = {
  apiKey: "",
  model: "",
}

export function AiProviderConfigCreateForm() {
  const router = useRouter()
  const canFetchModelCatalog = useHasPermission(
    "ai-provider-config:model-catalog"
  )
  const [modelOptions, setModelOptions] = useState<
    AiProviderModelOptionResponse[]
  >([])
  const [isModelDialogOpen, setIsModelDialogOpen] = useState(false)
  const [catalogCredentialFieldId, setCatalogCredentialFieldId] = useState("")
  const [isAuthenticatingModels, startAuthenticatingModels] = useTransition()

  const form = useForm<AiProviderConfigCreateFormValues>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(aiProviderConfigCreateSchema as any),
    defaultValues: {
      providerType: "OPENAI",
      description: "",
      credentials: [emptyCredential],
      baseUrl: "",
      defaultProvider: false,
    },
  })

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "credentials",
  })

  // eslint-disable-next-line react-hooks/incompatible-library
  const credentialValues = form.watch("credentials")
  const selectedCredentialIndex = fields.findIndex(
    (field) => field.id === catalogCredentialFieldId
  )
  const currentDialogModel =
    selectedCredentialIndex >= 0
      ? credentialValues?.[selectedCredentialIndex]?.model || ""
      : ""

  function clearCatalogState() {
    setModelOptions([])
    setIsModelDialogOpen(false)
  }

  function clearCredentialModel(index: number) {
    form.setValue(`credentials.${index}.model`, "", {
      shouldDirty: true,
      shouldTouch: true,
      shouldValidate: true,
    })
    clearCatalogState()
  }

  function clearAllCredentialModels() {
    fields.forEach((_, index) => {
      form.setValue(`credentials.${index}.model`, "", {
        shouldDirty: true,
        shouldTouch: true,
        shouldValidate: true,
      })
    })
    clearCatalogState()
  }

  function handleAddCredential() {
    append({ ...emptyCredential })
  }

  function handleRemoveCredential(index: number) {
    if (fields.length <= 1) {
      return
    }

    if (fields[index]?.id === catalogCredentialFieldId) {
      setCatalogCredentialFieldId("")
      clearCatalogState()
    }

    remove(index)
  }

  async function handleAuthenticateAndSelectModel(
    fieldId: string,
    index: number
  ) {
    const values = form.getValues()
    const apiKeyFieldName = `credentials.${index}.apiKey` as const
    const apiKey = values.credentials?.[index]?.apiKey?.trim() || ""

    if (!apiKey) {
      form.setError(apiKeyFieldName, {
        message: "Vui lòng nhập API key để xác thực",
      })
      form.setFocus(apiKeyFieldName)
      return
    }

    form.clearErrors(apiKeyFieldName)
    setCatalogCredentialFieldId(fieldId)

    const request: AiProviderModelCatalogRequest = {
      providerType: values.providerType,
      apiKey,
      baseUrl: values.baseUrl?.trim() || undefined,
    }

    startAuthenticatingModels(async () => {
      const result = await getAiProviderModelCatalog(request)

      if (result.success) {
        setModelOptions(result.data.models)
        setIsModelDialogOpen(true)
        toast.success("Xác thực credential thành công")
        return
      }

      setModelOptions([])
      setIsModelDialogOpen(false)
      toast.error(result.error || "Không thể xác thực credential")
    })
  }

  function handleConfirmModel(modelId: string) {
    const index = fields.findIndex(
      (field) => field.id === catalogCredentialFieldId
    )

    if (index < 0) {
      setIsModelDialogOpen(false)
      return
    }

    form.setValue(`credentials.${index}.model`, modelId, {
      shouldDirty: true,
      shouldTouch: true,
      shouldValidate: true,
    })
    setIsModelDialogOpen(false)
    toast.success("Đã chọn model cho credential")
  }

  async function onSubmit(values: AiProviderConfigCreateFormValues) {
    const result = await createAiProviderConfig({
      providerType: values.providerType,
      description: values.description?.trim() || undefined,
      baseUrl: values.baseUrl?.trim() || undefined,
      defaultProvider: values.defaultProvider,
      credentials: values.credentials.map((credential) => ({
        apiKey: credential.apiKey.trim(),
        model: credential.model.trim(),
      })),
    } satisfies AiProviderConfigCreateRequest)

    if (result.success) {
      toast.success("Tạo cấu hình AI thành công")
      router.push("/ai-provider-configs")
      router.refresh()
      return
    }

    toast.error(result.error)
  }

  function handleCancel() {
    router.push("/ai-provider-configs")
  }

  return (
    <>
      <AppFormShell
        title="Tạo cấu hình nhà cung cấp AI"
        description="Khai báo nhà cung cấp và thêm credential đã xác thực model."
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
                      Nhà cung cấp <span className="text-destructive">*</span>
                    </FieldLabel>
                    <Select
                      value={field.value}
                      onValueChange={(value) => {
                        field.onChange(value)
                        clearAllCredentialModels()
                      }}
                    >
                      <SelectTrigger
                        id="providerType"
                        aria-invalid={fieldState.invalid}
                      >
                        <SelectValue placeholder="Chọn nhà cung cấp" />
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

              <FieldSet className="gap-4">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div className="flex flex-col gap-1">
                    <FieldLabel>
                      Thiết lập credential
                    </FieldLabel>
                    <FieldDescription>
                      Thêm API key và chọn model cho từng credential.
                    </FieldDescription>
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleAddCredential}
                  >
                    <Plus data-icon="inline-start" />
                    Thêm credential
                  </Button>
                </div>

                <div className="flex flex-col gap-4">
                  {fields.map((credentialField, index) => {
                    const apiKeyName = `credentials.${index}.apiKey` as const
                    const modelName = `credentials.${index}.model` as const
                    const apiKeyInputId = `credential-api-key-${credentialField.id}`
                    const isCatalogCredential =
                      credentialField.id === catalogCredentialFieldId
                    const isAuthenticatingThisCredential =
                      isAuthenticatingModels && isCatalogCredential

                    return (
                      <div
                        key={credentialField.id}
                        className="flex flex-col gap-3 rounded-lg border p-3"
                      >
                        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                          <div className="text-sm text-muted-foreground tabular-nums">
                            Credential {index + 1}
                          </div>
                          <div className="flex flex-wrap items-center gap-2 sm:justify-end">
                            <Controller
                              name={modelName}
                              control={form.control}
                              render={({ field }) => (
                                <AiProviderCredentialModelActionButton
                                  model={field.value}
                                  isPending={isAuthenticatingThisCredential}
                                  disabled={
                                    !canFetchModelCatalog ||
                                    isAuthenticatingModels
                                  }
                                  onClick={() =>
                                    handleAuthenticateAndSelectModel(
                                      credentialField.id,
                                      index
                                    )
                                  }
                                />
                              )}
                            />
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon-sm"
                              aria-label={`Xóa credential ${index + 1}`}
                              disabled={fields.length <= 1}
                              onClick={() => handleRemoveCredential(index)}
                            >
                              <Trash2 data-icon="inline-start" />
                            </Button>
                          </div>
                        </div>

                        <div className="grid gap-3 md:grid-cols-[minmax(0,1fr)_minmax(14rem,0.75fr)]">
                          <Controller
                            name={apiKeyName}
                            control={form.control}
                            render={({ field, fieldState }) => (
                              <Field data-invalid={fieldState.invalid}>
                                <FieldLabel htmlFor={apiKeyInputId}>
                                  API key{" "}
                                  <span className="text-destructive">*</span>
                                </FieldLabel>
                                <Input
                                  {...field}
                                  id={apiKeyInputId}
                                  type="password"
                                  aria-invalid={fieldState.invalid}
                                  onChange={(event) => {
                                    field.onChange(event)
                                    clearCredentialModel(index)
                                    form.clearErrors(apiKeyName)
                                  }}
                                  placeholder="Dán API key của nhà cung cấp"
                                  autoComplete="new-password"
                                />
                                {fieldState.invalid ? (
                                  <FieldError errors={[fieldState.error]} />
                                ) : null}
                              </Field>
                            )}
                          />

                          <Controller
                            name={modelName}
                            control={form.control}
                            render={({ field, fieldState }) => (
                              <Field data-invalid={fieldState.invalid}>
                                <FieldLabel>
                                  Model{" "}
                                  <span className="text-destructive">*</span>
                                </FieldLabel>
                                <AiProviderCredentialModelSummary
                                  model={field.value}
                                  invalid={fieldState.invalid}
                                />
                                {fieldState.invalid ? (
                                  <FieldError errors={[fieldState.error]} />
                                ) : null}
                              </Field>
                            )}
                          />
                        </div>
                      </div>
                    )
                  })}
                </div>
              </FieldSet>

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
                      onChange={(event) => {
                        field.onChange(event)
                        clearAllCredentialModels()
                      }}
                      placeholder="https://api.example.com/v1"
                    />
                    <FieldDescription>
                      Chỉ nhập khi nhà cung cấp yêu cầu endpoint tùy chỉnh.
                    </FieldDescription>
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
                    <FieldLabel htmlFor="description">Mô tả</FieldLabel>
                    <Textarea
                      {...field}
                      id="description"
                      aria-invalid={fieldState.invalid}
                      placeholder="Mô tả ngắn gọn mục đích sử dụng của cấu hình này"
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
                    label="Nhà cung cấp mặc định"
                    description="Đặt cấu hình này làm nhà cung cấp AI mặc định cho toàn hệ thống."
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                )}
              />
            </FieldGroup>
          </AppFormShellBody>

          <AppFormShellFooter>
            <Button type="button" variant="ghost" onClick={handleCancel}>
              Hủy
            </Button>
            <Button disabled={form.formState.isSubmitting} type="submit">
              {form.formState.isSubmitting ? (
                <>
                  <Spinner data-icon="inline-start" />
                  Đang tạo...
                </>
              ) : (
                "Tạo cấu hình"
              )}
            </Button>
          </AppFormShellFooter>
        </form>
      </AppFormShell>

      <AiProviderModelPickerDialog
        currentModel={currentDialogModel}
        models={modelOptions}
        open={isModelDialogOpen}
        onOpenChange={setIsModelDialogOpen}
        onConfirm={handleConfirmModel}
      />
    </>
  )
}
