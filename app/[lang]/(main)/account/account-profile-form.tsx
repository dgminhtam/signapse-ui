"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { RotateCcw, Save } from "lucide-react"
import { useRouter } from "next/navigation"
import { useEffect, useMemo } from "react"
import { Controller, useForm } from "react-hook-form"
import { toast } from "sonner"
import * as z from "zod"

import { updateMyProfile } from "@/app/api/user/action"
import type { Dictionary } from "@/app/lib/i18n/dictionary-types"
import { useLocalization } from "@/app/lib/i18n/provider"
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
  firstName: string
  lastName: string
  dateOfBirth: string
  email: string
  phoneNumber: string
  roleName: string
}

interface AccountProfileFormProps {
  initialData: AccountProfileInitialData
}

function getAccountProfileSchema(t: Dictionary["accountProfile"]) {
  return z.object({
    firstName: z.string().trim().min(1, t.firstNameRequired),
    lastName: z.string().trim().min(1, t.lastNameRequired),
    dateOfBirth: z
      .string()
      .trim()
      .min(1, t.dateOfBirthRequired)
      .regex(/^\d{4}-\d{2}-\d{2}$/, t.dateOfBirthInvalid),
    email: z.string().trim(),
    phoneNumber: z.string().trim().min(1, t.phoneNumberRequired),
  })
}

type AccountProfileFormValues = z.infer<
  ReturnType<typeof getAccountProfileSchema>
>

export function AccountProfileForm({ initialData }: AccountProfileFormProps) {
  const router = useRouter()
  const { dictionary } = useLocalization()
  const t = dictionary.accountProfile
  const defaultValues: AccountProfileFormValues = useMemo(
    () => ({
      firstName: initialData.firstName,
      lastName: initialData.lastName,
      dateOfBirth: initialData.dateOfBirth,
      email: initialData.email,
      phoneNumber: initialData.phoneNumber,
    }),
    [
      initialData.dateOfBirth,
      initialData.email,
      initialData.firstName,
      initialData.lastName,
      initialData.phoneNumber,
    ]
  )
  const form = useForm<AccountProfileFormValues>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(getAccountProfileSchema(t) as any),
    defaultValues,
    mode: "onChange",
    reValidateMode: "onChange",
    shouldFocusError: true,
  })
  const { isDirty, isSubmitting, isValid } = form.formState

  useEffect(() => {
    form.reset(defaultValues)
  }, [defaultValues, form])

  const displayName =
    [initialData.lastName, initialData.firstName]
      .filter(Boolean)
      .join(" ")
      .trim() ||
    initialData.email ||
    t.avatarLabel
  const roleName = initialData.roleName.trim() || t.noRole
  const avatarAlt = displayName || t.avatarLabel

  async function onSubmit(values: AccountProfileFormValues) {
    if (isSubmitting) {
      return
    }

    const normalizedValues: AccountProfileFormValues = {
      firstName: values.firstName.trim(),
      lastName: values.lastName.trim(),
      dateOfBirth: values.dateOfBirth.trim(),
      email: values.email.trim(),
      phoneNumber: values.phoneNumber.trim(),
    }

    try {
      const result = await updateMyProfile({
        firstName: normalizedValues.firstName,
        lastName: normalizedValues.lastName,
        birthday: normalizedValues.dateOfBirth,
        phone: normalizedValues.phoneNumber,
      })

      if (!result.success) {
        toast.error(t.updateError)
        return
      }

      form.reset(normalizedValues)
      toast.success(t.updateSuccess)
      router.refresh()
    } catch {
      toast.error(t.updateError)
    }
  }

  function handleRestore() {
    form.reset(defaultValues)
  }

  return (
    <AppFormShell
      description={t.formDescription}
      surface="plain"
      title={t.formTitle}
      width="lg"
    >
      <form noValidate onSubmit={form.handleSubmit(onSubmit)}>
        <AppFormShellBody surface="plain">
          <FieldGroup>
            <div className="flex min-w-0 flex-wrap items-center gap-4">
              <Avatar
                aria-label={avatarAlt}
                className="size-20 shrink-0"
                role="img"
              >
                <AvatarImage
                  aria-hidden="true"
                  alt=""
                  src={initialData.avatarUrl || undefined}
                />
                <AvatarFallback>{initialData.avatarFallback}</AvatarFallback>
              </Avatar>
              <div className="min-w-0">
                <p className="text-sm font-medium">{t.avatarLabel}</p>
                <p className="text-sm leading-6 text-muted-foreground">
                  {t.avatarDescription}
                </p>
              </div>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <Controller
                name="lastName"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="account-last-name">
                      {t.lastName}{" "}
                      <span aria-hidden="true" className="text-destructive">
                        *
                      </span>
                    </FieldLabel>
                    <Input
                      {...field}
                      id="account-last-name"
                      aria-describedby={
                        fieldState.invalid
                          ? "account-last-name-error"
                          : undefined
                      }
                      aria-invalid={fieldState.invalid}
                      autoComplete="family-name"
                      disabled={isSubmitting}
                      required
                    />
                    {fieldState.invalid ? (
                      <FieldError
                        id="account-last-name-error"
                        errors={[fieldState.error]}
                      />
                    ) : null}
                  </Field>
                )}
              />

              <Controller
                name="firstName"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="account-first-name">
                      {t.firstName}{" "}
                      <span aria-hidden="true" className="text-destructive">
                        *
                      </span>
                    </FieldLabel>
                    <Input
                      {...field}
                      id="account-first-name"
                      aria-describedby={
                        fieldState.invalid
                          ? "account-first-name-error"
                          : undefined
                      }
                      aria-invalid={fieldState.invalid}
                      autoComplete="given-name"
                      disabled={isSubmitting}
                      required
                    />
                    {fieldState.invalid ? (
                      <FieldError
                        id="account-first-name-error"
                        errors={[fieldState.error]}
                      />
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
                      {t.dateOfBirth}{" "}
                      <span aria-hidden="true" className="text-destructive">
                        *
                      </span>
                    </FieldLabel>
                    <Input
                      {...field}
                      id="account-date-of-birth"
                      aria-describedby={
                        fieldState.invalid
                          ? "account-date-of-birth-error"
                          : undefined
                      }
                      aria-invalid={fieldState.invalid}
                      autoComplete="bday"
                      disabled={isSubmitting}
                      required
                      type="date"
                    />
                    {fieldState.invalid ? (
                      <FieldError
                        id="account-date-of-birth-error"
                        errors={[fieldState.error]}
                      />
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
                      {t.phoneNumber}{" "}
                      <span aria-hidden="true" className="text-destructive">
                        *
                      </span>
                    </FieldLabel>
                    <Input
                      {...field}
                      id="account-phone-number"
                      aria-describedby={
                        fieldState.invalid
                          ? "account-phone-number-error"
                          : undefined
                      }
                      aria-invalid={fieldState.invalid}
                      autoComplete="tel"
                      disabled={isSubmitting}
                      required
                      type="tel"
                    />
                    {fieldState.invalid ? (
                      <FieldError
                        id="account-phone-number-error"
                        errors={[fieldState.error]}
                      />
                    ) : null}
                  </Field>
                )}
              />

              <Controller
                name="email"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field
                    className="sm:col-span-2"
                    data-invalid={fieldState.invalid}
                  >
                    <FieldLabel htmlFor="account-email">{t.email}</FieldLabel>
                    <Input
                      {...field}
                      id="account-email"
                      aria-describedby="account-email-description"
                      aria-invalid={fieldState.invalid}
                      aria-readonly="true"
                      autoComplete="email"
                      readOnly
                      type="email"
                    />
                    <FieldDescription id="account-email-description">
                      {t.emailReadOnlyDescription}
                    </FieldDescription>
                  </Field>
                )}
              />

              <Field className="sm:col-span-2">
                <FieldTitle>{t.roleLabel}</FieldTitle>
                <div
                  aria-describedby="account-role-description"
                  className="flex min-h-9 items-center"
                  id="account-role"
                >
                  <Badge variant="secondary">{roleName}</Badge>
                </div>
                <FieldDescription id="account-role-description">
                  {t.roleReadOnlyDescription}
                </FieldDescription>
              </Field>
            </div>
          </FieldGroup>
        </AppFormShellBody>

        <AppFormShellFooter surface="plain">
          <Button
            disabled={!isDirty || isSubmitting}
            onClick={handleRestore}
            type="button"
            variant="ghost"
          >
            <RotateCcw data-icon="inline-start" />
            {t.restore}
          </Button>
          <Button
            aria-busy={isSubmitting}
            disabled={!isDirty || !isValid || isSubmitting}
            type="submit"
          >
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
