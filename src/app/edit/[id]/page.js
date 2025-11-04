'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { useAuth } from '../../context/AuthContext'

export default function EditBlogPage() {
  const router = useRouter()
  const params = useParams()
  const { user } = useAuth()
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(true)

  // Redirect if not logged in
  useEffect(() => {
    if (!user) {
      router.push('/login')
    }
  }, [user, router])

  useEffect(() => {
    if (params.id && user) {
      fetchBlog()
    }
  }, [params.id, user])

  const fetchBlog = async () => {
    try {
      const res = await fetch(`/api/blogs/${params.id}`)
      if (res.ok) {
        const blog = await res.json()
        // Check if user owns this blog
        if (user && user.id === blog.authorId) {
          setTitle(blog.title)
          setContent(blog.content)
        } else {
          router.push('/blogs')
        }
      } else {
        router.push('/blogs')
      }
      setFetching(false)
    } catch (error) {
      console.error('Error fetching blog:', error)
      setFetching(false)
    }
  }

  if (!user) {
    return null
  }

  if (fetching) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="text-center py-20">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-black"></div>
          <p className="text-black/60 mt-4">Loading...</p>
        </div>
      </div>
    )
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const token = localStorage.getItem('token')
      const res = await fetch(`/api/blogs/${params.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          title,
          content
        })
      })

      if (res.ok) {
        router.push(`/blogs/${params.id}`)
      } else {
        const error = await res.json()
        alert(error.error || 'Failed to update blog')
      }
    } catch (error) {
      console.error('Error updating blog:', error)
      alert('Failed to update blog')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <h1 className="text-5xl font-bold text-black mb-10">Edit Blog</h1>
      <form onSubmit={handleSubmit} className="border border-black/10 rounded-2xl p-10">
        <div className="mb-8">
          <label htmlFor="title" className="block text-sm font-semibold text-black mb-3">
            Title
          </label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="w-full px-6 py-4 border border-black/20 rounded-xl text-black placeholder-black/40 focus:outline-none focus:ring-2 focus:ring-black focus:border-black transition-all bg-white"
            placeholder="Enter your blog title..."
          />
        </div>
        <div className="mb-8">
          <label htmlFor="content" className="block text-sm font-semibold text-black mb-3">
            Content
          </label>
          <textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
            rows={18}
            className="w-full px-6 py-4 border border-black/20 rounded-xl text-black placeholder-black/40 focus:outline-none focus:ring-2 focus:ring-black focus:border-black transition-all bg-white resize-none"
            placeholder="Share your thoughts, ideas, and stories here..."
          />
        </div>
        <div className="flex gap-4">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 bg-black text-white px-8 py-4 rounded-full hover:bg-black/90 transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Updating...' : 'Update Blog'}
          </button>
          <button
            type="button"
            onClick={() => router.back()}
            className="border border-black/20 px-8 py-4 rounded-full text-black hover:bg-black/5 transition-colors font-semibold"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  )
}



