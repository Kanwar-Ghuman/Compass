import { AlertCircle } from 'lucide-react'

interface FormErrorProps {
  message?: string
  id?: string
}

export function FormError({ message, id }: FormErrorProps) {
  if (!message) return null

  return (
    <p 
      id={id}
      className="flex items-center gap-2 text-sm text-red-600 mt-1"
      role="alert"
    >
      <AlertCircle className="w-4 h-4 flex-shrink-0" aria-hidden="true" />
      <span>{message}</span>
    </p>
  )
}
