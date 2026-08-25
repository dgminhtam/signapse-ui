"use client"

import * as React from "react"

import { useLocalization } from "@/app/lib/i18n/provider"

import {
  FEEDBACK_FIXTURE_USER_ID,
  type FeedbackMutationKind,
  type FeedbackMutationMode,
  type FeedbackMutationResult,
  type FeedbackRecord,
  type FeedbackReviewInput,
  type FeedbackSubmitInput,
} from "./definitions"
import { createFeedbackFixtureSeed } from "./fixtures"

interface FeedbackFixtureContextValue {
  records: FeedbackRecord[]
  personalRecords: FeedbackRecord[]
  moderationRecords: FeedbackRecord[]
  getRecord: (id: string) => FeedbackRecord | undefined
  createSubmission: (
    input: FeedbackSubmitInput
  ) => Promise<FeedbackMutationResult>
  withdrawSubmission: (id: string) => Promise<FeedbackMutationResult>
  promoteSubmission: (
    input: FeedbackReviewInput
  ) => Promise<FeedbackMutationResult>
  dismissSubmission: (
    input: FeedbackReviewInput
  ) => Promise<FeedbackMutationResult>
  eraseSubmission: (id: string) => Promise<FeedbackMutationResult>
  getMutationMode: (kind: FeedbackMutationKind) => FeedbackMutationMode
  hasFeedbackPermission: (permission: string) => boolean
}

const FeedbackFixtureContext =
  React.createContext<FeedbackFixtureContextValue | null>(null)

function readMode(value: string | null): FeedbackMutationMode | null {
  return value === "success" ||
    value === "pending" ||
    value === "validation-error" ||
    value === "mutation-failure"
    ? value
    : null
}

function getQueryMode(kind: FeedbackMutationKind): FeedbackMutationMode | null {
  if (typeof window === "undefined") {
    return null
  }

  const params = new URLSearchParams(window.location.search)
  const configuredModes = (
    window as Window & {
      __SIGNAPSE_FEEDBACK_SCENARIOS__?: Partial<
        Record<FeedbackMutationKind | "feedback", FeedbackMutationMode>
      >
    }
  ).__SIGNAPSE_FEEDBACK_SCENARIOS__

  const configuredMode =
    readMode(configuredModes?.[kind] ?? null) ??
    readMode(configuredModes?.feedback ?? null)

  if (configuredMode) {
    return configuredMode
  }

  return (
    readMode(params.get(`${kind}Scenario`)) ??
    readMode(params.get("feedbackScenario"))
  )
}

function getConfiguredFeedbackPermissions(): string[] | null {
  if (typeof window === "undefined") {
    return null
  }

  const configured = (
    window as Window & {
      __SIGNAPSE_FEEDBACK_PERMISSIONS__?: string[]
    }
  ).__SIGNAPSE_FEEDBACK_PERMISSIONS__
  if (configured) {
    return configured
  }

  const queryValue = new URLSearchParams(window.location.search).get(
    "feedbackPermissions"
  )
  return queryValue ? queryValue.split(",").filter(Boolean) : null
}

function getMutationError(
  kind: FeedbackMutationKind,
  mode: FeedbackMutationMode
) {
  if (mode === "validation-error") {
    return "fixture-validation-error"
  }

  if (mode === "mutation-failure") {
    return `fixture-${kind}-failure`
  }

  return undefined
}

function delay(milliseconds: number) {
  return new Promise<void>((resolve) => {
    window.setTimeout(resolve, milliseconds)
  })
}

export function FeedbackFixtureProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const { locale, dictionary } = useLocalization()
  const [records, setRecords] = React.useState(() =>
    createFeedbackFixtureSeed(locale)
  )

  const getMutationMode = React.useCallback(
    (kind: FeedbackMutationKind): FeedbackMutationMode => {
      return getQueryMode(kind) ?? "success"
    },
    []
  )

  const hasFeedbackPermission = React.useCallback((permission: string) => {
    const configured = getConfiguredFeedbackPermissions()
    return configured
      ? configured.includes("*") || configured.includes(permission)
      : true
  }, [])

  const runMutation = React.useCallback(
    async (
      kind: FeedbackMutationKind,
      apply: () => void
    ): Promise<FeedbackMutationResult> => {
      const mode = getMutationMode(kind)

      if (mode === "pending") {
        await delay(900)
      }

      const error = getMutationError(kind, mode)
      if (error) {
        return { success: false, error }
      }

      apply()
      return { success: true }
    },
    [getMutationMode]
  )

  const createSubmission = React.useCallback(
    async (input: FeedbackSubmitInput) => {
      const createdAt = new Date().toISOString()
      const record: FeedbackRecord = {
        id: `feedback-new-${Date.now()}`,
        ownerId: FEEDBACK_FIXTURE_USER_ID,
        type: input.type,
        title: input.title,
        description: input.description,
        expectedOutcome: input.expectedOutcome,
        reproductionSteps: input.reproductionSteps,
        clientContext: input.clientContext,
        screenshot: input.screenshot,
        status: "PENDING_REVIEW",
        createdAt,
        updatedAt: createdAt,
        sender: {
          id: FEEDBACK_FIXTURE_USER_ID,
          displayName: dictionary.feedback.fixtureUser,
          email: "fixture.user@signapse.test",
          active: true,
        },
        capabilities: {
          canWithdraw: true,
          canPromote: false,
          canDismiss: false,
          canErase: false,
        },
      }

      return runMutation("compose", () => {
        setRecords((current) => [record, ...current])
      }).then((result) => ({
        ...result,
        record: result.success ? record : undefined,
      }))
    },
    [dictionary.feedback.fixtureUser, runMutation]
  )

  const withdrawSubmission = React.useCallback(
    (id: string) =>
      runMutation("withdraw", () => {
        setRecords((current) => current.filter((record) => record.id !== id))
      }),
    [runMutation]
  )

  const updateReview = React.useCallback(
    (kind: "promote" | "dismiss", input: FeedbackReviewInput) =>
      runMutation(kind, () => {
        setRecords((current) =>
          current.map((record) =>
            record.id === input.id
              ? {
                  ...record,
                  status: kind === "promote" ? "PROMOTED" : "DISMISSED",
                  reviewMessage: input.reviewMessage,
                  updatedAt: new Date().toISOString(),
                  capabilities: {
                    ...record.capabilities,
                    canPromote: false,
                    canDismiss: false,
                  },
                }
              : record
          )
        )
      }),
    [runMutation]
  )

  const promoteSubmission = React.useCallback(
    (input: FeedbackReviewInput) => updateReview("promote", input),
    [updateReview]
  )

  const dismissSubmission = React.useCallback(
    (input: FeedbackReviewInput) => updateReview("dismiss", input),
    [updateReview]
  )

  const eraseSubmission = React.useCallback(
    (id: string) =>
      runMutation("erase", () => {
        setRecords((current) => current.filter((record) => record.id !== id))
      }),
    [runMutation]
  )

  const value = React.useMemo<FeedbackFixtureContextValue>(
    () => ({
      records,
      personalRecords: records.filter(
        (record) => record.ownerId === FEEDBACK_FIXTURE_USER_ID
      ),
      moderationRecords: records,
      getRecord: (id) => records.find((record) => record.id === id),
      createSubmission,
      withdrawSubmission,
      promoteSubmission,
      dismissSubmission,
      eraseSubmission,
      getMutationMode,
      hasFeedbackPermission,
    }),
    [
      createSubmission,
      dismissSubmission,
      eraseSubmission,
      getMutationMode,
      hasFeedbackPermission,
      promoteSubmission,
      records,
      withdrawSubmission,
    ]
  )

  return (
    <FeedbackFixtureContext.Provider value={value}>
      {children}
    </FeedbackFixtureContext.Provider>
  )
}

export function FeedbackFixtureBoundary({
  enabled,
  children,
}: {
  enabled: boolean
  children: React.ReactNode
}) {
  if (!enabled) {
    return <>{children}</>
  }

  return <FeedbackFixtureProvider>{children}</FeedbackFixtureProvider>
}

export function useFeedbackFixture() {
  const context = React.useContext(FeedbackFixtureContext)

  if (!context) {
    throw new Error(
      "useFeedbackFixture must be used within FeedbackFixtureProvider"
    )
  }

  return context
}
