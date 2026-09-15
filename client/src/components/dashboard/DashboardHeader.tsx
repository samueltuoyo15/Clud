import React, { useState } from "react"
import {
  FilterHorizontalIcon,
  Notification01Icon,
} from "hugeicons-react"
import { UserDropdown } from "./UserDropdown"

export interface Workspace {
  id: string
  name: string
  role: string
}

interface DashboardHeaderProps {
  viewFilter: "all" | "sync" | "drift"
  setViewFilter: (filter: "all" | "sync" | "drift") => void
  displayName: string
  email?: string
  initial: string
  profilePicture?: string | null
  onOpenSettings: () => void
  onLogout: () => void
  onCreateWorkspace: () => void
  workspaces: Workspace[]
  activeWorkspaceId: string | null
  onSwitchWorkspace: (id: string) => void
}

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  viewFilter,
  setViewFilter,
  displayName,
  email,
  initial,
  profilePicture,
  onOpenSettings,
  onLogout,
  onCreateWorkspace,
  workspaces,
  activeWorkspaceId,
  onSwitchWorkspace,
}) => {
  const [showNotifications, setShowNotifications] = useState(false)

  const activeWorkspace = workspaces.find((w) => w.id === activeWorkspaceId) || workspaces[0]

  return (
    <header className="h-[72px] px-8 border-b border-neutral-200/60 flex items-center justify-between shrink-0 bg-white">
      <div className="flex-1 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <div className="relative group">
            <button className="flex items-center gap-2 text-sm font-semibold text-neutral-900 hover:opacity-80 transition-opacity cursor-pointer">
              <div className="w-6 h-6 rounded bg-primary/10 flex items-center justify-center text-primary font-bold text-xs">
                {activeWorkspace?.name.charAt(0).toUpperCase() || initial}
              </div>
              {activeWorkspace?.name || `${displayName}'s Workspace`}
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-neutral-400"><path d="m6 9 6 6 6-6"/></svg>
            </button>
            <div className="absolute left-0 top-full mt-1 w-56 bg-white border border-neutral-200 rounded-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 p-1 ">
              <div className="px-3 py-2 text-[10px] font-bold text-neutral-400 uppercase tracking-wider">Your Workspaces</div>
              {workspaces.map((ws) => (
                <button 
                  key={ws.id}
                  onClick={() => onSwitchWorkspace(ws.id)}
                  className={`w-full text-left px-3 py-2 text-xs font-medium rounded-lg flex items-center gap-2 ${activeWorkspaceId === ws.id ? 'bg-neutral-50 text-neutral-900' : 'text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900'}`}
                >
                  <div className="w-4 h-4 rounded bg-primary/10 flex items-center justify-center text-primary font-bold text-[8px]">
                    {ws.name.charAt(0).toUpperCase()}
                  </div>
                  <span className="flex-1 truncate">{ws.name}</span>
                  {activeWorkspaceId === ws.id && (
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary"><path d="M20 6 9 17l-5-5"/></svg>
                  )}
                </button>
              ))}
              <div className="h-px bg-neutral-100 my-1 w-full" />
              <button 
                onClick={onCreateWorkspace}
                className="w-full text-left px-3 py-2 text-xs text-neutral-500 hover:bg-neutral-50 hover:text-neutral-900 rounded-lg flex items-center gap-2"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="M12 5v14"/></svg>
                Create Workspace
              </button>
            </div>
          </div>
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
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl border border-neutral-200 p-3 z-50">
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
