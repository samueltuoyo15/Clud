import React, { useState } from "react"
import { Button } from "../ui/button"

interface EmailIntegrationModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (emails: string[]) => void
  initialEmails?: string[]
}

export const EmailIntegrationModal: React.FC<EmailIntegrationModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialEmails = [],
}) => {
  const [emails, setEmails] = useState<string[]>(initialEmails)
  const [inputValue, setInputValue] = useState("")

  if (!isOpen) return null

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault()
      addEmail(inputValue)
    }
  }

  const handleBlur = () => {
    addEmail(inputValue)
  }

  const addEmail = (val: string) => {
    const trimmed = val.trim().replace(/,$/, "")
    if (trimmed && isValidEmail(trimmed) && !emails.includes(trimmed)) {
      setEmails([...emails, trimmed])
      setInputValue("")
    }
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
        className="absolute inset-0 bg-neutral-900/30 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      <div className="bg-white rounded-2xl  w-full max-w-md relative z-10 overflow-hidden flex flex-col border border-neutral-200">
        <div className="px-6 py-5 border-b border-neutral-100 flex items-center justify-between">
          <h2 className="text-lg font-heading font-semibold text-neutral-900">
            Email Alerts
          </h2>
        </div>

        <div className="p-6 flex-1 overflow-y-auto">
          <p className="text-sm text-neutral-500 mb-4">
            Enter the email addresses that should receive drift alerts. Separate multiple emails by pressing Enter or comma.
          </p>

          <div className="min-h-[100px] border border-neutral-200 rounded-xl p-2 bg-neutral-50 flex flex-wrap gap-2 items-start focus-within:border-primary focus-within:ring-4 focus-within:ring-primary/10 transition-all">
            {emails.map((email) => (
              <span
                key={email}
                className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#401246] text-white text-xs font-medium rounded-full"
              >
                {email}
                <button
                  type="button"
                  onClick={() => removeEmail(email)}
                  className="hover:bg-white/20 rounded-full p-0.5 transition-colors cursor-pointer"
                >
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M18 6 6 18M6 6l12 12" />
                  </svg>
                </button>
              </span>
            ))}
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              onBlur={handleBlur}
              placeholder={emails.length === 0 ? "team@company.com" : ""}
              className="flex-1 min-w-[120px] bg-transparent outline-none text-sm text-neutral-900 p-1"
            />
          </div>
        </div>

        <div className="px-6 py-4 bg-neutral-50 border-t border-neutral-100 flex items-center justify-end gap-3">
          <Button variant="light" onClick={onClose} className="px-5">
            Cancel
          </Button>
          <Button onClick={() => onSave(emails)} className="px-6">
            Save Emails
          </Button>
        </div>
      </div>
    </div>
  )
}
