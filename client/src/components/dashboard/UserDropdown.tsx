import React, { useState } from "react"
import { ArrowDown01Icon } from "hugeicons-react"

interface UserDropdownProps {
  displayName: string
  email?: string
  initial: string
  profilePicture?: string | null
  onOpenSettings: () => void
  onLogout: () => void
}

export const UserDropdown: React.FC<UserDropdownProps> = ({
  displayName,
  email,
  initial,
  profilePicture,
  onOpenSettings,
  onLogout,
}) => {
  const [showUserMenu, setShowUserMenu] = useState(false)
  const menuRef = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowUserMenu(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  return (
    <div className="relative border-l border-neutral-200 pl-4" ref={menuRef}>
      <button
        onClick={() => setShowUserMenu(!showUserMenu)}
        className="flex items-center gap-2 rounded-md hover:bg-black/5 px-1.5 py-1 transition-colors cursor-pointer"
      >
        {profilePicture ? (
          <img
            src={profilePicture}
            alt={displayName}
            className="w-6 h-6 rounded-md object-cover"
          />
        ) : (
          <div className="w-6 h-6 rounded-md bg-neutral-800 text-white text-[10px] font-bold flex items-center justify-center">
            {initial}
          </div>
        )}
        <span className="text-xs font-medium text-neutral-700 max-w-24 truncate hidden sm:block">
          {displayName}
        </span>
        <ArrowDown01Icon size={12} className="text-neutral-400" />
      </button>

      {showUserMenu && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl border border-neutral-200  p-1.5 z-50">
          <div className="px-3 py-2 border-b border-neutral-100 mb-1">
            <p className="text-xs font-semibold text-neutral-900 truncate">
              {displayName}
            </p>
            <p className="text-[11px] text-neutral-500 truncate">{email}</p>
          </div>
          <button
            onClick={() => {
              onOpenSettings()
              setShowUserMenu(false)
            }}
            className="w-full text-left px-3 py-1.5 text-xs text-neutral-700 hover:bg-black/5 rounded-md transition-colors cursor-pointer"
          >
            Workspace Settings
          </button>
          <button
            onClick={onLogout}
            className="w-full text-left px-3 py-1.5 text-xs text-rose-600 hover:bg-rose-50 rounded-md transition-colors cursor-pointer"
          >
            Sign Out
          </button>
        </div>
      )}
    </div>
  )
}
