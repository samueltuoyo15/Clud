import React from "react"
import { Button } from "../ui/button"

interface SignOutModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
}

export const SignOutModal: React.FC<SignOutModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
}) => {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
      <div
        className="absolute inset-0 bg-neutral-900/30 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      <div className="bg-white rounded-2xl  w-full max-w-sm relative z-10 overflow-hidden flex flex-col border border-neutral-200">
        <div className="px-6 py-5 border-b border-neutral-100 flex items-center justify-between">
          <h2 className="text-lg font-heading font-semibold text-neutral-900">
            Sign Out
          </h2>
        </div>

        <div className="p-6">
          <p className="text-sm text-neutral-600 leading-relaxed">
            Are you sure you want to sign out of your account?
          </p>
        </div>

        <div className="px-6 py-4 bg-neutral-50 border-t border-neutral-100 flex items-center justify-end gap-3">
          <Button variant="light" onClick={onClose} className="px-5">
            Cancel
          </Button>
          <Button 
            className="px-6 bg-rose-600 text-white hover:bg-rose-700 border-transparent" 
            onClick={onConfirm} 
          >
            Sign Out
          </Button>
        </div>
      </div>
    </div>
  )
}
