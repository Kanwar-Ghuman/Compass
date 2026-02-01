import Link from 'next/link'
import Image from 'next/image'
import { MapPin, Calendar, Eye, Tag } from 'lucide-react'
import { StatusBadge } from './StatusBadge'
import { CATEGORIES, LOCATIONS } from '@/lib/constants'

interface ItemCardProps {
  item: {
    id: string
    title: string
    category: string
    description: string
    foundLocation: string
    foundAt: Date | string
    imageUrl: string
    status: 'PENDING' | 'APPROVED' | 'CLAIMED' | 'ARCHIVED' | 'REJECTED'
    views: number
  }
}

export function ItemCard({ item }: ItemCardProps) {
  const category = CATEGORIES.find(c => c.value === item.category)
  const location = LOCATIONS.find(l => l.value === item.foundLocation)
  const foundDate = new Date(item.foundAt)

  return (
    <Link href={`/items/${item.id}`} className="block group">
      <article className="glass-card overflow-hidden h-full">
        <div className="relative aspect-[4/3] bg-[#f8faf5]">
          <Image
            src={item.imageUrl}
            alt={`Photo of found item: ${item.title}`}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
          <div className="absolute top-3 right-3">
            <StatusBadge status={item.status} size="sm" />
          </div>
        </div>

        <div className="p-4 space-y-3">
          <h3 className="font-semibold text-lg text-[#132A13] group-hover:text-[#4F772D] transition-colors line-clamp-1">
            {item.title}
          </h3>

          <p className="text-[#132A13]/60 text-sm line-clamp-2">
            {item.description}
          </p>

          <div className="flex flex-wrap gap-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#ECF39E]/50 text-[#132A13] text-xs font-medium">
              <Tag className="w-3 h-3" aria-hidden="true" />
              {category?.label || item.category}
            </span>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#90A955]/20 text-[#31572C] text-xs font-medium">
              <MapPin className="w-3 h-3" aria-hidden="true" />
              {location?.label || item.foundLocation}
            </span>
          </div>

          <div className="flex items-center justify-between text-xs text-[#132A13]/50 pt-3 border-t border-[#4F772D]/10">
            <span className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5" aria-hidden="true" />
              {foundDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
            </span>
            <span className="flex items-center gap-1.5">
              <Eye className="w-3.5 h-3.5" aria-hidden="true" />
              {item.views} views
            </span>
          </div>
        </div>
      </article>
    </Link>
  )
}
