import React, { useState, useRef, useEffect } from "react"

export interface SelectOption {
  value: string
  label: string
  icon?: React.ReactNode
}

interface SelectProps {
  value: string
  onChange: (val: string) => void
  options: SelectOption[]
  className?: string
}

export const Select: React.FC<SelectProps> = ({ value, onChange, options, className = "" }) => {
  const [isOpen, setIsOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  const selectedOption = options.find((opt) => opt.value === value) || options[0]

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  return (
    <div className={`relative ${className}`} ref={containerRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full gap-2 px-3 py-2 bg-white border border-neutral-200 rounded-xl text-sm font-medium text-neutral-700 hover:border-neutral-300 transition-colors focus:outline-none"
      >
        <div className="flex items-center gap-2">
          {selectedOption?.icon && <span className="flex-shrink-0">{selectedOption.icon}</span>}
          <span>{selectedOption?.label}</span>
        </div>
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`text-neutral-400 transition-transform ${isOpen ? "rotate-180" : ""}`}>
          <path d="m6 9 6 6 6-6"/>
        </svg>
      </button>

      {isOpen && (
        <div className="absolute left-0 top-full mt-1 w-full min-w-[140px] bg-white border border-neutral-200 rounded-xl py-1 z-50 flex flex-col">
          {options.map((option) => (
            <button
              key={option.value}
              onClick={() => {
                onChange(option.value)
                setIsOpen(false)
              }}
              className={`flex items-center gap-2 px-3 py-2 text-sm text-left w-full hover:bg-neutral-50 transition-colors ${
                value === option.value ? "bg-neutral-50 text-primary font-semibold" : "text-neutral-700"
              }`}
            >
              {option.icon && <span className="flex-shrink-0">{option.icon}</span>}
              <span className="truncate">{option.label}</span>
              {value === option.value && (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="ml-auto text-primary">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
