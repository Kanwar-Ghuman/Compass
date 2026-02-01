import { z } from 'zod'
import { ALLOWED_FILE_TYPES, MAX_FILE_SIZE } from './constants'

export const itemFormSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters').max(60, 'Title must be less than 60 characters'),
  category: z.enum(['ELECTRONICS', 'CLOTHING', 'JEWELRY', 'BOOKS', 'ID_WALLET', 'KEYS', 'OTHER']),
  description: z.string().min(10, 'Description must be at least 10 characters').max(500, 'Description must be less than 500 characters'),
  foundLocation: z.enum(['CAFETERIA', 'GYM', 'LIBRARY', 'HALLWAY', 'PARKING_LOT', 'CLASSROOM', 'OFFICE', 'OTHER']),
  foundAt: z.string().refine((date) => {
    const parsed = new Date(date)
    return !isNaN(parsed.getTime())
  }, 'Please enter a valid date'),
  reporterName: z.string().optional(),
  reporterEmail: z.string().email('Please enter a valid email address'),
  reporterPhone: z.string().optional(),
})

export const claimFormSchema = z.object({
  claimType: z.enum(['CLAIM', 'INQUIRY']),
  itemId: z.string().optional(),
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Please enter a valid email address'),
  proofDetails: z.string().optional(),
  message: z.string().optional(),
}).refine((data) => {
  if (data.claimType === 'CLAIM') {
    return data.proofDetails && data.proofDetails.length >= 10
  }
  return true
}, {
  message: 'Proof details are required for claims (minimum 10 characters)',
  path: ['proofDetails'],
}).refine((data) => {
  if (data.claimType === 'CLAIM') {
    return !!data.itemId
  }
  return true
}, {
  message: 'Please select an item to claim',
  path: ['itemId'],
})

export const validateFile = (file: File) => {
  const errors: string[] = []
  
  if (!ALLOWED_FILE_TYPES.includes(file.type)) {
    errors.push('File type not allowed. Please upload a JPG, PNG, or WebP image.')
  }
  
  if (file.size > MAX_FILE_SIZE) {
    errors.push('File size must be less than 5MB.')
  }
  
  return errors
}

export type ItemFormData = z.infer<typeof itemFormSchema>
export type ClaimFormData = z.infer<typeof claimFormSchema>
