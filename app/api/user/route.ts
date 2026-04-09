import { NextResponse } from 'next/server'
import { currentUser, auth } from '@clerk/nextjs/server'

export async function GET() {
  const { isAuthenticated } = await auth()
  if (!isAuthenticated) {
    return new NextResponse('Unauthorized', { status: 401 })
  }

  const user = await currentUser()
  return NextResponse.json({ user: user }, { status: 200 })
}