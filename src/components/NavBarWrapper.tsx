import { stackServerApp } from '@/stack'
import { NavBar } from './NavBar'

export async function NavBarWrapper() {
  const user = await stackServerApp.getUser()
  
  const userData = user ? {
    id: user.id,
    displayName: user.displayName,
    primaryEmail: user.primaryEmail,
  } : null

  return <NavBar initialUser={userData} />
}
