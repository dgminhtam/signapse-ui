// @vitest-environment jsdom

import { cleanup, render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { afterEach, beforeAll, describe, expect, it } from "vitest"
import { useState } from "react"

import { vi as viDictionary } from "@/app/lib/i18n/dictionaries/vi"
import { LocalizationProvider } from "@/app/lib/i18n/provider"
import { AiProviderModelPickerDialog } from "@/app/[lang]/(main)/ai-provider-configs/ai-provider-model-picker-dialog"

const models = [
  { id: "deepseek-v4-flash", label: "deepseek-v4-flash" },
  { id: "deepseek-v4-pro", label: "deepseek-v4-pro" },
]

function ModelPickerHarness() {
  const [open, setOpen] = useState(false)
  const [model, setModel] = useState("")

  return (
    <LocalizationProvider locale="vi" dictionary={viDictionary}>
      <button type="button" onClick={() => setOpen(true)}>
        Open model picker
      </button>
      <output aria-label="Selected model">{model}</output>
      <AiProviderModelPickerDialog
        currentModel={model}
        models={models}
        open={open}
        onOpenChange={setOpen}
        onConfirm={(modelId) => {
          setModel(modelId)
          setOpen(false)
        }}
      />
    </LocalizationProvider>
  )
}

describe("AiProviderModelPickerDialog", () => {
  beforeAll(() => {
    Object.defineProperty(window, "PointerEvent", {
      configurable: true,
      value: MouseEvent,
    })
  })

  afterEach(cleanup)

  it("unmounts the modal after confirming a model", async () => {
    const user = userEvent.setup()
    render(<ModelPickerHarness />)

    const trigger = screen.getByRole("button", { name: "Open model picker" })
    await user.click(trigger)
    await user.click(screen.getByRole("radio", { name: "deepseek-v4-pro" }))
    await user.click(
      screen.getByRole("button", { name: viDictionary.aiProviderConfigs.confirm })
    )

    expect(screen.getByLabelText("Selected model")).toHaveTextContent(
      "deepseek-v4-pro"
    )
    await waitFor(() => {
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument()
    })
    expect(trigger).toHaveFocus()
  })
})
