"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { Controller, useForm } from "react-hook-form"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import * as z from "zod"

import { createCronjob } from "@/app/api/cronjobs/action"
import {
  AppFormShell,
  AppFormShellBody,
  AppFormShellFooter,
} from "@/components/app-form-shell"
import { Button } from "@/components/ui/button"
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupText,
} from "@/components/ui/input-group"
import { Spinner } from "@/components/ui/spinner"

export const createCronjobSchema = z.object({
  jobName: z
    .string()
    .min(1, "Tên tác vụ là bắt buộc")
    .max(255, "Tên tác vụ quá dài"),
  jobGroup: z
    .string()
    .min(1, "Nhóm tác vụ là bắt buộc")
    .max(255, "Nhóm tác vụ quá dài"),
  jobClass: z
    .string()
    .min(1, "Lớp xử lý là bắt buộc")
    .max(255, "Lớp xử lý quá dài"),
  expression: z
    .string()
    .min(1, "Biểu thức cron là bắt buộc")
    .max(100, "Biểu thức cron quá dài"),
  description: z.string().max(500, "Mô tả quá dài").optional(),
})

export type CreateCronjobRequest = z.infer<typeof createCronjobSchema>

export function CreateCronjobForm() {
  const router = useRouter()
  const form = useForm<CreateCronjobRequest>({
    resolver: zodResolver(createCronjobSchema as any),
    defaultValues: {
      jobName: "",
      jobGroup: "",
      jobClass: "",
      expression: "",
      description: "",
    },
  })

  async function onSubmit(data: CreateCronjobRequest) {
    const result = await createCronjob(data)
    if (result.success) {
      toast.success("Đã tạo tác vụ định kỳ thành công.")

      form.reset({
        jobName: "",
        jobGroup: "",
        jobClass: "",
        expression: "",
        description: "",
      })

      router.push("/cronjobs")
      router.refresh()
    } else {
      toast.error(result.error || "Đã có lỗi không mong muốn xảy ra. Vui lòng thử lại.")
    }
  }

  return (
    <AppFormShell
      title="Tạo tác vụ định kỳ"
      description="Khai báo lớp xử lý, nhóm tác vụ và lịch chạy cron."
      width="md"
    >
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <AppFormShellBody>
          <FieldGroup>
        <Controller
          name="jobName"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor="jobName">
                Tên tác vụ <span className="text-destructive">*</span>
              </FieldLabel>
              <Input
                {...field}
                id="jobName"
                placeholder="Ví dụ: ingest-market-news"
                autoComplete="off"
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Controller
          name="jobGroup"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor="jobGroup">
                Nhóm tác vụ <span className="text-destructive">*</span>
              </FieldLabel>
              <Input
                {...field}
                id="jobGroup"
                placeholder="Ví dụ: ingestion"
                autoComplete="off"
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Controller
          name="jobClass"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor="jobClass">
                Lớp xử lý <span className="text-destructive">*</span>
              </FieldLabel>
              <Input
                {...field}
                id="jobClass"
                placeholder="Ví dụ: com.signapse.jobs.NewsIngestJob"
                autoComplete="off"
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Controller
          name="expression"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor="expression">
                Biểu thức cron <span className="text-destructive">*</span>
              </FieldLabel>
              <InputGroup>
                <Input
                  {...field}
                  id="expression"
                  placeholder="0 0 * * *"
                  autoComplete="off"
                  className="font-mono"
                />
                <InputGroupAddon>
                  <InputGroupText className="text-xs text-muted-foreground">
                    Ví dụ: 0 0 * * * (chạy hằng ngày lúc 00:00)
                  </InputGroupText>
                </InputGroupAddon>
              </InputGroup>
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
              <Input
                {...field}
                id="description"
                placeholder="Mô tả ngắn về mục đích của tác vụ"
                autoComplete="off"
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
          </FieldGroup>
        </AppFormShellBody>

        <AppFormShellFooter>
      <div className="flex gap-4">
        <Button disabled={form.formState.isSubmitting} type="submit">
          {form.formState.isSubmitting ? (
            <>
              <Spinner className="mr-2 size-4" data-icon="inline-start" /> Đang tạo...
            </>
          ) : (
            "Tạo tác vụ"
          )}
        </Button>
        <Button
          type="button"
          variant="ghost"
          onClick={() => router.push("/cronjobs")}
        >
          Hủy
        </Button>
      </div>
        </AppFormShellFooter>
      </form>
    </AppFormShell>
  )
}
