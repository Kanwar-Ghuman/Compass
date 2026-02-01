'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { 
  Package, 
  MessageSquare, 
  BarChart3,
  Clock,
  CheckCircle,
  XCircle,
  Eye,
  Loader2,
  LogOut,
  RefreshCw,
  Archive,
  AlertCircle
} from 'lucide-react'
import { StatusBadge } from '@/components/StatusBadge'
import { CATEGORIES, LOCATIONS } from '@/lib/constants'

type Tab = 'pending' | 'approved' | 'claims' | 'analytics'

interface User {
  id: string
  displayName?: string | null
  primaryEmail?: string | null
}

interface Item {
  id: string
  title: string
  category: string
  description: string
  foundLocation: string
  foundAt: string
  imageUrl: string
  status: string
  reporterName?: string | null
  reporterEmail: string
  reporterPhone?: string | null
  adminNotes?: string | null
  rejectionReason?: string | null
  views: number
  createdAt: string
  claims?: Claim[]
}

interface Claim {
  id: string
  itemId?: string | null
  claimType: string
  name: string
  email: string
  proofDetails?: string | null
  message?: string | null
  status: string
  adminNotes?: string | null
  createdAt: string
  item?: {
    id: string
    title: string
    imageUrl: string
    status: string
  } | null
}

interface AdminDashboardProps {
  user: User
}

export function AdminDashboard({ user }: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState<Tab>('pending')
  const [items, setItems] = useState<Item[]>([])
  const [claims, setClaims] = useState<Claim[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedItem, setSelectedItem] = useState<Item | null>(null)
  const [selectedClaim, setSelectedClaim] = useState<Claim | null>(null)
  const [actionLoading, setActionLoading] = useState<string | null>(null)
  const [stats, setStats] = useState({
    pending: 0,
    approved: 0,
    claimed: 0,
    totalClaims: 0,
  })

  const fetchData = async () => {
    setLoading(true)
    try {
      const [pendingRes, approvedRes, claimsRes] = await Promise.all([
        fetch('/api/items?status=PENDING&limit=100'),
        fetch('/api/items?status=APPROVED&limit=100'),
        fetch('/api/claims?limit=100'),
      ])

      const pendingData = await pendingRes.json()
      const approvedData = await approvedRes.json()
      const claimsData = await claimsRes.json()

      if (activeTab === 'pending') {
        setItems(pendingData.items || [])
      } else if (activeTab === 'approved') {
        setItems(approvedData.items || [])
      }

      setClaims(claimsData.claims || [])

      setStats({
        pending: pendingData.total || 0,
        approved: approvedData.total || 0,
        claimed: 0,
        totalClaims: claimsData.total || 0,
      })
    } catch (error) {
      console.error('Failed to fetch data:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [activeTab])

  const handleApprove = async (itemId: string) => {
    setActionLoading(itemId)
    try {
      await fetch(`/api/items/${itemId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          status: 'APPROVED',
          approvedBy: user.displayName || user.primaryEmail || 'admin'
        }),
      })
      await fetchData()
      setSelectedItem(null)
    } catch (error) {
      console.error('Failed to approve item:', error)
    } finally {
      setActionLoading(null)
    }
  }

  const handleReject = async (itemId: string, reason: string) => {
    setActionLoading(itemId)
    try {
      await fetch(`/api/items/${itemId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          status: 'REJECTED',
          rejectionReason: reason
        }),
      })
      await fetchData()
      setSelectedItem(null)
    } catch (error) {
      console.error('Failed to reject item:', error)
    } finally {
      setActionLoading(null)
    }
  }

  const handleMarkClaimed = async (itemId: string) => {
    setActionLoading(itemId)
    try {
      await fetch(`/api/items/${itemId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'CLAIMED' }),
      })
      await fetchData()
      setSelectedItem(null)
    } catch (error) {
      console.error('Failed to mark as claimed:', error)
    } finally {
      setActionLoading(null)
    }
  }

  const handleArchive = async (itemId: string) => {
    setActionLoading(itemId)
    try {
      await fetch(`/api/items/${itemId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'ARCHIVED' }),
      })
      await fetchData()
      setSelectedItem(null)
    } catch (error) {
      console.error('Failed to archive item:', error)
    } finally {
      setActionLoading(null)
    }
  }

  const handleUpdateClaimStatus = async (claimId: string, status: string) => {
    setActionLoading(claimId)
    try {
      await fetch(`/api/claims/${claimId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      })
      await fetchData()
      setSelectedClaim(null)
    } catch (error) {
      console.error('Failed to update claim:', error)
    } finally {
      setActionLoading(null)
    }
  }

  const tabs = [
    { id: 'pending' as Tab, label: 'Pending Items', icon: Clock, count: stats.pending },
    { id: 'approved' as Tab, label: 'Approved Items', icon: CheckCircle, count: stats.approved },
    { id: 'claims' as Tab, label: 'Claims', icon: MessageSquare, count: stats.totalClaims },
    { id: 'analytics' as Tab, label: 'Analytics', icon: BarChart3, count: null },
  ]

  return (
    <div className="min-h-screen py-8 px-4 bg-[#f8faf5]">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-[#132A13] mb-2">Admin Dashboard</h1>
            <p className="text-[#132A13]/60">
              Welcome back, {user.displayName || user.primaryEmail || 'Admin'}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={fetchData}
              className="glass-button-secondary px-4 py-2 flex items-center gap-2"
            >
              <RefreshCw className="w-4 h-4" aria-hidden="true" />
              Refresh
            </button>
            <a
              href="/handler/sign-out"
              className="glass-button-secondary px-4 py-2 flex items-center gap-2 text-red-600 border-red-300 hover:bg-red-50 hover:text-red-700"
            >
              <LogOut className="w-4 h-4" aria-hidden="true" />
              Sign Out
            </a>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          {tabs.map((tab) => {
            const Icon = tab.icon
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`glass-card p-4 text-left transition-all ${
                  activeTab === tab.id ? 'ring-2 ring-[#4F772D]' : ''
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <Icon className={`w-5 h-5 ${
                    activeTab === tab.id ? 'text-[#4F772D]' : 'text-[#132A13]/50'
                  }`} aria-hidden="true" />
                  {tab.count !== null && (
                    <span className="text-2xl font-bold text-[#132A13]">{tab.count}</span>
                  )}
                </div>
                <p className={`text-sm ${
                  activeTab === tab.id ? 'text-[#132A13]' : 'text-[#132A13]/60'
                }`}>
                  {tab.label}
                </p>
              </button>
            )
          })}
        </div>

        <div className="glass-card p-6">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-[#4F772D]" />
            </div>
          ) : activeTab === 'analytics' ? (
            <AnalyticsPanel stats={stats} />
          ) : activeTab === 'claims' ? (
            <ClaimsTable
              claims={claims}
              selectedClaim={selectedClaim}
              setSelectedClaim={setSelectedClaim}
              onUpdateStatus={handleUpdateClaimStatus}
              actionLoading={actionLoading}
            />
          ) : (
            <ItemsTable
              items={items}
              selectedItem={selectedItem}
              setSelectedItem={setSelectedItem}
              onApprove={handleApprove}
              onReject={handleReject}
              onMarkClaimed={handleMarkClaimed}
              onArchive={handleArchive}
              actionLoading={actionLoading}
              isPending={activeTab === 'pending'}
            />
          )}
        </div>
      </div>
    </div>
  )
}

function ItemsTable({
  items,
  selectedItem,
  setSelectedItem,
  onApprove,
  onReject,
  onMarkClaimed,
  onArchive,
  actionLoading,
  isPending,
}: {
  items: Item[]
  selectedItem: Item | null
  setSelectedItem: (item: Item | null) => void
  onApprove: (id: string) => void
  onReject: (id: string, reason: string) => void
  onMarkClaimed: (id: string) => void
  onArchive: (id: string) => void
  actionLoading: string | null
  isPending: boolean
}) {
  const [rejectReason, setRejectReason] = useState('')

  if (items.length === 0) {
    return (
      <div className="text-center py-12">
        <Package className="w-12 h-12 text-[#132A13]/30 mx-auto mb-4" aria-hidden="true" />
        <p className="text-[#132A13]/60">No items to display</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-[#4F772D]/10">
              <th className="text-left py-3 px-4 text-[#132A13]/60 font-medium">Item</th>
              <th className="text-left py-3 px-4 text-[#132A13]/60 font-medium">Category</th>
              <th className="text-left py-3 px-4 text-[#132A13]/60 font-medium">Location</th>
              <th className="text-left py-3 px-4 text-[#132A13]/60 font-medium">Date</th>
              <th className="text-left py-3 px-4 text-[#132A13]/60 font-medium">Status</th>
              <th className="text-right py-3 px-4 text-[#132A13]/60 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => {
              const category = CATEGORIES.find(c => c.value === item.category)
              const location = LOCATIONS.find(l => l.value === item.foundLocation)
              return (
                <tr 
                  key={item.id} 
                  className="border-b border-[#4F772D]/5 hover:bg-[#ECF39E]/10 transition-colors"
                >
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-lg overflow-hidden bg-[#f8faf5] flex-shrink-0">
                        <Image
                          src={item.imageUrl}
                          alt={item.title}
                          width={48}
                          height={48}
                          className="object-cover w-full h-full"
                        />
                      </div>
                      <div>
                        <p className="font-medium text-[#132A13]">{item.title}</p>
                        <p className="text-[#132A13]/50 text-sm">{item.reporterEmail}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-[#132A13]/70">{category?.label}</td>
                  <td className="py-3 px-4 text-[#132A13]/70">{location?.label}</td>
                  <td className="py-3 px-4 text-[#132A13]/70">
                    {new Date(item.foundAt).toLocaleDateString()}
                  </td>
                  <td className="py-3 px-4">
                    <StatusBadge status={item.status as 'PENDING' | 'APPROVED' | 'CLAIMED' | 'ARCHIVED' | 'REJECTED'} size="sm" />
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => setSelectedItem(item)}
                        className="p-2 rounded-lg hover:bg-[#ECF39E]/30 transition-colors"
                        aria-label="View details"
                      >
                        <Eye className="w-4 h-4 text-[#132A13]/60" />
                      </button>
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {selectedItem && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-xl">
            <div className="flex items-start justify-between mb-6">
              <h3 className="text-xl font-semibold text-[#132A13]">{selectedItem.title}</h3>
              <button
                onClick={() => setSelectedItem(null)}
                className="p-2 rounded-lg hover:bg-[#ECF39E]/30"
                aria-label="Close"
              >
                <XCircle className="w-5 h-5 text-[#132A13]/60" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="aspect-square rounded-xl overflow-hidden bg-[#f8faf5]">
                <Image
                  src={selectedItem.imageUrl}
                  alt={selectedItem.title}
                  width={400}
                  height={400}
                  className="object-contain w-full h-full"
                />
              </div>
              <div className="space-y-4">
                <div>
                  <p className="text-[#132A13]/50 text-sm">Description</p>
                  <p className="text-[#132A13]">{selectedItem.description}</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-[#132A13]/50 text-sm">Category</p>
                    <p className="text-[#132A13]">{CATEGORIES.find(c => c.value === selectedItem.category)?.label}</p>
                  </div>
                  <div>
                    <p className="text-[#132A13]/50 text-sm">Location</p>
                    <p className="text-[#132A13]">{LOCATIONS.find(l => l.value === selectedItem.foundLocation)?.label}</p>
                  </div>
                  <div>
                    <p className="text-[#132A13]/50 text-sm">Found Date</p>
                    <p className="text-[#132A13]">{new Date(selectedItem.foundAt).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <p className="text-[#132A13]/50 text-sm">Views</p>
                    <p className="text-[#132A13]">{selectedItem.views}</p>
                  </div>
                </div>
                <div className="pt-4 border-t border-[#4F772D]/10">
                  <p className="text-[#132A13]/50 text-sm mb-2">Reporter Contact</p>
                  <p className="text-[#132A13]">{selectedItem.reporterName || 'Not provided'}</p>
                  <p className="text-[#132A13]/70">{selectedItem.reporterEmail}</p>
                  {selectedItem.reporterPhone && (
                    <p className="text-[#132A13]/70">{selectedItem.reporterPhone}</p>
                  )}
                </div>
              </div>
            </div>

            {isPending && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-[#132A13]/70 mb-2">
                    Rejection Reason (if rejecting)
                  </label>
                  <textarea
                    value={rejectReason}
                    onChange={(e) => setRejectReason(e.target.value)}
                    placeholder="Enter reason for rejection..."
                    className="w-full px-4 py-3 glass-input resize-none"
                    rows={2}
                  />
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => onApprove(selectedItem.id)}
                    disabled={actionLoading === selectedItem.id}
                    className="flex-1 glass-button py-3 flex items-center justify-center gap-2"
                  >
                    {actionLoading === selectedItem.id ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <CheckCircle className="w-4 h-4" />
                    )}
                    Approve
                  </button>
                  <button
                    onClick={() => onReject(selectedItem.id, rejectReason)}
                    disabled={actionLoading === selectedItem.id}
                    className="flex-1 px-4 py-3 rounded-xl border-2 border-red-300 text-red-600 hover:bg-red-50 font-medium flex items-center justify-center gap-2"
                  >
                    <XCircle className="w-4 h-4" />
                    Reject
                  </button>
                </div>
              </div>
            )}

            {!isPending && (
              <div className="flex gap-3">
                <button
                  onClick={() => onMarkClaimed(selectedItem.id)}
                  disabled={actionLoading === selectedItem.id}
                  className="flex-1 glass-button py-3 flex items-center justify-center gap-2"
                >
                  <CheckCircle className="w-4 h-4" />
                  Mark Claimed
                </button>
                <button
                  onClick={() => onArchive(selectedItem.id)}
                  disabled={actionLoading === selectedItem.id}
                  className="flex-1 glass-button-secondary py-3 flex items-center justify-center gap-2"
                >
                  <Archive className="w-4 h-4" />
                  Archive
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

function ClaimsTable({
  claims,
  selectedClaim,
  setSelectedClaim,
  onUpdateStatus,
  actionLoading,
}: {
  claims: Claim[]
  selectedClaim: Claim | null
  setSelectedClaim: (claim: Claim | null) => void
  onUpdateStatus: (id: string, status: string) => void
  actionLoading: string | null
}) {
  if (claims.length === 0) {
    return (
      <div className="text-center py-12">
        <MessageSquare className="w-12 h-12 text-[#132A13]/30 mx-auto mb-4" aria-hidden="true" />
        <p className="text-[#132A13]/60">No claims to display</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-[#4F772D]/10">
              <th className="text-left py-3 px-4 text-[#132A13]/60 font-medium">Claimant</th>
              <th className="text-left py-3 px-4 text-[#132A13]/60 font-medium">Type</th>
              <th className="text-left py-3 px-4 text-[#132A13]/60 font-medium">Item</th>
              <th className="text-left py-3 px-4 text-[#132A13]/60 font-medium">Date</th>
              <th className="text-left py-3 px-4 text-[#132A13]/60 font-medium">Status</th>
              <th className="text-right py-3 px-4 text-[#132A13]/60 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {claims.map((claim) => (
              <tr 
                key={claim.id} 
                className="border-b border-[#4F772D]/5 hover:bg-[#ECF39E]/10 transition-colors"
              >
                <td className="py-3 px-4">
                  <div>
                    <p className="font-medium text-[#132A13]">{claim.name}</p>
                    <p className="text-[#132A13]/50 text-sm">{claim.email}</p>
                  </div>
                </td>
                <td className="py-3 px-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    claim.claimType === 'CLAIM' 
                      ? 'bg-[#ECF39E] text-[#132A13]' 
                      : 'bg-[#90A955]/20 text-[#31572C]'
                  }`}>
                    {claim.claimType}
                  </span>
                </td>
                <td className="py-3 px-4 text-[#132A13]/70">
                  {claim.item?.title || 'General Inquiry'}
                </td>
                <td className="py-3 px-4 text-[#132A13]/70">
                  {new Date(claim.createdAt).toLocaleDateString()}
                </td>
                <td className="py-3 px-4">
                  <StatusBadge status={claim.status as 'SUBMITTED' | 'IN_REVIEW' | 'VERIFIED' | 'DENIED' | 'RESOLVED'} type="claim" size="sm" />
                </td>
                <td className="py-3 px-4">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => setSelectedClaim(claim)}
                      className="p-2 rounded-lg hover:bg-[#ECF39E]/30 transition-colors"
                      aria-label="View details"
                    >
                      <Eye className="w-4 h-4 text-[#132A13]/60" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selectedClaim && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 max-w-lg w-full shadow-xl">
            <div className="flex items-start justify-between mb-6">
              <h3 className="text-xl font-semibold text-[#132A13]">Claim Details</h3>
              <button
                onClick={() => setSelectedClaim(null)}
                className="p-2 rounded-lg hover:bg-[#ECF39E]/30"
                aria-label="Close"
              >
                <XCircle className="w-5 h-5 text-[#132A13]/60" />
              </button>
            </div>

            <div className="space-y-4 mb-6">
              <div>
                <p className="text-[#132A13]/50 text-sm">Claimant</p>
                <p className="text-[#132A13] font-medium">{selectedClaim.name}</p>
                <p className="text-[#132A13]/70">{selectedClaim.email}</p>
              </div>
              {selectedClaim.item && (
                <div>
                  <p className="text-[#132A13]/50 text-sm">Item</p>
                  <p className="text-[#132A13]">{selectedClaim.item.title}</p>
                </div>
              )}
              {selectedClaim.proofDetails && (
                <div>
                  <p className="text-[#132A13]/50 text-sm">Proof of Ownership</p>
                  <p className="text-[#132A13] bg-[#f8faf5] p-3 rounded-lg">{selectedClaim.proofDetails}</p>
                </div>
              )}
              {selectedClaim.message && (
                <div>
                  <p className="text-[#132A13]/50 text-sm">Message</p>
                  <p className="text-[#132A13]">{selectedClaim.message}</p>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <p className="text-[#132A13]/50 text-sm mb-2">Update Status</p>
              <div className="grid grid-cols-2 gap-2">
                {['IN_REVIEW', 'VERIFIED', 'DENIED', 'RESOLVED'].map((status) => (
                  <button
                    key={status}
                    onClick={() => onUpdateStatus(selectedClaim.id, status)}
                    disabled={actionLoading === selectedClaim.id || selectedClaim.status === status}
                    className={`py-2 px-3 rounded-lg text-sm transition-all font-medium ${
                      selectedClaim.status === status
                        ? 'bg-[#4F772D] text-white'
                        : 'border border-[#4F772D]/30 text-[#132A13] hover:bg-[#ECF39E]/30'
                    }`}
                  >
                    {status.replace('_', ' ')}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function AnalyticsPanel({ stats }: { stats: { pending: number; approved: number; claimed: number; totalClaims: number } }) {
  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-lg font-semibold text-[#132A13] mb-4">Overview</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-[#f8faf5] p-4 rounded-xl text-center">
            <p className="text-3xl font-bold text-amber-600">{stats.pending}</p>
            <p className="text-[#132A13]/60 text-sm">Pending Review</p>
          </div>
          <div className="bg-[#f8faf5] p-4 rounded-xl text-center">
            <p className="text-3xl font-bold text-[#4F772D]">{stats.approved}</p>
            <p className="text-[#132A13]/60 text-sm">Approved Items</p>
          </div>
          <div className="bg-[#f8faf5] p-4 rounded-xl text-center">
            <p className="text-3xl font-bold text-[#31572C]">{stats.claimed}</p>
            <p className="text-[#132A13]/60 text-sm">Claimed Items</p>
          </div>
          <div className="bg-[#f8faf5] p-4 rounded-xl text-center">
            <p className="text-3xl font-bold text-[#90A955]">{stats.totalClaims}</p>
            <p className="text-[#132A13]/60 text-sm">Total Claims</p>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-[#132A13] mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-[#f8faf5] p-4 rounded-xl">
            <div className="flex items-center gap-3 mb-2">
              <AlertCircle className="w-5 h-5 text-amber-500" />
              <span className="font-medium text-[#132A13]">Pending Items</span>
            </div>
            <p className="text-[#132A13]/60 text-sm">
              {stats.pending > 0 
                ? `You have ${stats.pending} items waiting for review.`
                : 'All items have been reviewed!'}
            </p>
          </div>
          <div className="bg-[#f8faf5] p-4 rounded-xl">
            <div className="flex items-center gap-3 mb-2">
              <MessageSquare className="w-5 h-5 text-[#4F772D]" />
              <span className="font-medium text-[#132A13]">Claims</span>
            </div>
            <p className="text-[#132A13]/60 text-sm">
              {stats.totalClaims > 0 
                ? `${stats.totalClaims} claims require attention.`
                : 'No pending claims.'}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
