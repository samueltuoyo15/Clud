import React from "react"
import {
  Home01Icon,
  FoldersIcon,
  PuzzleIcon,
  Settings01Icon,
} from "hugeicons-react"
import type { Project } from "../../api/projects"

interface DashboardSidebarProps {
  activeNav: "dashboard" | "apis" | "integrations" | "settings"
  setActiveNav: (
    nav: "dashboard" | "apis" | "integrations" | "settings",
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
    { id: "apis", label: "Projects", icon: FoldersIcon },
    { id: "integrations", label: "Integrations", icon: PuzzleIcon },
    { id: "settings", label: "Settings", icon: Settings01Icon },
  ] as const

  return (
    <aside className="w-64 h-full bg-[#F4F3EF] border-r border-[#EBEBE8] py-6 px-4 flex flex-col justify-between shrink-0">
      <div>
        <div className="flex items-center gap-2.5 px-3 mb-8">
          <img
            src="/favicon.svg"
            alt="Clud"
            className="h-5 w-5 object-contain"
          />
          <span className="font-heading font-bold text-sm tracking-wide text-neutral-900 uppercase">
            Clud
          </span>
        </div>

        <nav className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = activeNav === item.id
            return (
              <button
                key={item.id}
                onClick={() => setActiveNav(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                  isActive
                    ? "bg-white text-neutral-900 border border-neutral-200/50"
                    : "text-neutral-500 hover:text-neutral-900 hover:bg-black/5"
                }`}
              >
                <Icon
                  size={16}
                  className={isActive ? "text-neutral-800" : "text-neutral-400"}
                />
                <span>{item.label}</span>
              </button>
            )
          })}
        </nav>

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
                  }}
                  className={`w-full flex items-center gap-2 text-xs py-1.5 px-2 rounded-md transition-colors cursor-pointer text-left truncate ${
                    selectedProjectId === p.id && activeNav === "dashboard"
                      ? "text-neutral-900 font-medium bg-black/5"
                      : "text-neutral-500 hover:bg-black/5 hover:text-neutral-800"
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
          <span className="text-xs font-semibold text-neutral-800">
            Clud AI
          </span>
          <span className="text-[10px] text-neutral-500">
            Auto-Polling Active
          </span>
        </div>
      </div>
    </aside>
  )
}
