'use client'

import { useState, useEffect } from 'react'
import { 
  MessageSquare, 
  Package,
  Loader2,
  AlertCircle,
  ChevronDown
} from 'lucide-react'
import { claimFormSchema } from '@/lib/validators'
import { FormError } from '@/components/FormError'
import { SuccessMessage } from '@/components/SuccessMessage'

interface ClaimFormProps {
  userEmail: string
  userName: string
  defaultItemId?: string
  defaultType?: 'CLAIM' | 'INQUIRY'
}

interface ItemOption {
  id: string
  title: string
  category: string
}

export function ClaimForm({ userEmail, userName, defaultItemId, defaultType }: ClaimFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [claimType, setClaimType] = useState<'CLAIM' | 'INQUIRY'>(defaultType || 'CLAIM')
  const [items, setItems] = useState<ItemOption[]>([])
  const [loadingItems, setLoadingItems] = useState(true)
  const [selectedItemId, setSelectedItemId] = useState(defaultItemId || '')

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const res = await fetch('/api/items?status=APPROVED&limit=100')
        const data = await res.json()
        setItems(data.items?.map((item: { id: string; title: string; category: string }) => ({
          id: item.id,
          title: item.title,
          category: item.category,
        })) || [])
      } catch (error) {
        console.error('Failed to fetch items:', error)
      } finally {
        setLoadingItems(false)
      }
    }
    fetchItems()
  }, [])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)
    setErrors({})

    const formData = new FormData(e.currentTarget)
    const data = {
      itemId: selectedItemId || undefined,
      claimType,
      name: userName,
      email: userEmail,
      phone: formData.get('phone') as string || undefined,
      proofDetails: formData.get('proofDetails') as string || undefined,
      message: formData.get('message') as string || undefined,
    }

    const validation = claimFormSchema.safeParse(data)
    if (!validation.success) {
      const fieldErrors: Record<string, string> = {}
      validation.error.issues.forEach((issue) => {
        if (issue.path[0]) {
          fieldErrors[issue.path[0].toString()] = issue.message
        }
      })
      setErrors(fieldErrors)
      setIsSubmitting(false)
      return
    }

    try {
      const response = await fetch('/api/claims', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      const result = await response.json()

      if (!response.ok) {
        setErrors({ submit: result.error || 'Failed to submit claim' })
        setIsSubmitting(false)
        return
      }

      setIsSuccess(true)
    } catch {
      setErrors({ submit: 'An unexpected error occurred. Please try again.' })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isSuccess) {
    return (
      <SuccessMessage
        title={claimType === 'CLAIM' ? 'Claim Submitted!' : 'Inquiry Sent!'}
        message={
          claimType === 'CLAIM'
            ? 'Thank you for submitting your claim. Our admin team will review your proof of ownership and contact you soon.'
            : 'Thank you for your inquiry. Our team will get back to you as soon as possible.'
        }
        actions={[
          { label: 'Browse Items', href: '/items', primary: true },
          { label: 'Go Home', href: '/' },
        ]}
      />
    )
  }

  return (
    <form onSubmit={handleSubmit} className="glass-card p-6 md:p-8 space-y-6">
      <div className="flex gap-4 mb-6">
        <button
          type="button"
          onClick={() => setClaimType('CLAIM')}
          className={`flex-1 py-4 px-6 rounded-xl font-medium transition-all flex items-center justify-center gap-3 ${
            claimType === 'CLAIM'
              ? 'bg-[#4F772D] text-white'
              : 'border-2 border-[#4F772D]/30 text-[#132A13] hover:border-[#4F772D]'
          }`}
        >
          <Package className="w-5 h-5" aria-hidden="true" />
          Claim an Item
        </button>
        <button
          type="button"
          onClick={() => setClaimType('INQUIRY')}
          className={`flex-1 py-4 px-6 rounded-xl font-medium transition-all flex items-center justify-center gap-3 ${
            claimType === 'INQUIRY'
              ? 'bg-[#4F772D] text-white'
              : 'border-2 border-[#4F772D]/30 text-[#132A13] hover:border-[#4F772D]'
          }`}
        >
          <MessageSquare className="w-5 h-5" aria-hidden="true" />
          General Inquiry
        </button>
      </div>

      {claimType === 'CLAIM' && (
        <div>
          <label htmlFor="itemId" className="block text-sm font-medium text-[#132A13] mb-2">
            Select Item <span className="text-red-500">*</span>
          </label>
          {loadingItems ? (
            <div className="flex items-center gap-2 text-[#132A13]/60">
              <Loader2 className="w-4 h-4 animate-spin" />
              Loading items...
            </div>
          ) : items.length === 0 ? (
            <p className="text-[#132A13]/60">No items available to claim at this time.</p>
          ) : (
            <div className="relative">
              <select
                id="itemId"
                value={selectedItemId}
                onChange={(e) => setSelectedItemId(e.target.value)}
                className="w-full px-4 py-3 glass-input"
                aria-describedby={errors.itemId ? 'item-error' : undefined}
              >
                <option value="">Select an item to claim</option>
                {items.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.title} ({item.category})
                  </option>
                ))}
              </select>
            </div>
          )}
          <FormError message={errors.itemId} id="item-error" />
        </div>
      )}

      <div className="border-t border-[#4F772D]/10 pt-6">
        <h3 className="text-lg font-medium text-[#132A13] mb-4">Your Contact Information</h3>
        <p className="text-[#132A13]/50 text-sm mb-4">
          This information is kept private and only visible to administrators.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-[#132A13] mb-2">
              Your Name
            </label>
            <div className="px-4 py-3 glass-input bg-[#f8faf5] text-[#132A13]/70">
              {userName || 'Not provided'}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-[#132A13] mb-2">
              Email Address
            </label>
            <div className="px-4 py-3 glass-input bg-[#f8faf5] text-[#132A13]/70">
              {userEmail}
            </div>
          </div>
        </div>

        <div className="mt-6">
          <label htmlFor="phone" className="block text-sm font-medium text-[#132A13] mb-2">
            Phone Number <span className="text-[#132A13]/50">(optional)</span>
          </label>
          <input
            id="phone"
            name="phone"
            type="tel"
            placeholder="Optional"
            className="w-full px-4 py-3 glass-input"
          />
        </div>
      </div>

      {claimType === 'CLAIM' && (
        <div>
          <label htmlFor="proofDetails" className="block text-sm font-medium text-[#132A13] mb-2">
            Proof of Ownership <span className="text-red-500">*</span>
          </label>
          <textarea
            id="proofDetails"
            name="proofDetails"
            rows={4}
            placeholder="Describe how you can prove this item belongs to you (e.g., unique identifying features, serial numbers, when/where you lost it, etc.)"
            className="w-full px-4 py-3 glass-input resize-none"
            aria-describedby={errors.proofDetails ? 'proof-error' : undefined}
          />
          <FormError message={errors.proofDetails} id="proof-error" />
        </div>
      )}

      <div>
        <label htmlFor="message" className="block text-sm font-medium text-[#132A13] mb-2">
          {claimType === 'CLAIM' ? 'Additional Notes' : 'Your Message'}{' '}
          {claimType === 'INQUIRY' && <span className="text-red-500">*</span>}
        </label>
        <textarea
          id="message"
          name="message"
          rows={4}
          placeholder={
            claimType === 'CLAIM'
              ? 'Any additional information you want to share...'
              : 'What would you like to know? Ask us anything about the lost and found system...'
          }
          className="w-full px-4 py-3 glass-input resize-none"
          aria-describedby={errors.message ? 'message-error' : undefined}
        />
        <FormError message={errors.message} id="message-error" />
      </div>

      {errors.submit && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-200">
          <div className="flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-red-600" aria-hidden="true" />
            <p className="text-red-700">{errors.submit}</p>
          </div>
        </div>
      )}

      <button
        type="submit"
        disabled={isSubmitting || (claimType === 'CLAIM' && items.length === 0)}
        className="w-full glass-button py-4 text-lg flex items-center justify-center gap-3"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" aria-hidden="true" />
            Submitting...
          </>
        ) : (
          <>
            {claimType === 'CLAIM' ? (
              <Package className="w-5 h-5" aria-hidden="true" />
            ) : (
              <MessageSquare className="w-5 h-5" aria-hidden="true" />
            )}
            {claimType === 'CLAIM' ? 'Submit Claim' : 'Send Inquiry'}
          </>
        )}
      </button>
    </form>
  )
}
