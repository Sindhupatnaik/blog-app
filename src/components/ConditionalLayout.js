'use client'

import { usePathname } from 'next/navigation'
import { useAuth } from '../app/context/AuthContext'
import Navbar from './Navbar'
import Footer from './Footer'

export default function ConditionalLayout({ children }) {
  const pathname = usePathname()
  const { user, loading } = useAuth()
  
  // Hide navbar/footer completely when user is logged in
  // Only show navbar when user is NOT logged in (and authentication check is complete)
  // Wait for loading to complete to prevent navbar flash
  const shouldShowNavbar = !loading && !user

  return (
    <>
      {shouldShowNavbar && <Navbar />}
      <main className={user ? '' : 'min-h-screen'}>
        {children}
      </main>
      {shouldShowNavbar && <Footer />}
    </>
  )
}






