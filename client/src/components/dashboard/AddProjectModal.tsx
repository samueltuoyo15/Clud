import React from "react"
import { Cancel01Icon, PlusSignIcon } from "hugeicons-react"
import { Button } from "../ui/button"

interface AddProjectModalProps {
  isOpen: boolean
  isCreating: boolean
  newProject: { name: string; spec_url: string; check_interval_minutes: number }
  setNewProject: React.Dispatch<
    React.SetStateAction<{
      name: string
      spec_url: string
      check_interval_minutes: number
    }>
  >
  onClose: () => void
  onSubmit: (e: React.FormEvent) => void
}

export const AddProjectModal: React.FC<AddProjectModalProps> = ({
  isOpen,
  isCreating,
  newProject,
  setNewProject,
  onClose,
  onSubmit,
}) => {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 bg-black/20 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-xl border border-neutral-200">
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-sm font-bold text-neutral-900">
            Connect New Spec
          </h3>
          <button
            onClick={onClose}
            className="text-neutral-400 hover:text-neutral-700 transition-colors"
          >
            <Cancel01Icon size={18} />
          </button>
        </div>

        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="block text-[11px] font-semibold text-neutral-700 mb-1">
              API Name
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Payment Gateway"
              value={newProject.name}
              onChange={(e) =>
                setNewProject({ ...newProject, name: e.target.value })
              }
              className="w-full px-3 py-2 rounded-lg border border-neutral-200 focus:border-neutral-400 outline-none text-xs text-neutral-900"
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-neutral-700 mb-1">
              OpenAPI Spec URL (JSON/YAML)
            </label>
            <input
              type="url"
              required
              placeholder="https://api.example.com/openapi.json"
              value={newProject.spec_url}
              onChange={(e) =>
                setNewProject({ ...newProject, spec_url: e.target.value })
              }
              className="w-full px-3 py-2 rounded-lg border border-neutral-200 focus:border-neutral-400 outline-none text-xs font-mono text-neutral-900"
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-neutral-700 mb-1">
              Check Interval
            </label>
            <select
              value={newProject.check_interval_minutes}
              onChange={(e) =>
                setNewProject({
                  ...newProject,
                  check_interval_minutes: parseInt(e.target.value, 10),
                })
              }
              className="w-full px-3 py-2 rounded-lg border border-neutral-200 focus:border-neutral-400 outline-none text-xs bg-white text-neutral-900"
            >
              <option value={5}>Every 5 minutes</option>
              <option value={15}>Every 15 minutes</option>
              <option value={60}>Every 1 hour</option>
              <option value={1440}>Once a day</option>
            </select>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-neutral-100 mt-2">
            <Button
              type="button"
              variant="light"
              size="sm"
              onClick={onClose}
              className="rounded-lg shadow-xs"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="sm"
              isLoading={isCreating}
              className="rounded-lg shadow-xs flex items-center gap-1.5"
            >
              <span>Connect Spec</span>
              {!isCreating && <PlusSignIcon size={14} />}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
