import React from 'react'

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'light' | 'outline' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  isLoading?: boolean
  children: React.ReactNode
}

export const Button: React.FC<ButtonProps> = ({
  variant = "primary",
  size = "md",
  isLoading = false,
  className = "",
  children,
  disabled,
  ...props
}) => {
  const baseStyles =
    "inline-flex items-center justify-center font-medium transition-all duration-150 cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed select-none";

  const variantStyles = {
    primary: "bg-[#3902FF] text-white hover:bg-[#3902FF]/90 active:bg-[#3902FF]/80 border border-[#3902FF]/20 active:scale-[0.98]",
    light:
      "bg-white text-neutral-900 hover:bg-neutral-50 active:bg-neutral-100 border border-neutral-200/90 active:scale-[0.98]",
    outline:
      "bg-transparent text-neutral-800 hover:bg-neutral-100/70 active:bg-neutral-200/50 border border-neutral-300 active:scale-[0.98]",
    ghost:
      "bg-transparent text-neutral-600 hover:text-neutral-950 hover:bg-neutral-200/50 active:bg-neutral-200/80 active:scale-[0.98]",
  };

  const sizeStyles = {
    sm: "text-xs px-4 py-1.5 rounded-lg gap-1.5",
    md: "text-sm px-5 py-2 rounded-xl gap-2",
    lg: "text-base px-7 py-2.5 rounded-xl gap-2.5",
  };

  return (
    <button
      className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
      disabled={isLoading || disabled}
      {...props}
    >
      {children}
      {isLoading && (
        <svg
          className="animate-spin ml-1 h-4 w-4 text-current shrink-0"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
      )}
    </button>
  );
};

