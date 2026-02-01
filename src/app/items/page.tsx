import { Suspense } from 'react'
import { Package } from 'lucide-react'
import prisma from '@/lib/db'
import { ItemCard } from '@/components/ItemCard'
import { ItemFilters } from '@/components/ItemFilters'
import { Pagination } from '@/components/Pagination'

const PAGE_SIZE = 12

interface SearchParams {
  q?: string
  category?: string
  location?: string
  status?: string
  sort?: string
  page?: string
}

interface ItemType {
  id: string
  title: string
  category: string
  description: string
  foundLocation: string
  foundAt: Date
  imageUrl: string
  status: 'PENDING' | 'APPROVED' | 'CLAIMED' | 'ARCHIVED' | 'REJECTED'
  views: number
  createdAt: Date
}

async function getItems(searchParams: SearchParams) {
  const page = parseInt(searchParams.page || '1', 10)
  const skip = (page - 1) * PAGE_SIZE

  const where: Record<string, unknown> = {
    status: { in: ['APPROVED', 'CLAIMED'] },
  }

  if (searchParams.q) {
    where.OR = [
      { title: { contains: searchParams.q, mode: 'insensitive' } },
      { description: { contains: searchParams.q, mode: 'insensitive' } },
    ]
  }

  if (searchParams.category) {
    where.category = searchParams.category
  }

  if (searchParams.location) {
    where.foundLocation = searchParams.location
  }

  let orderBy: Record<string, string> = { createdAt: 'desc' }
  if (searchParams.sort === 'oldest') {
    orderBy = { createdAt: 'asc' }
  } else if (searchParams.sort === 'views') {
    orderBy = { views: 'desc' }
  }

  try {
    const [items, total] = await Promise.all([
      prisma.item.findMany({
        where,
        orderBy,
        skip,
        take: PAGE_SIZE,
      }),
      prisma.item.count({ where }),
    ])

    return {
      items,
      total,
      page,
      totalPages: Math.ceil(total / PAGE_SIZE),
    }
  } catch {
    return {
      items: [],
      total: 0,
      page: 1,
      totalPages: 0,
    }
  }
}

function ItemsLoading() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {[...Array(8)].map((_, i) => (
        <div key={i} className="glass-card overflow-hidden animate-pulse">
          <div className="aspect-[4/3] bg-[#ECF39E]/30" />
          <div className="p-4">
            <div className="h-6 bg-[#ECF39E]/30 rounded mb-3" />
            <div className="h-4 bg-[#ECF39E]/30 rounded mb-2" />
            <div className="h-4 bg-[#ECF39E]/30 rounded w-2/3" />
          </div>
        </div>
      ))}
    </div>
  )
}

async function ItemsGrid({ searchParams }: { searchParams: SearchParams }) {
  const { items, total, page, totalPages } = await getItems(searchParams)

  if (items.length === 0) {
    return (
      <div className="glass-card p-12 text-center">
        <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-[#ECF39E]/50 flex items-center justify-center">
          <Package className="w-10 h-10 text-[#132A13]/30" aria-hidden="true" />
        </div>
        <h3 className="text-xl font-semibold text-[#132A13] mb-2">No items found</h3>
        <p className="text-[#132A13]/60">
          {searchParams.q || searchParams.category || searchParams.location
            ? 'Try adjusting your search filters'
            : 'No items have been reported yet'}
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {items.map((item: ItemType) => (
          <ItemCard key={item.id} item={item} />
        ))}
      </div>

      <Pagination currentPage={page} totalPages={totalPages} totalItems={total} />
    </div>
  )
}

export default async function ItemsPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>
}) {
  const params = await searchParams

  return (
    <div className="min-h-screen py-12 px-4 bg-[#f8faf5]">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-[#132A13] mb-4">
            Browse Found Items
          </h1>
          <p className="text-[#132A13]/70">
            Search through reported items to find what you&apos;ve lost
          </p>
        </div>

        <div className="mb-8">
          <Suspense fallback={<div className="glass-card p-6 animate-pulse h-20" />}>
            <ItemFilters />
          </Suspense>
        </div>

        <Suspense fallback={<ItemsLoading />}>
          <ItemsGrid searchParams={params} />
        </Suspense>
      </div>
    </div>
  )
}
