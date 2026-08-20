"use client"

import {
  Clock3,
  KeyRound,
  Plus,
  RefreshCw,
  TimerReset,
  Trash2,
} from "lucide-react"
import { useRouter } from "next/navigation"
import { useState, useTransition } from "react"
import { toast } from "sonner"

import {
  createAiProviderCredential,
  deleteAiProviderCredential,
  getAiProviderModelCatalog,
  updateAiProviderCredential,
} from "@/app/api/ai-provider-configs/action"
import {
  AiProviderConfigResponse,
  AiProviderCredentialResponse,
  AiProviderModelCatalogRequest,
  AiProviderModelOptionResponse,
} from "@/app/lib/ai-provider-configs/definitions"
import { useLocalization } from "@/app/lib/i18n/provider"
import { AppTimeMetadata } from "@/components/app-time-metadata"
import { useHasPermission } from "@/components/permission-provider"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Spinner } from "@/components/ui/spinner"

import {
  AiProviderCredentialModelActionButton,
  AiProviderCredentialModelSummary,
} from "./ai-provider-credential-model-control"
import { AiProviderModelPickerDialog } from "./ai-provider-model-picker-dialog"

interface AiProviderCredentialPanelProps {
  provider: AiProviderConfigResponse
}

const COMPACT_DATE_TIME_OPTIONS = {
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
} satisfies Intl.DateTimeFormatOptions

export function AiProviderCredentialPanel({
  provider,
}: AiProviderCredentialPanelProps) {
  const credentials = provider.credentials || []
  const canCreateCredential = useHasPermission("ai-provider-config:create")
  const canUpdateCredential = useHasPermission("ai-provider-config:update")
  const canDeleteCredential = useHasPermission("ai-provider-config:delete")
  const canFetchModelCatalog = useHasPermission(
    "ai-provider-config:model-catalog"
  )
  const { dictionary } = useLocalization()
  const t = dictionary.aiProviderConfigs

  return (
    <section className="w-full max-w-3xl overflow-hidden rounded-xl border bg-card shadow-sm">
      <header className="flex flex-col gap-2 px-6 pt-6">
        <h2 className="text-xl font-semibold tracking-tight text-card-foreground">
          {t.credentialsTitle}
        </h2>
        <p className="text-sm leading-6 text-muted-foreground">
          {t.credentialsDescription}
        </p>
      </header>

      <div className="flex flex-col gap-6 px-6 py-6">
        {credentials.length > 0 ? (
          <div className="flex flex-col gap-3">
            {credentials.map((credential) => (
              <CredentialItem
                key={credential.id}
                provider={provider}
                credential={credential}
                canUpdate={canUpdateCredential}
                canDelete={canDeleteCredential}
                canFetchModelCatalog={canFetchModelCatalog}
              />
            ))}
          </div>
        ) : (
          <Empty className="rounded-lg border border-dashed py-8">
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <KeyRound />
              </EmptyMedia>
              <EmptyTitle>{t.noCredentials}</EmptyTitle>
              <EmptyDescription>
                {t.credentialEmptyDescription}
              </EmptyDescription>
            </EmptyHeader>
          </Empty>
        )}

        {canCreateCredential ? (
          <CreateCredentialForm
            provider={provider}
            canFetchModelCatalog={canFetchModelCatalog}
          />
        ) : null}
      </div>
    </section>
  )
}

function CreateCredentialForm({
  provider,
  canFetchModelCatalog,
}: {
  provider: AiProviderConfigResponse
  canFetchModelCatalog: boolean
}) {
  const router = useRouter()
  const [apiKey, setApiKey] = useState("")
  const [model, setModel] = useState("")
  const [modelOptions, setModelOptions] = useState<
    AiProviderModelOptionResponse[]
  >([])
  const [isModelDialogOpen, setIsModelDialogOpen] = useState(false)
  const [isAuthenticating, startAuthenticating] = useTransition()
  const [isCreating, startCreating] = useTransition()
  const { dictionary } = useLocalization()
  const t = dictionary.aiProviderConfigs

  function handleApiKeyChange(value: string) {
    setApiKey(value)
    setModel("")
    setModelOptions([])
  }

  function handleAuthenticateAndSelectModel() {
    const trimmedApiKey = apiKey.trim()

    if (!trimmedApiKey) {
      toast.error(t.apiKeyRequiredForAuth)
      return
    }

    const request: AiProviderModelCatalogRequest = {
      providerType: provider.providerType,
      apiKey: trimmedApiKey,
      baseUrl: provider.baseUrl?.trim() || undefined,
    }

    startAuthenticating(async () => {
      const result = await getAiProviderModelCatalog(request)

      if (result.success) {
        setModelOptions(result.data.models)
        setIsModelDialogOpen(true)
        toast.success(t.authenticateSuccess)
        return
      }

      setModelOptions([])
      setIsModelDialogOpen(false)
      toast.error(result.error || t.authenticateError)
    })
  }

  function handleCreate() {
    const trimmedApiKey = apiKey.trim()
    const trimmedModel = model.trim()

    if (!trimmedApiKey || !trimmedModel) {
      toast.error(t.missingCredentialAndModel)
      return
    }

    startCreating(async () => {
      const result = await createAiProviderCredential(provider.id, {
        apiKey: trimmedApiKey,
        model: trimmedModel,
      })

      if (result.success) {
        toast.success(t.credentialCreateSuccess)
        setApiKey("")
        setModel("")
        setModelOptions([])
        router.refresh()
        return
      }

      toast.error(result.error)
    })
  }

  return (
    <>
      <div className="rounded-lg border bg-muted/20 p-4">
        <FieldGroup>
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div className="text-sm font-medium">{t.newCredentialTitle}</div>
            <AiProviderCredentialModelActionButton
              model={model}
              isPending={isAuthenticating}
              disabled={!canFetchModelCatalog || isAuthenticating || isCreating}
              onClick={handleAuthenticateAndSelectModel}
            />
          </div>

          <div className="grid gap-3 md:grid-cols-[minmax(0,1fr)_minmax(14rem,0.75fr)]">
            <Field>
              <FieldLabel htmlFor="newCredentialApiKey">
                {t.apiKeyNew} <span className="text-destructive">*</span>
              </FieldLabel>
              <Input
                id="newCredentialApiKey"
                type="password"
                value={apiKey}
                onChange={(event) => handleApiKeyChange(event.target.value)}
                placeholder={t.apiKeyNewPlaceholder}
                autoComplete="new-password"
              />
              <FieldDescription>{t.apiKeyDescription}</FieldDescription>
            </Field>

            <Field>
              <FieldLabel>
                {t.model} <span className="text-destructive">*</span>
              </FieldLabel>
              <AiProviderCredentialModelSummary model={model} />
            </Field>
          </div>

          <div>
            <Button
              type="button"
              onClick={handleCreate}
              disabled={isCreating || !apiKey.trim() || !model.trim()}
            >
              {isCreating ? (
                <Spinner data-icon="inline-start" />
              ) : (
                <Plus data-icon="inline-start" />
              )}
              {t.addCredential}
            </Button>
          </div>
        </FieldGroup>
      </div>

      <AiProviderModelPickerDialog
        currentModel={model}
        models={modelOptions}
        open={isModelDialogOpen}
        onOpenChange={setIsModelDialogOpen}
        onConfirm={(modelId) => {
          setModel(modelId)
          setIsModelDialogOpen(false)
          toast.success(t.modelSelected)
        }}
      />
    </>
  )
}

function CredentialItem({
  provider,
  credential,
  canUpdate,
  canDelete,
  canFetchModelCatalog,
}: {
  provider: AiProviderConfigResponse
  credential: AiProviderCredentialResponse
  canUpdate: boolean
  canDelete: boolean
  canFetchModelCatalog: boolean
}) {
  const router = useRouter()
  const [apiKey, setApiKey] = useState("")
  const [model, setModel] = useState("")
  const [modelOptions, setModelOptions] = useState<
    AiProviderModelOptionResponse[]
  >([])
  const [isModelDialogOpen, setIsModelDialogOpen] = useState(false)
  const [isAuthenticating, startAuthenticating] = useTransition()
  const [isUpdating, startUpdating] = useTransition()
  const { dictionary, formatDateTime, formatMessage } = useLocalization()
  const t = dictionary.aiProviderConfigs
  const formatCredentialTime = (value?: string) =>
    formatDateTime(value, COMPACT_DATE_TIME_OPTIONS, "")

  function handleApiKeyChange(value: string) {
    setApiKey(value)
    setModel("")
    setModelOptions([])
  }

  function handleAuthenticateAndSelectModel() {
    const trimmedApiKey = apiKey.trim()

    if (!trimmedApiKey) {
      toast.error(t.apiKeyNewRequiredForAuth)
      return
    }

    const request: AiProviderModelCatalogRequest = {
      providerType: provider.providerType,
      apiKey: trimmedApiKey,
      baseUrl: provider.baseUrl?.trim() || undefined,
    }

    startAuthenticating(async () => {
      const result = await getAiProviderModelCatalog(request)

      if (result.success) {
        setModelOptions(result.data.models)
        setIsModelDialogOpen(true)
        toast.success(t.authenticateSuccess)
        return
      }

      setModelOptions([])
      setIsModelDialogOpen(false)
      toast.error(result.error || t.authenticateError)
    })
  }

  function handleUpdate() {
    const trimmedApiKey = apiKey.trim()
    const trimmedModel = model.trim()

    if (!trimmedApiKey || !trimmedModel) {
      toast.error(t.missingNewCredentialAndModel)
      return
    }

    startUpdating(async () => {
      const result = await updateAiProviderCredential(
        provider.id,
        credential.id,
        {
          apiKey: trimmedApiKey,
          model: trimmedModel,
        }
      )

      if (result.success) {
        toast.success(t.credentialUpdateSuccess)
        setApiKey("")
        setModel("")
        setModelOptions([])
        router.refresh()
        return
      }

      toast.error(result.error)
    })
  }

  return (
    <>
      <div className="flex flex-col gap-4 rounded-lg border p-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex min-w-0 flex-col gap-2">
            <div className="flex min-w-0 flex-wrap items-center gap-2">
              <span className="min-w-0 font-medium break-all text-foreground">
                {credential.model || t.noModel}
              </span>
              {credential.keyPreview ? (
                <Badge variant="secondary">{credential.keyPreview}</Badge>
              ) : null}
            </div>
            <div className="flex flex-wrap gap-x-4 gap-y-1">
              {formatCredentialTime(credential.lastUsedDate) ? (
                <AppTimeMetadata icon={Clock3}>
                  {formatMessage(t.lastUsed, {
                    time: formatCredentialTime(credential.lastUsedDate),
                  })}
                </AppTimeMetadata>
              ) : null}
              {formatCredentialTime(credential.rateLimitedUntil) ? (
                <AppTimeMetadata icon={TimerReset}>
                  {formatMessage(t.rateLimitedUntil, {
                    time: formatCredentialTime(credential.rateLimitedUntil),
                  })}
                </AppTimeMetadata>
              ) : null}
              {formatCredentialTime(credential.createdDate) ? (
                <AppTimeMetadata icon={Clock3}>
                  {formatMessage(t.createdAt, {
                    time: formatCredentialTime(credential.createdDate),
                  })}
                </AppTimeMetadata>
              ) : null}
              {formatCredentialTime(credential.lastModifiedDate) ? (
                <AppTimeMetadata icon={RefreshCw}>
                  {formatMessage(t.updatedAt, {
                    time: formatCredentialTime(credential.lastModifiedDate),
                  })}
                </AppTimeMetadata>
              ) : null}
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2 sm:justify-end">
            {canUpdate ? (
              <AiProviderCredentialModelActionButton
                model={model}
                isPending={isAuthenticating}
                disabled={
                  !canFetchModelCatalog || isAuthenticating || isUpdating
                }
                onClick={handleAuthenticateAndSelectModel}
              />
            ) : null}
            {canDelete ? (
              <DeleteCredentialButton
                providerId={provider.id}
                credential={credential}
              />
            ) : null}
          </div>
        </div>

        {canUpdate ? (
          <FieldGroup>
            <div className="grid gap-3 md:grid-cols-[minmax(0,1fr)_minmax(14rem,0.75fr)]">
              <Field>
                <FieldLabel htmlFor={`credential-${credential.id}-api-key`}>
                  {t.apiKeyNew}
                </FieldLabel>
                <Input
                  id={`credential-${credential.id}-api-key`}
                  type="password"
                  value={apiKey}
                  onChange={(event) => handleApiKeyChange(event.target.value)}
                  placeholder={t.apiKeyUpdatePlaceholder}
                  autoComplete="new-password"
                />
              </Field>
              <Field>
                <FieldLabel>
                  {t.model} <span className="text-destructive">*</span>
                </FieldLabel>
                <AiProviderCredentialModelSummary model={model} />
              </Field>
            </div>
            <Button
              type="button"
              variant="outline"
              onClick={handleUpdate}
              disabled={isUpdating || !apiKey.trim() || !model.trim()}
            >
              {isUpdating ? (
                <Spinner data-icon="inline-start" />
              ) : (
                <RefreshCw data-icon="inline-start" />
              )}
              {t.update}
            </Button>
          </FieldGroup>
        ) : null}
      </div>

      <AiProviderModelPickerDialog
        currentModel={model}
        models={modelOptions}
        open={isModelDialogOpen}
        onOpenChange={setIsModelDialogOpen}
        onConfirm={(modelId) => {
          setModel(modelId)
          setIsModelDialogOpen(false)
          toast.success(t.modelSelected)
        }}
      />
    </>
  )
}

function DeleteCredentialButton({
  providerId,
  credential,
}: {
  providerId: number
  credential: AiProviderCredentialResponse
}) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [isPending, startTransition] = useTransition()
  const { dictionary, formatMessage } = useLocalization()
  const t = dictionary.aiProviderConfigs
  const credentialName =
    credential.model || credential.keyPreview || `#${credential.id}`

  function handleDelete() {
    startTransition(async () => {
      const result = await deleteAiProviderCredential(providerId, credential.id)

      if (result.success) {
        toast.success(t.credentialDeleteSuccess)
        setOpen(false)
        router.refresh()
        return
      }

      toast.error(result.error)
    })
  }

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger
        render={
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-destructive hover:bg-destructive/10 hover:text-destructive"
          />
        }
      >
        <Trash2 />
        <span className="sr-only">{t.credentialDelete}</span>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{t.credentialDeleteTitle}</AlertDialogTitle>
          <AlertDialogDescription>
            {formatMessage(t.credentialDeleteDescription, {
              credential: credentialName,
            })}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending}>
            {dictionary.common.cancel}
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={(event) => {
              event.preventDefault()
              handleDelete()
            }}
            disabled={isPending}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {isPending ? (
              <>
                <Spinner data-icon="inline-start" />
                {t.deleteConfigPending}
              </>
            ) : (
              t.credentialDelete
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
