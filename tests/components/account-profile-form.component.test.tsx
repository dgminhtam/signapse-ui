// @vitest-environment jsdom

import {
  cleanup,
  render,
  screen,
  waitFor,
  within,
} from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"

const { routerRefresh, toastError, toastSuccess } = vi.hoisted(() => ({
  routerRefresh: vi.fn(),
  toastError: vi.fn(),
  toastSuccess: vi.fn(),
}))

vi.mock("@/app/api/user/action", () => ({
  updateMyProfile: vi.fn(),
}))

vi.mock("next/navigation", () => ({
  useRouter: () => ({ refresh: routerRefresh }),
}))

vi.mock("sonner", () => ({
  toast: {
    error: toastError,
    success: toastSuccess,
  },
}))

import { updateMyProfile } from "@/app/api/user/action"
import { en } from "@/app/lib/i18n/dictionaries/en"
import { LocalizationProvider } from "@/app/lib/i18n/provider"
import {
  AccountProfileForm,
  type AccountProfileInitialData,
} from "@/app/[lang]/(main)/account/account-profile-form"

const initialData: AccountProfileInitialData = {
  avatarUrl: "https://example.com/avatar.png",
  avatarFallback: "AM",
  firstName: "Ada",
  lastName: "Miller",
  dateOfBirth: "1990-01-02",
  email: "ada@example.com",
  phoneNumber: "+1 555 0100",
}

function renderProfile(overrides: Partial<AccountProfileInitialData> = {}) {
  return render(
    <LocalizationProvider locale="en" dictionary={en}>
      <AccountProfileForm initialData={{ ...initialData, ...overrides }} />
    </LocalizationProvider>
  )
}

describe("AccountProfileForm", () => {
  afterEach(() => {
    cleanup()
  })

  beforeEach(() => {
    vi.mocked(updateMyProfile).mockReset()
    routerRefresh.mockReset()
    toastError.mockReset()
    toastSuccess.mockReset()
  })

  it("renders a static identity row, read-only account data, and accessible required fields", async () => {
    const user = userEvent.setup()
    renderProfile()

    expect(
      screen.getByRole("heading", {
        name: en.accountProfile.formTitle,
      })
    ).toBeVisible()
    expect(screen.getByRole("img", { name: "Miller Ada" })).toBeVisible()
    expect(
      screen.queryByText(/profile information used for your Signapse account/i)
    ).not.toBeInTheDocument()
    expect(screen.queryByText(/account role/i)).not.toBeInTheDocument()

    const email = screen.getByRole("textbox", {
      name: en.accountProfile.email,
    })
    expect(email).toHaveAttribute("readonly")
    expect(email).toHaveAttribute(
      "aria-describedby",
      "account-email-description"
    )
    expect(email).toHaveValue(initialData.email)

    expect(screen.getByRole("textbox", { name: /Last name/ })).toBeRequired()
    expect(screen.getByRole("textbox", { name: /First name/ })).toBeRequired()
    const dateOfBirth = screen.getByRole("button", {
      name: /Date of birth.*required.*January 2, 1990/i,
    })
    expect(dateOfBirth).toHaveAttribute(
      "aria-labelledby",
      "account-date-of-birth-label account-date-of-birth-value"
    )
    expect(screen.getByRole("textbox", { name: /Phone number/ })).toBeRequired()
    expect(
      screen.queryByRole("button", { name: /upload|delete|replace/i })
    ).not.toBeInTheDocument()
    expect(
      screen.queryByText(/billing|payment|package|plan|upgrade|subscription/i)
    ).not.toBeInTheDocument()

    await user.clear(screen.getByRole("textbox", { name: /First name/ }))

    const firstName = screen.getByRole("textbox", { name: /First name/ })
    expect(firstName).toHaveAttribute(
      "aria-describedby",
      "account-first-name-error"
    )
    expect(screen.getByRole("alert")).toHaveTextContent(
      en.accountProfile.firstNameRequired
    )
  })

  it("selects a localized calendar date and submits the canonical value", async () => {
    const user = userEvent.setup()
    vi.mocked(updateMyProfile).mockResolvedValue({
      success: true,
      data: {} as never,
    })
    renderProfile()

    await user.click(
      screen.getByRole("button", {
        name: /Date of birth.*January 2, 1990/i,
      })
    )
    const dateCell = screen
      .getAllByRole("gridcell", { name: "3" })
      .find((element) => element.getAttribute("data-day") === "1990-01-03")
    expect(dateCell).toBeDefined()
    await user.click(within(dateCell!).getByRole("button"))

    const dateOfBirth = screen.getByRole("button", {
      name: /Date of birth.*January 3, 1990/i,
    })
    expect(dateOfBirth).toHaveAttribute("aria-expanded", "false")
    expect(dateOfBirth).toHaveAccessibleName(
      /Date of birth.*required.*January 3, 1990/i
    )

    await user.click(
      screen.getByRole("button", { name: en.accountProfile.saveChanges })
    )

    await waitFor(() => expect(updateMyProfile).toHaveBeenCalledTimes(1))
    expect(updateMyProfile).toHaveBeenCalledWith({
      firstName: initialData.firstName,
      lastName: initialData.lastName,
      birthday: "1990-01-03",
      phone: initialData.phoneNumber,
    })
  })

  it("restores dirty edits without mutation and normalizes a successful update", async () => {
    const user = userEvent.setup()
    let resolveUpdate: (() => void) | undefined
    vi.mocked(updateMyProfile).mockImplementation(
      () =>
        new Promise<Awaited<ReturnType<typeof updateMyProfile>>>((resolve) => {
          resolveUpdate = () => resolve({ success: true, data: {} as never })
        })
    )
    renderProfile()

    const firstName = screen.getByRole("textbox", { name: /First name/ })
    const restore = screen.getByRole("button", {
      name: en.accountProfile.restore,
    })
    const save = screen.getByRole("button", {
      name: en.accountProfile.saveChanges,
    })
    expect(restore).toBeDisabled()
    expect(save).toBeDisabled()

    await user.clear(firstName)
    await user.type(firstName, "  Ada Prime  ")
    expect(restore).toBeEnabled()
    expect(save).toBeEnabled()

    await user.click(restore)
    expect(firstName).toHaveValue(initialData.firstName)
    expect(restore).toBeDisabled()
    expect(save).toBeDisabled()
    expect(updateMyProfile).not.toHaveBeenCalled()

    await user.clear(firstName)
    await user.type(firstName, "  Ada Prime  ")
    await user.click(save)
    await waitFor(() => expect(updateMyProfile).toHaveBeenCalledTimes(1))
    expect(updateMyProfile).toHaveBeenCalledWith({
      firstName: "Ada Prime",
      lastName: initialData.lastName,
      birthday: initialData.dateOfBirth,
      phone: initialData.phoneNumber,
    })
    expect(save).toBeDisabled()
    expect(restore).toBeDisabled()

    await user.click(save)
    expect(updateMyProfile).toHaveBeenCalledTimes(1)

    resolveUpdate?.()
    await waitFor(() => expect(routerRefresh).toHaveBeenCalledTimes(1))
    expect(firstName).toHaveValue("Ada Prime")
    expect(save).toBeDisabled()
    expect(restore).toBeDisabled()
    expect(toastSuccess).toHaveBeenCalledWith(en.accountProfile.updateSuccess)
  })

  it("retains failed edits and exposes localized recovery feedback", async () => {
    const user = userEvent.setup()
    vi.mocked(updateMyProfile).mockResolvedValue({
      success: false,
      error: "backend detail that must not reach the UI",
    })
    renderProfile()

    const lastName = screen.getByRole("textbox", { name: /Last name/ })
    await user.clear(lastName)
    await user.type(lastName, "  Miller Updated  ")
    await user.click(
      screen.getByRole("button", { name: en.accountProfile.saveChanges })
    )

    await waitFor(() =>
      expect(toastError).toHaveBeenCalledWith(en.accountProfile.updateError)
    )
    expect(lastName).toHaveValue("  Miller Updated  ")
    expect(
      screen.getByRole("button", { name: en.accountProfile.restore })
    ).toBeEnabled()
    expect(screen.queryByText(/backend detail/i)).not.toBeInTheDocument()
  })
})
