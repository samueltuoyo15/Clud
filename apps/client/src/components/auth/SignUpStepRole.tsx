import React from "react"

export const roleOptions = [
  {
    id: "frontend",
    title: "Frontend Developer",
    description: "I need to know when the backend changes under me before the UI breaks.",
  },
  {
    id: "backend",
    title: "Backend Developer",
    description: "I want to catch my own breaking changes before they hit production.",
  },
  {
    id: "manager",
    title: "Engineering Lead / Manager",
    description: "I just want my team to stop arguing over who broke the staging environment.",
  },
]

interface SignUpStepRoleProps {
  role: string
  onSelect: (role: string) => void
}

export const SignUpStepRole: React.FC<SignUpStepRoleProps> = ({
  role,
  onSelect,
}) => {
  return (
    <div className="space-y-3">
      {roleOptions.map((opt) => {
        const isSelected = role === opt.id
        return (
          <div
            key={opt.id}
            onClick={() => onSelect(opt.id)}
            className={`p-4 rounded-xl border transition-all cursor-pointer flex items-start gap-3.5 ${
              isSelected
                ? "border-primary bg-primary/5 ring-1 ring-primary"
                : "border-neutral-200 hover:border-neutral-300 hover:bg-neutral-50/50 bg-white"
            }`}
          >
            <div
              className={`w-4 h-4 rounded-full border mt-0.5 shrink-0 flex items-center justify-center transition-colors ${
                isSelected
                  ? "border-primary bg-primary"
                  : "border-neutral-300 bg-white"
              }`}
            >
              {isSelected && (
                <div className="w-1.5 h-1.5 rounded-full bg-white" />
              )}
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-neutral-900 leading-snug">
                {opt.title}
              </p>
              <p className="text-xs text-neutral-500 mt-1 leading-relaxed">
                {opt.description}
              </p>
            </div>
          </div>
        )
      })}
    </div>
  )
}
