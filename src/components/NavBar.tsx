'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState, useEffect } from 'react'
import Image from 'next/image'
import { 
  Home, 
  PlusCircle, 
  Search, 
  MessageSquare, 
  Shield,
  Menu,
  X,
  LogIn,
  LogOut,
  User,
  ChevronDown,
  Users
} from 'lucide-react'
import { isAdminEmail, type UserRole } from '@/lib/auth'

interface UserData {
  id: string
  displayName?: string | null
  primaryEmail?: string | null
}

interface NavBarProps {
  initialUser?: UserData | null
}

export function NavBar({ initialUser }: NavBarProps) {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
  
  const user = initialUser || null
  const isAdmin = user ? isAdminEmail(user.primaryEmail) : false
  const userRole: UserRole = !user ? 'guest' : (isAdmin ? 'admin' : 'student')

  const publicNavLinks = [
    { href: '/', label: 'Home', icon: Home },
    { href: '/items', label: 'Browse Items', icon: Search },
  ]

  const studentNavLinks = [
    ...publicNavLinks,
    { href: '/report', label: 'Report Found Item', icon: PlusCircle },
    { href: '/claim', label: 'Claim/Inquiry', icon: MessageSquare },
  ]

  const adminNavLinks = [
    { href: '/', label: 'Home', icon: Home },
    { href: '/admin', label: 'Dashboard', icon: Shield },
    { href: '/items', label: 'Browse Items', icon: Search },
  ]

  const navLinks = userRole === 'admin' ? adminNavLinks : 
                   userRole === 'student' ? studentNavLinks : 
                   publicNavLinks

  useEffect(() => {
    if (isUserMenuOpen) {
      const handleClickOutside = () => setIsUserMenuOpen(false)
      document.addEventListener('click', handleClickOutside)
      return () => document.removeEventListener('click', handleClickOutside)
    }
  }, [isUserMenuOpen])

  return (
    <header className="sticky top-0 z-50 w-full bg-white/95 backdrop-blur-sm border-b border-[#4F772D]/10">
      <nav 
        className="max-w-7xl mx-auto px-6 py-4"
        role="navigation"
        aria-label="Main navigation"
      >
        <div className="flex items-center justify-between">
          <Link 
            href="/" 
            className="flex items-center group"
            aria-label="Compass Home"
          >
            <Image
              src="/compass-high-resolution-logo-transparent.png"
              alt="Compass Logo"
              width={180}
              height={60}
              className="h-14 w-auto object-contain"
              priority
            />
          </Link>

          <div className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => {
              const isActive = pathname === link.href
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`text-sm font-medium transition-colors ${
                    isActive
                      ? 'text-[#4F772D]'
                      : 'text-[#132A13]/70 hover:text-[#4F772D]'
                  }`}
                  aria-current={isActive ? 'page' : undefined}
                >
                  {link.label}
                </Link>
              )
            })}
          </div>

          <div className="hidden lg:flex items-center gap-3">
            {user ? (
              <div className="relative">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation()
                    setIsUserMenuOpen(!isUserMenuOpen)
                  }}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl border border-[#4F772D]/20 hover:border-[#4F772D]/40 transition-colors"
                  aria-expanded={isUserMenuOpen}
                  aria-haspopup="true"
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    isAdmin 
                      ? 'bg-[#ECF39E]' 
                      : 'bg-[#90A955]'
                  }`}>
                    {isAdmin ? (
                      <Shield className="w-4 h-4 text-[#132A13]" aria-hidden="true" />
                    ) : (
                      <User className="w-4 h-4 text-white" aria-hidden="true" />
                    )}
                  </div>
                  <span className="text-sm font-medium text-[#132A13] max-w-[120px] truncate">
                    {user.displayName || user.primaryEmail?.split('@')[0] || 'User'}
                  </span>
                  <ChevronDown className={`w-4 h-4 text-[#132A13]/60 transition-transform ${isUserMenuOpen ? 'rotate-180' : ''}`} aria-hidden="true" />
                </button>

                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl py-2 shadow-lg border border-[#4F772D]/10">
                    <div className="px-4 py-2 border-b border-[#4F772D]/10">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-medium text-[#132A13] truncate">
                          {user.displayName || 'User'}
                        </p>
                        <span className={`px-2 py-0.5 text-xs rounded-full ${
                          isAdmin 
                            ? 'bg-[#ECF39E] text-[#132A13]' 
                            : 'bg-[#90A955]/20 text-[#4F772D]'
                        }`}>
                          {isAdmin ? 'Admin' : 'Student'}
                        </span>
                      </div>
                      <p className="text-xs text-[#132A13]/50 truncate">
                        {user.primaryEmail}
                      </p>
                    </div>
                    <Link
                      href="/handler/account-settings"
                      className="flex items-center gap-2 px-4 py-2 text-sm text-[#132A13]/70 hover:text-[#4F772D] hover:bg-[#ECF39E]/20 transition-colors"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      <User className="w-4 h-4" aria-hidden="true" />
                      Account Settings
                    </Link>
                    {isAdmin && (
                      <Link
                        href="/admin"
                        className="flex items-center gap-2 px-4 py-2 text-sm text-[#132A13]/70 hover:text-[#4F772D] hover:bg-[#ECF39E]/20 transition-colors"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        <Shield className="w-4 h-4" aria-hidden="true" />
                        Admin Dashboard
                      </Link>
                    )}
                    <a
                      href="/handler/sign-out"
                      className="flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                    >
                      <LogOut className="w-4 h-4" aria-hidden="true" />
                      Sign Out
                    </a>
                  </div>
                )}
              </div>
            ) : (
              <Link
                href="/handler/sign-in?after_auth_return_to=/"
                className="glass-button text-sm px-5 py-2"
              >
                Sign In
              </Link>
            )}
          </div>

          <button
            type="button"
            className="lg:hidden p-2 rounded-xl border border-[#4F772D]/20 hover:bg-[#ECF39E]/20 transition-colors"
            onClick={() => setIsOpen(!isOpen)}
            aria-expanded={isOpen}
            aria-controls="mobile-menu"
            aria-label={isOpen ? 'Close menu' : 'Open menu'}
          >
            {isOpen ? (
              <X className="w-5 h-5 text-[#132A13]" aria-hidden="true" />
            ) : (
              <Menu className="w-5 h-5 text-[#132A13]" aria-hidden="true" />
            )}
          </button>
        </div>

        {isOpen && (
          <div 
            id="mobile-menu"
            className="lg:hidden mt-4 pt-4 border-t border-[#4F772D]/10"
          >
            <div className="flex flex-col gap-2">
              {navLinks.map((link) => {
                const Icon = link.icon
                const isActive = pathname === link.href
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                      isActive
                        ? 'bg-[#ECF39E]/30 text-[#4F772D]'
                        : 'text-[#132A13]/70 hover:bg-[#ECF39E]/20 hover:text-[#4F772D]'
                    }`}
                    onClick={() => setIsOpen(false)}
                    aria-current={isActive ? 'page' : undefined}
                  >
                    <Icon className="w-5 h-5" aria-hidden="true" />
                    <span className="font-medium">{link.label}</span>
                  </Link>
                )
              })}

              <div className="mt-4 pt-4 border-t border-[#4F772D]/10">
                {user ? (
                  <>
                    <div className="px-4 py-2 mb-2">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-medium text-[#132A13]">
                          {user.displayName || 'User'}
                        </p>
                        <span className={`px-2 py-0.5 text-xs rounded-full ${
                          isAdmin 
                            ? 'bg-[#ECF39E] text-[#132A13]' 
                            : 'bg-[#90A955]/20 text-[#4F772D]'
                        }`}>
                          {isAdmin ? 'Admin' : 'Student'}
                        </span>
                      </div>
                      <p className="text-xs text-[#132A13]/50">
                        {user.primaryEmail}
                      </p>
                    </div>
                    <a
                      href="/handler/sign-out"
                      className="flex items-center gap-3 px-4 py-3 rounded-xl text-red-600 hover:bg-red-50 transition-colors"
                    >
                      <LogOut className="w-5 h-5" aria-hidden="true" />
                      <span className="font-medium">Sign Out</span>
                    </a>
                  </>
                ) : (
                  <Link
                    href="/handler/sign-in?after_auth_return_to=/"
                    className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-[#4F772D] text-white font-medium"
                    onClick={() => setIsOpen(false)}
                  >
                    <LogIn className="w-5 h-5" aria-hidden="true" />
                    Sign In
                  </Link>
                )}
              </div>
            </div>
          </div>
        )}
      </nav>
    </header>
  )
}
