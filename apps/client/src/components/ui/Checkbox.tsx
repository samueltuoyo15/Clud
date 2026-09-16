import React from "react"

interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type" | "onChange"> {
  checked: boolean
  onChange: (checked: boolean) => void
  label?: React.ReactNode
  description?: string
}

export const Checkbox: React.FC<CheckboxProps> = ({
  checked,
  onChange,
  label,
  description,
  disabled = false,
  className = "",
  id,
  ...props
}) => {
  const generatedId = React.useId()
  const inputId = id || generatedId
  const hasContent = Boolean(label || description)

  return (
    <label
      htmlFor={inputId}
      className={`inline-flex ${hasContent ? "items-start gap-2.5" : "items-center justify-center"} select-none ${
        disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
      } ${className}`}
    >
      <div className={`relative flex items-center justify-center shrink-0 ${hasContent && description ? "mt-0.5" : ""}`}>
        <input
          type="checkbox"
          id={inputId}
          checked={checked}
          disabled={disabled}
          onChange={(e) => onChange(e.target.checked)}
          className="sr-only"
          {...props}
        />
        <div
          className={`w-4 h-4 rounded-md border flex items-center justify-center transition-all ${
            checked
              ? "bg-primary border-primary text-white"
              : "bg-white border-neutral-300 hover:border-neutral-400"
          }`}
        >
          {checked && (
            <svg
              width="11"
              height="11"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="3.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="20 6 9 17 4 12" />
            </svg>
          )}
        </div>
      </div>
      {hasContent && (
        <div className="text-xs">
          {label && (
            <span className="font-semibold text-neutral-800 block leading-tight">
              {label}
            </span>
          )}
          {description && (
            <span className="text-neutral-500 text-[11px] block mt-0.5">
              {description}
            </span>
          )}
        </div>
      )}
    </label>
  )
}
