import React, { useState, useEffect } from "react"
import { useSearchParams } from "react-router-dom"
import { toast } from "sonner"
import { Button } from "../ui/button"
import { Checkbox } from "../ui/Checkbox"
import { fetchApi } from "../../lib/fetch"
import type { Workspace } from "./DashboardSidebar"
import { CancelSubscriptionModal } from "./CancelSubscriptionModal"

interface Member {
  id: string
  email: string
  first_name: string | null
  last_name: string | null
  profile_picture?: string | null
  role: string
  created_at: string
}

interface SettingsTabProps {
  displayName: string
  email?: string
  profilePicture?: string | null
  activeWorkspace?: Workspace
  onUpdateWorkspace?: (name: string, logoUrl?: string) => Promise<void>
  onProfileUpdated?: () => void
  projectsCount?: number
  integrationsCount?: number
}

const PRESET_LOGOS = [
  "https://api.dicebear.com/7.x/identicon/svg?seed=tech",
  "https://api.dicebear.com/7.x/identicon/svg?seed=cloud",
  "https://api.dicebear.com/7.x/identicon/svg?seed=nexus",
  "https://api.dicebear.com/7.x/identicon/svg?seed=matrix",
  "https://api.dicebear.com/7.x/identicon/svg?seed=api",
]

const PRESET_USER_AVATARS = [
  "https://api.dicebear.com/7.x/big-smile/svg?seed=Sam&backgroundColor=e9d5ff&accessories=faceMask",
  "https://api.dicebear.com/7.x/big-smile/svg?seed=Alex&backgroundColor=d8b4fe&accessories=faceMask",
  "https://api.dicebear.com/7.x/big-smile/svg?seed=Taylor&backgroundColor=c084fc&accessories=faceMask",
  "https://api.dicebear.com/7.x/big-smile/svg?seed=Jordan&backgroundColor=a855f7&accessories=faceMask",
  "https://api.dicebear.com/7.x/big-smile/svg?seed=Casey&backgroundColor=9333ea&accessories=faceMask",
  "https://api.dicebear.com/7.x/big-smile/svg?seed=Morgan&backgroundColor=7e22ce&accessories=faceMask",
]

type SubTabId = "general" | "account" | "members" | "billing"

export const SettingsTab: React.FC<SettingsTabProps> = ({
  displayName,
  email,
  profilePicture,
  activeWorkspace,
  onUpdateWorkspace,
  onProfileUpdated,
  projectsCount = 0,
  integrationsCount = 0,
}) => {
  const [searchParams, setSearchParams] = useSearchParams()
  const tabFromUrl = searchParams.get("tab") as SubTabId | null
  const validTabs: SubTabId[] = ["general", "account", "members", "billing"]
  const initialTab: SubTabId = tabFromUrl && validTabs.includes(tabFromUrl) ? tabFromUrl : "general"
  const [activeSubTab, setActiveSubTab] = useState<SubTabId>(initialTab)

  useEffect(() => {
    const currentTab = searchParams.get("tab") as SubTabId | null
    if (currentTab && validTabs.includes(currentTab) && currentTab !== activeSubTab) {
      setActiveSubTab(currentTab)
    }
  }, [searchParams])

  const handleSubTabChange = (tabId: SubTabId) => {
    setActiveSubTab(tabId)
    setSearchParams({ tab: tabId })
  }

  // Workspace state
  const [workspaceName, setWorkspaceName] = useState(activeWorkspace?.name || "")
  const [logoUrl, setLogoUrl] = useState(activeWorkspace?.logo_url || "")
  const [isSavingWorkspace, setIsSavingWorkspace] = useState(false)

  // Account profile state
  const nameParts = displayName.split(" ")
  const initialFirst = nameParts[0] || ""
  const initialLast = nameParts.slice(1).join(" ") || ""
  const [firstName, setFirstName] = useState(initialFirst)
  const [lastName, setLastName] = useState(initialLast)
  const [userAvatarUrl, setUserAvatarUrl] = useState(profilePicture || "")
  const [isSavingAccount, setIsSavingAccount] = useState(false)

  const handleLogoFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (file.size > 2 * 1024 * 1024) {
      toast.error("Image file size must be less than 2MB")
      return
    }
    const reader = new FileReader()
    reader.onload = () => {
      if (typeof reader.result === "string") {
        setLogoUrl(reader.result)
        toast.success("Logo file loaded! Click Save Workspace to apply.")
      }
    }
    reader.readAsDataURL(file)
  }

  const handleAvatarFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (file.size > 2 * 1024 * 1024) {
      toast.error("Image file size must be less than 2MB")
      return
    }
    const reader = new FileReader()
    reader.onload = () => {
      if (typeof reader.result === "string") {
        setUserAvatarUrl(reader.result)
        toast.success("Avatar file loaded! Click Save Profile to apply.")
      }
    }
    reader.readAsDataURL(file)
  }

  // Members state
  const [members, setMembers] = useState<Member[]>([])
  const [selectedMemberIds, setSelectedMemberIds] = useState<string[]>([])
  const [isLoadingMembers, setIsLoadingMembers] = useState(false)
  const [inviteEmail, setInviteEmail] = useState("")
  const [isInviting, setIsInviting] = useState(false)

  useEffect(() => {
    if (activeWorkspace) {
      setWorkspaceName(activeWorkspace.name)
      setLogoUrl(activeWorkspace.logo_url || "")
    }
  }, [activeWorkspace])

  useEffect(() => {
    const parts = displayName.split(" ")
    setFirstName(parts[0] || "")
    setLastName(parts.slice(1).join(" ") || "")
    setUserAvatarUrl(profilePicture || "")
  }, [displayName, profilePicture])

  const loadMembers = async () => {
    if (!activeWorkspace?.id) return
    setIsLoadingMembers(true)
    try {
      const data = await fetchApi(`/workspaces/${activeWorkspace.id}/members`)
      setMembers(Array.isArray(data) ? data : [])
    } catch {
      toast.error("Failed to load team members")
    } finally {
      setIsLoadingMembers(false)
    }
  }

  // Billing state
  const [billingData, setBillingData] = useState<{
    plan: string
    subscription_status: string
    subscription?: any
  } | null>(null)
  const [isStartingCheckout, setIsStartingCheckout] = useState(false)
  const [isCancelling, setIsCancelling] = useState(false)
  const [showCancelModal, setShowCancelModal] = useState(false)

  const loadBilling = async () => {
    if (!activeWorkspace?.id) return
    try {
      const data = await fetchApi<{
        plan: string
        subscription_status: string
        subscription?: any
      }>(`/payments/billing/${activeWorkspace.id}`)
      setBillingData(data)
    } catch {
      // Keep default if billing fetch fails
    }
  }

  useEffect(() => {
    if (activeSubTab === "members" && activeWorkspace?.id) {
      loadMembers()
    }
  }, [activeSubTab, activeWorkspace?.id])

  useEffect(() => {
    if (activeSubTab === "billing" && activeWorkspace?.id) {
      loadBilling()
    }
  }, [activeSubTab, activeWorkspace?.id])

  const handleUpgrade = async () => {
    if (!activeWorkspace?.id) return
    setIsStartingCheckout(true)
    try {
      const data = await fetchApi<{ checkout_url?: string }>("/payments/checkout", {
        method: "POST",
        data: {
          workspace_id: activeWorkspace.id,
        },
      })
      if (data?.checkout_url) {
        window.location.href = data.checkout_url
      } else {
        throw new Error("Could not retrieve checkout URL")
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to start checkout. Please try again.")
      setIsStartingCheckout(false)
    }
  }

  const handleConfirmCancel = async () => {
    if (!activeWorkspace?.id) return
    setIsCancelling(true)
    try {
      await fetchApi(`/payments/cancel/${activeWorkspace.id}`, { method: "POST" })
      toast.success("Subscription cancelled successfully.")
      setShowCancelModal(false)
      loadBilling()
      if (onProfileUpdated) onProfileUpdated()
    } catch (err: any) {
      toast.error(err.message || "Failed to cancel subscription")
    } finally {
      setIsCancelling(false)
    }
  }

  const handleSaveWorkspace = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!workspaceName.trim()) {
      toast.error("Workspace name cannot be empty")
      return
    }
    if (!onUpdateWorkspace) return

    setIsSavingWorkspace(true)
    try {
      await onUpdateWorkspace(workspaceName.trim(), logoUrl.trim() || undefined)
      toast.success("Workspace settings updated!")
    } catch (err: any) {
      toast.error(err.message || "Failed to update workspace")
    } finally {
      setIsSavingWorkspace(false)
    }
  }

  const handleSaveAccount = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSavingAccount(true)
    try {
      await fetchApi("/auth/profile", {
        method: "PATCH",
        data: {
          firstName: firstName.trim(),
          lastName: lastName.trim(),
          profilePicture: userAvatarUrl.trim() || undefined,
        },
      })
      toast.success("Personal profile updated!")
      if (onProfileUpdated) onProfileUpdated()
    } catch (err: any) {
      toast.error(err.message || "Failed to update personal profile")
    } finally {
      setIsSavingAccount(false)
    }
  }

  const handleInviteMember = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!inviteEmail.trim() || !activeWorkspace?.id) return
    setIsInviting(true)
    try {
      await fetchApi(`/workspaces/${activeWorkspace.id}/members`, {
        method: "POST",
        data: { email: inviteEmail.trim() },
      })
      toast.success("Member invited successfully!")
      setInviteEmail("")
      loadMembers()
    } catch (err: any) {
      toast.error(err.message || "Failed to invite member")
    } finally {
      setIsInviting(false)
    }
  }

  const toggleSelectAll = () => {
    if (selectedMemberIds.length === members.length) {
      setSelectedMemberIds([])
    } else {
      setSelectedMemberIds(members.map((m) => m.id))
    }
  }

  const toggleSelectMember = (id: string) => {
    setSelectedMemberIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    )
  }

  const subTabs = [
    { id: "general", label: "General", mobileLabel: "General" },
    { id: "account", label: "Account Profile", mobileLabel: "Profile" },
    { id: "members", label: "Members", mobileLabel: "Members" },
    { id: "billing", label: "Plan & Billing", mobileLabel: "Billing" },
  ] as const

  const admins = members.filter((m) => m.role === "owner" || m.role === "admin")
  const contributors = members.filter((m) => m.role === "member")

  return (
    <div className="p-4 sm:p-8 max-w-4xl mx-auto overflow-y-auto w-full">
      <div className="mb-6">
        <h2 className="text-xl font-heading font-semibold text-neutral-900 mb-1">
          Settings
        </h2>
        <p className="text-sm text-neutral-500">
          Manage workspace branding, account profiles, team members, and subscriptions.
        </p>
      </div>

      {/* Sub-tabs Navigation */}
      <div className="flex items-center gap-1 sm:gap-2 border-b border-neutral-200 mb-8 overflow-x-auto">
        {subTabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => handleSubTabChange(tab.id)}
            className={`pb-3 px-2.5 sm:px-3 text-xs font-semibold transition-all relative cursor-pointer whitespace-nowrap ${
              activeSubTab === tab.id
                ? "text-neutral-900"
                : "text-neutral-500 hover:text-neutral-800"
            }`}
          >
            <span className="sm:hidden">{tab.mobileLabel}</span>
            <span className="hidden sm:inline">{tab.label}</span>
            {activeSubTab === tab.id && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-neutral-900 rounded-full" />
            )}
          </button>
        ))}
      </div>

      {/* TAB 1: GENERAL */}
      {activeSubTab === "general" && (
        <div className="space-y-8">
          <div className="bg-white rounded-2xl border border-neutral-200 overflow-hidden">
            <div className="h-24 bg-[#401246] relative px-8 flex items-end">
              <div className="absolute -bottom-6 flex items-end gap-4">
                <div className="w-16 h-16 rounded-xl bg-white p-1 border border-neutral-200">
                  {logoUrl ? (
                    <img
                      src={logoUrl}
                      alt={workspaceName}
                      className="w-full h-full object-cover rounded-lg bg-neutral-50"
                    />
                  ) : (
                    <div className="w-full h-full rounded-lg bg-primary/10 flex items-center justify-center text-primary font-heading font-bold text-2xl">
                      {workspaceName.charAt(0).toUpperCase() || "W"}
                    </div>
                  )}
                </div>
                <div className="mb-7 pl-1">
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-bold text-white">
                      {workspaceName || "Your Workspace"}
                    </h3>
                    <span className="text-[10px] font-semibold bg-white/20 text-white px-2 py-0.5 rounded-full capitalize">
                      {activeWorkspace?.role || "Owner"}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-10 pb-6 px-8 grid grid-cols-1 sm:grid-cols-3 gap-3 border-b border-neutral-100 bg-neutral-50/50 mt-2">
              <div className="p-3.5 bg-white rounded-xl border border-neutral-200">
                <p className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider mb-1">
                  Monitored APIs
                </p>
                <p className="text-xl font-bold text-neutral-900">
                  {projectsCount}
                </p>
              </div>
              <div className="p-3.5 bg-white rounded-xl border border-neutral-200">
                <p className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider mb-1">
                  Alert Channels
                </p>
                <p className="text-xl font-bold text-neutral-900">
                  {integrationsCount}
                </p>
              </div>
              <div className="p-3.5 bg-white rounded-xl border border-neutral-200">
                <p className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider mb-1">
                  Workspace Role
                </p>
                <p className="text-xl font-bold text-neutral-900 capitalize">
                  {activeWorkspace?.role || "Owner"}
                </p>
              </div>
            </div>

            <form onSubmit={handleSaveWorkspace} className="p-8 space-y-6">
              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1.5">
                  Workspace Name
                </label>
                <input
                  type="text"
                  required
                  value={workspaceName}
                  onChange={(e) => setWorkspaceName(e.target.value)}
                  className="w-full max-w-md px-3.5 py-2 rounded-xl border border-neutral-200 text-xs text-neutral-900 focus:outline-none focus:border-primary"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1.5">
                  Workspace Logo (Upload image, paste link, or choose preset)
                </label>
                <div className="flex items-center gap-2 max-w-md">
                  <input
                    type="url"
                    placeholder="https://example.com/logo.png"
                    value={logoUrl}
                    onChange={(e) => setLogoUrl(e.target.value)}
                    className="flex-1 px-3.5 py-2 rounded-xl border border-neutral-200 text-xs text-neutral-900 focus:outline-none focus:border-primary font-mono"
                  />
                  <label className="px-3 py-2 text-xs font-semibold text-neutral-700 bg-neutral-100 hover:bg-neutral-200 rounded-xl cursor-pointer shrink-0 transition-colors">
                    Upload
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleLogoFileUpload}
                      className="hidden"
                    />
                  </label>
                </div>
                <div className="mt-3 flex items-center gap-2">
                  <span className="text-[11px] text-neutral-400">
                    DiceBear presets:
                  </span>
                  {PRESET_LOGOS.map((preset, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setLogoUrl(preset)}
                      className="w-6 h-6 rounded-lg border border-neutral-200 overflow-hidden hover:scale-105 transition-transform cursor-pointer"
                    >
                      <img
                        src={preset}
                        alt="preset"
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-2">
                <Button
                  type="submit"
                  variant="primary"
                  size="sm"
                  isLoading={isSavingWorkspace}
                  className="rounded-lg px-5"
                >
                  Save Workspace
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* TAB 2: ACCOUNT PROFILE */}
      {activeSubTab === "account" && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-neutral-200 p-8">
            <h3 className="text-base font-semibold text-neutral-900 mb-1">
              Personal Account Profile
            </h3>
            <p className="text-xs text-neutral-500 mb-6">
              Update your personal avatar, full name, and account details.
            </p>

            <form onSubmit={handleSaveAccount} className="space-y-6">
              {/* Profile Avatar Preview & Presets */}
              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-2">
                  Profile Avatar (Upload image, paste link, or choose preset)
                </label>
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary font-bold text-lg border border-neutral-200 overflow-hidden shrink-0">
                    {userAvatarUrl ? (
                      <img
                        src={userAvatarUrl}
                        alt={displayName}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      displayName.charAt(0).toUpperCase()
                    )}
                  </div>
                  <div className="flex-1 max-w-md flex items-center gap-2">
                    <input
                      type="url"
                      placeholder="https://api.dicebear.com/... or custom image URL"
                      value={userAvatarUrl}
                      onChange={(e) => setUserAvatarUrl(e.target.value)}
                      className="flex-1 px-3.5 py-2 rounded-xl border border-neutral-200 text-xs text-neutral-900 focus:outline-none focus:border-primary font-mono"
                    />
                    <label className="px-3 py-2 text-xs font-semibold text-neutral-700 bg-neutral-100 hover:bg-neutral-200 rounded-xl cursor-pointer shrink-0 transition-colors">
                      Upload
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleAvatarFileUpload}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[11px] text-neutral-400">
                    DiceBear Big-Smile mask presets:
                  </span>
                  {PRESET_USER_AVATARS.map((preset, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setUserAvatarUrl(preset)}
                      className="w-7 h-7 rounded-lg border border-neutral-200 overflow-hidden hover:scale-105 transition-transform cursor-pointer bg-neutral-50"
                    >
                      <img
                        src={preset}
                        alt="preset"
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-xl">
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1.5">
                    First Name
                  </label>
                  <input
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-neutral-200 text-xs text-neutral-900 focus:outline-none focus:border-primary"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1.5">
                    Last Name
                  </label>
                  <input
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-neutral-200 text-xs text-neutral-900 focus:outline-none focus:border-primary"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1.5">
                  Email Address
                </label>
                <input
                  type="email"
                  disabled
                  value={email || ""}
                  className="w-full max-w-md px-3.5 py-2 rounded-xl border border-neutral-200 text-xs bg-neutral-50 text-neutral-500 cursor-not-allowed"
                />
                <p className="text-[11px] text-neutral-400 mt-1">
                  Email is linked to your authentication token and cannot be changed here.
                </p>
              </div>

              <div className="pt-2">
                <Button
                  type="submit"
                  variant="primary"
                  size="sm"
                  isLoading={isSavingAccount}
                  className="rounded-lg px-5"
                >
                  Save Profile
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* TAB 3: MEMBERS */}
      {activeSubTab === "members" && (
        <div className="space-y-6">
          {/* Member Stats Cards with Overlapping Avatar Stacks */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Total Members */}
            <div className="p-5 bg-white rounded-2xl border border-neutral-200 flex flex-col justify-between">
              <div>
                <p className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider mb-1">
                  Total Members
                </p>
                <p className="text-2xl font-bold text-neutral-900">
                  {members.length}
                </p>
              </div>
              <div className="mt-4 flex items-center justify-between">
                <span className="text-xs text-neutral-500">Workspace users</span>
                <div className="flex -space-x-2 overflow-hidden">
                  {members.slice(0, 5).map((m) => (
                    <img
                      key={m.id}
                      src={
                        m.profile_picture ||
                        `https://api.dicebear.com/7.x/big-smile/svg?seed=${encodeURIComponent(m.email)}&backgroundColor=e9d5ff&accessories=faceMask`
                      }
                      alt={m.first_name || m.email}
                      className="inline-block h-6 w-6 rounded-full ring-2 ring-white object-cover bg-neutral-100"
                    />
                  ))}
                  {members.length > 5 && (
                    <div className="inline-flex h-6 w-6 rounded-full ring-2 ring-white bg-neutral-200 items-center justify-center text-[9px] font-bold text-neutral-600">
                      +{members.length - 5}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Admins & Owners */}
            <div className="p-5 bg-white rounded-2xl border border-neutral-200 flex flex-col justify-between">
              <div>
                <p className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider mb-1">
                  Admins &amp; Owners
                </p>
                <p className="text-2xl font-bold text-neutral-900">
                  {admins.length}
                </p>
              </div>
              <div className="mt-4 flex items-center justify-between">
                <span className="text-xs text-neutral-500">Full management</span>
                <div className="flex -space-x-2 overflow-hidden">
                  {admins.slice(0, 3).map((m) => (
                    <img
                      key={m.id}
                      src={
                        m.profile_picture ||
                        `https://api.dicebear.com/7.x/big-smile/svg?seed=${encodeURIComponent(m.email)}&backgroundColor=d8b4fe&accessories=faceMask`
                      }
                      alt={m.first_name || m.email}
                      className="inline-block h-6 w-6 rounded-full ring-2 ring-white object-cover bg-neutral-100"
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Active Contributors */}
            <div className="p-5 bg-white rounded-2xl border border-neutral-200 flex flex-col justify-between">
              <div>
                <p className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider mb-1">
                  Contributors
                </p>
                <p className="text-2xl font-bold text-neutral-900">
                  {contributors.length}
                </p>
              </div>
              <div className="mt-4 flex items-center justify-between">
                <span className="text-xs text-neutral-500">Active members</span>
                <div className="flex -space-x-2 overflow-hidden">
                  {contributors.slice(0, 3).map((m) => (
                    <img
                      key={m.id}
                      src={
                        m.profile_picture ||
                        `https://api.dicebear.com/7.x/big-smile/svg?seed=${encodeURIComponent(m.email)}&backgroundColor=c084fc&accessories=faceMask`
                      }
                      alt={m.first_name || m.email}
                      className="inline-block h-6 w-6 rounded-full ring-2 ring-white object-cover bg-neutral-100"
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Invite Member Box */}
          <div className="bg-white rounded-2xl border border-neutral-200 p-6">
            <h3 className="text-sm font-semibold text-neutral-900 mb-1">
              Invite Teammate
            </h3>
            <p className="text-xs text-neutral-500 mb-4">
              Add someone to your workspace by email. They must have a Clud account first.
            </p>
            <form onSubmit={handleInviteMember} className="flex gap-3">
              <input
                type="email"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
                placeholder="colleague@company.com"
                className="flex-1 px-3.5 py-2 text-xs rounded-xl border border-neutral-200 focus:outline-none focus:border-primary"
                required
              />
              <Button
                type="submit"
                variant="primary"
                size="sm"
                isLoading={isInviting}
                className="rounded-lg px-5"
              >
                Invite
              </Button>
            </form>
          </div>

          {/* Members Table with Checkboxes */}
          <div className="bg-white rounded-2xl border border-neutral-200 overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-neutral-100 bg-neutral-50/50 text-xs font-semibold text-neutral-500">
                  <th className="w-10 px-4 py-3.5 text-center">
                    <Checkbox
                      checked={
                        members.length > 0 &&
                        selectedMemberIds.length === members.length
                      }
                      onChange={toggleSelectAll}
                    />
                  </th>
                  <th className="px-4 py-3.5 font-medium">User</th>
                  <th className="px-4 py-3.5 font-medium">Role</th>
                  <th className="px-4 py-3.5 font-medium">Joined</th>
                </tr>
              </thead>
              <tbody className="text-xs">
                {isLoadingMembers ? (
                  <tr>
                    <td colSpan={4} className="py-8 text-center text-neutral-400">
                      Loading team members...
                    </td>
                  </tr>
                ) : members.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="py-8 text-center text-neutral-400">
                      No members found.
                    </td>
                  </tr>
                ) : (
                  members.map((member) => {
                    const isSelected = selectedMemberIds.includes(member.id)
                    const avatarSrc =
                      member.profile_picture ||
                      `https://api.dicebear.com/7.x/big-smile/svg?seed=${encodeURIComponent(member.email)}&backgroundColor=e9d5ff&accessories=faceMask`
                    return (
                      <tr
                        key={member.id}
                        className={`border-b border-neutral-100 last:border-0 transition-colors ${
                          isSelected ? "bg-neutral-50" : "hover:bg-neutral-50/50"
                        }`}
                      >
                        <td className="w-10 px-4 py-3.5 text-center">
                          <Checkbox
                            checked={isSelected}
                            onChange={() => toggleSelectMember(member.id)}
                          />
                        </td>
                        <td className="px-4 py-3.5">
                          <div className="flex items-center gap-3">
                            <img
                              src={avatarSrc}
                              alt={member.first_name || member.email}
                              className="w-7 h-7 rounded-full object-cover shrink-0 border border-neutral-200 bg-neutral-100"
                            />
                            <div>
                              <div className="font-semibold text-neutral-900">
                                {member.first_name
                                  ? `${member.first_name} ${member.last_name || ""}`
                                  : member.email}
                              </div>
                              <div className="text-[11px] text-neutral-400">
                                {member.email}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3.5">
                          <span className="capitalize text-neutral-700 bg-neutral-100 px-2 py-0.5 rounded text-[11px] font-medium">
                            {member.role}
                          </span>
                        </td>
                        <td className="px-4 py-3.5 text-neutral-400 text-[11px]">
                          {new Date(member.created_at).toLocaleDateString()}
                        </td>
                      </tr>
                    )
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 4: BILLING */}
      {activeSubTab === "billing" && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-neutral-200 p-6 sm:p-8">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-6">
              <div>
                <span className="text-xs font-semibold text-primary uppercase tracking-wider mb-1 block">
                  Current Plan
                </span>
                <h3 className="text-2xl font-bold text-neutral-900">
                  {billingData?.plan === "pro" ? "Pro Plan ($10/mo)" : "Hobby Plan (Free)"}
                </h3>
                <p className="text-xs text-neutral-500 mt-1">
                  {billingData?.plan === "pro"
                    ? "Unlimited OpenAPI specs, priority queue polling, and automated alert delivery."
                    : "Essential contract drift tracking for small teams."}
                </p>
              </div>
              {billingData?.plan === "pro" ? (
                <button
                  type="button"
                  onClick={() => setShowCancelModal(true)}
                  className="self-start px-3 py-1.5 rounded-lg border border-rose-200 bg-rose-50 text-rose-700 hover:bg-rose-100 text-xs font-semibold transition-colors cursor-pointer shrink-0"
                >
                  Cancel Subscription
                </button>
              ) : (
                <span className="self-start text-xs font-semibold px-2.5 py-1 rounded-full border bg-emerald-50 text-emerald-700 border-emerald-200 shrink-0">
                  Active
                </span>
              )}
            </div>

            <div className="border-t border-neutral-100 pt-6 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-neutral-600 mb-8">
              <div className="flex items-center gap-2">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                <span>{billingData?.plan === "pro" ? "Unlimited OpenAPI specs" : "Up to 3 monitored API specs"}</span>
              </div>
              <div className="flex items-center gap-2">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                <span>{billingData?.plan === "pro" ? "Priority queue polling" : "5-minute automated polling"}</span>
              </div>
              <div className="flex items-center gap-2">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                <span>Slack &amp; Email drift notifications</span>
              </div>
              <div className="flex items-center gap-2">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                <span>Full schema change diff history</span>
              </div>
            </div>

            {billingData?.plan !== "pro" ? (
              <div className="bg-neutral-50 rounded-xl p-4 flex items-center justify-between border border-neutral-200">
                <div>
                  <p className="text-xs font-semibold text-neutral-900">
                    Upgrade to Pro ($10/mo)
                  </p>
                  <p className="text-[11px] text-neutral-500">
                    Unlimited specs, custom webhooks, priority queue polling, and unlimited team members.
                  </p>
                </div>
                <Button
                  variant="primary"
                  size="sm"
                  isLoading={isStartingCheckout}
                  onClick={handleUpgrade}
                  className="rounded-lg shrink-0 whitespace-nowrap ml-4"
                >
                  Upgrade
                </Button>
              </div>
            ) : (
              <div className="bg-emerald-50 rounded-xl p-4 border border-emerald-200">
                <p className="text-xs font-semibold text-emerald-900">
                  You are on the Pro Plan
                </p>
                <p className="text-[11px] text-emerald-700 mt-0.5">
                  Your workspace has full access to all features and unlimited monitoring.
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      <CancelSubscriptionModal
        isOpen={showCancelModal}
        isLoading={isCancelling}
        onClose={() => setShowCancelModal(false)}
        onConfirm={handleConfirmCancel}
      />
    </div>
  )
}
