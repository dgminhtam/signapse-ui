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

const aiProviderConfigUpdateSchema = z.object({
  providerType: z.enum(AI_PROVIDER_TYPES),
  description: z
    .string()
    .max(500, "Mô tả không được vượt quá 500 ký tự")
    .optional()
    .or(z.literal("")),
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
      toast.success("Cập nhật cấu hình AI thành công")
      router.push("/ai-provider-configs")
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
      title="Chỉnh sửa cấu hình nhà cung cấp AI"
      description="Cập nhật metadata của cấu hình. Model được quản lý riêng trên từng credential."
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
                  <Select value={field.value} onValueChange={field.onChange}>
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
                Đang cập nhật...
              </>
            ) : (
              "Lưu thay đổi"
            )}
          </Button>
        </AppFormShellFooter>
      </form>
    </AppFormShell>
  )
}
