'use client'

import { clsx } from 'clsx'
import { InputHTMLAttributes, forwardRef } from 'react'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className, id, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label htmlFor={id} className="block font-bold text-sm uppercase tracking-wider mb-1">
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={id}
          className={clsx(
            'w-full px-4 py-3 border-3 border-black bg-white text-black font-medium text-base',
            'placeholder:text-gray-400 focus:outline-none focus:ring-0 focus:border-[#FFE500] focus:bg-[#FFFDE6]',
            'transition-colors duration-100',
            error && 'border-red-600',
            className
          )}
          {...props}
        />
        {error && <p className="mt-1 text-red-600 text-sm font-bold">{error}</p>}
      </div>
    )
  }
)
Input.displayName = 'Input'
