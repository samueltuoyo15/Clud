import React, { useState } from "react"
import {
  Search01Icon,
  FilterHorizontalIcon,
  Notification01Icon,
} from "hugeicons-react"
import { UserDropdown } from "./UserDropdown"

interface DashboardHeaderProps {
  searchQuery: string
  setSearchQuery: (q: string) => void
  viewFilter: "all" | "sync" | "drift"
  setViewFilter: (filter: "all" | "sync" | "drift") => void
  displayName: string
  email?: string
  initial: string
  profilePicture?: string | null
  onOpenSettings: () => void
  onLogout: () => void
}

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  searchQuery,
  setSearchQuery,
  viewFilter,
  setViewFilter,
  displayName,
  email,
  initial,
  profilePicture,
  onOpenSettings,
  onLogout,
}) => {
  const [showNotifications, setShowNotifications] = useState(false)

  return (
    <header className="h-[72px] px-8 border-b border-neutral-200/60 flex items-center justify-between shrink-0 bg-[#FAFAFA]">
      <div className="flex-1 flex items-center justify-between">
        <div className="relative">
          <Search01Icon
            size={14}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400"
          />
          <input
            type="text"
            placeholder="Search APIs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-48 sm:w-56 pl-9 pr-3 py-1.5 rounded-lg border border-neutral-200/80 bg-white hover:border-neutral-300 text-xs text-neutral-900 placeholder:text-neutral-400 outline-none focus:border-neutral-400 transition-colors"
          />
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <button
              title="Filter options"
              onClick={() =>
                setViewFilter(
                  viewFilter === "all"
                    ? "drift"
                    : viewFilter === "drift"
                      ? "sync"
                      : "all",
                )
              }
              className="w-8 h-8 rounded-md flex items-center justify-center text-neutral-500 hover:text-neutral-900 hover:bg-black/5 transition-colors cursor-pointer"
            >
              <FilterHorizontalIcon size={16} />
            </button>

            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                title="Notifications"
                className="w-8 h-8 rounded-md flex items-center justify-center text-neutral-500 hover:text-neutral-900 hover:bg-black/5 transition-colors cursor-pointer relative"
              >
                <Notification01Icon size={16} />
              </button>

              {showNotifications && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl border border-neutral-200 shadow-lg p-3 z-50">
                  <div className="pb-2 border-b border-neutral-100 flex items-center justify-between">
                    <p className="text-xs font-semibold text-neutral-900">
                      Notifications
                    </p>
                  </div>
                  <div className="py-6 text-center">
                    <p className="text-xs text-neutral-400">
                      No new notifications.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          <UserDropdown
            displayName={displayName}
            email={email}
            initial={initial}
            profilePicture={profilePicture}
            onOpenSettings={onOpenSettings}
            onLogout={onLogout}
          />
        </div>
      </div>
    </header>
  )
}
