import { 
  Accessibility, 
  Keyboard, 
  Eye, 
  Palette, 
  FileText, 
  ImageIcon,
  Monitor,
  Volume2
} from 'lucide-react'

export const metadata = {
  title: 'Accessibility | Compass',
  description: 'Our commitment to making Compass accessible to everyone',
}

const accessibilityFeatures = [
  {
    icon: Keyboard,
    title: 'Keyboard Navigation',
    description: 'All interactive elements are accessible via keyboard. Use Tab to navigate, Enter or Space to activate, and Escape to close dialogs.',
  },
  {
    icon: Eye,
    title: 'Visible Focus Indicators',
    description: 'Clear visual indicators show which element currently has keyboard focus, making it easy to navigate without a mouse.',
  },
  {
    icon: Palette,
    title: 'Color Contrast',
    description: 'All text meets WCAG 2.1 Level AA contrast requirements, ensuring readability for users with visual impairments.',
  },
  {
    icon: FileText,
    title: 'Semantic HTML',
    description: 'Proper heading hierarchy and semantic elements ensure screen readers can effectively communicate page structure.',
  },
  {
    icon: ImageIcon,
    title: 'Alt Text for Images',
    description: 'All meaningful images include descriptive alternative text for users who cannot see them.',
  },
  {
    icon: Monitor,
    title: 'Responsive Design',
    description: 'The website adapts to different screen sizes and works well with screen magnification tools.',
  },
  {
    icon: Volume2,
    title: 'ARIA Labels',
    description: 'Interactive elements include ARIA labels and roles where needed to improve screen reader compatibility.',
  },
]

export default function AccessibilityPage() {
  return (
    <div className="min-h-screen py-12 px-4 bg-[#f8faf5]">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-[#ECF39E] flex items-center justify-center">
            <Accessibility className="w-8 h-8 text-[#132A13]" aria-hidden="true" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-[#132A13] mb-4">
            Accessibility Statement
          </h1>
          <p className="text-[#132A13]/70 max-w-2xl mx-auto">
            We are committed to making Compass accessible to everyone, 
            including people with disabilities. Here&apos;s what we&apos;ve implemented to ensure an inclusive experience.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {accessibilityFeatures.map((feature) => {
            const Icon = feature.icon
            return (
              <div key={feature.title} className="glass-card p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-[#ECF39E] flex items-center justify-center flex-shrink-0">
                    <Icon className="w-6 h-6 text-[#132A13]" aria-hidden="true" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-[#132A13] mb-2">{feature.title}</h2>
                    <p className="text-[#132A13]/70">{feature.description}</p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        <div className="glass-card p-8">
          <h2 className="text-2xl font-bold text-[#132A13] mb-4">Report an Issue</h2>
          <p className="text-[#132A13]/70 mb-4">
            If you encounter any accessibility barriers while using our website, 
            please let us know. We take all feedback seriously and work to continuously 
            improve our accessibility.
          </p>
          <p className="text-[#132A13]/70">
            You can report accessibility issues through our{' '}
            <a href="/claim" className="text-[#4F772D] hover:underline">
              inquiry form
            </a>{' '}
            or contact your school&apos;s administration directly.
          </p>
        </div>
      </div>
    </div>
  )
}
