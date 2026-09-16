import React from "react"
import type { Project } from "../../api/projects"
import { Button } from "../ui/button"
import { ProjectCard, type ProjectCardMember } from "./ProjectCard"

interface ProjectListProps {
  projects: Project[]
  selectedProjectId: string | null
  checkingProjectId: string | null
  members?: ProjectCardMember[]
  viewFilter: "all" | "sync" | "drift"
  setViewFilter: (filter: "all" | "sync" | "drift") => void
  onSelectProject: (id: string) => void
  onCheckProject: (id: string, name: string) => void
  onOpenAddModal: () => void
}

export const ProjectList: React.FC<ProjectListProps> = ({
  projects,
  selectedProjectId,
  checkingProjectId,
  members = [],
  viewFilter,
  setViewFilter,
  onSelectProject,
  onCheckProject,
  onOpenAddModal,
}) => {
  const tabs = [
    { id: "all", label: "Board" },
    { id: "sync", label: "In Sync" },
    { id: "drift", label: "Drift Detected" },
  ] as const

  return (
    <div className="flex-1 flex flex-col p-4 sm:p-8 overflow-hidden min-w-0">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6 shrink-0">
        <div className="flex items-center gap-1 bg-white border border-neutral-200/80 p-0.5 rounded-lg overflow-x-auto max-w-full">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setViewFilter(tab.id)}
              className={`px-3 sm:px-4 py-1.5 text-xs font-medium rounded-md transition-all cursor-pointer whitespace-nowrap ${
                viewFilter === tab.id
                  ? "bg-neutral-100 text-neutral-900 font-semibold"
                  : "text-neutral-500 hover:text-neutral-800 hover:bg-neutral-50"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <Button
          variant="primary"
          size="sm"
          onClick={onOpenAddModal}
          className="flex items-center justify-center gap-2 rounded-lg"
        >
          <span>Add API</span>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="M12 5v14"/></svg>
        </Button>
      </div>
      <div className="flex-1 overflow-y-auto pr-2 pb-8">
        {projects.length === 0 ? (
          <div className="h-full min-h-[380px] flex flex-col items-center justify-center text-center p-8 bg-neutral-50/40 rounded-2xl border border-dashed border-neutral-200">
            <img
              src="/images/empty-apis.svg"
              alt="No APIs monitored"
              className="w-56 h-40 object-contain mb-4"
            />
            <h3 className="text-base font-semibold text-neutral-900 mb-1">
              No Monitored APIs Yet
            </h3>
            <p className="text-xs text-neutral-500 max-w-sm mb-6 leading-relaxed">
              Connect your OpenAPI (Swagger) spec URL to start automatically tracking schema diffs and drift across your services.
            </p>
            <Button
              variant="primary"
              size="sm"
              onClick={onOpenAddModal}
              className="rounded-lg px-5 flex items-center gap-2"
            >
              <span>Connect First Spec</span>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="M12 5v14"/></svg>
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
            {projects.map((p) => (
              <ProjectCard
                key={p.id}
                project={p}
                isSelected={selectedProjectId === p.id}
                isChecking={checkingProjectId === p.id}
                members={members}
                onSelect={() => onSelectProject(p.id)}
                onCheck={() => onCheckProject(p.id, p.name)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
