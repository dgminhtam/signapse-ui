"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { Bot } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState, useTransition } from "react"
import { Controller, useForm } from "react-hook-form"
import { toast } from "sonner"
import * as z from "zod"

import {
  getAiProviderModelCatalog,
  updateAiProviderConfig,
} from "@/app/api/ai-provider-configs/action"
import {
  AiProviderConfigResponse,
  AiProviderConfigUpdateRequest,
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

const aiProviderConfigUpdateSchema = z.object({
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
  temporaryApiKey: z.string().optional().or(z.literal("")),
  model: z
    .string()
    .min(1, "Vui lòng chọn model")
    .max(255, "Tên model quá dài"),
  baseUrl: z
    .string()
    .max(500, "Base URL không được vượt quá 500 ký tự")
    .optional()
    .or(z.literal("")),
  defaultProvider: z.boolean().default(false),
})

type AiProviderConfigUpdateFormValues = z.infer<
  typeof aiProviderConfigUpdateSchema
>

interface AiProviderConfigUpdateFormProps {
  initialData: AiProviderConfigResponse
}

export function AiProviderConfigUpdateForm({
  initialData,
}: AiProviderConfigUpdateFormProps) {
  const router = useRouter()
  const canFetchModelCatalog = useHasPermission("ai-provider-config:model-catalog")
  const [modelOptions, setModelOptions] = useState<AiProviderModelOptionResponse[]>([])
  const [isModelDialogOpen, setIsModelDialogOpen] = useState(false)
  const [hasAuthenticatedCatalog, setHasAuthenticatedCatalog] = useState(false)
  const [credentialsChangedAfterAuth, setCredentialsChangedAfterAuth] = useState(false)
  const [isAuthenticatingModels, startAuthenticatingModels] = useTransition()

  const defaultValues: AiProviderConfigUpdateFormValues = {
    providerType: initialData.providerType,
    name: initialData.name,
    description: initialData.description || "",
    temporaryApiKey: "",
    model: initialData.model,
    baseUrl: initialData.baseUrl || "",
    defaultProvider: initialData.defaultProvider,
  }

  const form = useForm<AiProviderConfigUpdateFormValues>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(aiProviderConfigUpdateSchema as any),
    defaultValues,
  })

  // eslint-disable-next-line react-hooks/incompatible-library
  const selectedModel = form.watch("model")

  function invalidateAuthenticatedCatalog() {
    if (hasAuthenticatedCatalog) {
      setCredentialsChangedAfterAuth(true)
    }

    setHasAuthenticatedCatalog(false)
    setModelOptions([])
    setIsModelDialogOpen(false)
  }

  async function handleAuthenticateAndSelectModel() {
    const values = form.getValues()
    const apiKey = values.temporaryApiKey?.trim()

    if (!apiKey) {
      form.setError("temporaryApiKey", {
        message: "Vui lòng nhập API key tạm thời để xác thực",
      })
      return
    }

    form.clearErrors("temporaryApiKey")

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
        form.clearErrors("temporaryApiKey")
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

  async function onSubmit(values: AiProviderConfigUpdateFormValues) {
    const result = await updateAiProviderConfig(initialData.id, {
      providerType: values.providerType,
      name: values.name.trim(),
      description: values.description?.trim() || "",
      model: values.model.trim(),
      baseUrl: values.baseUrl?.trim() || "",
      defaultProvider: values.defaultProvider,
    } satisfies AiProviderConfigUpdateRequest)

    if (result.success) {
      toast.success("Cập nhật cấu hình AI thành công")
      router.push("/ai-provider-configs")
      router.refresh()
      return
    }

    toast.error(result.error)
  }

  function handleCancel() {
    form.reset(defaultValues)
    setHasAuthenticatedCatalog(false)
    setCredentialsChangedAfterAuth(false)
    setModelOptions([])
    setIsModelDialogOpen(false)
  }

  return (
    <>
      <AppFormShell
        title="Chỉnh sửa cấu hình nhà cung cấp AI"
        description="Cập nhật metadata và model của cấu hình. Credential được quản lý ở vùng riêng bên dưới."
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
                      <SelectTrigger id="providerType" aria-invalid={fieldState.invalid}>
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
                      Tên hiển thị <span className="text-destructive">*</span>
                    </FieldLabel>
                    <Input
                      {...field}
                      id="name"
                      aria-invalid={fieldState.invalid}
                      placeholder="Ví dụ: OpenAI sản xuất chính"
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
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />

              <Controller
                name="temporaryApiKey"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="temporaryApiKey">
                      API key tạm thời để chọn model
                    </FieldLabel>
                    <Input
                      {...field}
                      id="temporaryApiKey"
                      type="password"
                      aria-invalid={fieldState.invalid}
                      onChange={(event) => {
                        form.clearErrors("temporaryApiKey")
                        invalidateAuthenticatedCatalog()
                        field.onChange(event)
                      }}
                      placeholder="Dán API key nếu cần xác thực lại danh sách model"
                      autoComplete="new-password"
                    />
                    <FieldDescription>
                      Key này chỉ dùng để tải danh sách model, không được lưu nếu bạn không cập nhật credential.
                    </FieldDescription>
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
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
                          Model đã chọn <span className="text-destructive">*</span>
                        </FieldLabel>
                        <FieldDescription>
                          Nhập API key tạm thời nếu bạn cần xác thực lại và đổi model.
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
                          !form.getValues("temporaryApiKey")?.trim()
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
                          <span className="text-xs font-medium uppercase text-muted-foreground">
                            Model hiện tại
                          </span>
                          <span className="break-all font-medium text-foreground">
                            {field.value}
                          </span>
                        </div>
                      ) : (
                        <div className="flex items-start gap-3 text-sm text-muted-foreground">
                          <Bot className="mt-0.5 shrink-0" />
                          <span>Chưa có model nào được chọn.</span>
                        </div>
                      )}
                    </div>

                    {credentialsChangedAfterAuth && field.value ? (
                      <FieldDescription>
                        Thông tin xác thực tạm thời đã thay đổi. Hãy xác thực lại nếu bạn muốn chọn model mới.
                      </FieldDescription>
                    ) : null}

                    {hasAuthenticatedCatalog && modelOptions.length === 0 ? (
                      <FieldDescription>
                        Nhà cung cấp không trả về model nào cho thông tin xác thực hiện tại.
                      </FieldDescription>
                    ) : null}

                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
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
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />

              <Controller
                name="defaultProvider"
                control={form.control}
                render={({ field }) => (
                  <Field className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="flex flex-col gap-0.5">
                      <FieldLabel className="text-base">Nhà cung cấp mặc định</FieldLabel>
                      <div className="text-sm text-muted-foreground">
                        Đặt cấu hình này làm nhà cung cấp AI mặc định cho toàn hệ thống.
                      </div>
                    </div>
                    <Switch checked={field.value} onCheckedChange={field.onChange} />
                  </Field>
                )}
              />
            </FieldGroup>
          </AppFormShellBody>

          <AppFormShellFooter>
            <Button type="button" variant="ghost" onClick={handleCancel}>
              Hủy
            </Button>
            <Button disabled={form.formState.isSubmitting || !selectedModel} type="submit">
              {form.formState.isSubmitting ? (
                <>
                  <Spinner data-icon="inline-start" />
                  Đang cập nhật...
                </>
              ) : (
                "Lưu thay đổi"
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
