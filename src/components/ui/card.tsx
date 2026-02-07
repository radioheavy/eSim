import { clsx } from 'clsx'

interface CardProps {
  children: React.ReactNode
  className?: string
  hover?: boolean
}

export function Card({ children, className, hover }: CardProps) {
  return (
    <div
      className={clsx(
        'border-3 border-black bg-white p-6',
        hover && 'transition-all duration-100 hover:-translate-y-1 hover:shadow-[4px_4px_0_0_#000]',
        className
      )}
    >
      {children}
    </div>
  )
}
