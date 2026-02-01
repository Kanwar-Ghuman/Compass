import { 
  Clock, 
  CheckCircle, 
  XCircle, 
  Archive, 
  Eye,
  MessageSquare,
  ThumbsUp,
  ThumbsDown,
  CheckCheck
} from 'lucide-react'

type ItemStatus = 'PENDING' | 'APPROVED' | 'CLAIMED' | 'ARCHIVED' | 'REJECTED'
type ClaimStatus = 'SUBMITTED' | 'IN_REVIEW' | 'VERIFIED' | 'DENIED' | 'RESOLVED'

interface StatusBadgeProps {
  status: ItemStatus | ClaimStatus
  type?: 'item' | 'claim'
  size?: 'sm' | 'md' | 'lg'
}

const itemStatusConfig: Record<ItemStatus, { label: string; icon: typeof Clock; colors: string }> = {
  PENDING: { 
    label: 'Pending Review', 
    icon: Clock, 
    colors: 'bg-amber-100 text-amber-700 border-amber-200' 
  },
  APPROVED: { 
    label: 'Available', 
    icon: CheckCircle, 
    colors: 'bg-[#ECF39E] text-[#132A13] border-[#90A955]' 
  },
  CLAIMED: { 
    label: 'Claimed', 
    icon: CheckCheck, 
    colors: 'bg-[#90A955]/20 text-[#31572C] border-[#90A955]' 
  },
  ARCHIVED: { 
    label: 'Archived', 
    icon: Archive, 
    colors: 'bg-gray-100 text-gray-600 border-gray-200' 
  },
  REJECTED: { 
    label: 'Rejected', 
    icon: XCircle, 
    colors: 'bg-red-100 text-red-700 border-red-200' 
  },
}

const claimStatusConfig: Record<ClaimStatus, { label: string; icon: typeof Clock; colors: string }> = {
  SUBMITTED: { 
    label: 'Submitted', 
    icon: MessageSquare, 
    colors: 'bg-amber-100 text-amber-700 border-amber-200' 
  },
  IN_REVIEW: { 
    label: 'In Review', 
    icon: Eye, 
    colors: 'bg-blue-100 text-blue-700 border-blue-200' 
  },
  VERIFIED: { 
    label: 'Verified', 
    icon: ThumbsUp, 
    colors: 'bg-[#ECF39E] text-[#132A13] border-[#90A955]' 
  },
  DENIED: { 
    label: 'Denied', 
    icon: ThumbsDown, 
    colors: 'bg-red-100 text-red-700 border-red-200' 
  },
  RESOLVED: { 
    label: 'Resolved', 
    icon: CheckCheck, 
    colors: 'bg-gray-100 text-gray-600 border-gray-200' 
  },
}

const sizeClasses = {
  sm: 'px-2 py-1 text-xs gap-1',
  md: 'px-3 py-1.5 text-sm gap-1.5',
  lg: 'px-4 py-2 text-base gap-2',
}

const iconSizes = {
  sm: 'w-3 h-3',
  md: 'w-4 h-4',
  lg: 'w-5 h-5',
}

export function StatusBadge({ status, type = 'item', size = 'md' }: StatusBadgeProps) {
  const config = type === 'item' 
    ? itemStatusConfig[status as ItemStatus] 
    : claimStatusConfig[status as ClaimStatus]
  
  if (!config) return null

  const Icon = config.icon

  return (
    <span 
      className={`inline-flex items-center font-medium rounded-full border ${config.colors} ${sizeClasses[size]}`}
      role="status"
    >
      <Icon className={iconSizes[size]} aria-hidden="true" />
      <span>{config.label}</span>
    </span>
  )
}
