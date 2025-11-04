'use client'

import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '../app/context/AuthContext'

export default function DashboardSidebar() {
  const router = useRouter()
  const pathname = usePathname()
  const { user, logout } = useAuth()

  const handleLogout = () => {
    logout()
    router.push('/')
  }

  const isActive = (path) => pathname === path

  return (
    <aside className="w-64 border-r border-black/10 min-h-screen bg-white sticky top-0">
      <div className="p-6 h-full flex flex-col">
        <Link href="/dashboard" className="text-2xl font-bold text-black mb-8 block">
          BlogSpace
        </Link>
        
        <nav className="space-y-2 flex-1">
          <Link
            href="/create"
            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
              isActive('/create') 
                ? 'bg-black text-white font-medium' 
                : 'text-black/70 hover:bg-black/5 hover:text-black'
            }`}
          >
            <span>✍️</span> Write Blog
          </Link>
          <Link
            href="/dashboard/my-blogs"
            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
              isActive('/dashboard/my-blogs') 
                ? 'bg-black text-white font-medium' 
                : 'text-black/70 hover:bg-black/5 hover:text-black'
            }`}
          >
            <span>📝</span> My Blogs
          </Link>
          <Link
            href="/dashboard"
            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
              isActive('/dashboard') && !isActive('/dashboard/my-blogs')
                ? 'bg-black text-white font-medium' 
                : 'text-black/70 hover:bg-black/5 hover:text-black'
            }`}
          >
            <span>⚙️</span> Profile Settings
          </Link>
        </nav>

        <div className="mt-auto pt-8 border-t border-black/10">
          <div className="px-4 py-3 mb-4">
            <div className="text-sm text-black/60 mb-1">Logged in as</div>
            <div className="font-semibold text-black">{user?.username}</div>
            <div className="text-xs text-black/50 truncate">{user?.email}</div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full bg-black text-white px-4 py-3 rounded-lg hover:bg-black/90 transition-colors font-medium"
          >
            Logout
          </button>
        </div>
      </div>
    </aside>
  )
}




