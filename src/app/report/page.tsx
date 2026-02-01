import { redirect } from 'next/navigation'
import { PlusCircle } from 'lucide-react'
import { stackServerApp } from '@/stack'
import { ReportForm } from '@/components/ReportForm'

export const metadata = {
  title: 'Report Found Item | Compass',
  description: 'Report a found item to help reunite it with its owner',
}

export default async function ReportPage() {
  const user = await stackServerApp.getUser()
  
  if (!user) {
    redirect('/handler/sign-in?after_auth_return_to=/report')
  }

  return (
    <div className="min-h-screen py-12 px-4 bg-[#f8faf5]">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-[#ECF39E] flex items-center justify-center">
            <PlusCircle className="w-8 h-8 text-[#132A13]" aria-hidden="true" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-[#132A13] mb-4">
            Report a Found Item
          </h1>
          <p className="text-[#132A13]/70 max-w-lg mx-auto">
            Found something? Help reunite it with its owner by submitting the details below. 
            Your submission will be reviewed by our team before being made public.
          </p>
        </div>

        <ReportForm 
          userEmail={user.primaryEmail || ''} 
          userName={user.displayName || ''} 
        />
      </div>
    </div>
  )
}
