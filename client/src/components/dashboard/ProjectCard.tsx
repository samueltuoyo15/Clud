import React from "react"
import { Calendar01Icon, Clock01Icon, RefreshIcon } from "hugeicons-react"
import type { Project } from "../../api/projects"
import { Button } from "../ui/button"

export interface ProjectCardMember {
  id: string
  email: string
  first_name?: string | null
  last_name?: string | null
  profile_picture?: string | null
}

interface ProjectCardProps {
  project: Project
  isSelected: boolean
  isChecking: boolean
  members?: ProjectCardMember[]
  onSelect: () => void
  onCheck: () => void
}

export const ProjectCard: React.FC<ProjectCardProps> = ({
  project: p,
  isSelected,
  isChecking,
  members = [],
  onSelect,
  onCheck,
}) => {
  return (
    <div
      onClick={onSelect}
      className={`bg-white rounded-xl p-5 transition-all cursor-pointer border ${
        isSelected
          ? "border-neutral-900 ring-1 ring-neutral-900/10"
          : "border-neutral-200 hover:border-neutral-300"
      }`}
    >
      {/* Top Header: Status, Date & Team Avatars */}
      <div className="flex items-center justify-between mb-3.5 gap-2">
        <div className="flex items-center gap-2 flex-wrap">
          <span
            className={`text-[10px] font-semibold px-2 py-0.5 rounded-md border flex items-center gap-1.5 ${
              p.drift_detected
                ? "bg-rose-50 text-rose-700 border-rose-200"
                : "bg-emerald-50 text-emerald-700 border-emerald-200"
            }`}
          >
            <span
              className={`w-1.5 h-1.5 rounded-full ${
                p.drift_detected ? "bg-rose-500" : "bg-emerald-500"
              }`}
            />
            {p.drift_detected ? "Drift Detected" : "In Sync"}
          </span>
          <span className="flex items-center gap-1 text-[11px] font-medium text-neutral-400">
            <Calendar01Icon size={12} />
            {new Date(p.created_at).toLocaleDateString("en-GB", {
              day: "numeric",
              month: "short",
            })}
          </span>
        </div>

        {/* Real Workspace Team Avatars at Top Right (Max 5) */}
        {members.length > 0 && (
          <div className="flex -space-x-2 overflow-hidden items-center shrink-0">
            {members.slice(0, 5).map((m) => {
              const avatarSrc =
                m.profile_picture ||
                `https://api.dicebear.com/7.x/big-smile/svg?seed=${encodeURIComponent(
                  m.email || m.first_name || "member",
                )}&backgroundColor=e9d5ff&accessories=faceMask`
              const name = m.first_name || m.email || "Member"
              return (
                <img
                  key={m.id}
                  src={avatarSrc}
                  alt={name}
                  title={name}
                  className="w-6 h-6 rounded-full border-2 border-white ring-1 ring-neutral-200/80 object-cover bg-neutral-100 shrink-0"
                />
              )
            })}
            {members.length > 5 && (
              <div className="w-6 h-6 rounded-full border-2 border-white ring-1 ring-neutral-200/80 bg-neutral-100 flex items-center justify-center text-[9px] font-bold text-neutral-600 shrink-0">
                +{members.length - 5}
              </div>
            )}
          </div>
        )}
      </div>

      {/* API Title */}
      <h4 className="text-[15px] font-bold text-neutral-900 mb-2 leading-tight">
        {p.name}
      </h4>

      {/* OpenAPI Spec URL Box */}
      <div className="px-3 py-1.5 bg-neutral-50 rounded-lg border border-neutral-200/70 font-mono text-[11px] text-neutral-600 mb-4 truncate">
        {p.spec_url}
      </div>

      {/* Footer Info & Action */}
      <div className="flex items-center justify-between pt-1 border-t border-neutral-100">
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
          className="text-[11px] px-3 py-1 h-7 rounded-lg !bg-primary/5 !text-primary !border-primary/20 hover:!bg-primary/10 flex items-center gap-1.5"
        >
          {!isChecking && <RefreshIcon size={12} />}
          <span>Poll Now</span>
        </Button>
      </div>
    </div>
  )
}
