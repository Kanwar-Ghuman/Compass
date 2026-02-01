import { CheckCircle } from 'lucide-react'
import Link from 'next/link'

interface SuccessMessageProps {
  title: string
  message: string
  actions?: {
    label: string
    href: string
    primary?: boolean
  }[]
}

export function SuccessMessage({ title, message, actions }: SuccessMessageProps) {
  return (
    <div className="glass-card p-8 text-center max-w-md mx-auto">
      <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-[#ECF39E] flex items-center justify-center">
        <CheckCircle className="w-8 h-8 text-[#132A13]" aria-hidden="true" />
      </div>
      
      <h2 className="text-2xl font-bold text-[#132A13] mb-2">{title}</h2>
      <p className="text-[#132A13]/70 mb-8">{message}</p>

      {actions && actions.length > 0 && (
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          {actions.map((action) => (
            <Link
              key={action.href}
              href={action.href}
              className={action.primary ? 'glass-button px-6 py-3' : 'glass-button-secondary px-6 py-3'}
            >
              {action.label}
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
