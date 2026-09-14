import React from "react"

interface SignUpStep4Props {
  otp: string
  onChange: (otp: string) => void
}

export const SignUpStep4: React.FC<SignUpStep4Props> = ({ otp, onChange }) => {
  return (
    <div>
      <label htmlFor="otp" className="block text-sm font-medium text-neutral-700 mb-1.5">
        6-Digit Code
      </label>
      <input
        type="text"
        id="otp"
        required
        placeholder="000000"
        maxLength={6}
        value={otp}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-4 py-3 rounded-xl border border-neutral-200 focus:ring-4 focus:ring-[#006FEE]/10 focus:border-[#006FEE] outline-none transition-all text-neutral-900 text-center tracking-[0.5em] font-mono text-xl"
      />
    </div>
  )
}
