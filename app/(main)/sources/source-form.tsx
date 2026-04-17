"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { Controller, useForm } from "react-hook-form"
import { toast } from "sonner"
import * as z from "zod"
import { useRouter } from "next/navigation"

import { createSource, updateSource } from "@/app/api/sources/action"
import { SourceResponse, SourceRequest } from "@/app/lib/sources/definitions"
import { Button } from "@/components/ui/button"
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { Spinner } from "@/components/ui/spinner"

const sourceSchema = z.object({
  name: z
    .string()
    .min(1, "Name is required")
    .max(255, "Name is too long"),
  url: z
    .string()
    .url("Invalid URL format")
    .min(1, "URL is required"),
  rssUrl: z.union([z.literal(""), z.string().url("Invalid RSS URL format")]),
  description: z
    .string()
    .max(500, "Description is too long")
    .optional()
    .or(z.literal("")),
  active: z.boolean().default(true),
})

type SourceFormValues = z.infer<typeof sourceSchema>

interface SourceFormProps {
  initialData?: SourceResponse
}

export function SourceForm({ initialData }: SourceFormProps) {
  const router = useRouter()
  const isEdit = !!initialData

  const form = useForm<SourceFormValues>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(sourceSchema as any),
    defaultValues: {
      name: initialData?.name || "",
      url: initialData?.url || "",
      rssUrl: initialData?.rssUrl || "",
      description: initialData?.description || "",
      active: initialData?.active ?? true,
    },
  })

  async function onSubmit(data: SourceFormValues) {
    const request: SourceRequest = {
      ...data,
      rssUrl: data.rssUrl || "",
      description: data.description || "",
    }

    const result = isEdit
      ? await updateSource(initialData.id, request)
      : await createSource(request)

    if (result.success) {
      toast.success(isEdit ? "Source updated successfully" : "Source created successfully")
      router.push("/sources")
      router.refresh()
    } else {
      toast.error(result.error)
    }
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      <FieldGroup>
        <Controller
          name="name"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="name">
                Source Name <span className="text-destructive">*</span>
              </FieldLabel>
              <Input
                {...field}
                id="name"
                placeholder="e.g. Google News"
                autoComplete="off"
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Controller
          name="url"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="url">
                Website URL <span className="text-destructive">*</span>
              </FieldLabel>
              <Input
                {...field}
                id="url"
                placeholder="https://example.com"
                autoComplete="off"
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Controller
          name="rssUrl"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="rssUrl">RSS URL</FieldLabel>
              <Input
                {...field}
                id="rssUrl"
                placeholder="https://example.com/rss.xml"
                autoComplete="off"
              />
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
              <Input
                {...field}
                id="description"
                placeholder="Optional description"
                autoComplete="off"
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
                <FieldLabel className="text-base">Active Status</FieldLabel>
                <div className="text-sm text-muted-foreground">
                  Allow the system to crawl articles from this source.
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

      <Separator className="my-8" />

      <div className="flex gap-4">
        <Button disabled={form.formState.isSubmitting} type="submit">
          {form.formState.isSubmitting ? (
            <>
              <Spinner className="mr-2 size-4" /> {isEdit ? "Updating..." : "Creating..."}
            </>
          ) : (
            isEdit ? "Update Source" : "Create Source"
          )}
        </Button>
        <Button
          type="button"
          variant="ghost"
          onClick={() => router.push("/sources")}
        >
          Cancel
        </Button>
      </div>
    </form>
  )
}
