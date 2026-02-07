'use client'

import { clsx } from 'clsx'
import { ButtonHTMLAttributes, forwardRef } from 'react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'md', className, children, disabled, ...props }, ref) => {
    return (
      <button
        ref={ref}
        disabled={disabled}
        className={clsx(
          'font-black uppercase tracking-wider border-3 border-black transition-all duration-100 cursor-pointer inline-flex items-center justify-center',
          'disabled:opacity-50 disabled:cursor-not-allowed',
          {
            'bg-black text-white hover:bg-[#FFE500] hover:text-black active:translate-y-0.5': variant === 'primary',
            'bg-white text-black hover:bg-black hover:text-white active:translate-y-0.5': variant === 'secondary',
            'bg-red-600 text-white border-red-600 hover:bg-red-800 active:translate-y-0.5': variant === 'danger',
            'bg-transparent text-black border-transparent hover:border-black': variant === 'ghost',
          },
          {
            'px-3 py-1.5 text-xs': size === 'sm',
            'px-5 py-2.5 text-sm': size === 'md',
            'px-8 py-4 text-base': size === 'lg',
          },
          className
        )}
        {...props}
      >
        {children}
      </button>
    )
  }
)
Button.displayName = 'Button'
