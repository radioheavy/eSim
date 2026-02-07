import { clsx } from 'clsx'

interface BadgeProps {
  variant?: 'default' | 'green' | 'yellow' | 'red'
  children: React.ReactNode
  className?: string
}

export function Badge({ variant = 'default', children, className }: BadgeProps) {
  return (
    <span
      className={clsx(
        'inline-block px-2 py-0.5 text-xs font-black uppercase tracking-wider border-2 border-black',
        {
          'bg-gray-100 text-black': variant === 'default',
          'bg-green-400 text-black': variant === 'green',
          'bg-[#FFE500] text-black': variant === 'yellow',
          'bg-red-500 text-white': variant === 'red',
        },
        className
      )}
    >
      {children}
    </span>
  )
}
