import React from "react"

interface SignUpStep1Props {
  firstName: string
  lastName: string
  email: string
  onChange: (
    fields: Partial<{ firstName: string; lastName: string; email: string }>,
  ) => void
}

export const SignUpStep1: React.FC<SignUpStep1Props> = ({
  firstName,
  lastName,
  email,
  onChange,
}) => {
  return (
    <>
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <label
            htmlFor="firstName"
            className="block text-sm font-medium text-neutral-700 mb-1.5"
          >
            First name
          </label>
          <input
            type="text"
            id="firstName"
            required
            placeholder="John"
            value={firstName}
            onChange={(e) => onChange({ firstName: e.target.value })}
            className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all text-neutral-900"
          />
        </div>
        <div className="flex-1">
          <label
            htmlFor="lastName"
            className="block text-sm font-medium text-neutral-700 mb-1.5"
          >
            Last name
          </label>
          <input
            type="text"
            id="lastName"
            required
            placeholder="Doe"
            value={lastName}
            onChange={(e) => onChange({ lastName: e.target.value })}
            className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all text-neutral-900"
          />
        </div>
      </div>
      <div>
        <label
          htmlFor="email"
          className="block text-sm font-medium text-neutral-700 mb-1.5"
        >
          Work email
        </label>
        <input
          type="email"
          id="email"
          required
          placeholder="johndoe@company.com"
          value={email}
          onChange={(e) => onChange({ email: e.target.value })}
          className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all text-neutral-900"
        />
      </div>
    </>
  )
}
