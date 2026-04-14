"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { Controller, useForm } from "react-hook-form"
import { toast } from "sonner"
import * as z from "zod"

import { createTopic, updateTopic } from "@/app/api/topics/action"
import { TopicCreateRequest, TopicResponse, TopicUpdateRequest } from "@/app/lib/topics/definitions"
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
import { Spinner } from "@/components/ui/spinner"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"

const topicSchema = z.object({
  name: z.string().min(1, "Name is required").max(255, "Name is too long"),
  slug: z
    .string()
    .min(1, "Slug is required")
    .max(255, "Slug is too long")
    .regex(
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      "Slug can only contain lowercase letters, numbers, and hyphens"
    ),
  description: z.string().max(1000, "Description is too long").optional().or(z.literal("")),
  includeKeywordsText: z.string(),
  excludeKeywordsText: z.string(),
  entitiesText: z.string(),
  active: z.boolean().default(true),
})

type TopicFormValues = z.infer<typeof topicSchema>

interface TopicFormProps {
  initialData?: TopicResponse
}

function slugify(value: string): string {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\u0111/g, "d")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-{2,}/g, "-")
}

function parseStringList(value: string): string[] {
  return Array.from(
    new Set(
      value
        .split(/[\r\n,]+/)
        .map((item) => item.trim())
        .filter(Boolean)
    )
  )
}

function stringifyStringList(items?: string[]): string {
  return items?.join("\n") ?? ""
}

export function TopicForm({ initialData }: TopicFormProps) {
  const router = useRouter()
  const isEdit = !!initialData
  const [isSlugManuallyEdited, setIsSlugManuallyEdited] = useState(isEdit)

  const form = useForm<TopicFormValues>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(topicSchema as any),
    defaultValues: {
      name: initialData?.name ?? "",
      slug: initialData?.slug ?? "",
      description: initialData?.description ?? "",
      includeKeywordsText: stringifyStringList(initialData?.includeKeywords),
      excludeKeywordsText: stringifyStringList(initialData?.excludeKeywords),
      entitiesText: stringifyStringList(initialData?.entities),
      active: initialData?.active ?? true,
    },
  })

  const nameValue = form.watch("name")

  useEffect(() => {
    if (!nameValue || isSlugManuallyEdited) {
      return
    }

    form.setValue("slug", slugify(nameValue), {
      shouldDirty: true,
      shouldTouch: true,
      shouldValidate: true,
    })
  }, [form, isSlugManuallyEdited, nameValue])

  async function onSubmit(values: TopicFormValues) {
    const request = {
      name: values.name,
      slug: values.slug,
      description: values.description || "",
      includeKeywords: parseStringList(values.includeKeywordsText),
      excludeKeywords: parseStringList(values.excludeKeywordsText),
      entities: parseStringList(values.entitiesText),
      active: values.active,
    }

    const result = isEdit
      ? await updateTopic(initialData.id, request satisfies TopicUpdateRequest)
      : await createTopic(request satisfies TopicCreateRequest)

    if (result.success) {
      toast.success(isEdit ? "Topic updated successfully" : "Topic created successfully")
      router.push("/topics")
      router.refresh()
      return
    }

    toast.error(result.error)
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
                Topic Name <span className="text-destructive">*</span>
              </FieldLabel>
              <Input
                {...field}
                id="name"
                placeholder="e.g. Artificial Intelligence"
                autoComplete="off"
              />
              {fieldState.invalid ? <FieldError errors={[fieldState.error]} /> : null}
            </Field>
          )}
        />

        <Controller
          name="slug"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="slug">
                Slug <span className="text-destructive">*</span>
              </FieldLabel>
              <Input
                {...field}
                id="slug"
                placeholder="artificial-intelligence"
                autoComplete="off"
                onChange={(event) => {
                  setIsSlugManuallyEdited(true)
                  field.onChange(event)
                }}
              />
              <FieldDescription>
                Slug is auto-generated from the topic name until you edit it manually.
              </FieldDescription>
              {fieldState.invalid ? <FieldError errors={[fieldState.error]} /> : null}
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
                rows={4}
                placeholder="Optional description for this topic"
              />
              {fieldState.invalid ? <FieldError errors={[fieldState.error]} /> : null}
            </Field>
          )}
        />

        <Controller
          name="includeKeywordsText"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="includeKeywordsText">Include Keywords</FieldLabel>
              <Textarea
                {...field}
                id="includeKeywordsText"
                rows={4}
                placeholder={"ai\nmachine learning\ndata"}
              />
              <FieldDescription>Separate items with commas or line breaks.</FieldDescription>
              {fieldState.invalid ? <FieldError errors={[fieldState.error]} /> : null}
            </Field>
          )}
        />

        <Controller
          name="excludeKeywordsText"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="excludeKeywordsText">Exclude Keywords</FieldLabel>
              <Textarea
                {...field}
                id="excludeKeywordsText"
                rows={4}
                placeholder={"sports\nentertainment"}
              />
              <FieldDescription>Separate items with commas or line breaks.</FieldDescription>
              {fieldState.invalid ? <FieldError errors={[fieldState.error]} /> : null}
            </Field>
          )}
        />

        <Controller
          name="entitiesText"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="entitiesText">Entities</FieldLabel>
              <Textarea
                {...field}
                id="entitiesText"
                rows={4}
                placeholder={"OpenAI\nAnthropic\nGoogle"}
              />
              <FieldDescription>Separate items with commas or line breaks.</FieldDescription>
              {fieldState.invalid ? <FieldError errors={[fieldState.error]} /> : null}
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
                  Allow this topic to participate in filtering and automation flows.
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
              <Spinner className="mr-2 size-4" /> {isEdit ? "Updating..." : "Creating..."}
            </>
          ) : isEdit ? (
            "Update Topic"
          ) : (
            "Create Topic"
          )}
        </Button>
        <Button type="button" variant="ghost" onClick={() => router.push("/topics")}>
          Cancel
        </Button>
      </div>
    </form>
  )
}
