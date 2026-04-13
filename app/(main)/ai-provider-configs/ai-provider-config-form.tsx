"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { Bot } from "lucide-react"
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
  AiProviderConfigResponse,
  AiProviderConfigUpdateRequest,
  AiProviderModelCatalogRequest,
  AiProviderModelOptionResponse,
  AiProviderType,
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
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Spinner } from "@/components/ui/spinner"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"

import { AiProviderModelPickerDialog } from "./ai-provider-model-picker-dialog"

const providerOptions: { value: AiProviderType; label: string }[] = [
  { value: "GEMINI", label: "Gemini" },
  { value: "OPENAI", label: "OpenAI" },
  { value: "ZAI", label: "ZAI" },
]

const aiProviderConfigSchema = z.object({
  providerType: z.enum(["GEMINI", "OPENAI", "ZAI"]),
  name: z.string().min(1, "Vui lòng nhập tên hiển thị").max(255, "Tên hiển thị quá dài"),
  description: z
    .string()
    .max(500, "Mô tả không được vượt quá 500 ký tự")
    .optional()
    .or(z.literal("")),
  apiKey: z.string(),
  model: z.string().min(1, "Vui lòng xác thực và chọn model").max(255, "Tên model quá dài"),
  baseUrl: z
    .string()
    .max(500, "Base URL không được vượt quá 500 ký tự")
    .optional()
    .or(z.literal("")),
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
  const [isModelDialogOpen, setIsModelDialogOpen] = useState(false)
  const [hasAuthenticatedCatalog, setHasAuthenticatedCatalog] = useState(false)
  const [credentialsChangedAfterAuth, setCredentialsChangedAfterAuth] = useState(false)
  const [isAuthenticatingModels, startAuthenticatingModels] = useTransition()

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

  const selectedModel = form.watch("model")

  function invalidateAuthenticatedCatalog() {
    if (hasAuthenticatedCatalog) {
      setCredentialsChangedAfterAuth(true)
    }

    setHasAuthenticatedCatalog(false)
    setModelOptions([])
    setIsModelDialogOpen(false)

    if (!isEdit) {
      form.setValue("model", "", {
        shouldDirty: true,
        shouldTouch: true,
        shouldValidate: true,
      })
    }
  }

  async function handleAuthenticateAndSelectModel() {
    const values = form.getValues()
    const apiKey = values.apiKey.trim()

    if (!apiKey) {
      form.setError("apiKey", { message: "Vui lòng nhập API key để xác thực" })
      return
    }

    form.clearErrors("apiKey")

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
        form.clearErrors("apiKey")
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
      toast.success(isEdit ? "Cập nhật cấu hình AI thành công" : "Tạo cấu hình AI thành công")
      router.push("/ai-provider-configs")
      router.refresh()
      return
    }

    toast.error(result.error)
  }

  return (
    <>
      <form onSubmit={form.handleSubmit(onSubmit)}>
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
            name="apiKey"
            control={form.control}
            rules={{
              validate: (value) => (isEdit || value.trim().length > 0 ? true : "Vui lòng nhập API key"),
            }}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="apiKey">
                  API key {!isEdit && <span className="text-destructive">*</span>}
                </FieldLabel>
                <Input
                  {...field}
                  id="apiKey"
                  type="password"
                  aria-invalid={fieldState.invalid}
                  onChange={(event) => {
                    form.clearErrors("apiKey")
                    invalidateAuthenticatedCatalog()
                    field.onChange(event)
                  }}
                  placeholder={
                    isEdit
                      ? "Để trống nếu muốn giữ API key hiện tại"
                      : "Dán API key của nhà cung cấp"
                  }
                  autoComplete="new-password"
                />
                <FieldDescription>
                  {isEdit
                    ? "Nhập API key mới nếu bạn muốn xác thực lại và chọn model khác."
                    : "Nhập API key để xác thực với nhà cung cấp trước khi chọn model."}
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
                      Model chỉ có thể được chọn sau khi xác thực thành công với nhà cung cấp AI.
                    </FieldDescription>
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    className="sm:w-auto"
                    onClick={handleAuthenticateAndSelectModel}
                    disabled={
                      isAuthenticatingModels ||
                      !form.getValues("providerType") ||
                      !form.getValues("apiKey").trim()
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
                      <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                        Model hiện tại
                      </span>
                      <span className="break-all font-medium text-foreground">{field.value}</span>
                    </div>
                  ) : (
                    <div className="flex items-start gap-3 text-sm text-muted-foreground">
                      <Bot className="mt-0.5 shrink-0" />
                      <span>
                        Chưa có model nào được chọn. Vui lòng xác thực với nhà cung cấp để mở danh
                        sách model.
                      </span>
                    </div>
                  )}
                </div>

                {credentialsChangedAfterAuth && field.value ? (
                  <FieldDescription>
                    Thông tin xác thực đã thay đổi. Hãy xác thực lại nếu bạn muốn chọn model mới.
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

        <Separator className="my-8" />

        <div className="flex gap-4">
          <Button disabled={form.formState.isSubmitting || !selectedModel} type="submit">
            {form.formState.isSubmitting ? (
              <>
                <Spinner data-icon="inline-start" />
                {isEdit ? "Đang cập nhật..." : "Đang tạo..."}
              </>
            ) : isEdit ? (
              "Lưu thay đổi"
            ) : (
              "Tạo cấu hình"
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
                setHasAuthenticatedCatalog(false)
                setCredentialsChangedAfterAuth(false)
                setModelOptions([])
                setIsModelDialogOpen(false)
                return
              }

              form.reset()
              setHasAuthenticatedCatalog(false)
              setCredentialsChangedAfterAuth(false)
              setModelOptions([])
              setIsModelDialogOpen(false)
            }}
          >
            Hủy
          </Button>
        </div>
      </form>

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
