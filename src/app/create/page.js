'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '../context/AuthContext'

export default function CreateBlogPage() {
  const router = useRouter()
  const { user } = useAuth()
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [loading, setLoading] = useState(false)

  // Redirect if not logged in
  useEffect(() => {
    if (!user) {
      router.push('/login')
    }
  }, [user, router])

  if (!user) {
    return null
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const token = localStorage.getItem('token')
      const res = await fetch('/api/blogs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          title,
          content,
          authorId: user.id,
          authorName: user.username
        })
      })

      if (res.ok) {
        const blog = await res.json()
        router.push('/dashboard/my-blogs')
      } else {
        const error = await res.json()
        alert(error.error || 'Failed to create blog')
      }
    } catch (error) {
      console.error('Error creating blog:', error)
      alert('Failed to create blog')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <h1 className="text-5xl font-bold text-black mb-10">Write New Blog</h1>
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
            {loading ? 'Publishing...' : 'Publish Blog'}
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


