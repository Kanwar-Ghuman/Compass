'use client'

import { useState } from 'react'
import Image from 'next/image'
import { 
  Upload, 
  X, 
  Camera, 
  Loader2,
  AlertCircle
} from 'lucide-react'
import { CATEGORIES, LOCATIONS } from '@/lib/constants'
import { itemFormSchema, validateFile } from '@/lib/validators'
import { FormError } from '@/components/FormError'
import { SuccessMessage } from '@/components/SuccessMessage'

interface ReportFormProps {
  userEmail: string
  userName: string
}

export function ReportForm({ userEmail, userName }: ReportFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [imageFile, setImageFile] = useState<File | null>(null)

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const fileErrors = validateFile(file)
    if (fileErrors.length > 0) {
      setErrors(prev => ({ ...prev, image: fileErrors.join(' ') }))
      return
    }

    setErrors(prev => ({ ...prev, image: '' }))
    setImageFile(file)
    const reader = new FileReader()
    reader.onload = (e) => {
      setImagePreview(e.target?.result as string)
    }
    reader.readAsDataURL(file)
  }

  const removeImage = () => {
    setImagePreview(null)
    setImageFile(null)
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)
    setErrors({})

    const formData = new FormData(e.currentTarget)
    
    if (!imageFile) {
      setErrors({ image: 'Please upload a photo of the item' })
      setIsSubmitting(false)
      return
    }

    const data = {
      title: formData.get('title') as string,
      category: formData.get('category') as string,
      description: formData.get('description') as string,
      foundLocation: formData.get('foundLocation') as string,
      foundAt: formData.get('foundAt') as string,
      reporterName: userName,
      reporterEmail: userEmail,
      reporterPhone: formData.get('reporterPhone') as string,
    }

    const validation = itemFormSchema.safeParse(data)
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
      const uploadFormData = new FormData()
      uploadFormData.append('image', imageFile)
      Object.entries(data).forEach(([key, value]) => {
        uploadFormData.append(key, value)
      })

      const response = await fetch('/api/items', {
        method: 'POST',
        body: uploadFormData,
      })

      const result = await response.json()

      if (!response.ok) {
        setErrors({ submit: result.error || 'Failed to submit item' })
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
        title="Item Submitted!"
        message="Thank you for reporting this found item. Our admin team will review it shortly and make it visible to the community once approved."
        actions={[
          { label: 'Submit Another', href: '/report', primary: true },
          { label: 'Browse Items', href: '/items' },
        ]}
      />
    )
  }

  return (
    <form onSubmit={handleSubmit} className="glass-card p-6 md:p-8 space-y-6">
      <div>
        <label className="block text-sm font-medium text-[#132A13] mb-3">
          Photo of Item <span className="text-red-500">*</span>
        </label>
        {imagePreview ? (
          <div className="relative aspect-video rounded-xl overflow-hidden bg-[#f8faf5] border border-[#4F772D]/10">
            <Image
              src={imagePreview}
              alt="Preview of uploaded item"
              fill
              className="object-contain"
            />
            <button
              type="button"
              onClick={removeImage}
              className="absolute top-3 right-3 p-2 rounded-full bg-white/90 hover:bg-white shadow-sm transition-colors"
              aria-label="Remove image"
            >
              <X className="w-5 h-5 text-[#132A13]" />
            </button>
          </div>
        ) : (
          <label className="block cursor-pointer">
            <div className="border-2 border-dashed border-[#4F772D]/30 rounded-xl p-8 text-center hover:border-[#4F772D] transition-colors bg-[#f8faf5]">
              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-[#ECF39E] flex items-center justify-center">
                <Camera className="w-8 h-8 text-[#132A13]" aria-hidden="true" />
              </div>
              <p className="text-[#132A13] font-medium mb-2">Click to upload a photo</p>
              <p className="text-[#132A13]/50 text-sm">JPG, PNG, or WebP (max 5MB)</p>
            </div>
            <input
              type="file"
              accept="image/jpeg,image/jpg,image/png,image/webp"
              onChange={handleImageChange}
              className="sr-only"
              aria-describedby={errors.image ? 'image-error' : undefined}
            />
          </label>
        )}
        <FormError message={errors.image} id="image-error" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-[#132A13] mb-2">
            Item Title <span className="text-red-500">*</span>
          </label>
          <input
            id="title"
            name="title"
            type="text"
            placeholder="e.g., Blue iPhone 15 Pro"
            className="w-full px-4 py-3 glass-input"
            aria-describedby={errors.title ? 'title-error' : undefined}
          />
          <FormError message={errors.title} id="title-error" />
        </div>

        <div>
          <label htmlFor="category" className="block text-sm font-medium text-[#132A13] mb-2">
            Category <span className="text-red-500">*</span>
          </label>
          <select
            id="category"
            name="category"
            className="w-full px-4 py-3 glass-input"
            aria-describedby={errors.category ? 'category-error' : undefined}
          >
            <option value="">Select category</option>
            {CATEGORIES.map((cat) => (
              <option key={cat.value} value={cat.value}>
                {cat.label}
              </option>
            ))}
          </select>
          <FormError message={errors.category} id="category-error" />
        </div>
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-[#132A13] mb-2">
          Description <span className="text-red-500">*</span>
        </label>
        <textarea
          id="description"
          name="description"
          rows={4}
          placeholder="Describe the item in detail (color, brand, distinguishing features, etc.)"
          className="w-full px-4 py-3 glass-input resize-none"
          aria-describedby={errors.description ? 'description-error' : undefined}
        />
        <FormError message={errors.description} id="description-error" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="foundLocation" className="block text-sm font-medium text-[#132A13] mb-2">
            Found Location <span className="text-red-500">*</span>
          </label>
          <select
            id="foundLocation"
            name="foundLocation"
            className="w-full px-4 py-3 glass-input"
            aria-describedby={errors.foundLocation ? 'location-error' : undefined}
          >
            <option value="">Select location</option>
            {LOCATIONS.map((loc) => (
              <option key={loc.value} value={loc.value}>
                {loc.label}
              </option>
            ))}
          </select>
          <FormError message={errors.foundLocation} id="location-error" />
        </div>

        <div>
          <label htmlFor="foundAt" className="block text-sm font-medium text-[#132A13] mb-2">
            Date & Time Found <span className="text-red-500">*</span>
          </label>
          <input
            id="foundAt"
            name="foundAt"
            type="datetime-local"
            className="w-full px-4 py-3 glass-input"
            aria-describedby={errors.foundAt ? 'date-error' : undefined}
          />
          <FormError message={errors.foundAt} id="date-error" />
        </div>
      </div>

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
          <label htmlFor="reporterPhone" className="block text-sm font-medium text-[#132A13] mb-2">
            Phone Number <span className="text-[#132A13]/50">(optional)</span>
          </label>
          <input
            id="reporterPhone"
            name="reporterPhone"
            type="tel"
            placeholder="Optional"
            className="w-full px-4 py-3 glass-input"
          />
        </div>
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
        disabled={isSubmitting}
        className="w-full glass-button py-4 text-lg flex items-center justify-center gap-3"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" aria-hidden="true" />
            Submitting...
          </>
        ) : (
          <>
            <Upload className="w-5 h-5" aria-hidden="true" />
            Submit Found Item
          </>
        )}
      </button>
    </form>
  )
}
