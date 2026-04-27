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
  getSystemPromptTypeLabel,
  getSystemPromptWorkflowGroup,
  SYSTEM_PROMPT_TYPE_OPTIONS,
  SYSTEM_PROMPT_TYPES,
  SystemPromptResponse,
  SystemPromptType,
  UpdateSystemPromptRequest,
} from "@/app/lib/system-prompts/definitions"
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
import { Separator } from "@/components/ui/separator"
import { Spinner } from "@/components/ui/spinner"

const MAX_PROMPT_CONTENT_LENGTH = 10000

const systemPromptFormSchema = z.object({
  promptType: z.enum(SYSTEM_PROMPT_TYPES),
  content: z
    .string()
    .max(
      MAX_PROMPT_CONTENT_LENGTH,
      `Nội dung prompt không được vượt quá ${MAX_PROMPT_CONTENT_LENGTH.toLocaleString(
        "vi-VN"
      )} ký tự`
    )
    .refine((value) => value.trim().length > 0, {
      message: "Vui lòng nhập nội dung prompt",
    }),
})

type SystemPromptFormValues = z.infer<typeof systemPromptFormSchema>

interface SystemPromptFormProps {
  initialData?: SystemPromptResponse
}

export function SystemPromptForm({ initialData }: SystemPromptFormProps) {
  const router = useRouter()
  const isEdit = Boolean(initialData)

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
      toast.success(
        isEdit
          ? "Đã cập nhật prompt hệ thống."
          : "Đã tạo prompt hệ thống."
      )
      router.push("/system-prompts")
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

    router.push("/system-prompts")
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      <FieldGroup>
        {isEdit && initialData ? (
          <Field>
            <FieldLabel>Loại prompt</FieldLabel>
            <div className="rounded-lg border border-border bg-muted/20 p-4">
              <div className="flex flex-wrap items-center gap-2">
                <Badge>{getSystemPromptTypeLabel(initialData.promptType)}</Badge>
                <Badge variant="secondary">
                  {getSystemPromptWorkflowGroup(initialData.promptType)}
                </Badge>
              </div>
              <p className="mt-3 break-all font-mono text-sm text-muted-foreground">
                {initialData.promptType}
              </p>
            </div>
            <FieldDescription>
              Loại prompt là định danh của bản ghi và không thể chỉnh sửa ở chế
              độ cập nhật.
            </FieldDescription>
          </Field>
        ) : (
          <Controller
            name="promptType"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="promptType">
                  Loại prompt <span className="text-destructive">*</span>
                </FieldLabel>
                <Select
                  value={field.value}
                  onValueChange={(value) => field.onChange(value as SystemPromptType)}
                >
                  <SelectTrigger id="promptType" aria-invalid={fieldState.invalid}>
                    <SelectValue placeholder="Chọn loại prompt" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {SYSTEM_PROMPT_TYPE_OPTIONS.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label} · {option.group}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
                <FieldDescription>
                  Chọn workflow AI mà prompt này sẽ điều khiển.
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
                Nội dung prompt <span className="text-destructive">*</span>
              </FieldLabel>
              <InputGroup>
                <InputGroupTextarea
                  {...field}
                  id="content"
                  rows={18}
                  aria-invalid={fieldState.invalid}
                  className="min-h-[460px] resize-y font-mono text-sm leading-6"
                  placeholder="Nhập hướng dẫn hệ thống cho workflow AI..."
                />
                <InputGroupAddon align="block-end">
                  <InputGroupText
                    className={
                      isOverLimit
                        ? "text-xs tabular-nums text-destructive"
                        : "text-xs tabular-nums"
                    }
                  >
                    {contentLength.toLocaleString("vi-VN")} /{" "}
                    {MAX_PROMPT_CONTENT_LENGTH.toLocaleString("vi-VN")} ký tự
                  </InputGroupText>
                </InputGroupAddon>
              </InputGroup>
              <FieldDescription>
                Prompt nên mô tả rõ vai trò, ngữ cảnh, quy tắc đầu ra và các
                giới hạn cần tuân thủ.
              </FieldDescription>
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        {!isEdit ? (
          <div className="rounded-lg border border-dashed bg-muted/20 p-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-2 font-medium text-foreground">
              <FileText className="h-4 w-4" />
              Prompt đang chọn
            </div>
            <p className="mt-2">
              {getSystemPromptTypeLabel(promptType)} ·{" "}
              {getSystemPromptWorkflowGroup(promptType)}
            </p>
          </div>
        ) : null}
      </FieldGroup>

      <Separator className="my-8" />

      <div className="flex flex-col gap-3 sm:flex-row">
        <Button disabled={form.formState.isSubmitting} type="submit">
          {form.formState.isSubmitting ? (
            <>
              <Spinner data-icon="inline-start" />
              {isEdit ? "Đang cập nhật..." : "Đang tạo..."}
            </>
          ) : isEdit ? (
            "Lưu thay đổi"
          ) : (
            "Tạo prompt"
          )}
        </Button>
        <Button type="button" variant="ghost" onClick={handleCancel}>
          Hủy
        </Button>
      </div>
    </form>
  )
}
