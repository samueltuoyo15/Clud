import React from "react"
import { Calendar01Icon, Clock01Icon } from "hugeicons-react"
import type { Project } from "../../api/projects"
import { Button } from "../ui/button"

interface ProjectCardProps {
  project: Project
  isSelected: boolean
  isChecking: boolean
  onSelect: () => void
  onCheck: () => void
}

export const ProjectCard: React.FC<ProjectCardProps> = ({
  project: p,
  isSelected,
  isChecking,
  onSelect,
  onCheck,
}) => {
  return (
    <div
      onClick={onSelect}
      className={`bg-white rounded-xl p-5 transition-all cursor-pointer ${
        isSelected
          ? "border-neutral-800 border"
          : "border-neutral-200 border hover:border-neutral-300"
      }`}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1 text-[11px] font-medium text-neutral-500">
            <Calendar01Icon size={12} />
            {new Date(p.created_at).toLocaleDateString("en-GB", {
              day: "numeric",
              month: "short",
            })}
          </span>
          <span
            className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
              p.drift_detected
                ? "bg-rose-50 text-rose-600"
                : "bg-amber-50 text-amber-700"
            }`}
          >
            • {p.drift_detected ? "High Priority" : "Medium"}
          </span>
        </div>
        <span className="text-neutral-300 leading-none tracking-widest text-lg h-4 flex items-center">
          ···
        </span>
      </div>

      <h4 className="text-[15px] font-bold text-neutral-900 mb-1">{p.name}</h4>
      <p className="text-xs text-neutral-500 truncate mb-4 font-mono leading-relaxed">
        {p.spec_url}
      </p>

      <div className="flex items-center justify-between mt-auto">
        <span className="text-[11px] font-medium text-neutral-500 flex items-center gap-1.5">
          <Clock01Icon size={12} /> Interval: {p.check_interval_minutes}m
        </span>

        <Button
          variant="light"
          size="sm"
          isLoading={isChecking}
          onClick={(e) => {
            e.stopPropagation()
            onCheck()
          }}
          className="text-[11px] px-3 py-1 h-auto rounded-md !bg-primary/5 !text-primary !border-primary/20 hover:!bg-primary/10"
        >
          Poll Now
        </Button>
      </div>
    </div>
  )
}
