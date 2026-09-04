import React from 'react'

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'light' | 'outline' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  children: React.ReactNode
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  className = '',
  children,
  ...props
}) => {
  const baseStyles =
    'inline-flex items-center justify-center font-normal transition-all duration-150 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed select-none'

  const variantStyles = {
    primary: 'bg-[#006FEE] text-white hover:bg-[#005BC4] active:bg-[#004BB3] border border-[#006FEE]/20 shadow-sm active:scale-[0.98]',
    light:
      'bg-white text-neutral-900 hover:bg-neutral-50 active:bg-neutral-100 border border-neutral-200/90 shadow-[0_1px_2px_rgba(0,0,0,0.05)] active:scale-[0.98]',
    outline:
      'bg-transparent text-neutral-800 hover:bg-neutral-100/70 active:bg-neutral-200/50 border border-neutral-300 active:scale-[0.98]',
    ghost:
      'bg-transparent text-neutral-600 hover:text-neutral-950 hover:bg-neutral-200/50 active:bg-neutral-200/80 active:scale-[0.98]',
  }

  const sizeStyles = {
    sm: 'text-xs px-5 py-1.5 rounded-lg gap-1.5',
    md: 'text-sm px-6 py-2 rounded-xl gap-2',
    lg: 'text-base px-8 py-2.5 rounded-xl gap-2.5',
  }

  return (
    <button
      className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}

