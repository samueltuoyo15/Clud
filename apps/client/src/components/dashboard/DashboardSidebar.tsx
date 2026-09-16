import React, { useState, useRef, useEffect } from "react"
import { Link } from "react-router-dom"
import {
  Home01Icon,
  PuzzleIcon,
  Settings01Icon,
} from "hugeicons-react"
import type { Project } from "../../api/projects"

export interface Workspace {
  id: string
  name: string
  logo_url?: string | null
  role: string
  plan?: string
  subscription_status?: string
}

interface DashboardSidebarProps {
  activeNav: "dashboard" | "apis" | "integrations" | "settings" | "teams"
  setActiveNav: (
    nav: "dashboard" | "apis" | "integrations" | "settings" | "teams",
  ) => void
  projects: Project[]
  selectedProjectId: string | null
  setSelectedProjectId: (id: string) => void
  workspaces: Workspace[]
  activeWorkspaceId: string | null
  onSwitchWorkspace: (id: string) => void
  onCreateWorkspace: () => void
  isCollapsed?: boolean
  isMobileOpen?: boolean
  onCloseMobile?: () => void
}

export const DashboardSidebar: React.FC<DashboardSidebarProps> = ({
  activeNav,
  setActiveNav,
  projects,
  selectedProjectId,
  setSelectedProjectId,
  workspaces,
  activeWorkspaceId,
  onSwitchWorkspace,
  onCreateWorkspace,
  isCollapsed = false,
  isMobileOpen = false,
  onCloseMobile,
}) => {
  const [showWorkspaceMenu, setShowWorkspaceMenu] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowWorkspaceMenu(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const navItems = [
    { id: "dashboard", label: "Dashboard", icon: Home01Icon },
    { id: "integrations", label: "Integrations", icon: PuzzleIcon },
    { id: "settings", label: "Settings", icon: Settings01Icon },
  ] as const

  const activeWorkspace =
    workspaces.find((w) => w.id === activeWorkspaceId) || workspaces[0]

  return (
    <>
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 md:hidden transition-opacity"
          onClick={onCloseMobile}
        />
      )}
      <aside
        className={`h-full bg-[#FAFAFA] border-r border-neutral-200/80 flex flex-col justify-between shrink-0 select-none transition-all duration-300 ease-in-out z-50 fixed inset-y-0 left-0 md:static ${
          isMobileOpen
            ? "translate-x-0 w-64 px-4 py-6 shadow-2xl"
            : "-translate-x-full md:translate-x-0"
        } ${
          isCollapsed
            ? "md:w-0 md:overflow-hidden md:p-0 md:border-r-0 md:opacity-0 md:pointer-events-none"
            : "md:w-64 md:px-4 md:py-6 md:opacity-100"
        }`}
      >
        <div>
          {/* Brand Header */}
          <div className="flex items-center justify-between mb-6 px-2">
            <Link
              to="/"
              onClick={onCloseMobile}
              className="flex items-center gap-2.5 cursor-pointer hover:opacity-80 transition-opacity"
              title="Clud"
            >
              <img
                src="/favicon.svg"
                alt="Clud Logo"
                className="h-6 w-auto object-contain"
              />
              <span className="font-heading font-bold text-sm tracking-wide text-neutral-900 uppercase">
                Clud
              </span>
            </Link>
            {onCloseMobile && (
              <button
                onClick={onCloseMobile}
                className="md:hidden text-neutral-400 hover:text-neutral-900 p-1 rounded-lg transition-colors cursor-pointer"
                title="Close menu"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 6 6 18" />
                  <path d="m6 6 12 12" />
                </svg>
              </button>
            )}
          </div>

        {/* Workspace Switcher in Sidebar */}
        <div className="relative mb-6" ref={menuRef}>
          <button
            onClick={() => setShowWorkspaceMenu(!showWorkspaceMenu)}
            title={activeWorkspace?.name || "Workspace"}
            className="w-full flex items-center justify-between p-2 rounded-xl bg-white text-neutral-900 transition-all border border-neutral-200 hover:border-neutral-300 text-left cursor-pointer"
          >
            <div className="flex items-center gap-2.5 min-w-0">
              {activeWorkspace?.logo_url ? (
                <img
                  src={activeWorkspace.logo_url}
                  alt={activeWorkspace.name}
                  className="w-6 h-6 rounded-lg object-cover shrink-0 border border-neutral-200"
                />
              ) : (
                <div className="w-6 h-6 rounded-lg bg-primary/10 flex items-center justify-center text-primary font-bold text-xs shrink-0">
                  {activeWorkspace?.name.charAt(0).toUpperCase() || "W"}
                </div>
              )}
              <span className="text-xs font-semibold text-neutral-900 truncate">
                {activeWorkspace?.name || "Workspace"}
              </span>
            </div>
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className={`text-neutral-400 transition-transform ${showWorkspaceMenu ? "rotate-180" : ""}`}
            >
              <path d="m6 9 6 6 6-6" />
            </svg>
          </button>

          {showWorkspaceMenu && (
            <div className="absolute left-0 top-full mt-1.5 w-60 bg-white rounded-xl border border-neutral-200 z-50 p-1 text-neutral-900">
              <div className="px-3 py-1.5 text-[10px] font-bold text-neutral-400 uppercase tracking-wider">
                Workspaces
              </div>
              {workspaces.map((ws) => (
                <button
                  key={ws.id}
                  onClick={() => {
                    onSwitchWorkspace(ws.id)
                    setShowWorkspaceMenu(false)
                  }}
                  className={`w-full text-left px-3 py-2 text-xs font-medium rounded-lg flex items-center gap-2 cursor-pointer ${
                    activeWorkspaceId === ws.id
                      ? "bg-neutral-100 text-neutral-900 font-semibold"
                      : "text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900"
                  }`}
                >
                  {ws.logo_url ? (
                    <img
                      src={ws.logo_url}
                      alt={ws.name}
                      className="w-4 h-4 rounded object-cover shrink-0"
                    />
                  ) : (
                    <div className="w-4 h-4 rounded bg-primary/10 flex items-center justify-center text-primary font-bold text-[8px] shrink-0">
                      {ws.name.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <span className="flex-1 truncate">{ws.name}</span>
                  {activeWorkspaceId === ws.id && (
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-primary"
                    >
                      <path d="M20 6 9 17l-5-5" />
                    </svg>
                  )}
                </button>
              ))}
              <div className="h-px bg-neutral-100 my-1 w-full" />
              <button
                onClick={() => {
                  onCreateWorkspace()
                  setShowWorkspaceMenu(false)
                }}
                className="w-full text-left px-3 py-2 text-xs text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900 rounded-lg flex items-center gap-2 cursor-pointer"
              >
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M5 12h14" />
                  <path d="M12 5v14" />
                </svg>
                Create Workspace
              </button>
            </div>
          )}
        </div>

        {/* Navigation Items */}
        <nav className="space-y-1 mt-6">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = activeNav === item.id
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveNav(item.id)
                  onCloseMobile?.()
                }}
                title={isCollapsed ? item.label : undefined}
                className={`w-full flex items-center gap-3 py-2 px-3 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                  isActive
                    ? "bg-neutral-200/70 text-neutral-900 font-semibold"
                    : "text-neutral-600 hover:text-neutral-900 hover:bg-neutral-200/50"
                }`}
              >
                <Icon
                  size={16}
                  className={isActive ? "text-neutral-900" : "text-neutral-400"}
                />
                <span>{item.label}</span>
              </button>
            )
          })}
        </nav>

        {/* Pinned Projects Section */}
        <div className="mt-8 px-1">
          <p className="text-[11px] font-semibold text-neutral-400 mb-3 px-2">
            Pinned
          </p>
          {projects.length === 0 ? (
            <p className="text-xs text-neutral-400 px-2">No projects yet.</p>
          ) : (
            <div className="space-y-0.5">
              {projects.slice(0, 5).map((p) => (
                <button
                  key={p.id}
                  onClick={() => {
                    setSelectedProjectId(p.id)
                    setActiveNav("dashboard")
                    onCloseMobile?.()
                  }}
                  className={`w-full flex items-center gap-2 text-xs py-1.5 px-2 rounded-md transition-colors cursor-pointer text-left truncate ${
                    selectedProjectId === p.id && activeNav === "dashboard"
                      ? "text-neutral-900 font-semibold bg-neutral-200/70"
                      : "text-neutral-500 hover:bg-neutral-200/50 hover:text-neutral-900"
                  }`}
                >
                  <span className="truncate">{p.name}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </aside>
    </>
  )
}
