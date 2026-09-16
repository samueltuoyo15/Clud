import React, { useState, useRef, useEffect } from "react"
import { Notification01Icon, Search01Icon } from "hugeicons-react"
import { UserDropdown } from "./UserDropdown"
import { fetchApi } from "../../lib/fetch"
import { getShortcutKey } from "../../lib/platform"

export interface Workspace {
  id: string
  name: string
  logo_url?: string | null
  role: string
  plan?: string
  subscription_status?: string
}

export interface InAppNotification {
  id: string
  title: string
  message: string
  type: string
  read: boolean
  created_at: string
}

interface DashboardHeaderProps {
  displayName: string
  email?: string
  initial: string
  profilePicture?: string | null
  isSidebarCollapsed?: boolean
  onToggleCollapse?: () => void
  onOpenSettings: () => void
  onLogout: () => void
  onOpenCommandPalette: () => void
}

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  displayName,
  email,
  initial,
  profilePicture,
  isSidebarCollapsed = false,
  onToggleCollapse,
  onOpenSettings,
  onLogout,
  onOpenCommandPalette,
}) => {
  const [showNotifications, setShowNotifications] = useState(false)
  const [notificationsList, setNotificationsList] = useState<InAppNotification[]>([])
  const notifRef = useRef<HTMLDivElement>(null)

  const loadNotifications = async () => {
    try {
      const data = await fetchApi("/notifications")
      if (Array.isArray(data)) {
        setNotificationsList(data)
      }
    } catch {
      // Ignore background notification fetch errors
    }
  }

  useEffect(() => {
    loadNotifications()
    const interval = setInterval(loadNotifications, 30000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setShowNotifications(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const markRead = async (id: string) => {
    try {
      await fetchApi(`/notifications/${id}/read`, { method: "PATCH" })
      setNotificationsList((prev) =>
        prev.map((n) => (n.id === id ? { ...n, read: true } : n)),
      )
    } catch {
      // Ignore
    }
  }

  const unreadCount = notificationsList.filter((n) => !n.read).length

  return (
    <header className="h-16 px-8 flex items-center justify-between shrink-0 bg-transparent border-b border-transparent">
      {/* Search Input Bar Trigger + Collapse Button */}
      <div className="flex items-center gap-2.5 flex-1 max-w-lg">
        {onToggleCollapse && (
          <button
            onClick={onToggleCollapse}
            title={isSidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            className="w-8 h-8 rounded-xl bg-neutral-100 hover:bg-neutral-200/70 border border-neutral-200/70 flex items-center justify-center text-neutral-600 hover:text-neutral-900 transition-colors cursor-pointer shrink-0"
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect width="18" height="18" x="3" y="3" rx="2"/>
              <path d="M9 3v18"/>
              <path d={isSidebarCollapsed ? "m11 9 3 3-3 3" : "m14 9-3 3 3 3"}/>
            </svg>
          </button>
        )}

        <button
          onClick={onOpenCommandPalette}
          className="w-full flex items-center justify-between px-3.5 py-1.5 rounded-xl bg-neutral-100 hover:bg-neutral-200/60 border border-neutral-200/70 text-neutral-400 text-xs transition-colors cursor-pointer group"
        >
          <div className="flex items-center gap-2">
            <Search01Icon size={15} className="text-neutral-400 group-hover:text-neutral-600 transition-colors" />
            <span className="text-neutral-500 font-normal">Search APIs, settings, pages...</span>
          </div>
          <kbd className="px-1.5 py-0.5 text-[10px] font-mono text-neutral-400 bg-neutral-200/60 group-hover:bg-neutral-200 rounded border border-neutral-300/50 transition-colors">
            {getShortcutKey()}
          </kbd>
        </button>
      </div>

      <div className="flex items-center gap-3">
        {/* Notifications Bell */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            title="Notifications"
            className="w-8 h-8 rounded-xl bg-neutral-100 hover:bg-neutral-200/70 border border-neutral-200/70 flex items-center justify-center text-neutral-600 hover:text-neutral-900 transition-colors cursor-pointer relative"
          >
            <Notification01Icon size={17} />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-white" />
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl border border-neutral-200 p-3 z-50">
              <div className="pb-2 border-b border-neutral-100 flex items-center justify-between">
                <p className="text-xs font-semibold text-neutral-900">
                  Notifications
                </p>
                {unreadCount > 0 && (
                  <span className="text-[10px] bg-rose-50 text-rose-600 font-semibold px-1.5 py-0.5 rounded">
                    {unreadCount} new
                  </span>
                )}
              </div>
              <div className="max-h-64 overflow-y-auto divide-y divide-neutral-50">
                {notificationsList.length === 0 ? (
                  <div className="py-6 text-center">
                    <p className="text-xs text-neutral-400">
                      No notifications yet.
                    </p>
                  </div>
                ) : (
                  notificationsList.map((notif) => (
                    <div
                      key={notif.id}
                      onClick={() => markRead(notif.id)}
                      className={`p-2.5 text-left rounded-lg transition-colors cursor-pointer ${
                        !notif.read ? "bg-amber-50/40" : "hover:bg-neutral-50"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <p className="text-xs font-semibold text-neutral-900 leading-snug">
                          {notif.title}
                        </p>
                        {!notif.read && (
                          <span className="w-1.5 h-1.5 rounded-full bg-rose-500 shrink-0 mt-1" />
                        )}
                      </div>
                      <p className="text-[11px] text-neutral-500 line-clamp-2 leading-relaxed">
                        {notif.message}
                      </p>
                      <span className="text-[10px] text-neutral-400 mt-1 block">
                        {new Date(notif.created_at).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
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
    </header>
  )
}
