"use client"

import * as React from "react"
import { z } from "zod"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import {
  ArrowLeft,
  CalendarClock,
  CheckCircle2,
  CircleX,
  ExternalLink,
  FileText,
  Image as ImageIcon,
  Info,
  ShieldAlert,
  Trash2,
  UserRound,
  X,
} from "lucide-react"

import {
  FEEDBACK_DELETE_PERMISSION,
  FEEDBACK_READ_PERMISSION,
  FEEDBACK_REVIEW_PERMISSION,
} from "@/app/lib/feedback/permissions"
import { useFeedbackFixture } from "@/app/lib/feedback/fixture-provider"
import type { FeedbackRecord } from "@/app/lib/feedback/definitions"
import { useLocalization } from "@/app/lib/i18n/provider"
import { useHasPermission } from "@/components/permission-provider"
import { AccessDenied } from "@/components/access-denied"
import { LocalizedLink as Link } from "@/components/localized-link"
import { buttonVariants, Button } from "@/components/ui/button"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Field, FieldError, FieldLabel } from "@/components/ui/field"
import { Spinner } from "@/components/ui/spinner"
import { Textarea } from "@/components/ui/textarea"

import {
  FeedbackScreenshotView,
  FeedbackStatusBadge,
  FeedbackTypeBadge,
} from "./feedback-presentation"

interface FeedbackDetailPageProps {
  id: string
  moderation?: boolean
  backHref?: string
}

export function FeedbackDetailPage({
  id,
  moderation = false,
  backHref: providedBackHref,
}: FeedbackDetailPageProps) {
  const { dictionary, formatDateTime } = useLocalization()
  const t = dictionary.feedback
  const router = useRouter()
  const {
    getRecord,
    withdrawSubmission,
    promoteSubmission,
    dismissSubmission,
    eraseSubmission,
    getMutationMode,
    hasFeedbackPermission,
  } = useFeedbackFixture()
  const canRead = hasFeedbackPermission(FEEDBACK_READ_PERMISSION)
  const record = getRecord(id)
  const canReview =
    useHasPermission(FEEDBACK_REVIEW_PERMISSION) &&
    hasFeedbackPermission(FEEDBACK_REVIEW_PERMISSION)
  const canDelete =
    useHasPermission(FEEDBACK_DELETE_PERMISSION) &&
    hasFeedbackPermission(FEEDBACK_DELETE_PERMISSION)
  const [reviewKind, setReviewKind] = React.useState<
    "promote" | "dismiss" | null
  >(null)
  const [withdrawOpen, setWithdrawOpen] = React.useState(false)
  const [eraseOpen, setEraseOpen] = React.useState(false)
  const [isWithdrawing, setIsWithdrawing] = React.useState(false)
  const [isErasing, setIsErasing] = React.useState(false)
  const [withdrawError, setWithdrawError] = React.useState<string | null>(null)
  const [eraseError, setEraseError] = React.useState<string | null>(null)

  if (moderation && !canRead) {
    return (
      <AccessDenied
        description={t.readDenied}
        permission={FEEDBACK_READ_PERMISSION}
      />
    )
  }

  if (!record) {
    return (
      <div className="flex min-h-[360px] items-center justify-center">
        <div className="flex max-w-md flex-col items-center gap-3 text-center">
          <div className="flex size-12 items-center justify-center rounded-full bg-muted">
            <FileText className="size-6 text-muted-foreground" />
          </div>
          <h1 className="text-xl font-semibold">{t.missingTitle}</h1>
          <p className="text-sm text-muted-foreground">
            {t.missingDescription}
          </p>
          <Link
            href={moderation ? "/feedback-submissions" : "/feedback"}
            className={buttonVariants({ variant: "outline" })}
          >
            <ArrowLeft data-icon="inline-start" />
            {moderation ? t.moderationBack : t.backToHistory}
          </Link>
        </div>
      </div>
    )
  }

  const backHref =
    providedBackHref ?? (moderation ? "/feedback-submissions" : "/feedback")

  async function handleWithdraw() {
    if (!record || isWithdrawing) {
      return
    }
    setWithdrawError(null)
    setIsWithdrawing(true)
    const result = await withdrawSubmission(record.id)
    setIsWithdrawing(false)
    if (!result.success) {
      setWithdrawError(t.withdrawError)
      return
    }
    setWithdrawOpen(false)
    toast.success(t.withdrawSuccess)
    router.push(backHref)
  }

  async function handleErase() {
    if (!record || isErasing) {
      return
    }
    setEraseError(null)
    setIsErasing(true)
    const result = await eraseSubmission(record.id)
    setIsErasing(false)
    if (!result.success) {
      setEraseError(t.eraseError)
      return
    }
    setEraseOpen(false)
    toast.success(t.eraseSuccess)
    router.push(backHref)
  }

  const showWithdraw = !moderation && record.capabilities.canWithdraw
  const showPromote = moderation && canReview && record.capabilities.canPromote
  const showDismiss = moderation && canReview && record.capabilities.canDismiss
  const showErase = moderation && canDelete && record.capabilities.canErase

  return (
    <div className="flex min-w-0 flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Link
          href={backHref}
          className={buttonVariants({ variant: "outline", size: "sm" })}
        >
          <ArrowLeft data-icon="inline-start" />
          {moderation ? t.moderationBack : t.backToHistory}
        </Link>
        <span className="text-xs text-muted-foreground">
          {t.moderationFixtureNote}
        </span>
      </div>

      <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <FeedbackTypeBadge type={record.type} />
            <FeedbackStatusBadge status={record.status} />
          </div>
          <h1 className="mt-3 max-w-5xl text-2xl leading-tight font-semibold tracking-tight break-words">
            {record.title}
          </h1>
          <p className="mt-2 max-w-3xl text-sm text-muted-foreground">
            {t.statusDescriptions[record.status]}
          </p>
        </div>
        {showWithdraw || showPromote || showDismiss || showErase ? (
          <div
            className="flex shrink-0 flex-wrap items-center gap-2 xl:max-w-sm xl:justify-end"
            aria-label={t.accessibilityActions}
          >
            {showWithdraw ? (
              <Button
                type="button"
                variant="destructive"
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                onClick={() => setWithdrawOpen(true)}
              >
                <CircleX data-icon="inline-start" />
                {t.withdrawAction}
              </Button>
            ) : null}
            {showPromote ? (
              <Button type="button" onClick={() => setReviewKind("promote")}>
                <CheckCircle2 data-icon="inline-start" />
                {t.promoteAction}
              </Button>
            ) : null}
            {showDismiss ? (
              <Button
                type="button"
                variant="outline"
                onClick={() => setReviewKind("dismiss")}
              >
                <CircleX data-icon="inline-start" />
                {t.dismissAction}
              </Button>
            ) : null}
            {showErase ? (
              <Button
                type="button"
                variant="destructive"
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                onClick={() => setEraseOpen(true)}
              >
                <Trash2 data-icon="inline-start" />
                {t.eraseAction}
              </Button>
            ) : null}
          </div>
        ) : null}
      </div>

      <div className="grid min-w-0 gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(18rem,24rem)]">
        <main className="flex min-w-0 flex-col gap-6">
          <section className="min-w-0 rounded-xl border bg-card p-5">
            <h2 className="text-base font-semibold">{t.detailContent}</h2>
            <div className="mt-5 flex min-w-0 flex-col gap-5">
              <DetailText
                label={t.detailDescription}
                value={record.description}
              />
              <DetailText
                label={t.detailExpectedOutcome}
                value={record.expectedOutcome}
              />
              {record.reproductionSteps ? (
                <DetailText
                  label={t.detailReproductionSteps}
                  value={record.reproductionSteps}
                />
              ) : null}
            </div>
          </section>

          <section className="min-w-0 rounded-xl border bg-card p-5">
            <div className="flex items-center gap-2">
              <ImageIcon
                className="size-4 text-muted-foreground"
                aria-hidden="true"
              />
              <h2 className="text-base font-semibold">{t.detailScreenshot}</h2>
            </div>
            <div className="mt-4" aria-label={t.accessibilityScreenshot}>
              <FeedbackScreenshotView screenshot={record.screenshot} />
            </div>
          </section>

          <section className="min-w-0 rounded-xl border bg-card p-5">
            <div className="flex items-center gap-2">
              <Info
                className="size-4 text-muted-foreground"
                aria-hidden="true"
              />
              <h2 className="text-base font-semibold">
                {t.detailTechnicalContext}
              </h2>
            </div>
            {record.clientContext ? (
              <dl className="mt-4 grid min-w-0 gap-4 sm:grid-cols-2">
                <MetaValue
                  label={t.technicalContextFields.pagePath}
                  value={record.clientContext.pagePath}
                />
                <MetaValue
                  label={t.technicalContextFields.appVersion}
                  value={record.clientContext.appVersion}
                />
                <MetaValue
                  label={t.technicalContextFields.browser}
                  value={record.clientContext.browser}
                />
                <MetaValue
                  label={t.technicalContextFields.operatingSystem}
                  value={record.clientContext.operatingSystem}
                />
                <MetaValue
                  label={t.technicalContextFields.locale}
                  value={record.clientContext.locale}
                />
                <MetaValue
                  label={t.technicalContextFields.observedAt}
                  value={record.clientContext.observedAt}
                />
              </dl>
            ) : (
              <p className="mt-4 text-sm text-muted-foreground">
                {t.noTechnicalContext}
              </p>
            )}
          </section>

          {record.reviewMessage ? (
            <section className="min-w-0 rounded-xl border border-primary/30 bg-primary/5 p-5">
              <div className="flex items-center gap-2">
                <CheckCircle2
                  className="size-4 text-primary"
                  aria-hidden="true"
                />
                <h2 className="text-base font-semibold">
                  {t.detailReviewOutcome}
                </h2>
              </div>
              <p className="mt-3 text-xs font-medium text-foreground">
                {t.reviewMessageRecipientLabel}
              </p>
              <p className="mt-1 text-sm leading-6 break-words whitespace-pre-wrap text-foreground">
                {record.reviewMessage}
              </p>
            </section>
          ) : null}
        </main>

        <aside className="flex min-w-0 flex-col gap-4">
          <section className="rounded-xl border bg-muted/20 p-5">
            <h2 className="text-base font-semibold">
              {moderation ? t.moderationContext : t.detailTitle}
            </h2>
            <dl className="mt-4 flex flex-col gap-4">
              {moderation ? (
                <div className="flex items-start gap-3">
                  <UserRound
                    className="mt-0.5 size-4 shrink-0 text-muted-foreground"
                    aria-hidden="true"
                  />
                  <dt className="text-xs text-muted-foreground">
                    {t.senderLabel}
                  </dt>
                  <dd className="min-w-0 font-medium break-words">
                    {record.sender?.displayName ?? t.moderationEmptySender}
                  </dd>
                  {record.sender ? (
                    <dd className="text-xs text-muted-foreground">
                      {record.sender.active === false
                        ? t.senderInactive
                        : t.senderActive}
                    </dd>
                  ) : null}
                </div>
              ) : null}
              <MetaValue
                icon={CalendarClock}
                label={t.submittedAt}
                value={formatDateTime(record.createdAt)}
              />
              <MetaValue
                icon={CalendarClock}
                label={t.updatedAt}
                value={formatDateTime(record.updatedAt)}
              />
              <MetaValue
                label={t.typeLabel}
                value={dictionary.feedback.types[record.type]}
              />
              <MetaValue
                label={t.accessibilityStatus}
                value={dictionary.feedback.statuses[record.status]}
              />
            </dl>
          </section>

          <section className="rounded-xl border bg-card p-5">
            <h2 className="text-base font-semibold">{t.githubIssue}</h2>
            {record.githubIssueUrl ? (
              <a
                href={record.githubIssueUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 inline-flex max-w-full min-w-0 items-center gap-2 text-sm text-primary underline-offset-4 hover:underline"
              >
                <ExternalLink className="size-4 shrink-0" aria-hidden="true" />
                <span className="truncate">{t.openGithubIssue}</span>
              </a>
            ) : (
              <p className="mt-3 text-sm text-muted-foreground">
                {t.noGithubIssue}
              </p>
            )}
          </section>
        </aside>
      </div>

      {reviewKind ? (
        <FeedbackReviewDialog
          record={record}
          kind={reviewKind}
          open
          onOpenChange={(open) => {
            if (!open) {
              setReviewKind(null)
            }
          }}
          onSubmit={
            reviewKind === "promote" ? promoteSubmission : dismissSubmission
          }
          mutationMode={getMutationMode(reviewKind)}
        />
      ) : null}

      <AlertDialog open={withdrawOpen} onOpenChange={setWithdrawOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogMedia>
              <ShieldAlert className="text-destructive" />
            </AlertDialogMedia>
            <AlertDialogTitle>{t.withdrawTitle}</AlertDialogTitle>
            <AlertDialogDescription>
              {t.withdrawDescription}
            </AlertDialogDescription>
          </AlertDialogHeader>
          {withdrawError ? (
            <p role="alert" className="text-sm text-destructive">
              {withdrawError}
            </p>
          ) : null}
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isWithdrawing}>
              {t.cancelAction}
            </AlertDialogCancel>
            <AlertDialogAction
              variant="destructive"
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              disabled={isWithdrawing}
              onClick={handleWithdraw}
            >
              {isWithdrawing ? <Spinner data-icon="inline-start" /> : null}
              {isWithdrawing ? t.withdrawPending : t.withdrawConfirm}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={eraseOpen} onOpenChange={setEraseOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogMedia>
              <Trash2 className="text-destructive" />
            </AlertDialogMedia>
            <AlertDialogTitle>{t.eraseTitle}</AlertDialogTitle>
            <AlertDialogDescription>
              {t.eraseDescription}
            </AlertDialogDescription>
          </AlertDialogHeader>
          {eraseError ? (
            <p role="alert" className="text-sm text-destructive">
              {eraseError}
            </p>
          ) : null}
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isErasing}>
              {t.cancelAction}
            </AlertDialogCancel>
            <AlertDialogAction
              variant="destructive"
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              disabled={isErasing}
              onClick={handleErase}
            >
              {isErasing ? <Spinner data-icon="inline-start" /> : null}
              {isErasing ? t.erasePending : t.eraseConfirm}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

function DetailText({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-0">
      <h3 className="text-sm font-semibold text-foreground">{label}</h3>
      <p className="mt-2 text-sm leading-6 break-words whitespace-pre-wrap text-foreground/90">
        {value}
      </p>
    </div>
  )
}

function MetaValue({
  icon: Icon,
  label,
  value,
}: {
  icon?: typeof CalendarClock
  label: string
  value: string
}) {
  return (
    <div className="flex min-w-0 items-start gap-3">
      {Icon ? (
        <Icon
          className="mt-0.5 size-4 shrink-0 text-muted-foreground"
          aria-hidden="true"
        />
      ) : null}
      <dt className="text-xs text-muted-foreground">{label}</dt>
      <dd className="min-w-0 text-sm font-medium break-words text-foreground">
        {value}
      </dd>
    </div>
  )
}

function FeedbackReviewDialog({
  record,
  kind,
  open,
  onOpenChange,
  onSubmit,
  mutationMode,
}: {
  record: FeedbackRecord
  kind: "promote" | "dismiss"
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (input: {
    id: string
    reviewMessage: string
  }) => Promise<{ success: boolean; error?: string }>
  mutationMode: string
}) {
  const { dictionary } = useLocalization()
  const t = dictionary.feedback
  const [message, setMessage] = React.useState("")
  const [error, setError] = React.useState<string | null>(null)
  const [pending, setPending] = React.useState(false)
  const fieldRef = React.useRef<HTMLTextAreaElement>(null)
  const isPromote = kind === "promote"

  const schema = React.useMemo(
    () =>
      z
        .string()
        .trim()
        .min(1, t.reviewMessageRequired)
        .min(10, t.reviewMessageTooShort)
        .max(1000, t.reviewMessageTooLong),
    [t]
  )

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const parsed = schema.safeParse(message)
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? t.reviewMessageRequired)
      fieldRef.current?.focus()
      return
    }
    setError(null)
    setPending(true)
    const result = await onSubmit({ id: record.id, reviewMessage: parsed.data })
    setPending(false)
    if (!result.success) {
      setError(t.reviewError)
      return
    }
    toast.success(isPromote ? t.promoteSuccess : t.dismissSuccess)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className="max-h-[calc(100vh-2rem)] overflow-y-auto sm:max-w-lg"
      >
        <DialogHeader>
          <div className="flex items-start justify-between gap-4">
            <div className="flex min-w-0 flex-col gap-2">
              <DialogTitle>
                {isPromote ? t.promoteTitle : t.dismissTitle}
              </DialogTitle>
              <DialogDescription>{t.reviewDialogDescription}</DialogDescription>
            </div>
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              aria-label={t.closeAction}
              onClick={() => onOpenChange(false)}
            >
              <X />
            </Button>
          </div>
        </DialogHeader>
        <form onSubmit={submit} noValidate>
          <Field data-invalid={Boolean(error)}>
            <FieldLabel htmlFor={`feedback-review-message-${record.id}`}>
              {t.reviewMessageLabel}
            </FieldLabel>
            <Textarea
              id={`feedback-review-message-${record.id}`}
              ref={fieldRef}
              value={message}
              onChange={(event) => {
                setMessage(event.target.value)
                setError(null)
              }}
              placeholder={t.reviewMessagePlaceholder}
              maxLength={1000}
              rows={5}
              aria-invalid={Boolean(error)}
              aria-describedby={
                error ? "feedback-review-message-error" : undefined
              }
            />
            {error ? (
              <FieldError id="feedback-review-message-error">
                {error}
              </FieldError>
            ) : null}
          </Field>
          <div className="mt-4 min-h-6" aria-live="polite">
            {pending ? (
              <span className="flex items-center gap-2 text-sm text-muted-foreground">
                <Spinner /> {t.reviewPending}
              </span>
            ) : null}
            {mutationMode === "validation-error" && !pending ? (
              <span className="sr-only">{t.reviewError}</span>
            ) : null}
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              disabled={pending}
              onClick={() => onOpenChange(false)}
            >
              {t.cancelAction}
            </Button>
            <Button type="submit" disabled={pending}>
              {pending ? <Spinner data-icon="inline-start" /> : null}
              {pending ? t.reviewPending : t.reviewConfirm}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
