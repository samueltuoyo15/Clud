import React from "react"
import type { Project } from "../../api/projects"
import { Button } from "../ui/button"
import { ProjectCard } from "./ProjectCard"

interface ProjectListProps {
  projects: Project[]
  selectedProjectId: string | null
  checkingProjectId: string | null
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
    <div className="flex-1 flex flex-col p-8 overflow-hidden">
      <div className="flex items-center justify-between mb-6 shrink-0">
        <div className="flex items-center gap-1 bg-white border border-neutral-200/80 p-0.5 rounded-lg">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setViewFilter(tab.id)}
              className={`px-4 py-1.5 text-xs font-medium rounded-md transition-all cursor-pointer ${
                viewFilter === tab.id
                  ? "bg-neutral-100 text-neutral-900"
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
          className="flex items-center gap-1.5 rounded-lg"
        >
          <span>+ Add API</span>
        </Button>
      </div>
      <div className="flex-1 overflow-y-auto pr-2 pb-8">
        {projects.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center">
            <p className="text-sm font-medium text-neutral-900 mb-1">
              No Projects Found
            </p>
            <p className="text-xs text-neutral-500 mb-4">
              You have no matching projects or APIs.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
            {projects.map((p) => (
              <ProjectCard
                key={p.id}
                project={p}
                isSelected={selectedProjectId === p.id}
                isChecking={checkingProjectId === p.id}
                onSelect={() => onSelectProject(p.id)}
                onCheck={() => onCheckProject(p.id, p.name)}
              />
            ))}
          </div>
        )}
      </div>{" "}
      "a
    </div>
  )
}
