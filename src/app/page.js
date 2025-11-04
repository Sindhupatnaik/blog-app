'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useAuth } from './context/AuthContext'

export default function Home() {
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
      setBlogs(data.slice(0, 6)) // Show latest 6 blogs
      setLoading(false)
    } catch (error) {
      console.error('Error fetching blogs:', error)
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-16">
      {/* Hero Section */}
      <div className="text-center py-24 mb-32">
        <h1 className="text-8xl font-bold mb-8 text-black leading-tight">
          Welcome to BlogSpace
        </h1>
        <p className="text-2xl text-black/70 mb-6 max-w-3xl mx-auto leading-relaxed">
          Share your thoughts, read amazing stories, and connect with creators from around the world
        </p>
        <p className="text-lg text-black/60 mb-12 max-w-2xl mx-auto">
          A platform where ideas meet inspiration. Write your story, share your knowledge, and discover perspectives that matter.
        </p>
        <div className="flex gap-4 justify-center items-center">
          <Link
            href="/blogs"
            className="bg-black text-white px-12 py-4 rounded-full text-lg font-semibold hover:bg-black/90 transition-colors"
          >
            Explore Blogs
          </Link>
          {!user && (
            <Link
              href="/signup"
              className="border-2 border-black text-black px-12 py-4 rounded-full text-lg font-semibold hover:bg-black hover:text-white transition-colors"
            >
              Get Started
            </Link>
          )}
        </div>
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-32">
        <div className="text-center border border-black/10 rounded-2xl p-8">
          <div className="text-5xl font-bold text-black mb-2">{blogs.length}+</div>
          <div className="text-lg text-black/60">Blog Posts</div>
        </div>
        <div className="text-center border border-black/10 rounded-2xl p-8">
          <div className="text-5xl font-bold text-black mb-2">100+</div>
          <div className="text-lg text-black/60">Active Writers</div>
        </div>
        <div className="text-center border border-black/10 rounded-2xl p-8">
          <div className="text-5xl font-bold text-black mb-2">10K+</div>
          <div className="text-lg text-black/60">Monthly Readers</div>
        </div>
      </div>

      {/* Features Section */}
      <div className="mb-32">
        <h2 className="text-5xl font-bold text-center mb-16 text-black">Why Choose BlogSpace?</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="border border-black/10 rounded-2xl p-8">
            <div className="text-4xl mb-4">✍️</div>
            <h3 className="text-2xl font-bold text-black mb-3">Easy Writing</h3>
            <p className="text-black/60 leading-relaxed">
              Write and publish your thoughts effortlessly. Our clean editor makes blogging a breeze.
            </p>
          </div>
          <div className="border border-black/10 rounded-2xl p-8">
            <div className="text-4xl mb-4">🌍</div>
            <h3 className="text-2xl font-bold text-black mb-3">Global Reach</h3>
            <p className="text-black/60 leading-relaxed">
              Share your ideas with a worldwide audience. Connect with readers from every corner of the globe.
            </p>
          </div>
          <div className="border border-black/10 rounded-2xl p-8">
            <div className="text-4xl mb-4">🎨</div>
            <h3 className="text-2xl font-bold text-black mb-3">Clean Design</h3>
            <p className="text-black/60 leading-relaxed">
              Beautiful, distraction-free design that puts your content front and center.
            </p>
          </div>
          <div className="border border-black/10 rounded-2xl p-8">
            <div className="text-4xl mb-4">⚡</div>
            <h3 className="text-2xl font-bold text-black mb-3">Fast & Reliable</h3>
            <p className="text-black/60 leading-relaxed">
              Lightning-fast loading times and reliable hosting ensure your readers have a great experience.
            </p>
          </div>
          <div className="border border-black/10 rounded-2xl p-8">
            <div className="text-4xl mb-4">🔒</div>
            <h3 className="text-2xl font-bold text-black mb-3">Secure Platform</h3>
            <p className="text-black/60 leading-relaxed">
              Your content and data are protected with industry-standard security measures.
            </p>
          </div>
          <div className="border border-black/10 rounded-2xl p-8">
            <div className="text-4xl mb-4">💬</div>
            <h3 className="text-2xl font-bold text-black mb-3">Community Focus</h3>
            <p className="text-black/60 leading-relaxed">
              Join a community of writers and readers passionate about sharing knowledge and stories.
            </p>
          </div>
        </div>
      </div>

      {/* How It Works Section */}
      <div className="mb-32 border-t border-black/10 pt-16">
        <h2 className="text-5xl font-bold text-center mb-16 text-black">How It Works</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          <div className="text-center">
            <div className="w-16 h-16 bg-black text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-6">1</div>
            <h3 className="text-2xl font-bold text-black mb-4">Sign Up</h3>
            <p className="text-black/60 leading-relaxed">
              Create your free account in seconds. No credit card required.
            </p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-black text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-6">2</div>
            <h3 className="text-2xl font-bold text-black mb-4">Write</h3>
            <p className="text-black/60 leading-relaxed">
              Start writing your blog post using our intuitive editor.
            </p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-black text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-6">3</div>
            <h3 className="text-2xl font-bold text-black mb-4">Publish</h3>
            <p className="text-black/60 leading-relaxed">
              Hit publish and share your thoughts with the world instantly.
            </p>
          </div>
        </div>
      </div>

      {/* Featured Blogs */}
      <div className="mb-32">
        <div className="flex justify-between items-center mb-12">
          <h2 className="text-5xl font-bold text-black">Latest Posts</h2>
          <Link
            href="/blogs"
            className="text-black hover:text-black/80 transition-colors underline font-medium"
          >
            View All →
          </Link>
        </div>
        {loading ? (
          <div className="text-center py-20">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-black"></div>
            <p className="text-black/60 mt-4">Loading blogs...</p>
          </div>
        ) : blogs.length === 0 ? (
          <div className="text-center py-20 border border-black/10 rounded-2xl">
            <p className="text-black/60 text-xl mb-4">No blogs yet. Be the first to write one!</p>
            {user ? (
              <Link
                href="/create"
                className="text-black hover:text-black/80 transition-colors underline font-medium"
              >
                Write Your First Blog →
              </Link>
            ) : (
              <Link
                href="/signup"
                className="text-black hover:text-black/80 transition-colors underline font-medium"
              >
                Sign Up to Get Started →
              </Link>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogs.map((blog) => (
              <Link
                key={blog.id}
                href={`/blogs/${blog.id}`}
                className="group border border-black/10 rounded-2xl p-8 hover-lift hover:border-black/20 transition-all"
              >
                <div className="h-px w-16 bg-black mb-6"></div>
                <h3 className="text-2xl font-bold text-black mb-4 group-hover:text-black/80 transition-colors">
                  {blog.title}
                </h3>
                <p className="text-black/60 mb-6 line-clamp-3 leading-relaxed">
                  {blog.content.substring(0, 150)}...
                </p>
                <div className="flex items-center justify-between text-sm text-black/50 pt-4 border-t border-black/10">
                  <span className="font-medium">{blog.authorName}</span>
                  <span>{new Date(blog.createdAt).toLocaleDateString()}</span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* CTA Section */}
      {!user && (
        <div className="border-2 border-black rounded-2xl p-16 text-center mb-16">
          <h2 className="text-5xl font-bold text-black mb-6">Ready to Start Writing?</h2>
          <p className="text-xl text-black/60 mb-8 max-w-2xl mx-auto">
            Join thousands of writers sharing their stories and ideas. Start your blogging journey today.
          </p>
          <div className="flex gap-4 justify-center">
            <Link
              href="/signup"
              className="bg-black text-white px-12 py-4 rounded-full text-lg font-semibold hover:bg-black/90 transition-colors"
            >
              Create Free Account
            </Link>
            <Link
              href="/blogs"
              className="border-2 border-black text-black px-12 py-4 rounded-full text-lg font-semibold hover:bg-black hover:text-white transition-colors"
            >
              Browse Blogs
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}




