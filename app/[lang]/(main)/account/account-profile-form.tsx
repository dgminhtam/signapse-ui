"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { CreditCard, Save, Trash2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { useEffect, useRef, useState } from "react"
import type { ChangeEvent } from "react"
import { Controller, useForm } from "react-hook-form"
import { toast } from "sonner"
import * as z from "zod"

import { updateMyProfile } from "@/app/api/user/action"
import type { Dictionary } from "@/app/lib/i18n/dictionary-types"
import { useLocalization } from "@/app/lib/i18n/provider"
import { LocalizedLink } from "@/components/localized-link"
import {
  AppFormShell,
  AppFormShellBody,
  AppFormShellFooter,
} from "@/components/app-form-shell"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldTitle,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Spinner } from "@/components/ui/spinner"

export interface AccountProfileInitialData {
  avatarUrl: string
  avatarFallback: string
  fullName: string
  dateOfBirth: string
  email: string
  phoneNumber: string
  roleName: string
}

interface AccountProfileFormProps {
  initialData: AccountProfileInitialData
  upgradeHref: string
}

function getAccountProfileSchema(t: Dictionary["accountProfile"]) {
  return z.object({
    fullName: z.string().trim().min(1, t.fullNameRequired),
    dateOfBirth: z
      .string()
      .trim()
      .min(1, t.dateOfBirthRequired)
      .regex(/^\d{4}-\d{2}-\d{2}$/, t.dateOfBirthInvalid),
    email: z
      .string()
      .trim()
      .min(1, t.emailRequired)
      .regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, t.emailInvalid),
    phoneNumber: z.string().trim().min(1, t.phoneNumberRequired),
  })
}

type AccountProfileFormValues = z.infer<
  ReturnType<typeof getAccountProfileSchema>
>

export function AccountProfileForm({
  initialData,
  upgradeHref,
}: AccountProfileFormProps) {
  const router = useRouter()
  const { dictionary } = useLocalization()
  const t = dictionary.accountProfile
  const avatarInputRef = useRef<HTMLInputElement>(null)
  const [avatarUrl, setAvatarUrl] = useState(initialData.avatarUrl)
  const [objectAvatarUrl, setObjectAvatarUrl] = useState<string | null>(null)
  const defaultValues: AccountProfileFormValues = {
    fullName: initialData.fullName,
    dateOfBirth: initialData.dateOfBirth,
    email: initialData.email,
    phoneNumber: initialData.phoneNumber,
  }
  const form = useForm<AccountProfileFormValues>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(getAccountProfileSchema(t) as any),
    defaultValues,
  })
  const isSubmitting = form.formState.isSubmitting

  useEffect(() => {
    return () => {
      if (objectAvatarUrl) {
        URL.revokeObjectURL(objectAvatarUrl)
      }
    }
  }, [objectAvatarUrl])

  function handleAvatarChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]

    if (!file) {
      return
    }

    if (objectAvatarUrl) {
      URL.revokeObjectURL(objectAvatarUrl)
    }

    const nextUrl = URL.createObjectURL(file)
    setObjectAvatarUrl(nextUrl)
    setAvatarUrl(nextUrl)
  }

  function handleDeleteAvatar() {
    if (objectAvatarUrl) {
      URL.revokeObjectURL(objectAvatarUrl)
      setObjectAvatarUrl(null)
    }

    setAvatarUrl("")

    if (avatarInputRef.current) {
      avatarInputRef.current.value = ""
    }
  }

  async function onSubmit(values: AccountProfileFormValues) {
    const result = await updateMyProfile({
      fullName: values.fullName.trim(),
      dateOfBirth: values.dateOfBirth.trim(),
      phoneNumber: values.phoneNumber.trim(),
    })

    if (result.success) {
      toast.success(t.updateSuccess)
      router.refresh()
      return
    }

    toast.error(result.error || t.updateError)
  }

  function handleCancel() {
    form.reset(defaultValues)
    setAvatarUrl(initialData.avatarUrl)

    if (avatarInputRef.current) {
      avatarInputRef.current.value = ""
    }
  }

  return (
    <AppFormShell
      title={t.formTitle}
      description={t.formDescription}
      width="lg"
    >
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <AppFormShellBody>
          <FieldGroup>
            <Field className="items-center [&>[data-slot=avatar-upload-control]]:w-auto">
              <input
                ref={avatarInputRef}
                type="file"
                accept="image/*"
                className="sr-only"
                onChange={handleAvatarChange}
                aria-label={t.uploadAvatar}
              />
              <div
                data-slot="avatar-upload-control"
                className="group/avatar-upload relative w-fit"
              >
                <button
                  type="button"
                  className="rounded-full outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
                  onClick={() => avatarInputRef.current?.click()}
                  aria-label={t.uploadAvatar}
                >
                  <Avatar className="size-20">
                    <AvatarImage src={avatarUrl} alt={initialData.fullName} />
                    <AvatarFallback>{initialData.avatarFallback}</AvatarFallback>
                  </Avatar>
                </button>
                {avatarUrl ? (
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon-sm"
                    className="absolute right-0 bottom-0 opacity-0 transition-opacity group-hover/avatar-upload:opacity-100 focus-visible:opacity-100"
                    onClick={handleDeleteAvatar}
                    aria-label={t.deleteAvatar}
                  >
                    <Trash2 />
                  </Button>
                ) : null}
              </div>
            </Field>

            <Controller
              name="fullName"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="account-full-name">
                    {t.fullName} <span className="text-destructive">*</span>
                  </FieldLabel>
                  <Input
                    {...field}
                    id="account-full-name"
                    aria-invalid={fieldState.invalid}
                    placeholder={t.fullNamePlaceholder}
                    disabled={isSubmitting}
                  />
                  {fieldState.invalid ? (
                    <FieldError errors={[fieldState.error]} />
                  ) : null}
                </Field>
              )}
            />

            <Controller
              name="dateOfBirth"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="account-date-of-birth">
                    {t.dateOfBirth} <span className="text-destructive">*</span>
                  </FieldLabel>
                  <Input
                    {...field}
                    id="account-date-of-birth"
                    type="date"
                    aria-invalid={fieldState.invalid}
                    disabled={isSubmitting}
                  />
                  {fieldState.invalid ? (
                    <FieldError errors={[fieldState.error]} />
                  ) : null}
                </Field>
              )}
            />

            <Controller
              name="email"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="account-email">
                    {t.email} <span className="text-destructive">*</span>
                  </FieldLabel>
                  <Input
                    {...field}
                    id="account-email"
                    type="email"
                    disabled
                    aria-invalid={fieldState.invalid}
                  />
                  <FieldDescription>{t.emailReadOnlyDescription}</FieldDescription>
                  {fieldState.invalid ? (
                    <FieldError errors={[fieldState.error]} />
                  ) : null}
                </Field>
              )}
            />

            <Controller
              name="phoneNumber"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="account-phone-number">
                    {t.phoneNumber} <span className="text-destructive">*</span>
                  </FieldLabel>
                  <Input
                    {...field}
                    id="account-phone-number"
                    type="tel"
                    aria-invalid={fieldState.invalid}
                    placeholder={t.phoneNumberPlaceholder}
                    disabled={isSubmitting}
                  />
                  {fieldState.invalid ? (
                    <FieldError errors={[fieldState.error]} />
                  ) : null}
                </Field>
              )}
            />

            <Field>
              <FieldTitle>{t.accountRoles}</FieldTitle>
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex flex-wrap gap-2">
                  <Badge variant="secondary">
                    {initialData.roleName || t.noRoles}
                  </Badge>
                </div>
                <Button variant="outline" asChild>
                  <LocalizedLink href={upgradeHref}>
                    <CreditCard data-icon="inline-start" />
                    {t.upgradeAccount}
                  </LocalizedLink>
                </Button>
              </div>
            </Field>
          </FieldGroup>
        </AppFormShellBody>

        <AppFormShellFooter>
          <Button
            type="button"
            variant="ghost"
            onClick={handleCancel}
            disabled={isSubmitting}
          >
            {dictionary.common.cancel}
          </Button>
          <Button disabled={isSubmitting} type="submit">
            {isSubmitting ? (
              <>
                <Spinner data-icon="inline-start" />
                {t.updatePending}
              </>
            ) : (
              <>
                <Save data-icon="inline-start" />
                {t.saveChanges}
              </>
            )}
          </Button>
        </AppFormShellFooter>
      </form>
    </AppFormShell>
  )
}
