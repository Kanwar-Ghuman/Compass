import Link from 'next/link'
import { 
  Search, 
  PlusCircle, 
  MessageSquare, 
  Shield, 
  CheckCircle,
  TrendingUp,
  ArrowRight,
  Users,
  LogIn,
  Package,
  UserCheck,
  Compass
} from 'lucide-react'
import { stackServerApp } from '@/stack'
import { isAdminEmail } from '@/lib/auth'
import prisma from '@/lib/db'

async function getStats() {
  try {
    const [totalItems, claimedItems, activeListings, pendingReview] = await Promise.all([
      prisma.item.count({ where: { status: { in: ['APPROVED', 'CLAIMED', 'ARCHIVED'] } } }),
      prisma.item.count({ where: { status: 'CLAIMED' } }),
      prisma.item.count({ where: { status: 'APPROVED' } }),
      prisma.item.count({ where: { status: 'PENDING' } }),
    ])
    
    const successRate = totalItems > 0 ? Math.round((claimedItems / totalItems) * 100) : 0
    
    return { totalItems, claimedItems, activeListings, pendingReview, successRate }
  } catch {
    return { totalItems: 0, claimedItems: 0, activeListings: 0, pendingReview: 0, successRate: 0 }
  }
}

export default async function HomePage() {
  const [stats, user] = await Promise.all([
    getStats(),
    stackServerApp.getUser()
  ])

  const isAdmin = user ? isAdminEmail(user.primaryEmail) : false
  const isLoggedIn = !!user

  return (
    <div className="min-h-screen">
      <section className="py-16 lg:py-24 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-[#132A13] mb-6 leading-tight">
                Find Your Way Back to What&apos;s Lost
              </h1>
              
              <p className="text-lg text-[#132A13]/70 mb-8 max-w-lg">
                Effortlessly report lost and found items, reach the right people, 
                and reconnect owners with their belongings faster than ever.
              </p>

              {!isLoggedIn ? (
                <div className="flex flex-wrap gap-4">
                  <Link 
                    href="/handler/sign-in?after_auth_return_to=/report" 
                    className="glass-button-accent px-6 py-3 flex items-center gap-2"
                  >
                    <PlusCircle className="w-5 h-5" aria-hidden="true" />
                    Report Lost Item
                  </Link>
                  <Link 
                    href="/items" 
                    className="glass-button-secondary px-6 py-3 flex items-center gap-2"
                  >
                    Report Found Item
                  </Link>
                </div>
              ) : isAdmin ? (
                <div className="flex flex-wrap gap-4">
                  <Link 
                    href="/admin" 
                    className="glass-button px-6 py-3 flex items-center gap-2"
                  >
                    <Shield className="w-5 h-5" aria-hidden="true" />
                    Go to Dashboard
                  </Link>
                  <Link 
                    href="/items" 
                    className="glass-button-secondary px-6 py-3 flex items-center gap-2"
                  >
                    Browse Items
                  </Link>
                </div>
              ) : (
                <div className="flex flex-wrap gap-4">
                  <Link 
                    href="/report" 
                    className="glass-button-accent px-6 py-3 flex items-center gap-2"
                  >
                    <PlusCircle className="w-5 h-5" aria-hidden="true" />
                    Report Found Item
                  </Link>
                  <Link 
                    href="/items" 
                    className="glass-button-secondary px-6 py-3 flex items-center gap-2"
                  >
                    Browse Items
                  </Link>
                </div>
              )}
            </div>

            <div className="flex gap-4 justify-center lg:justify-end">
              <div className="glass-card p-6 w-48">
                <div className="w-12 h-12 rounded-xl bg-[#ECF39E] flex items-center justify-center mb-4">
                  <CheckCircle className="w-6 h-6 text-[#132A13]" aria-hidden="true" />
                </div>
                <p className="text-sm text-[#132A13]/60 mb-1">Items Returned</p>
                <p className="text-2xl font-bold text-[#132A13]">{stats.claimedItems}</p>
              </div>
              <div className="glass-card p-6 w-48 mt-8">
                <div className="w-12 h-12 rounded-xl bg-[#ECF39E] flex items-center justify-center mb-4">
                  <Package className="w-6 h-6 text-[#132A13]" aria-hidden="true" />
                </div>
                <p className="text-sm text-[#132A13]/60 mb-1">Active Listings</p>
                <p className="text-2xl font-bold text-[#132A13]">{stats.activeListings}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 px-4 border-y border-[#4F772D]/10">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <p className="text-3xl md:text-4xl font-bold text-[#132A13] mb-2">{stats.totalItems}</p>
              <p className="text-sm text-[#132A13]/60">Total Items Posted</p>
              <p className="text-xs text-[#132A13]/40 mt-1">Since launch</p>
            </div>
            <div className="text-center">
              <p className="text-3xl md:text-4xl font-bold text-[#132A13] mb-2">{stats.claimedItems}</p>
              <p className="text-sm text-[#132A13]/60">Items Returned</p>
              <p className="text-xs text-[#132A13]/40 mt-1">Successfully reunited</p>
            </div>
            <div className="text-center">
              <p className="text-3xl md:text-4xl font-bold text-[#132A13] mb-2">{stats.activeListings}</p>
              <p className="text-sm text-[#132A13]/60">Active Listings</p>
              <p className="text-xs text-[#132A13]/40 mt-1">Waiting to be claimed</p>
            </div>
            <div className="text-center">
              <p className="text-3xl md:text-4xl font-bold text-[#132A13] mb-2">{stats.successRate}%</p>
              <p className="text-sm text-[#132A13]/60">Success Rate</p>
              <p className="text-xs text-[#132A13]/40 mt-1">Items returned to owners</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 px-4 bg-[#132A13]">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            <div>
              <p className="text-[#ECF39E] text-sm font-medium mb-2">Get familiar!</p>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">How it works</h2>
            </div>
            <div>
              <p className="text-white/70">
                Effortlessly report lost and found items, reach the right people, 
                and reconnect owners with their belongings faster than ever.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
            <div className="bg-white/5 rounded-2xl p-8 border border-white/10">
              <div className="w-12 h-12 rounded-xl bg-[#ECF39E] flex items-center justify-center mb-6 text-[#132A13] font-bold text-xl">
                1
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">Sign In</h3>
              <p className="text-white/60">
                Log in with your school email using OTP or Google authentication. 
                Your account type determines your access level.
              </p>
            </div>

            <div className="bg-white/5 rounded-2xl p-8 border border-white/10">
              <div className="w-12 h-12 rounded-xl bg-[#ECF39E] flex items-center justify-center mb-6 text-[#132A13] font-bold text-xl">
                2
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">Report or Browse</h3>
              <p className="text-white/60">
                Found something? Submit a report with a photo. Lost something? 
                Browse the listings or use filters to search.
              </p>
            </div>

            <div className="bg-white/5 rounded-2xl p-8 border border-white/10">
              <div className="w-12 h-12 rounded-xl bg-[#ECF39E] flex items-center justify-center mb-6 text-[#132A13] font-bold text-xl">
                3
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">Claim Your Item</h3>
              <p className="text-white/60">
                Found your item? Submit a claim with proof of ownership. Our admin team 
                will verify and help you retrieve your belonging.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="glass-card p-8 md:p-12">
            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="flex-1">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#ECF39E] text-[#132A13] text-sm font-medium mb-4">
                  <Shield className="w-4 h-4" aria-hidden="true" />
                  Privacy Protected
                </div>
                <h2 className="text-2xl md:text-3xl font-bold text-[#132A13] mb-4">
                  Your Privacy Matters
                </h2>
                <p className="text-[#132A13]/70 mb-6">
                  We only display public information about found items. Your contact details 
                  and claim proof are kept private and only visible to administrators who 
                  verify ownership.
                </p>
                <Link 
                  href="/privacy" 
                  className="inline-flex items-center gap-2 text-[#4F772D] hover:text-[#31572C] font-medium transition-colors"
                >
                  Learn more about our privacy policy
                  <ArrowRight className="w-4 h-4" aria-hidden="true" />
                </Link>
              </div>
              <div className="w-32 h-32 rounded-2xl bg-[#ECF39E] flex items-center justify-center">
                <Shield className="w-16 h-16 text-[#132A13]" aria-hidden="true" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {!isLoggedIn && (
        <section className="py-20 px-4 bg-[#f8faf5]">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-[#132A13] mb-4">
              Ready to get started?
            </h2>
            <p className="text-[#132A13]/70 mb-8">
              Join our community and help reunite people with their lost belongings.
            </p>
            <Link 
              href="/handler/sign-in?after_auth_return_to=/" 
              className="glass-button px-10 py-4 text-lg inline-flex items-center gap-2"
            >
              Get Started
              <ArrowRight className="w-5 h-5" aria-hidden="true" />
            </Link>
          </div>
        </section>
      )}
    </div>
  )
}
