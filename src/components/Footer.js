'use client'

import Link from 'next/link'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="border-t border-black/10 mt-20">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Brand Section */}
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-2xl font-bold text-black mb-4">BlogSpace</h3>
            <p className="text-black/60 mb-4 max-w-md leading-relaxed">
              A platform where ideas meet inspiration. Share your thoughts, read amazing stories, and connect with creators from around the world.
            </p>
            <div className="flex gap-4 mt-6">
              <a href="#" className="text-black/60 hover:text-black transition-colors">Twitter</a>
              <a href="#" className="text-black/60 hover:text-black transition-colors">Facebook</a>
              <a href="#" className="text-black/60 hover:text-black transition-colors">LinkedIn</a>
              <a href="#" className="text-black/60 hover:text-black transition-colors">Instagram</a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-bold text-black mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/blogs" className="text-black/60 hover:text-black transition-colors">
                  All Blogs
                </Link>
              </li>
              <li>
                <Link href="/create" className="text-black/60 hover:text-black transition-colors">
                  Write a Blog
                </Link>
              </li>
              <li>
                <Link href="/login" className="text-black/60 hover:text-black transition-colors">
                  Login
                </Link>
              </li>
              <li>
                <Link href="/signup" className="text-black/60 hover:text-black transition-colors">
                  Sign Up
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="text-lg font-bold text-black mb-4">Resources</h4>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-black/60 hover:text-black transition-colors">
                  Help Center
                </a>
              </li>
              <li>
                <a href="#" className="text-black/60 hover:text-black transition-colors">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="text-black/60 hover:text-black transition-colors">
                  Terms of Service
                </a>
              </li>
              <li>
                <a href="#" className="text-black/60 hover:text-black transition-colors">
                  Contact Us
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-black/10 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-black/60 text-sm">
            © {currentYear} BlogSpace. All rights reserved.
          </p>
          <div className="flex gap-6 mt-4 md:mt-0">
            <a href="#" className="text-black/60 hover:text-black text-sm transition-colors">
              Privacy
            </a>
            <a href="#" className="text-black/60 hover:text-black text-sm transition-colors">
              Terms
            </a>
            <a href="#" className="text-black/60 hover:text-black text-sm transition-colors">
              Cookies
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}

