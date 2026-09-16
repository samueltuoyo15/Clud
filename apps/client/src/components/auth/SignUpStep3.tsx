import React from "react"
import Select from "react-select"
import countryList from "country-list"

interface SignUpStep3Props {
  country: string
  onChange: (country: string) => void
}

const countryOptions = countryList.getData().map((c) => ({
  value: c.code,
  label: c.name,
}))

const selectStyles = {
  control: (base: any, state: any) => ({
    ...base,
    padding: "2px",
    borderRadius: "0.75rem",
    borderColor: state.isFocused ? "var(--color-primary)" : "#e5e7eb",
    boxShadow: state.isFocused ? "0 0 0 4px rgba(97, 31, 105, 0.1)" : "none",
    "&:hover": { borderColor: state.isFocused ? "var(--color-primary)" : "#e5e7eb" },
    transition: "all 0.2s ease",
  }),
  option: (base: any, state: any) => ({
    ...base,
    backgroundColor: state.isSelected
      ? "var(--color-primary)"
      : state.isFocused
        ? "#f3f4f6"
        : "white",
    color: state.isSelected ? "white" : "#111827",
    "&:active": { backgroundColor: "var(--color-primary)", color: "white" },
  }),
}

export const SignUpStep3: React.FC<SignUpStep3Props> = ({
  country,
  onChange,
}) => {
  return (
    <div>
      <label
        htmlFor="country"
        className="block text-sm font-medium text-neutral-700 mb-1.5"
      >
        Country
      </label>
      <Select
        options={countryOptions}
        styles={selectStyles}
        placeholder="Search your country..."
        value={countryOptions.find((c) => c.value === country)}
        onChange={(val: any) => onChange(val?.value || "")}
        isSearchable={true}
      />
    </div>
  )
}
