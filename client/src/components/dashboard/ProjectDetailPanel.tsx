import React from "react"
import {
  CheckmarkCircle01Icon,
  Clock01Icon,
  Calendar01Icon,
  Activity01Icon,
} from "hugeicons-react"
import type { Project } from "../../api/projects"

interface ProjectDetailPanelProps {
  project: Project | null
}

export const ProjectDetailPanel: React.FC<ProjectDetailPanelProps> = ({
  project,
}) => {
  return (
    <div className="w-80 shrink-0 bg-white border-l border-neutral-200 p-6 flex flex-col justify-between overflow-y-auto">
      <div>
        {project ? (
          <>
            <h3 className="text-base font-bold text-neutral-900 mb-1">
              {project.name}
            </h3>
            <p className="text-xs text-neutral-500 mb-6 font-mono truncate">
              {project.spec_url}
            </p>

            <div className="mb-8">
              <p className="text-[11px] font-medium text-neutral-500 mb-1">
                Status
              </p>
              <div className="flex items-center gap-1.5">
                <span
                  className={`text-[13px] font-bold ${project.drift_detected ? "text-rose-600" : "text-neutral-900"}`}
                >
                  {project.drift_detected ? "Drifted" : "In Sync"}
                </span>
                {!project.drift_detected && (
                  <CheckmarkCircle01Icon
                    size={14}
                    className="text-emerald-500"
                  />
                )}
              </div>
              <div className="w-full h-1 bg-neutral-100 rounded-full mt-2">
                <div
                  className={`h-full rounded-full ${project.drift_detected ? "bg-rose-500 w-full" : "bg-emerald-500 w-full"}`}
                />
              </div>
            </div>

            <div className="mb-6">
              <p className="text-[11px] font-bold text-neutral-900 uppercase tracking-wide mb-4">
                Project Details
              </p>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-md bg-neutral-50 border border-neutral-200 flex items-center justify-center shrink-0 text-neutral-500">
                    <Clock01Icon size={12} />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-neutral-900">
                      Last Polled
                    </p>
                    <p className="text-[11px] text-neutral-500">
                      {project.last_polled_at
                        ? new Date(project.last_polled_at).toLocaleString()
                        : "Never polled"}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-md bg-neutral-50 border border-neutral-200 flex items-center justify-center shrink-0 text-neutral-500">
                    <Calendar01Icon size={12} />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-neutral-900">
                      Created At
                    </p>
                    <p className="text-[11px] text-neutral-500">
                      {new Date(project.created_at).toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="text-center py-12">
            <Activity01Icon
              size={24}
              className="mx-auto text-neutral-300 mb-2"
            />
            <p className="text-xs font-medium text-neutral-500">
              Select a project
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
