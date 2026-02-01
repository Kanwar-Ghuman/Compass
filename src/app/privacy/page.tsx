import { 
  Lock, 
  Eye, 
  EyeOff, 
  Shield, 
  Clock, 
  Trash2 
} from 'lucide-react'

export const metadata = {
  title: 'Privacy & Safety | Compass',
  description: 'How we protect your privacy and keep your information safe',
}

export default function PrivacyPage() {
  return (
    <div className="min-h-screen py-12 px-4 bg-[#f8faf5]">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-[#ECF39E] flex items-center justify-center">
            <Lock className="w-8 h-8 text-[#132A13]" aria-hidden="true" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-[#132A13] mb-4">
            Privacy & Safety
          </h1>
          <p className="text-[#132A13]/70 max-w-2xl mx-auto">
            Your privacy matters to us. Here&apos;s how we handle your information 
            to keep Compass safe for everyone.
          </p>
        </div>

        <div className="space-y-8">
          <div className="glass-card p-8">
            <div className="flex items-start gap-4 mb-6">
              <div className="w-12 h-12 rounded-xl bg-[#ECF39E] flex items-center justify-center flex-shrink-0">
                <Eye className="w-6 h-6 text-[#132A13]" aria-hidden="true" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-[#132A13] mb-2">What&apos;s Public</h2>
                <p className="text-[#132A13]/70">
                  Only essential information about found items is displayed publicly:
                </p>
              </div>
            </div>
            <ul className="space-y-3 ml-16">
              <li className="flex items-center gap-2 text-[#132A13]/70">
                <span className="w-2 h-2 rounded-full bg-[#4F772D]" />
                Photo of the item
              </li>
              <li className="flex items-center gap-2 text-[#132A13]/70">
                <span className="w-2 h-2 rounded-full bg-[#4F772D]" />
                Item title and description
              </li>
              <li className="flex items-center gap-2 text-[#132A13]/70">
                <span className="w-2 h-2 rounded-full bg-[#4F772D]" />
                General location where found
              </li>
              <li className="flex items-center gap-2 text-[#132A13]/70">
                <span className="w-2 h-2 rounded-full bg-[#4F772D]" />
                Date found and status
              </li>
            </ul>
          </div>

          <div className="glass-card p-8">
            <div className="flex items-start gap-4 mb-6">
              <div className="w-12 h-12 rounded-xl bg-[#90A955]/30 flex items-center justify-center flex-shrink-0">
                <EyeOff className="w-6 h-6 text-[#31572C]" aria-hidden="true" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-[#132A13] mb-2">What&apos;s Private</h2>
                <p className="text-[#132A13]/70">
                  The following information is kept confidential and only visible to administrators:
                </p>
              </div>
            </div>
            <ul className="space-y-3 ml-16">
              <li className="flex items-center gap-2 text-[#132A13]/70">
                <span className="w-2 h-2 rounded-full bg-[#90A955]" />
                Reporter contact information
              </li>
              <li className="flex items-center gap-2 text-[#132A13]/70">
                <span className="w-2 h-2 rounded-full bg-[#90A955]" />
                Claimant contact details
              </li>
              <li className="flex items-center gap-2 text-[#132A13]/70">
                <span className="w-2 h-2 rounded-full bg-[#90A955]" />
                Proof of ownership details
              </li>
              <li className="flex items-center gap-2 text-[#132A13]/70">
                <span className="w-2 h-2 rounded-full bg-[#90A955]" />
                Admin notes and communications
              </li>
            </ul>
          </div>

          <div className="glass-card p-8">
            <div className="flex items-start gap-4 mb-6">
              <div className="w-12 h-12 rounded-xl bg-[#ECF39E] flex items-center justify-center flex-shrink-0">
                <Shield className="w-6 h-6 text-[#132A13]" aria-hidden="true" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-[#132A13] mb-2">Data Protection</h2>
                <p className="text-[#132A13]/70">
                  We implement several measures to protect your data:
                </p>
              </div>
            </div>
            <ul className="space-y-3 ml-16">
              <li className="flex items-center gap-2 text-[#132A13]/70">
                <span className="w-2 h-2 rounded-full bg-[#4F772D]" />
                Secure authentication with Google or OTP
              </li>
              <li className="flex items-center gap-2 text-[#132A13]/70">
                <span className="w-2 h-2 rounded-full bg-[#4F772D]" />
                Encrypted database connections
              </li>
              <li className="flex items-center gap-2 text-[#132A13]/70">
                <span className="w-2 h-2 rounded-full bg-[#4F772D]" />
                Role-based access control for admin functions
              </li>
              <li className="flex items-center gap-2 text-[#132A13]/70">
                <span className="w-2 h-2 rounded-full bg-[#4F772D]" />
                Regular security updates
              </li>
            </ul>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="glass-card p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-[#ECF39E] flex items-center justify-center">
                  <Clock className="w-5 h-5 text-[#132A13]" aria-hidden="true" />
                </div>
                <h3 className="text-lg font-semibold text-[#132A13]">Data Retention</h3>
              </div>
              <p className="text-[#132A13]/70">
                Item listings are automatically archived after 90 days of inactivity. 
                Archived items are kept for an additional 30 days before deletion.
              </p>
            </div>

            <div className="glass-card p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-[#90A955]/30 flex items-center justify-center">
                  <Trash2 className="w-5 h-5 text-[#31572C]" aria-hidden="true" />
                </div>
                <h3 className="text-lg font-semibold text-[#132A13]">Data Deletion</h3>
              </div>
              <p className="text-[#132A13]/70">
                You can request deletion of your personal data at any time by 
                contacting your school administration or using our inquiry form.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
