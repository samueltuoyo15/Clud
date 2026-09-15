import React, { useState, useEffect } from "react"
import {
  Home01Icon,
  PuzzleIcon,
  Settings01Icon,
  UserMultiple02Icon,
  PlusSignIcon,
  Search01Icon,
} from "hugeicons-react"
import type { Project } from "../../api/projects"

interface CommandPaletteModalProps {
  isOpen: boolean
  onClose: () => void
  onNavigate: (path: string) => void
  onOpenAddProject: () => void
  projects: Project[]
}

export const CommandPaletteModal: React.FC<CommandPaletteModalProps> = ({
  isOpen,
  onClose,
  onNavigate,
  onOpenAddProject,
  projects,
}) => {
  const [query, setQuery] = useState("")
  const [selectedFilter, setSelectedFilter] = useState<"all" | "pages" | "apis" | "settings">("all")

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        if (isOpen) onClose()
      } else if (e.key === "Escape" && isOpen) {
        onClose()
      }
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [isOpen, onClose])

  if (!isOpen) return null

  const pages = [
    {
      id: "dashboard",
      title: "Dashboard",
      description: "Overview of your monitored API specs and drift status",
      icon: Home01Icon,
      action: () => {
        onNavigate("/dashboard")
        onClose()
      },
      category: "pages",
    },
    {
      id: "integrations",
      title: "Integrations",
      description: "Manage Slack, Discord, and Email drift alert channels",
      icon: PuzzleIcon,
      action: () => {
        onNavigate("/dashboard/integrations")
        onClose()
      },
      category: "pages",
    },
    {
      id: "settings",
      title: "Workspace Settings",
      description: "Configure workspace branding, members, and details",
      icon: Settings01Icon,
      action: () => {
        onNavigate("/dashboard/settings")
        onClose()
      },
      category: "settings",
    },
    {
      id: "add-api",
      title: "Connect New Spec",
      description: "Add a new OpenAPI URL to start monitoring",
      icon: PlusSignIcon,
      action: () => {
        onClose()
        onOpenAddProject()
      },
      category: "apis",
    },
  ]

  const projectItems = projects.map((p) => ({
    id: `project-${p.id}`,
    title: p.name,
    description: `Spec: ${p.spec_url}`,
    icon: Home01Icon,
    action: () => {
      onNavigate("/dashboard")
      onClose()
    },
    category: "apis",
  }))

  const allItems = [...pages, ...projectItems]

  const filteredItems = allItems.filter((item) => {
    const matchesFilter = selectedFilter === "all" || item.category === selectedFilter
    const matchesQuery =
      item.title.toLowerCase().includes(query.toLowerCase()) ||
      item.description.toLowerCase().includes(query.toLowerCase())
    return matchesFilter && matchesQuery
  })

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center pt-24 p-4">
      <div
        className="fixed inset-0 bg-neutral-900/30 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      <div className="relative w-full max-w-lg bg-white rounded-2xl border border-neutral-200 overflow-hidden flex flex-col z-10 animate-in fade-in zoom-in-95 duration-150">
        {/* Search Input Bar */}
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-neutral-100">
          <Search01Icon size={18} className="text-neutral-400 shrink-0" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search pages, APIs, settings..."
            className="flex-1 bg-transparent text-sm text-neutral-900 outline-none placeholder:text-neutral-400"
          />
          <kbd className="px-1.5 py-0.5 text-[10px] font-mono text-neutral-400 bg-neutral-100 rounded border border-neutral-200">
            ESC
          </kbd>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1 px-4 py-2 bg-neutral-50/70 border-b border-neutral-100">
          {(
            [
              { id: "all", label: "All" },
              { id: "pages", label: "Pages" },
              { id: "apis", label: "APIs" },
              { id: "settings", label: "Settings" },
            ] as const
          ).map((filter) => (
            <button
              key={filter.id}
              onClick={() => setSelectedFilter(filter.id)}
              className={`px-2.5 py-1 text-xs font-medium rounded-lg transition-colors cursor-pointer ${
                selectedFilter === filter.id
                  ? "bg-white text-neutral-900 border border-neutral-200/80"
                  : "text-neutral-500 hover:text-neutral-800"
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>

        {/* Search Results List */}
        <div className="max-h-80 overflow-y-auto p-2 divide-y divide-neutral-50">
          {filteredItems.length === 0 ? (
            <div className="py-12 text-center text-xs text-neutral-400">
              No results found for &ldquo;{query}&rdquo;
            </div>
          ) : (
            filteredItems.map((item) => {
              const Icon = item.icon
              return (
                <button
                  key={item.id}
                  onClick={item.action}
                  className="w-full text-left p-3 rounded-xl hover:bg-neutral-50 flex items-center gap-3 transition-colors group cursor-pointer"
                >
                  <div className="w-8 h-8 rounded-lg bg-neutral-100 flex items-center justify-center text-neutral-600 group-hover:bg-primary/10 group-hover:text-primary transition-colors shrink-0">
                    <Icon size={16} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-neutral-900 truncate">
                      {item.title}
                    </p>
                    <p className="text-[11px] text-neutral-400 truncate">
                      {item.description}
                    </p>
                  </div>
                  <span className="text-neutral-300 group-hover:text-neutral-500 text-xs transition-colors">
                    &rarr;
                  </span>
                </button>
              )
            })
          )}
        </div>

        {/* Footer */}
        <div className="px-4 py-2 bg-neutral-50 border-t border-neutral-100 flex items-center justify-between text-[10px] text-neutral-400">
          <div className="flex items-center gap-3">
            <span>&uarr;&darr; Navigate</span>
            <span>&crarr; Select</span>
          </div>
          <span>Clud Command</span>
        </div>
      </div>
    </div>
  )
}
