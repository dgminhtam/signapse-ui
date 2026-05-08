"use client"

import { Control, Controller } from "react-hook-form"
import * as z from "zod"

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
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"

export const newsOutletFormSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Tên nguồn tin là bắt buộc")
    .max(255, "Tên nguồn tin không được vượt quá 255 ký tự"),
  homepageUrl: z
    .string()
    .trim()
    .url("URL trang chủ không hợp lệ")
    .min(1, "URL trang chủ là bắt buộc"),
  rssUrl: z.union([
    z.literal(""),
    z.string().trim().url("URL RSS không hợp lệ"),
  ]),
  description: z
    .string()
    .trim()
    .max(1000, "Mô tả không được vượt quá 1000 ký tự")
    .optional()
    .or(z.literal("")),
  active: z.boolean().default(true),
})

export type NewsOutletFormValues = z.infer<typeof newsOutletFormSchema>

interface NewsOutletFormFieldsProps {
  control: Control<NewsOutletFormValues>
  isSubmitting: boolean
}

export function NewsOutletFormFields({
  control,
  isSubmitting,
}: NewsOutletFormFieldsProps) {
  return (
    <>
      <FieldSet>
        <FieldGroup>
          <Controller
            name="name"
            control={control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="name">
                  Tên nguồn tin <span className="text-destructive">*</span>
                </FieldLabel>
                <Input
                  {...field}
                  id="name"
                  aria-invalid={fieldState.invalid}
                  placeholder="Ví dụ: Investing VN News"
                  autoComplete="off"
                  disabled={isSubmitting}
                />
                {fieldState.invalid ? (
                  <FieldError errors={[fieldState.error]} />
                ) : null}
              </Field>
            )}
          />

          <Controller
            name="homepageUrl"
            control={control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="homepageUrl">
                  URL trang chủ <span className="text-destructive">*</span>
                </FieldLabel>
                <Input
                  {...field}
                  id="homepageUrl"
                  aria-invalid={fieldState.invalid}
                  placeholder="https://example.com"
                  autoComplete="off"
                  disabled={isSubmitting}
                />
                {fieldState.invalid ? (
                  <FieldError errors={[fieldState.error]} />
                ) : null}
              </Field>
            )}
          />

          <Controller
            name="rssUrl"
            control={control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="rssUrl">URL RSS</FieldLabel>
                <Input
                  {...field}
                  id="rssUrl"
                  aria-invalid={fieldState.invalid}
                  placeholder="https://example.com/rss.xml"
                  autoComplete="off"
                  disabled={isSubmitting}
                />
                <FieldDescription>
                  Để trống nếu nguồn tin không cung cấp RSS.
                </FieldDescription>
                {fieldState.invalid ? (
                  <FieldError errors={[fieldState.error]} />
                ) : null}
              </Field>
            )}
          />

          <Controller
            name="description"
            control={control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="description">Mô tả</FieldLabel>
                <Textarea
                  {...field}
                  id="description"
                  aria-invalid={fieldState.invalid}
                  rows={4}
                  placeholder="Mô tả ngắn về phạm vi và vai trò của nguồn tin."
                  disabled={isSubmitting}
                />
                {fieldState.invalid ? (
                  <FieldError errors={[fieldState.error]} />
                ) : null}
              </Field>
            )}
          />
        </FieldGroup>
      </FieldSet>

      <FieldSet>
        <FieldLabel>Trạng thái</FieldLabel>
        <FieldGroup>
          <Controller
            name="active"
            control={control}
            render={({ field }) => (
              <Field className="flex flex-row items-center justify-between rounded-lg border p-4">
                <div className="flex flex-col gap-0.5">
                  <FieldLabel htmlFor="active">
                    Kích hoạt nguồn tin
                  </FieldLabel>
                  <FieldDescription>
                    Cho phép hệ thống tiếp tục sử dụng nguồn tin này trong quy
                    trình xử lý nội dung.
                  </FieldDescription>
                </div>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                  disabled={isSubmitting}
                  id="active"
                />
              </Field>
            )}
          />
        </FieldGroup>
      </FieldSet>
    </>
  )
}
