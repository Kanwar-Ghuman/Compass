import Link from 'next/link'
import Image from 'next/image'
import { Accessibility, Lock, FileText, Heart } from 'lucide-react'

const footerLinks = [
  { href: '/accessibility', label: 'Accessibility', icon: Accessibility },
  { href: '/privacy', label: 'Privacy', icon: Lock },
  { href: '/sources', label: 'Sources', icon: FileText },
]

export function Footer() {
  return (
    <footer className="bg-[#132A13] text-white mt-auto" role="contentinfo">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2 text-white/70">
            <span className="text-sm">Made with</span>
            <Heart className="w-4 h-4 text-[#ECF39E] fill-current" aria-hidden="true" />
            <span className="text-sm">for the school community</span>
          </div>

          <nav aria-label="Footer navigation">
            <ul className="flex items-center gap-8">
              {footerLinks.map((link) => {
                const Icon = link.icon
                return (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="flex items-center gap-2 text-white/70 hover:text-[#ECF39E] transition-colors"
                    >
                      <Icon className="w-4 h-4" aria-hidden="true" />
                      <span className="text-sm">{link.label}</span>
                    </Link>
                  </li>
                )
              })}
            </ul>
          </nav>

          <div className="flex items-center gap-2 text-white/50 text-sm">
            <span>© {new Date().getFullYear()}</span>
            <Image
              src="/compass-high-resolution-logo-transparent.png"
              alt="Compass"
              width={80}
              height={28}
              className="h-6 w-auto object-contain brightness-0 invert opacity-70"
            />
          </div>
        </div>
      </div>
    </footer>
  )
}
