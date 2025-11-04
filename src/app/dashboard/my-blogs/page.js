'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '../../context/AuthContext'

export default function MyBlogsPage() {
  const router = useRouter()
  const { user } = useAuth()
  const [blogs, setBlogs] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) {
      router.push('/login')
      return
    }
    fetchUserBlogs()
  }, [user, router])

  const fetchUserBlogs = async () => {
    try {
      const res = await fetch('/api/blogs')
      if (res.ok) {
        const data = await res.json()
        // Filter blogs by current user
        const userBlogs = data.filter(blog => blog.authorId === user.id)
        // Sort by most recent first
        userBlogs.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        setBlogs(userBlogs)
      }
      setLoading(false)
    } catch (error) {
      console.error('Error fetching blogs:', error)
      setLoading(false)
    }
  }

  const handleDelete = async (blogId) => {
    if (!confirm('Are you sure you want to delete this blog?')) return

    try {
      const token = localStorage.getItem('token')
      const res = await fetch(`/api/blogs/${blogId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (res.ok) {
        fetchUserBlogs()
      } else {
        alert('Failed to delete blog')
      }
    } catch (error) {
      console.error('Error deleting blog:', error)
      alert('Failed to delete blog')
    }
  }

  if (!user) {
    return null
  }

  return (
    <main className="flex-1 p-8">
      {/* Header */}
      <div className="mb-12">
        <h1 className="text-5xl font-bold text-black mb-4">
          My Blogs
        </h1>
        <p className="text-xl text-black/60">
          Manage all your blog posts
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
        <div className="border border-black/10 rounded-2xl p-8">
          <div className="text-4xl font-bold text-black mb-2">{blogs.length}</div>
          <div className="text-lg text-black/60">Total Blogs</div>
        </div>
        <div className="border border-black/10 rounded-2xl p-8">
          <div className="text-4xl font-bold text-black mb-2">
            {blogs.filter(blog => {
              const daysSinceCreation = (new Date() - new Date(blog.createdAt)) / (1000 * 60 * 60 * 24)
              return daysSinceCreation <= 30
            }).length}
          </div>
          <div className="text-lg text-black/60">This Month</div>
        </div>
        <div className="border border-black/10 rounded-2xl p-8">
          <div className="text-4xl font-bold text-black mb-2">
            {blogs.filter(blog => {
              const daysSinceUpdate = (new Date() - new Date(blog.updatedAt)) / (1000 * 60 * 60 * 24)
              return daysSinceUpdate <= 7
            }).length}
          </div>
          <div className="text-lg text-black/60">Updated This Week</div>
        </div>
      </div>

      {/* Quick Action */}
      <div className="mb-8">
        <Link
          href="/create"
          className="inline-block bg-black text-white px-8 py-4 rounded-full hover:bg-black/90 transition-colors font-semibold"
        >
          Write New Blog
        </Link>
      </div>

      {/* Blogs List */}
      {loading ? (
        <div className="text-center py-20">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-black"></div>
          <p className="text-black/60 mt-4">Loading blogs...</p>
        </div>
      ) : blogs.length === 0 ? (
        <div className="border border-black/10 rounded-2xl p-16 text-center">
          <p className="text-black/60 text-xl mb-6">You haven't written any blogs yet.</p>
          <Link
            href="/create"
            className="inline-block bg-black text-white px-8 py-4 rounded-full hover:bg-black/90 transition-colors font-semibold"
          >
            Write Your First Blog
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {blogs.map((blog) => (
            <div
              key={blog.id}
              className="border border-black/10 rounded-2xl p-6 hover:border-black/20 transition-all"
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <Link href={`/blogs/${blog.id}`}>
                    <h3 className="text-2xl font-bold text-black mb-2 hover:text-black/80 transition-colors">
                      {blog.title}
                    </h3>
                  </Link>
                  <p className="text-black/60 mb-4 line-clamp-2">
                    {blog.content.substring(0, 200)}...
                  </p>
                  <div className="flex items-center gap-4 text-sm text-black/50">
                    <span>Published: {new Date(blog.createdAt).toLocaleDateString()}</span>
                    <span>•</span>
                    <span>Updated: {new Date(blog.updatedAt).toLocaleDateString()}</span>
                  </div>
                </div>
                <div className="flex gap-2 ml-4">
                  <Link
                    href={`/edit/${blog.id}`}
                    className="border border-black/20 text-black px-4 py-2 rounded-full hover:bg-black/5 transition-colors font-medium"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => handleDelete(blog.id)}
                    className="border border-black/20 text-black px-4 py-2 rounded-full hover:bg-black/5 transition-colors font-medium"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  )
}

