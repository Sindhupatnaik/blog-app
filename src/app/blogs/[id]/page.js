'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useAuth } from '../../context/AuthContext'
import Link from 'next/link'

export default function BlogDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { user } = useAuth()
  const [blog, setBlog] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (params.id) {
      fetchBlog()
    }
  }, [params.id])

  const fetchBlog = async () => {
    try {
      const res = await fetch(`/api/blogs/${params.id}`)
      if (res.ok) {
        const data = await res.json()
        setBlog(data)
      } else {
        router.push('/blogs')
      }
      setLoading(false)
    } catch (error) {
      console.error('Error fetching blog:', error)
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this blog?')) return

    try {
      const token = localStorage.getItem('token')
      const res = await fetch(`/api/blogs/${params.id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (res.ok) {
        router.push('/blogs')
      }
    } catch (error) {
      console.error('Error deleting blog:', error)
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="text-center py-20">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-black"></div>
          <p className="text-black/60 mt-4">Loading...</p>
        </div>
      </div>
    )
  }

  if (!blog) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="text-center py-20 border border-black/10 rounded-2xl">
          <p className="text-black/60 text-xl mb-4">Blog not found</p>
          <Link href="/blogs" className="text-black hover:text-black/80 transition-colors underline">
            ← Back to Blogs
          </Link>
        </div>
      </div>
    )
  }

  const isOwner = user && user.id === blog.authorId

  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <article className="border border-black/10 rounded-2xl p-10 hover:border-black/20 transition-all">
        <div className="flex justify-between items-start mb-8">
          <div className="flex-1">
            <div className="h-px w-24 bg-black mb-6"></div>
            <h1 className="text-5xl font-bold text-black mb-6">
              {blog.title}
            </h1>
            <div className="flex items-center gap-4 text-black/60 mb-6">
              <span>{blog.authorName}</span>
              <span>•</span>
              <span>{new Date(blog.createdAt).toLocaleDateString()}</span>
            </div>
          </div>
          {isOwner && (
            <div className="flex gap-3 ml-4">
              <Link
                href={`/edit/${blog.id}`}
                className="bg-black text-white px-6 py-2 rounded-full hover:bg-black/90 transition-colors font-medium"
              >
                Edit
              </Link>
              <button
                onClick={handleDelete}
                className="bg-black text-white px-6 py-2 rounded-full hover:bg-black/90 transition-colors font-medium"
              >
                Delete
              </button>
            </div>
          )}
        </div>
        <div className="prose max-w-none">
          <p className="text-black/80 whitespace-pre-wrap leading-relaxed text-lg">
            {blog.content}
          </p>
        </div>
      </article>
      <div className="mt-8">
        <Link
          href="/blogs"
          className="inline-flex items-center gap-2 text-black hover:text-black/80 transition-colors font-medium"
        >
          <span>←</span> Back to Blogs
        </Link>
      </div>
    </div>
  )
}


