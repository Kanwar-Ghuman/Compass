import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Shield, ArrowLeft, AlertTriangle } from 'lucide-react'
import { stackServerApp } from '@/stack'
import { isAdminEmail } from '@/lib/auth'
import { AdminDashboard } from '@/components/admin/AdminDashboard'

export const metadata = {
  title: 'Admin Dashboard | Compass',
  description: 'Manage items and claims',
}

function AccessDenied() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 bg-[#f8faf5]">
      <div className="text-center max-w-md">
        <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-red-100 flex items-center justify-center">
          <AlertTriangle className="w-10 h-10 text-red-600" aria-hidden="true" />
        </div>
        
        <h1 className="text-3xl font-bold text-[#132A13] mb-4">Access Denied</h1>
        <p className="text-[#132A13]/60 mb-8">
          You don&apos;t have permission to access the admin dashboard. 
          Only authorized administrators can view this page.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link 
            href="/" 
            className="glass-button px-6 py-3 flex items-center justify-center gap-2"
          >
            <ArrowLeft className="w-5 h-5" aria-hidden="true" />
            Go Home
          </Link>
          <a
            href="/handler/sign-out"
            className="glass-button-secondary px-6 py-3 flex items-center justify-center gap-2"
          >
            Sign Out
          </a>
        </div>

        <p className="text-[#132A13]/40 text-sm mt-8">
          If you believe this is an error, please contact your school administrator.
        </p>
      </div>
    </div>
  )
}

export default async function AdminPage() {
  const user = await stackServerApp.getUser()
  
  if (!user) {
    redirect('/handler/sign-in?after_auth_return_to=/admin')
  }

  const isAdmin = isAdminEmail(user.primaryEmail)
  
  if (!isAdmin) {
    return <AccessDenied />
  }

  const userData = {
    id: user.id,
    displayName: user.displayName,
    primaryEmail: user.primaryEmail,
  }

  return <AdminDashboard user={userData} />
}
