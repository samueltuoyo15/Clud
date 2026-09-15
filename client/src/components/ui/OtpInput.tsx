import React, { useRef } from "react"

interface OtpInputProps {
  value: string
  onChange: (otp: string) => void
  onAutoSubmit?: (otp: string) => void
  onResend?: () => void
  isLoadingResend?: boolean
}

export const OtpInput: React.FC<OtpInputProps> = ({
  value,
  onChange,
  onAutoSubmit,
  onResend,
  isLoadingResend,
}) => {
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])

  const handleChange = (index: number, val: string) => {
    if (val && !/^\d+$/.test(val)) return

    const newOtp = (value || "").split("")
    newOtp[index] = val.slice(-1)
    const combined = newOtp.join("").slice(0, 6)
    onChange(combined)

    if (val && index < 5) {
      inputRefs.current[index + 1]?.focus()
    }

    if (combined.length === 6 && onAutoSubmit) {
      onAutoSubmit(combined)
    }
  }

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (e.key === "Backspace") {
      if (!value[index] && index > 0) {
        inputRefs.current[index - 1]?.focus()
      } else {
        const newOtp = (value || "").split("")
        newOtp[index] = ""
        onChange(newOtp.join(""))
      }
    }
  }

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault()
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6)
    onChange(pasted)
    if (pasted.length > 0) {
      inputRefs.current[Math.min(pasted.length, 5)]?.focus()
    }
    if (pasted.length === 6 && onAutoSubmit) {
      onAutoSubmit(pasted)
    }
  }

  return (
    <div>
      <label className="block text-sm font-medium text-neutral-700 mb-3 text-center sm:text-left">
        6-Digit Code
      </label>
      <div className="flex gap-2 justify-between">
        {Array.from({ length: 6 }).map((_, index) => (
          <input
            key={index}
            ref={(el) => {
              inputRefs.current[index] = el
            }}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={value[index] || ""}
            onChange={(e) => handleChange(index, e.target.value)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            onPaste={handlePaste}
            className="w-12 h-14 sm:w-14 sm:h-16 text-center text-xl sm:text-2xl font-semibold text-neutral-900 bg-white border border-neutral-200 rounded-xl focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all"
          />
        ))}
      </div>

      {onResend && (
        <div className="mt-6 text-left">
          <p className="text-sm text-neutral-600">
            Didn't receive a code?{" "}
            <button
              type="button"
              onClick={onResend}
              disabled={isLoadingResend}
              className="font-medium text-primary hover:underline disabled:opacity-50 disabled:no-underline"
            >
              {isLoadingResend ? "Sending..." : "Resend"}
            </button>
          </p>
        </div>
      )}
    </div>
  )
}
