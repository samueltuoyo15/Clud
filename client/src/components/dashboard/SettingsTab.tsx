import React from "react"

interface SettingsTabProps {
  displayName: string
  email?: string
}

export const SettingsTab: React.FC<SettingsTabProps> = ({
  displayName,
  email,
}) => {
  return (
    <div className="p-8 max-w-2xl overflow-y-auto">
      <h2 className="text-lg font-bold text-neutral-900 mb-1">
        Workspace Settings
      </h2>
      <p className="text-xs text-neutral-500 mb-8">
        Manage your account and workspace configurations.
      </p>

      <div className="space-y-4">
        <div className="bg-white p-5 rounded-xl border border-neutral-200 shadow-xs">
          <label className="block text-[11px] font-semibold text-neutral-700 mb-1">
            User Name
          </label>
          <input
            type="text"
            disabled
            value={displayName}
            className="w-full px-3 py-1.5 rounded-md border border-neutral-200 text-xs bg-neutral-50 text-neutral-600 mb-4"
          />

          <label className="block text-[11px] font-semibold text-neutral-700 mb-1">
            Email Address
          </label>
          <input
            type="email"
            disabled
            value={email || ""}
            className="w-full px-3 py-1.5 rounded-md border border-neutral-200 text-xs bg-neutral-50 text-neutral-600"
          />
        </div>
      </div>
    </div>
  )
}
