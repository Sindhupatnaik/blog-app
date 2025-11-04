'use client'

import Link from 'next/link'
import { useAuth } from '../app/context/AuthContext'
import { useRouter } from 'next/navigation'

export default function Navbar() {
  const { user, logout } = useAuth()
  const router = useRouter()

  const handleLogout = () => {
    logout()
    router.push('/')
  }

  return (
    <nav className="bg-white border-b border-black/10 sticky top-0 z-50 backdrop-blur-sm bg-white/95">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          <Link href="/" className="text-2xl font-bold text-black hover:text-black/80 transition-colors">
            BlogSpace
          </Link>
          <div className="flex items-center gap-6">
            <Link
              href="/blogs"
              className="text-black/70 hover:text-black transition-colors font-medium relative group"
            >
              Blogs
              <span className="absolute bottom-0 left-0 w-0 h-px bg-black group-hover:w-full transition-all duration-200"></span>
            </Link>
            {user ? (
              <>
                <Link
                  href="/dashboard"
                  className="text-black/70 hover:text-black transition-colors font-medium relative group"
                >
                  Dashboard
                  <span className="absolute bottom-0 left-0 w-0 h-px bg-black group-hover:w-full transition-all duration-200"></span>
                </Link>
                <Link
                  href="/create"
                  className="bg-black text-white px-6 py-2 rounded-full hover:bg-black/90 transition-colors font-medium"
                >
                  Write
                </Link>
                <div className="flex items-center gap-3">
                  <div className="text-black/70 text-sm">
                    {user.username}
                  </div>
                  <button
                    onClick={handleLogout}
                    className="bg-black text-white px-6 py-2 rounded-full hover:bg-black/90 transition-colors font-medium"
                  >
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="text-black/70 hover:text-black transition-colors font-medium relative group"
                >
                  Login
                  <span className="absolute bottom-0 left-0 w-0 h-px bg-black group-hover:w-full transition-all duration-200"></span>
                </Link>
                <Link
                  href="/signup"
                  className="bg-black text-white px-6 py-2 rounded-full hover:bg-black/90 transition-colors font-medium"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}



