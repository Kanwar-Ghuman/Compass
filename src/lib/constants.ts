export const CATEGORIES = [
  { value: 'ELECTRONICS', label: 'Electronics', icon: 'smartphone' },
  { value: 'CLOTHING', label: 'Clothing', icon: 'shirt' },
  { value: 'JEWELRY', label: 'Jewelry', icon: 'gem' },
  { value: 'BOOKS', label: 'Books', icon: 'book-open' },
  { value: 'ID_WALLET', label: 'ID/Wallet', icon: 'wallet' },
  { value: 'KEYS', label: 'Keys', icon: 'key' },
  { value: 'OTHER', label: 'Other', icon: 'package' },
] as const

export const LOCATIONS = [
  { value: 'CAFETERIA', label: 'Cafeteria', icon: 'utensils' },
  { value: 'GYM', label: 'Gym', icon: 'dumbbell' },
  { value: 'LIBRARY', label: 'Library', icon: 'library' },
  { value: 'HALLWAY', label: 'Hallway', icon: 'door-open' },
  { value: 'PARKING_LOT', label: 'Parking Lot', icon: 'car' },
  { value: 'CLASSROOM', label: 'Classroom', icon: 'graduation-cap' },
  { value: 'OFFICE', label: 'Office', icon: 'briefcase' },
  { value: 'OTHER', label: 'Other', icon: 'map-pin' },
] as const

export const ITEM_STATUSES = [
  { value: 'PENDING', label: 'Pending Review', color: 'yellow' },
  { value: 'APPROVED', label: 'Available', color: 'green' },
  { value: 'CLAIMED', label: 'Claimed', color: 'blue' },
  { value: 'ARCHIVED', label: 'Archived', color: 'gray' },
  { value: 'REJECTED', label: 'Rejected', color: 'red' },
] as const

export const CLAIM_STATUSES = [
  { value: 'SUBMITTED', label: 'Submitted', color: 'yellow' },
  { value: 'IN_REVIEW', label: 'In Review', color: 'blue' },
  { value: 'VERIFIED', label: 'Verified', color: 'green' },
  { value: 'DENIED', label: 'Denied', color: 'red' },
  { value: 'RESOLVED', label: 'Resolved', color: 'gray' },
] as const

export const MAX_FILE_SIZE = 5 * 1024 * 1024

export const ALLOWED_FILE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
