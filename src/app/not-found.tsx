import Link from 'next/link'
import { Search, Home } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="text-center">
        <div className="w-24 h-24 mx-auto mb-8 rounded-3xl bg-[#ECF39E] flex items-center justify-center">
          <Search className="w-12 h-12 text-[#132A13]" aria-hidden="true" />
        </div>
        
        <h1 className="text-6xl font-bold text-[#132A13] mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-[#132A13] mb-4">Page Not Found</h2>
        <p className="text-[#132A13]/60 max-w-md mx-auto mb-8">
          The page you&apos;re looking for doesn&apos;t exist or has been moved. 
          Maybe you&apos;re looking for a lost item instead?
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link 
            href="/" 
            className="glass-button px-6 py-3 flex items-center justify-center gap-2"
          >
            <Home className="w-5 h-5" aria-hidden="true" />
            Go Home
          </Link>
          <Link 
            href="/items" 
            className="glass-button-secondary px-6 py-3 flex items-center justify-center gap-2"
          >
            <Search className="w-5 h-5" aria-hidden="true" />
            Browse Items
          </Link>
        </div>
      </div>
    </div>
  )
}
