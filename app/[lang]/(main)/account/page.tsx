import { currentUser } from "@clerk/nextjs/server"

import { getMe } from "@/app/api/user/action"
import { getServerDictionary } from "@/app/lib/i18n/server"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

import { AccountBillingPlaceholder } from "./account-billing-placeholder"
import {
  AccountProfileForm,
  AccountProfileInitialData,
} from "./account-profile-form"

interface PageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

function getFullName(firstName?: string | null, lastName?: string | null) {
  return [firstName, lastName].filter(Boolean).join(" ").trim()
}

function getAvatarFallback(fullName: string, email: string) {
  const source = fullName || email
  const initials = source
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("")

  return initials || "CN"
}

function getPrimaryEmail(user: Awaited<ReturnType<typeof currentUser>>) {
  return (
    user?.primaryEmailAddress?.emailAddress ??
    user?.emailAddresses[0]?.emailAddress ??
    ""
  )
}

export default async function AccountPage({ searchParams }: PageProps) {
  const [dictionary, profile, clerkUser, resolvedSearchParams] =
    await Promise.all([getServerDictionary(), getMe(), currentUser(), searchParams])
  const fullName =
    getFullName(profile.firstName, profile.lastName) || clerkUser?.fullName || ""
  const email = profile.email || getPrimaryEmail(clerkUser)
  const avatarUrl =
    profile.mainImage?.urlThumbnail ??
    profile.mainImage?.urlMedium ??
    profile.mainImage?.urlOriginal ??
    clerkUser?.imageUrl ??
    ""
  const initialData: AccountProfileInitialData = {
    avatarUrl,
    avatarFallback: getAvatarFallback(fullName, email),
    fullName,
    dateOfBirth: profile.dateOfBirth ?? "",
    email,
    phoneNumber: profile.phoneNumber ?? "",
    roleName: profile.role_name ?? "",
  }
  const activeTab = resolvedSearchParams.tab === "billing" ? "billing" : "personal"

  return (
    <Tabs defaultValue={activeTab} className="mx-auto w-full max-w-3xl">
      <TabsList>
        <TabsTrigger value="personal">
          {dictionary.accountProfile.personalTab}
        </TabsTrigger>
        <TabsTrigger value="billing">
          {dictionary.accountProfile.billingTab}
        </TabsTrigger>
      </TabsList>
      <TabsContent value="personal" className="pt-4">
        <AccountProfileForm
          initialData={initialData}
          upgradeHref="/account?tab=billing"
        />
      </TabsContent>
      <TabsContent value="billing" className="pt-4">
        <AccountBillingPlaceholder dictionary={dictionary.accountProfile} />
      </TabsContent>
    </Tabs>
  )
}
