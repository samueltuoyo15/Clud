import React, { useState, useEffect } from "react"
import { toast } from "sonner"
import { Button } from "../ui/button"
import { fetchApi } from "../../lib/fetch"

interface EmailIntegrationModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (emails: string[]) => void
  initialEmails?: string[]
}

interface TeamMember {
  id: string
  email: string
  first_name?: string | null
}

export const EmailIntegrationModal: React.FC<EmailIntegrationModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialEmails = [],
}) => {
  const safeInitialEmails = Array.isArray(initialEmails) ? initialEmails : []
  const [emails, setEmails] = useState<string[]>(safeInitialEmails)
  const [inputValue, setInputValue] = useState("")
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([])

  useEffect(() => {
    if (isOpen) {
      setEmails(Array.isArray(initialEmails) ? initialEmails : [])
      setInputValue("")
      loadTeamMembers()
    }
  }, [isOpen, initialEmails])

  const loadTeamMembers = async () => {
    try {
      const workspaces = await fetchApi("/workspaces")
      if (Array.isArray(workspaces) && workspaces[0]?.id) {
        const members = await fetchApi(`/workspaces/${workspaces[0].id}/members`)
        if (Array.isArray(members)) {
          setTeamMembers(members)
        }
      }
    } catch {
      // Ignore background member fetch error
    }
  }

  if (!isOpen) return null

  const addEmail = (val: string) => {
    const trimmed = val.trim().toLowerCase()
    if (!trimmed) return
    if (!isValidEmail(trimmed)) {
      toast.error("Please enter a valid email address")
      return
    }
    if (emails.includes(trimmed)) {
      toast.error("Email is already in the list")
      return
    }
    setEmails([...emails, trimmed])
    setInputValue("")
  }

  const removeEmail = (emailToRemove: string) => {
    setEmails(emails.filter((e) => e !== emailToRemove))
  }

  const isValidEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-neutral-900/30 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      <div className="bg-white rounded-2xl w-full max-w-md relative z-10 overflow-hidden flex flex-col border border-neutral-200">
        <div className="px-6 py-5 border-b border-neutral-100 flex items-center justify-between">
          <h2 className="text-base font-heading font-semibold text-neutral-900">
            Email Alert Recipients
          </h2>
        </div>

        <div className="p-6 flex-1 overflow-y-auto space-y-4">
          <p className="text-xs text-neutral-500 leading-relaxed">
            Enter team emails or select from existing workspace members below to receive schema drift alerts.
          </p>

          {/* Quick Team Member Chips */}
          {teamMembers.length > 0 && (
            <div>
              <label className="block text-[11px] font-semibold text-neutral-700 mb-1.5">
                Quick Add Team Members
              </label>
              <div className="flex flex-wrap gap-1.5">
                {teamMembers.map((member) => {
                  const isAdded = emails.includes(member.email.toLowerCase())
                  return (
                    <button
                      key={member.id}
                      type="button"
                      onClick={() => !isAdded && addEmail(member.email)}
                      disabled={isAdded}
                      className={`px-2.5 py-1 text-[11px] rounded-lg border transition-colors flex items-center gap-1.5 cursor-pointer disabled:cursor-default ${
                        isAdded
                          ? "bg-neutral-100 text-neutral-400 border-neutral-200"
                          : "bg-white text-neutral-700 border-neutral-200 hover:border-primary hover:text-primary"
                      }`}
                    >
                      <span>{member.first_name || member.email}</span>
                      {isAdded ? (
                        <span className="text-[11px] text-emerald-600 font-bold">✓</span>
                      ) : (
                        <span className="text-neutral-400 font-semibold">+</span>
                      )}
                    </button>
                  )
                })}
              </div>
            </div>
          )}

          {/* Manual Input Form */}
          <div>
            <label className="block text-[11px] font-semibold text-neutral-700 mb-1.5">
              Add Custom Email
            </label>
            <form
              onSubmit={(e) => {
                e.preventDefault()
                addEmail(inputValue)
              }}
              className="flex gap-2"
            >
              <input
                type="email"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="developer@company.com"
                className="flex-1 px-3.5 py-2 text-xs rounded-xl border border-neutral-200 focus:outline-none focus:border-primary text-neutral-900"
              />
              <Button
                type="submit"
                variant="primary"
                size="sm"
                className="rounded-xl px-4 shrink-0 text-xs"
              >
                Add
              </Button>
            </form>
          </div>

          {/* Active Recipients List */}
          <div>
            <label className="block text-[11px] font-semibold text-neutral-700 mb-1.5">
              Active Recipients ({emails.length})
            </label>
            {emails.length === 0 ? (
              <div className="p-4 rounded-xl border border-dashed border-neutral-200 text-center text-xs text-neutral-400">
                No recipients added yet.
              </div>
            ) : (
              <div className="max-h-40 overflow-y-auto space-y-1.5 p-1">
                {emails.map((email) => (
                  <div
                    key={email}
                    className="flex items-center justify-between px-3 py-2 bg-neutral-50 rounded-xl border border-neutral-200/80 text-xs text-neutral-800"
                  >
                    <span className="font-mono text-[11px]">{email}</span>
                    <button
                      type="button"
                      onClick={() => removeEmail(email)}
                      className="text-neutral-400 hover:text-rose-600 transition-colors p-1 cursor-pointer"
                      title="Remove"
                    >
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M18 6 6 18M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="px-6 py-4 bg-neutral-50 border-t border-neutral-100 flex items-center justify-end gap-3">
          <Button variant="light" size="sm" onClick={onClose} className="px-4 text-xs rounded-xl">
            Cancel
          </Button>
          <Button size="sm" onClick={() => onSave(emails)} className="px-5 text-xs rounded-xl">
            Save Emails
          </Button>
        </div>
      </div>
    </div>
  )
}
