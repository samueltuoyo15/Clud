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
    <div className="hidden lg:flex w-80 shrink-0 bg-white border-l border-neutral-200 p-6 flex-col justify-between overflow-y-auto">
      <div>
        {project ? (
          <>
            <div className="mb-6">
              <span className="text-[10px] font-semibold text-neutral-400 uppercase tracking-wider block mb-1">
                Selected Spec
              </span>
              <h3 className="text-base font-bold text-neutral-900 mb-1.5 leading-tight">
                {project.name}
              </h3>
              <div className="px-2.5 py-1.5 bg-neutral-50 rounded-lg border border-neutral-200/70 font-mono text-[11px] text-neutral-600 truncate">
                {project.spec_url}
              </div>
            </div>

            <div className="mb-6 p-4 rounded-xl bg-neutral-50 border border-neutral-200/70">
              <p className="text-[11px] font-semibold text-neutral-500 mb-2">
                Contract Health
              </p>
              <div className="flex items-center gap-2">
                <span
                  className={`text-xs font-bold px-2.5 py-1 rounded-md border flex items-center gap-1.5 ${
                    project.drift_detected
                      ? "bg-rose-50 text-rose-700 border-rose-200"
                      : "bg-emerald-50 text-emerald-700 border-emerald-200"
                  }`}
                >
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${
                      project.drift_detected ? "bg-rose-500" : "bg-emerald-500"
                    }`}
                  />
                  {project.drift_detected ? "Drift Detected" : "In Sync"}
                </span>
                {!project.drift_detected && (
                  <CheckmarkCircle01Icon
                    size={15}
                    className="text-emerald-600 shrink-0"
                  />
                )}
              </div>
            </div>

            <div className="mb-6">
              <p className="text-[11px] font-bold text-neutral-900 uppercase tracking-wide mb-3">
                Project Details
              </p>
              <div className="space-y-3">
                <div className="flex items-start gap-3 p-3 rounded-xl bg-white border border-neutral-200/70">
                  <div className="w-6 h-6 rounded-lg bg-neutral-100 flex items-center justify-center shrink-0 text-neutral-600 mt-0.5">
                    <Clock01Icon size={13} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-neutral-900">
                      Last Polled
                    </p>
                    <p className="text-[11px] text-neutral-500 truncate mt-0.5">
                      {project.last_polled_at
                        ? new Date(project.last_polled_at).toLocaleString()
                        : "Never polled"}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-xl bg-white border border-neutral-200/70">
                  <div className="w-6 h-6 rounded-lg bg-neutral-100 flex items-center justify-center shrink-0 text-neutral-600 mt-0.5">
                    <Calendar01Icon size={13} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-neutral-900">
                      Created At
                    </p>
                    <p className="text-[11px] text-neutral-500 truncate mt-0.5">
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
