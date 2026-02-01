import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { 
  MapPin, 
  Calendar, 
  Tag, 
  Eye, 
  Clock,
  MessageSquare,
  ArrowLeft,
  Share2
} from 'lucide-react'
import prisma from '@/lib/db'
import { StatusBadge } from '@/components/StatusBadge'
import { CATEGORIES, LOCATIONS } from '@/lib/constants'

async function getItem(id: string) {
  try {
    const item = await prisma.item.findUnique({
      where: { id },
    })

    if (!item || !['APPROVED', 'CLAIMED'].includes(item.status)) {
      return null
    }

    await prisma.item.update({
      where: { id },
      data: { views: { increment: 1 } },
    })

    return item
  } catch {
    return null
  }
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const item = await getItem(id)
  
  if (!item) {
    return { title: 'Item Not Found' }
  }

  return {
    title: `${item.title} | Compass`,
    description: item.description,
  }
}

export default async function ItemDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const item = await getItem(id)

  if (!item) {
    notFound()
  }

  const category = CATEGORIES.find(c => c.value === item.category)
  const location = LOCATIONS.find(l => l.value === item.foundLocation)
  const foundDate = new Date(item.foundAt)
  const createdDate = new Date(item.createdAt)

  return (
    <div className="min-h-screen py-12 px-4 bg-[#f8faf5]">
      <div className="max-w-5xl mx-auto">
        <Link 
          href="/items" 
          className="inline-flex items-center gap-2 text-[#132A13]/60 hover:text-[#4F772D] transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" aria-hidden="true" />
          Back to all items
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="glass-card p-4">
            <div className="relative aspect-square rounded-xl overflow-hidden bg-white">
              <Image
                src={item.imageUrl}
                alt={`Photo of found item: ${item.title}`}
                fill
                className="object-contain"
                priority
              />
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <div className="flex items-start justify-between gap-4 mb-4">
                <StatusBadge status={item.status} size="lg" />
                <button
                  type="button"
                  className="p-2 rounded-lg border border-[#4F772D]/20 hover:bg-[#ECF39E]/20 transition-colors"
                  aria-label="Share item"
                >
                  <Share2 className="w-5 h-5 text-[#132A13]" aria-hidden="true" />
                </button>
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-[#132A13] mb-4">
                {item.title}
              </h1>
              <p className="text-[#132A13]/70 text-lg">
                {item.description}
              </p>
            </div>

            <div className="glass-card p-6 space-y-4">
              <h2 className="text-lg font-semibold text-[#132A13]">Item Details</h2>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#ECF39E] flex items-center justify-center">
                    <Tag className="w-5 h-5 text-[#132A13]" aria-hidden="true" />
                  </div>
                  <div>
                    <p className="text-[#132A13]/50 text-sm">Category</p>
                    <p className="text-[#132A13] font-medium">{category?.label || item.category}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#90A955]/30 flex items-center justify-center">
                    <MapPin className="w-5 h-5 text-[#31572C]" aria-hidden="true" />
                  </div>
                  <div>
                    <p className="text-[#132A13]/50 text-sm">Found At</p>
                    <p className="text-[#132A13] font-medium">{location?.label || item.foundLocation}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#ECF39E] flex items-center justify-center">
                    <Calendar className="w-5 h-5 text-[#132A13]" aria-hidden="true" />
                  </div>
                  <div>
                    <p className="text-[#132A13]/50 text-sm">Date Found</p>
                    <p className="text-[#132A13] font-medium">
                      {foundDate.toLocaleDateString('en-US', { 
                        month: 'long', 
                        day: 'numeric', 
                        year: 'numeric' 
                      })}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#90A955]/30 flex items-center justify-center">
                    <Eye className="w-5 h-5 text-[#31572C]" aria-hidden="true" />
                  </div>
                  <div>
                    <p className="text-[#132A13]/50 text-sm">Views</p>
                    <p className="text-[#132A13] font-medium">{item.views}</p>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-[#4F772D]/10 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#ECF39E] flex items-center justify-center">
                  <Clock className="w-5 h-5 text-[#132A13]" aria-hidden="true" />
                </div>
                <div>
                  <p className="text-[#132A13]/50 text-sm">Listed On</p>
                  <p className="text-[#132A13] font-medium">
                    {createdDate.toLocaleDateString('en-US', { 
                      month: 'long', 
                      day: 'numeric', 
                      year: 'numeric',
                      hour: 'numeric',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
              </div>
            </div>

            {item.status === 'APPROVED' && (
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href={`/claim?itemId=${item.id}`}
                  className="flex-1 glass-button py-4 text-lg flex items-center justify-center gap-3"
                >
                  <MessageSquare className="w-5 h-5" aria-hidden="true" />
                  Claim This Item
                </Link>
                <Link
                  href={`/claim?itemId=${item.id}&type=inquiry`}
                  className="flex-1 glass-button-secondary py-4 text-lg flex items-center justify-center gap-3"
                >
                  Ask a Question
                </Link>
              </div>
            )}

            {item.status === 'CLAIMED' && (
              <div className="glass-card p-6 bg-[#ECF39E]/30 border-[#90A955]">
                <p className="text-[#31572C] text-center font-medium">
                  This item has already been claimed and returned to its owner.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
