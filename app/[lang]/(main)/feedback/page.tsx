import { notFound } from "next/navigation"

import { isP0FixtureModeEnabled } from "@/app/lib/dev-auth-mode"

import { FeedbackListPage } from "./feedback-list"

export default function FeedbackPage() {
  if (!isP0FixtureModeEnabled()) {
    notFound()
  }

  return <FeedbackListPage />
}
