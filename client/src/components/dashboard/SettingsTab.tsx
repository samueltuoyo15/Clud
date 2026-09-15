import React from "react"

interface SettingsTabProps {
  displayName: string
  email?: string
  profilePicture?: string | null
}

export const SettingsTab: React.FC<SettingsTabProps> = ({
  displayName,
  email,
  profilePicture,
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
        <div className="bg-white p-6 rounded-2xl border border-neutral-200">
          
          <div className="flex items-center gap-6 mb-8">
            <div className="relative group cursor-pointer">
              <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center text-primary font-heading font-bold text-3xl border border-primary/20 overflow-hidden">
                {profilePicture ? (
                  <img src={profilePicture} alt={displayName} className="w-full h-full object-cover" />
                ) : (
                  displayName.charAt(0).toUpperCase()
                )}
              </div>
              <div className="absolute inset-0 bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"/>
                  <circle cx="12" cy="13" r="3"/>
                </svg>
              </div>
            </div>
            <div>
              <h3 className="text-base font-semibold text-neutral-900">Profile Picture</h3>
              <p className="text-xs text-neutral-500 mt-1">PNG, JPG or GIF up to 5MB.</p>
            </div>
          </div>

          <label className="block text-xs font-semibold text-neutral-700 mb-1.5">
            Full Name
          </label>
          <input
            type="text"
            disabled
            value={displayName}
            className="w-full px-4 py-2 rounded-lg border border-neutral-200 text-xs bg-neutral-50 text-neutral-600 mb-5"
          />

          <label className="block text-xs font-semibold text-neutral-700 mb-1.5">
            Email Address
          </label>
          <input
            type="email"
            disabled
            value={email || ""}
            className="w-full px-4 py-2 rounded-lg border border-neutral-200 text-xs bg-neutral-50 text-neutral-600"
          />
        </div>
      </div>
    </div>
  )
}
