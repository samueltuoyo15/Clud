import React from "react"
import { PlusSignIcon, PuzzleIcon } from "hugeicons-react"
import { Button } from "../ui/button"
import { Checkbox } from "../ui/Checkbox"

export interface ProjectFormData {
  name: string
  spec_url: string
  check_interval_minutes: number
  auth_type: "none" | "basic"
  auth_username?: string
  auth_password?: string
}

interface AddProjectModalProps {
  isOpen: boolean
  isCreating: boolean
  integrationsCount?: number
  projectsCount?: number
  workspacePlan?: string
  onGoToIntegrations?: () => void
  onGoToBilling?: () => void
  newProject: ProjectFormData
  setNewProject: React.Dispatch<React.SetStateAction<ProjectFormData>>
  onClose: () => void
  onSubmit: (e: React.FormEvent) => void
}

export const AddProjectModal: React.FC<AddProjectModalProps> = ({
  isOpen,
  isCreating,
  integrationsCount,
  projectsCount = 0,
  workspacePlan = "free",
  onGoToIntegrations,
  onGoToBilling,
  newProject,
  setNewProject,
  onClose,
  onSubmit,
}) => {
  if (!isOpen) return null

  const isPro = workspacePlan === "pro"
  const isProjectLimitReached = !isPro && projectsCount >= 1
  const hasIntegrations = integrationsCount !== undefined ? integrationsCount > 0 : true

  return (
    <div className="fixed inset-0 z-50 bg-black/20 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 border border-neutral-200">
        {isProjectLimitReached ? (
          <div className="text-center py-6">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4 border-4 border-purple-50 text-primary">
              <PlusSignIcon size={28} />
            </div>
            <h3 className="text-lg font-bold text-neutral-900 mb-2">
              Free Plan Limit Reached
            </h3>
            <p className="text-sm text-neutral-500 mb-8 px-4 leading-relaxed">
              The Hobby plan is limited to 1 monitored OpenAPI project. Upgrade to Pro for unlimited projects, instant Slack alerts, and 2-minute polling intervals.
            </p>
            <div className="flex items-center justify-center gap-3">
              <Button type="button" variant="light" onClick={onClose}>
                Cancel
              </Button>
              <Button
                type="button"
                variant="primary"
                onClick={() => {
                  onClose()
                  if (onGoToBilling) onGoToBilling()
                }}
              >
                Upgrade to Pro &rarr;
              </Button>
            </div>
          </div>
        ) : !hasIntegrations ? (
          <div className="text-center py-6">
            <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4 border-4 border-amber-50 text-amber-600">
              <PuzzleIcon size={28} />
            </div>
            <h3 className="text-lg font-bold text-neutral-900 mb-2">
              Missing Alert Destination
            </h3>
            <p className="text-sm text-neutral-500 mb-8 px-4 leading-relaxed">
              Before you can monitor an API, you need to tell Clud where to send the alerts. Please configure your email or connect Slack first.
            </p>
            <div className="flex items-center justify-center gap-3">
              <Button type="button" variant="light" onClick={onClose}>
                Cancel
              </Button>
              <Button
                type="button"
                variant="primary"
                onClick={() => {
                  onClose()
                  if (onGoToIntegrations) onGoToIntegrations()
                }}
              >
                Configure Integrations &rarr;
              </Button>
            </div>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-sm font-bold text-neutral-900">
                Connect New Spec
              </h3>
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
                  className="w-full px-3.5 py-2 rounded-xl border border-neutral-200 focus:border-primary outline-none text-xs text-neutral-900"
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
                  className="w-full px-3.5 py-2 rounded-xl border border-neutral-200 focus:border-primary outline-none text-xs font-mono text-neutral-900"
                />
              </div>

              {/* Protected / Basic Auth Toggle */}
              <div className="pt-1">
                <Checkbox
                  checked={newProject.auth_type === "basic"}
                  onChange={(checked) =>
                    setNewProject({
                      ...newProject,
                      auth_type: checked ? "basic" : "none",
                    })
                  }
                  label="Protected with HTTP Basic Auth?"
                  description="Supply credentials if this endpoint requires authentication"
                />

                {newProject.auth_type === "basic" && (
                  <div className="mt-3 grid grid-cols-2 gap-3 p-3 bg-neutral-50 rounded-xl border border-neutral-200">
                    <div>
                      <label className="block text-[10px] font-semibold text-neutral-600 mb-1">
                        Username
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="admin"
                        value={newProject.auth_username || ""}
                        onChange={(e) =>
                          setNewProject({
                            ...newProject,
                            auth_username: e.target.value,
                          })
                        }
                        className="w-full px-2.5 py-1.5 rounded-lg border border-neutral-200 bg-white text-xs outline-none focus:border-primary"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-semibold text-neutral-600 mb-1">
                        Password
                      </label>
                      <input
                        type="password"
                        required
                        placeholder="••••••••"
                        value={newProject.auth_password || ""}
                        onChange={(e) =>
                          setNewProject({
                            ...newProject,
                            auth_password: e.target.value,
                          })
                        }
                        className="w-full px-2.5 py-1.5 rounded-lg border border-neutral-200 bg-white text-xs outline-none focus:border-primary"
                      />
                    </div>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-neutral-100 mt-2">
                <Button
                  type="button"
                  variant="light"
                  size="sm"
                  onClick={onClose}
                  className="rounded-lg px-4"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  size="sm"
                  isLoading={isCreating}
                  className="rounded-lg flex items-center gap-1.5 px-4"
                >
                  <span>Connect</span>
                  {!isCreating && <PlusSignIcon size={14} />}
                </Button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  )
}
