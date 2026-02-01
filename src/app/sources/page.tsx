import { 
  Code, 
  Palette, 
  Database, 
  Lock, 
  Box,
  Type
} from 'lucide-react'
import Link from 'next/link'

export const metadata = {
  title: 'Sources & Citations | Compass',
  description: 'Technologies and resources used to build Compass',
}

const sources = [
  {
    category: 'Framework & Runtime',
    icon: Code,
    items: [
      { name: 'Next.js 15', url: 'https://nextjs.org', description: 'React framework with App Router' },
      { name: 'React 19', url: 'https://react.dev', description: 'UI component library' },
      { name: 'TypeScript', url: 'https://www.typescriptlang.org', description: 'Type-safe JavaScript' },
    ],
  },
  {
    category: 'Styling & Design',
    icon: Palette,
    items: [
      { name: 'Tailwind CSS', url: 'https://tailwindcss.com', description: 'Utility-first CSS framework' },
      { name: 'Lucide React', url: 'https://lucide.dev', description: 'Beautiful icon library' },
      { name: 'Geist Font', url: 'https://vercel.com/font', description: 'Modern sans-serif typeface' },
    ],
  },
  {
    category: 'Database & ORM',
    icon: Database,
    items: [
      { name: 'Neon', url: 'https://neon.tech', description: 'Serverless PostgreSQL database' },
      { name: 'Prisma', url: 'https://www.prisma.io', description: 'Next-generation Node.js ORM' },
    ],
  },
  {
    category: 'Authentication',
    icon: Lock,
    items: [
      { name: 'Stack Auth', url: 'https://stack-auth.com', description: 'Authentication for Next.js' },
    ],
  },
  {
    category: 'Validation & Utilities',
    icon: Box,
    items: [
      { name: 'Zod', url: 'https://zod.dev', description: 'TypeScript-first schema validation' },
      { name: 'UUID', url: 'https://www.npmjs.com/package/uuid', description: 'Unique ID generation' },
    ],
  },
]

export default function SourcesPage() {
  return (
    <div className="min-h-screen py-12 px-4 bg-[#f8faf5]">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-[#ECF39E] flex items-center justify-center">
            <Code className="w-8 h-8 text-[#132A13]" aria-hidden="true" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-[#132A13] mb-4">
            Sources & Citations
          </h1>
          <p className="text-[#132A13]/70 max-w-2xl mx-auto">
            Compass was built using modern web technologies and open-source tools.
          </p>
        </div>

        <div className="space-y-8">
          {sources.map((category) => {
            const Icon = category.icon
            return (
              <div key={category.category} className="glass-card p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-[#ECF39E] flex items-center justify-center">
                    <Icon className="w-5 h-5 text-[#132A13]" aria-hidden="true" />
                  </div>
                  <h2 className="text-xl font-semibold text-[#132A13]">{category.category}</h2>
                </div>
                
                <ul className="space-y-4">
                  {category.items.map((item) => (
                    <li key={item.name} className="flex items-center justify-between py-2 border-b border-[#4F772D]/10 last:border-0">
                      <div>
                        <a 
                          href={item.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[#4F772D] hover:text-[#31572C] font-medium"
                        >
                          {item.name}
                        </a>
                        <p className="text-[#132A13]/60 text-sm">{item.description}</p>
                      </div>
                      <a 
                        href={item.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#132A13]/40 hover:text-[#4F772D] text-sm"
                      >
                        Visit →
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )
          })}
        </div>

        <div className="glass-card p-8 mt-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-[#90A955]/30 flex items-center justify-center">
              <Type className="w-5 h-5 text-[#31572C]" aria-hidden="true" />
            </div>
            <h2 className="text-xl font-semibold text-[#132A13]">Design Inspiration</h2>
          </div>
          <p className="text-[#132A13]/70 mb-4">
            The design of this application was inspired by modern, clean UI patterns focusing on 
            accessibility and user experience. The green color palette represents growth, safety, 
            and the connection between lost items and their rightful owners.
          </p>
          <p className="text-[#132A13]/60 text-sm">
            Color Palette: Evergreen (#132A13), Hunter Green (#31572C), Fern (#4F772D), Palm Leaf (#90A955), Lime Cream (#ECF39E)
          </p>
        </div>
      </div>
    </div>
  )
}
