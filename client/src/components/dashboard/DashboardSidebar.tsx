import React from "react"
import { Link } from "react-router-dom"
import {
  Home01Icon,
  PuzzleIcon,
  Settings01Icon,
  UserMultiple02Icon,
} from "hugeicons-react"
import type { Project } from "../../api/projects"

interface DashboardSidebarProps {
  activeNav: "dashboard" | "apis" | "integrations" | "settings" | "teams"
  setActiveNav: (
    nav: "dashboard" | "apis" | "integrations" | "settings" | "teams",
  ) => void
  projects: Project[]
  selectedProjectId: string | null
  setSelectedProjectId: (id: string) => void
}

export const DashboardSidebar: React.FC<DashboardSidebarProps> = ({
  activeNav,
  setActiveNav,
  projects,
  selectedProjectId,
  setSelectedProjectId,
}) => {
  const navItems = [
    { id: "dashboard", label: "Dashboard", icon: Home01Icon },
    { id: "integrations", label: "Integrations", icon: PuzzleIcon },
    { id: "teams", label: "Teams", icon: UserMultiple02Icon },
    { id: "settings", label: "Settings", icon: Settings01Icon },
  ] as const

  return (
    <aside className="w-64 h-full bg-[#401246] border-r border-white/5 py-6 px-4 flex flex-col justify-between shrink-0">
      <div>
        <Link to="/" className="flex items-center gap-2.5 px-3 mb-8 cursor-pointer hover:opacity-80 transition-opacity">
          <img
            src="/favicon-white.svg"
            alt="Clud"
            className="h-5 w-5 object-contain"
          />
          <span className="font-heading font-bold text-sm tracking-wide text-white uppercase">
            Clud
          </span>
        </Link>

        <nav className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = activeNav === item.id
            return (
              <button
                key={item.id}
                onClick={() => setActiveNav(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium transition-all cursor-pointer border border-transparent ${
                  isActive
                    ? "bg-white/10 text-white"
                    : "text-white/60 hover:text-white hover:bg-white/5"
                }`}
              >
                <Icon
                  size={16}
                  className={isActive ? "text-white" : "text-white/50"}
                />
                <span>{item.label}</span>
              </button>
            )
          })}
        </nav>

        <div className="mt-8 px-1">
          <p className="text-[11px] font-semibold text-white/40 mb-3 px-2">
            Pinned
          </p>
          {projects.length === 0 ? (
            <p className="text-xs text-white/40 px-2">No projects yet.</p>
          ) : (
            <div className="space-y-0.5">
              {projects.slice(0, 5).map((p) => (
                <button
                  key={p.id}
                  onClick={() => {
                    setSelectedProjectId(p.id)
                    setActiveNav("dashboard")
                  }}
                  className={`w-full flex items-center gap-2 text-xs py-1.5 px-2 rounded-md transition-colors cursor-pointer text-left truncate ${
                    selectedProjectId === p.id && activeNav === "dashboard"
                      ? "text-white font-medium bg-white/10"
                      : "text-white/60 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  <span className="truncate">{p.name}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="px-2">
        <div className="p-3 flex flex-col items-start gap-1">
          <span className="text-[10px] text-white/50 font-medium">
            Auto-Polling Active
          </span>
        </div>
      </div>
    </aside>
  )
}
