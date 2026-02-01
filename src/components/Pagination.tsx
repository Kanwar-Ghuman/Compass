'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface PaginationProps {
  currentPage: number
  totalPages: number
  totalItems: number
}

export function Pagination({ currentPage, totalPages, totalItems }: PaginationProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const goToPage = (page: number) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set('page', page.toString())
    router.push(`/items?${params.toString()}`)
  }

  if (totalPages <= 1) return null

  const pages: (number | 'ellipsis')[] = []
  
  if (totalPages <= 7) {
    for (let i = 1; i <= totalPages; i++) {
      pages.push(i)
    }
  } else {
    pages.push(1)
    
    if (currentPage > 3) {
      pages.push('ellipsis')
    }
    
    for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
      if (!pages.includes(i)) {
        pages.push(i)
      }
    }
    
    if (currentPage < totalPages - 2) {
      pages.push('ellipsis')
    }
    
    if (!pages.includes(totalPages)) {
      pages.push(totalPages)
    }
  }

  return (
    <nav 
      className="flex flex-col sm:flex-row items-center justify-between gap-4 glass-card p-4"
      aria-label="Pagination"
    >
      <p className="text-sm text-[#132A13]/60">
        Showing page <span className="font-medium text-[#132A13]">{currentPage}</span> of{' '}
        <span className="font-medium text-[#132A13]">{totalPages}</span> ({totalItems} items)
      </p>

      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => goToPage(currentPage - 1)}
          disabled={currentPage <= 1}
          className="p-2 rounded-lg border border-[#4F772D]/20 hover:bg-[#ECF39E]/20 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          aria-label="Previous page"
        >
          <ChevronLeft className="w-5 h-5 text-[#132A13]" aria-hidden="true" />
        </button>

        <div className="flex items-center gap-1">
          {pages.map((page, index) => (
            page === 'ellipsis' ? (
              <span key={`ellipsis-${index}`} className="px-2 text-[#132A13]/40">
                ...
              </span>
            ) : (
              <button
                key={page}
                type="button"
                onClick={() => goToPage(page)}
                className={`min-w-[40px] h-10 rounded-lg font-medium transition-all ${
                  page === currentPage
                    ? 'bg-[#4F772D] text-white'
                    : 'border border-[#4F772D]/20 text-[#132A13] hover:bg-[#ECF39E]/20'
                }`}
                aria-label={`Page ${page}`}
                aria-current={page === currentPage ? 'page' : undefined}
              >
                {page}
              </button>
            )
          ))}
        </div>

        <button
          type="button"
          onClick={() => goToPage(currentPage + 1)}
          disabled={currentPage >= totalPages}
          className="p-2 rounded-lg border border-[#4F772D]/20 hover:bg-[#ECF39E]/20 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          aria-label="Next page"
        >
          <ChevronRight className="w-5 h-5 text-[#132A13]" aria-hidden="true" />
        </button>
      </div>
    </nav>
  )
}
