'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useAuth } from '../context/AuthContext'

export default function BlogsPage() {
  const [blogs, setBlogs] = useState([])
  const [loading, setLoading] = useState(true)
  const { user } = useAuth()

  useEffect(() => {
    fetchBlogs()
  }, [])

  const fetchBlogs = async () => {
    try {
      const res = await fetch('/api/blogs')
      const data = await res.json()
      setBlogs(data)
      setLoading(false)
    } catch (error) {
      console.error('Error fetching blogs:', error)
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="flex justify-between items-center mb-12">
        <h1 className="text-5xl font-bold text-black">All Blogs</h1>
        {user && (
          <Link
            href="/create"
            className="bg-black text-white px-8 py-3 rounded-full hover:bg-black/90 transition-colors font-semibold"
          >
            Write New Blog
          </Link>
        )}
      </div>

      {loading ? (
        <div className="text-center py-20">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-black"></div>
          <p className="text-black/60 mt-4">Loading blogs...</p>
        </div>
      ) : blogs.length === 0 ? (
        <div className="text-center py-20 border border-black/10 rounded-2xl">
          <p className="text-black/60 text-xl mb-4">No blogs yet.</p>
          {user ? (
            <Link
              href="/create"
              className="text-black hover:text-black/80 transition-colors underline"
            >
              Write the first blog!
            </Link>
          ) : (
            <Link
              href="/login"
              className="text-black hover:text-black/80 transition-colors underline"
            >
              Login to write blogs
            </Link>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogs.map((blog) => (
            <Link
              key={blog.id}
              href={`/blogs/${blog.id}`}
              className="group border border-black/10 rounded-2xl p-6 hover-lift hover:border-black/20 transition-all"
            >
              <div className="h-px w-16 bg-black mb-4"></div>
              <h2 className="text-2xl font-bold text-black mb-3 group-hover:text-black/80 transition-colors">
                {blog.title}
              </h2>
              <p className="text-black/60 mb-6 line-clamp-4 leading-relaxed">
                {blog.content.substring(0, 200)}...
              </p>
              <div className="flex items-center justify-between text-sm text-black/50 pt-4 border-t border-black/10">
                <span>{blog.authorName}</span>
                <span>{new Date(blog.createdAt).toLocaleDateString()}</span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}


