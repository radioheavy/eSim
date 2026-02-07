'use client'

import { clsx } from 'clsx'
import { SelectHTMLAttributes, forwardRef } from 'react'

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string
  error?: string
  options: { value: string; label: string }[]
  placeholder?: string
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, options, placeholder, className, id, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label htmlFor={id} className="block font-bold text-sm uppercase tracking-wider mb-1">
            {label}
          </label>
        )}
        <select
          ref={ref}
          id={id}
          className={clsx(
            'w-full px-4 py-3 border-3 border-black bg-white text-black font-medium text-base appearance-none cursor-pointer',
            'focus:outline-none focus:ring-0 focus:border-[#FFE500]',
            error && 'border-red-600',
            className
          )}
          {...props}
        >
          {placeholder && <option value="">{placeholder}</option>}
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        {error && <p className="mt-1 text-red-600 text-sm font-bold">{error}</p>}
      </div>
    )
  }
)
Select.displayName = 'Select'
