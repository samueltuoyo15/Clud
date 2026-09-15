import React from "react"

export const challengeOptions = [
  {
    id: "backend-changes",
    title: "Backend devs change APIs without notifying anyone",
    description:
      "Endpoints, parameters, or payloads shift silently and break our frontend.",
  },
  {
    id: "outages-bugs",
    title: "We've had outages caused by undocumented API shifts",
    description:
      "Breaking changes slipped into production without alerts or proper diffs.",
  },
]

interface SignUpStep2Props {
  challenge: string
  onSelect: (challenge: string) => void
}

export const SignUpStep2: React.FC<SignUpStep2Props> = ({
  challenge,
  onSelect,
}) => {
  return (
    <div className="space-y-3">
      {challengeOptions.map((opt) => {
        const isSelected = challenge === opt.id
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
