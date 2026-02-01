import { Loader2 } from 'lucide-react'

export default function Loading() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center">
      <div className="text-center">
        <Loader2 className="w-12 h-12 animate-spin text-[#4F772D] mx-auto mb-4" aria-hidden="true" />
        <p className="text-[#132A13]/60">Loading...</p>
      </div>
    </div>
  )
}
