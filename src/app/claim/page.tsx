import { redirect } from 'next/navigation'
import { MessageSquare } from 'lucide-react'
import { stackServerApp } from '@/stack'
import { ClaimForm } from '@/components/ClaimForm'

export const metadata = {
  title: 'Claim or Inquiry | Compass',
  description: 'Submit a claim for a lost item or send an inquiry',
}

export default async function ClaimPage({
  searchParams,
}: {
  searchParams: Promise<{ itemId?: string; type?: string }>
}) {
  const user = await stackServerApp.getUser()
  const params = await searchParams
  
  if (!user) {
    redirect('/handler/sign-in?after_auth_return_to=/claim')
  }

  return (
    <div className="min-h-screen py-12 px-4 bg-[#f8faf5]">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-[#ECF39E] flex items-center justify-center">
            <MessageSquare className="w-8 h-8 text-[#132A13]" aria-hidden="true" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-[#132A13] mb-4">
            Claim or Inquiry
          </h1>
          <p className="text-[#132A13]/70 max-w-lg mx-auto">
            Found your lost item in our listings? Submit a claim with proof of ownership. 
            Have a question? Send us an inquiry.
          </p>
        </div>

        <ClaimForm 
          userEmail={user.primaryEmail || ''} 
          userName={user.displayName || ''}
          defaultItemId={params.itemId}
          defaultType={params.type === 'inquiry' ? 'INQUIRY' : 'CLAIM'}
        />
      </div>
    </div>
  )
}
