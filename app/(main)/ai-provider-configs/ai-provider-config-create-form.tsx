"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { Bot, KeyRound, Plus, Trash2 } from "lucide-react"
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
import { useHasPermission } from "@/components/permission-provider"
import { Button } from "@/components/ui/button"
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
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
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"

import { AiProviderModelPickerDialog } from "./ai-provider-model-picker-dialog"
import { AI_PROVIDER_TYPES, providerOptions } from "./ai-provider-config-shared"

const credentialCreateSchema = z.object({
  label: z
    .string()
    .max(255, "Nhãn credential quá dài")
    .optional()
    .or(z.literal("")),
  apiKey: z.string().trim().min(1, "Vui lòng nhập API key"),
})

const aiProviderConfigCreateSchema = z.object({
  providerType: z.enum(AI_PROVIDER_TYPES),
  name: z
    .string()
    .min(1, "Vui lòng nhập tên hiển thị")
    .max(255, "Tên hiển thị quá dài"),
  description: z
    .string()
    .max(500, "Mô tả không được vượt quá 500 ký tự")
    .optional()
    .or(z.literal("")),
  credentials: z
    .array(credentialCreateSchema)
    .min(1, "Vui lòng thêm ít nhất một credential"),
  model: z
    .string()
    .min(1, "Vui lòng xác thực và chọn model")
    .max(255, "Tên model quá dài"),
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
  label: "",
  apiKey: "",
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
  const [hasAuthenticatedCatalog, setHasAuthenticatedCatalog] = useState(false)
  const [credentialsChangedAfterAuth, setCredentialsChangedAfterAuth] =
    useState(false)
  const [catalogCredentialFieldId, setCatalogCredentialFieldId] = useState("")
  const [isAuthenticatingModels, startAuthenticatingModels] = useTransition()

  const form = useForm<AiProviderConfigCreateFormValues>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(aiProviderConfigCreateSchema as any),
    defaultValues: {
      providerType: "OPENAI",
      name: "",
      description: "",
      credentials: [emptyCredential],
      model: "",
      baseUrl: "",
      defaultProvider: false,
    },
  })

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "credentials",
  })

  // eslint-disable-next-line react-hooks/incompatible-library
  const selectedModel = form.watch("model")
  const selectedCatalogCredentialId = fields.some(
    (field) => field.id === catalogCredentialFieldId
  )
    ? catalogCredentialFieldId
    : fields[0]?.id
  const selectedCatalogCredentialIndex = fields.findIndex(
    (field) => field.id === selectedCatalogCredentialId
  )

  function invalidateAuthenticatedCatalog() {
    if (hasAuthenticatedCatalog) {
      setCredentialsChangedAfterAuth(true)
    }

    setHasAuthenticatedCatalog(false)
    setModelOptions([])
    setIsModelDialogOpen(false)
    form.setValue("model", "", {
      shouldDirty: true,
      shouldTouch: true,
      shouldValidate: true,
    })
  }

  function handleAddCredential() {
    append({ ...emptyCredential })
  }

  function handleSelectCatalogCredential(fieldId: string) {
    if (fieldId === selectedCatalogCredentialId) {
      return
    }

    setCatalogCredentialFieldId(fieldId)
    invalidateAuthenticatedCatalog()
  }

  function handleRemoveCredential(index: number) {
    if (fields.length <= 1) {
      return
    }

    const removedField = fields[index]
    const nextCatalogField = fields[index + 1] || fields[index - 1]

    if (removedField?.id === selectedCatalogCredentialId) {
      setCatalogCredentialFieldId(nextCatalogField?.id || "")
      invalidateAuthenticatedCatalog()
    }

    remove(index)
  }

  async function handleAuthenticateAndSelectModel() {
    const values = form.getValues()
    const selectedIndex =
      selectedCatalogCredentialIndex >= 0 ? selectedCatalogCredentialIndex : 0
    const apiKeyFieldName = `credentials.${selectedIndex}.apiKey` as const
    const apiKey = values.credentials?.[selectedIndex]?.apiKey?.trim() || ""

    if (!apiKey) {
      form.setError(apiKeyFieldName, {
        message: "Vui lòng nhập API key để xác thực",
      })
      form.setFocus(apiKeyFieldName)
      return
    }

    form.clearErrors(apiKeyFieldName)

    const request: AiProviderModelCatalogRequest = {
      providerType: values.providerType,
      apiKey,
      baseUrl: values.baseUrl?.trim() || undefined,
    }

    startAuthenticatingModels(async () => {
      const result = await getAiProviderModelCatalog(request)

      if (result.success) {
        setHasAuthenticatedCatalog(true)
        setCredentialsChangedAfterAuth(false)
        setModelOptions(result.data.models)
        setIsModelDialogOpen(true)
        form.clearErrors(apiKeyFieldName)
        toast.success("Xác thực thành công")
        return
      }

      setHasAuthenticatedCatalog(false)
      setModelOptions([])
      setIsModelDialogOpen(false)
      toast.error(result.error || "Không thể xác thực nhà cung cấp AI")
    })
  }

  function handleConfirmModel(modelId: string) {
    form.setValue("model", modelId, {
      shouldDirty: true,
      shouldTouch: true,
      shouldValidate: true,
    })
    setIsModelDialogOpen(false)
    toast.success("Đã chọn model thành công")
  }

  async function onSubmit(values: AiProviderConfigCreateFormValues) {
    const credentials = values.credentials.map((credential) => {
      const label = credential.label?.trim()

      return {
        ...(label ? { label } : {}),
        apiKey: credential.apiKey.trim(),
      }
    })

    const result = await createAiProviderConfig({
      providerType: values.providerType,
      name: values.name.trim(),
      description: values.description?.trim() || "",
      model: values.model.trim(),
      baseUrl: values.baseUrl?.trim() || "",
      defaultProvider: values.defaultProvider,
      credentials,
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
        description="Khai báo nhà cung cấp AI, thêm các credential ban đầu và chọn model sử dụng."
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
                        invalidateAuthenticatedCatalog()
                        field.onChange(value)
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
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              <Controller
                name="name"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="name">
                      Tên hiển thị <span className="text-destructive">*</span>
                    </FieldLabel>
                    <Input
                      {...field}
                      id="name"
                      aria-invalid={fieldState.invalid}
                      placeholder="Ví dụ: OpenAI sản xuất chính"
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              <FieldSet className="gap-4">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div className="flex flex-col gap-1">
                    <FieldLegend className="mb-0">
                      Credential ban đầu
                    </FieldLegend>
                    <FieldDescription>
                      Thêm một hoặc nhiều API key sẽ được tạo cùng cấu hình này.
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
                    const labelName = `credentials.${index}.label` as const
                    const apiKeyName = `credentials.${index}.apiKey` as const
                    const labelInputId = `credential-label-${credentialField.id}`
                    const apiKeyInputId = `credential-api-key-${credentialField.id}`
                    const isCatalogCredential =
                      credentialField.id === selectedCatalogCredentialId

                    return (
                      <div
                        key={credentialField.id}
                        className="flex flex-col gap-4 rounded-lg border p-4"
                      >
                        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                          <div className="flex flex-col gap-1">
                            <div className="text-sm font-medium">
                              Credential {index + 1}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {isCatalogCredential
                                ? "API key này đang được dùng để xác thực và chọn model."
                                : "Có thể dùng credential này để xác thực catalog khi cần."}
                            </div>
                          </div>
                          <div className="flex flex-wrap items-center gap-2 sm:justify-end">
                            <Button
                              type="button"
                              variant={
                                isCatalogCredential ? "secondary" : "outline"
                              }
                              onClick={() =>
                                handleSelectCatalogCredential(
                                  credentialField.id
                                )
                              }
                            >
                              <KeyRound data-icon="inline-start" />
                              {isCatalogCredential
                                ? "Đang dùng chọn model"
                                : "Dùng chọn model"}
                            </Button>
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

                        <div className="grid gap-4 md:grid-cols-2">
                          <Controller
                            name={labelName}
                            control={form.control}
                            render={({ field, fieldState }) => (
                              <Field data-invalid={fieldState.invalid}>
                                <FieldLabel htmlFor={labelInputId}>
                                  Nhãn credential
                                </FieldLabel>
                                <Input
                                  {...field}
                                  id={labelInputId}
                                  aria-invalid={fieldState.invalid}
                                  placeholder="Ví dụ: Key sản xuất"
                                />
                                {fieldState.invalid && (
                                  <FieldError errors={[fieldState.error]} />
                                )}
                              </Field>
                            )}
                          />

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
                                    form.clearErrors(apiKeyName)
                                    if (isCatalogCredential) {
                                      invalidateAuthenticatedCatalog()
                                    }
                                    field.onChange(event)
                                  }}
                                  placeholder="Dán API key của nhà cung cấp"
                                  autoComplete="new-password"
                                />
                                {fieldState.invalid && (
                                  <FieldError errors={[fieldState.error]} />
                                )}
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
                        invalidateAuthenticatedCatalog()
                        field.onChange(event)
                      }}
                      placeholder="https://api.example.com/v1"
                    />
                    <FieldDescription>
                      Chỉ nhập khi nhà cung cấp yêu cầu endpoint tùy chỉnh.
                    </FieldDescription>
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              <Controller
                name="model"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                      <div className="flex flex-col gap-1">
                        <FieldLabel>
                          Model đã chọn{" "}
                          <span className="text-destructive">*</span>
                        </FieldLabel>
                        <FieldDescription>
                          Catalog dùng credential đang được chọn trong danh sách
                          bên trên.
                        </FieldDescription>
                      </div>
                      <Button
                        type="button"
                        variant="outline"
                        className="sm:w-auto"
                        onClick={handleAuthenticateAndSelectModel}
                        disabled={
                          !canFetchModelCatalog ||
                          isAuthenticatingModels ||
                          !form.getValues("providerType") ||
                          selectedCatalogCredentialIndex < 0
                        }
                      >
                        {isAuthenticatingModels ? (
                          <>
                            <Spinner data-icon="inline-start" />
                            Đang xác thực...
                          </>
                        ) : (
                          "Xác thực và chọn model"
                        )}
                      </Button>
                    </div>

                    <div
                      className="rounded-lg border border-dashed px-4 py-3"
                      aria-invalid={fieldState.invalid}
                    >
                      {field.value ? (
                        <div className="flex flex-col gap-1">
                          <span className="text-xs font-medium text-muted-foreground uppercase">
                            Model hiện tại
                          </span>
                          <span className="font-medium break-all text-foreground">
                            {field.value}
                          </span>
                        </div>
                      ) : (
                        <div className="flex items-start gap-3 text-sm text-muted-foreground">
                          <Bot className="mt-0.5 shrink-0" />
                          <span>
                            Chưa có model nào được chọn. Vui lòng xác thực để mở
                            danh sách model.
                          </span>
                        </div>
                      )}
                    </div>

                    {credentialsChangedAfterAuth && field.value ? (
                      <FieldDescription>
                        Thông tin xác thực đã thay đổi. Hãy xác thực lại để chọn
                        model mới.
                      </FieldDescription>
                    ) : null}

                    {hasAuthenticatedCatalog && modelOptions.length === 0 ? (
                      <FieldDescription>
                        Nhà cung cấp không trả về model nào cho thông tin xác
                        thực hiện tại.
                      </FieldDescription>
                    ) : null}

                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
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
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              <Controller
                name="defaultProvider"
                control={form.control}
                render={({ field }) => (
                  <Field className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="flex flex-col gap-0.5">
                      <FieldLabel className="text-base">
                        Nhà cung cấp mặc định
                      </FieldLabel>
                      <div className="text-sm text-muted-foreground">
                        Đặt cấu hình này làm nhà cung cấp AI mặc định cho toàn
                        hệ thống.
                      </div>
                    </div>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </Field>
                )}
              />
            </FieldGroup>
          </AppFormShellBody>

          <AppFormShellFooter>
            <Button type="button" variant="ghost" onClick={handleCancel}>
              Hủy
            </Button>
            <Button
              disabled={form.formState.isSubmitting || !selectedModel}
              type="submit"
            >
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
        currentModel={selectedModel}
        models={modelOptions}
        open={isModelDialogOpen}
        onOpenChange={setIsModelDialogOpen}
        onConfirm={handleConfirmModel}
      />
    </>
  )
}
