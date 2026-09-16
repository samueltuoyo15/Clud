import React from "react"
import { Button } from "../ui/button"

interface CancelSubscriptionModalProps {
  isOpen: boolean
  isLoading?: boolean
  onClose: () => void
  onConfirm: () => void
}

export const CancelSubscriptionModal: React.FC<CancelSubscriptionModalProps> = ({
  isOpen,
  isLoading = false,
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

      <div className="bg-white rounded-2xl w-full max-w-md relative z-10 overflow-hidden flex flex-col border border-neutral-200">
        <div className="px-6 py-5 border-b border-neutral-100 flex items-center justify-between">
          <h2 className="text-lg font-heading font-semibold text-neutral-900">
            Cancel Subscription
          </h2>
        </div>

        <div className="p-6 space-y-3">
          <p className="text-sm text-neutral-700 leading-relaxed font-medium">
            Are you sure you want to cancel your Pro plan?
          </p>
          <div className="p-3 bg-amber-50 rounded-xl border border-amber-200/70 text-xs text-amber-800 leading-relaxed">
            Your workspace will revert to the free Hobby tier (limited to 1 monitored API project and standard 5-minute polling).
          </div>
        </div>

        <div className="px-6 py-4 bg-neutral-50 border-t border-neutral-100 flex items-center justify-end gap-3">
          <Button
            variant="light"
            onClick={onClose}
            disabled={isLoading}
            className="px-4"
          >
            Keep Subscription
          </Button>
          <Button
            className="px-5 bg-rose-600 text-white hover:bg-rose-700 border-transparent"
            onClick={onConfirm}
            isLoading={isLoading}
          >
            Confirm Cancellation
          </Button>
        </div>
      </div>
    </div>
  )
}
