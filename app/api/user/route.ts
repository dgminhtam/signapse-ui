import { NextResponse } from "next/server"
import { currentUser, auth } from "@clerk/nextjs/server"

import { getDevAuthUser, isDevAuthModeEnabled } from "@/app/lib/dev-auth-mode"

export async function GET() {
  if (isDevAuthModeEnabled()) {
    return NextResponse.json({ user: getDevAuthUser() }, { status: 200 })
  }

  const { isAuthenticated } = await auth()
  if (!isAuthenticated) {
    return new NextResponse("Unauthorized", { status: 401 })
  }

  const user = await currentUser()
  return NextResponse.json({ user: user }, { status: 200 })
}
