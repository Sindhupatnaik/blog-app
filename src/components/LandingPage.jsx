"use client"

import React, { useEffect, useRef } from 'react'
import Link from 'next/link'
import styles from './LandingPage.module.css'

function useInView() {
  const refs = useRef(new Set())

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('opacity-100', 'translate-y-0')
          entry.target.classList.remove('opacity-0', 'translate-y-6')
        }
      })
    }, { threshold: 0.12 })

    refs.current.forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [])

  return (el) => {
    if (!el) return
    refs.current.add(el)
  }
}

export default function LandingPage() {
  const setRef = useInView()

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        {/* Hero */}
        <section className={styles.hero}>
          <div className={styles['hero-left']} ref={setRef}>
            <h1 className={styles.title}>Stay curious.</h1>
            <p className={styles.subtitle}>Discover stories, thinking, and expertise from writers on any topic.</p>

            <div className={styles['hero-ctas']}>
              <Link href="/signup" className={styles.primary}>Start reading</Link>
            </div>
          </div>

          <div className={styles['hero-right']} ref={setRef}>
            <img src="/images/hero-illustration.svg" alt="hero-illustration" className={styles['hero-img']} />
          </div>
        </section>

        {/* Trending posts - simplified cards */}
        <section className="w-full py-12">
          <div className="container">
            <h2 style={{marginBottom: '18px', fontSize: '18px', fontWeight:600}}>Trending on BlogApp</h2>
            <div className="blog-grid">
              {[1,2,3,4,5,6].map(i => (
                <div key={i} className="blog-card" ref={setRef}>
                  <h3 className="blog-title">A fascinating post title {i}</h3>
                  <div className="blog-meta">Author · Dec {i} · 5 min read</div>
                  <p className="blog-content">Short excerpt that previews the article. Clean, concise and to the point.</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Categories */}
        <section className="w-full bg-neutral-50 border-t border-neutral-200">
          <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16">
            <h2 className="text-base font-medium mb-8">Discover more of what matters to you</h2>
            <div className="flex flex-wrap gap-3 mb-8">
              {['Programming', 'Data Science', 'Technology', 'Self Improvement', 'Writing', 'Relationships', 'Machine Learning', 'Productivity'].map(tag => (
                <Link 
                  key={tag} 
                  href={`/tag/${tag.toLowerCase()}`}
                  className="px-4 py-2 rounded-full border border-neutral-200 hover:border-neutral-900 transition-colors duration-200"
                >
                  {tag}
                </Link>
              ))}
            </div>
            <Link href="/tags" className="text-sm text-green-600 hover:text-green-700">See all topics</Link>
          </div>
        </section>

        {/* Section 4: Earn money */}
        <section className="w-full border-t border-neutral-200">
          <div className="max-w-7xl mx-auto px-6 lg:px-8 py-20 lg:py-28 text-center">
            <div className="inline-block bg-white/60 rounded-2xl p-8 shadow-md opacity-0 translate-y-6 transition-all duration-700" ref={setRef}>
              <h3 className="text-2xl font-serif text-rose-800 mb-3">Earn money</h3>
              <p className="text-neutral-700 mb-6">Monetize with AdSense-style ads, partner programs, and affiliate links — built-in tools to help you earn from your writing.</p>
            </div>
          </div>
        </section>

        {/* Section 5: Analytics */}
        <section className="w-full border-t border-neutral-200">
          <div className="max-w-7xl mx-auto px-6 lg:px-8 py-20 lg:py-28 flex flex-col lg:flex-row items-center gap-12">
            <div className="lg:w-1/2 opacity-0 translate-y-6 transition-all duration-700" ref={setRef}>
              <h3 className="text-3xl font-serif text-rose-800 mb-4">Know your audience</h3>
              <p className="text-neutral-700 mb-6">Built-in analytics give you clear insights about views, referrers, and top posts to help you grow.</p>
            </div>
            <div className="lg:w-1/2 opacity-0 translate-y-6 transition-all duration-700" ref={setRef}>
              <div className="w-full h-64 rounded-lg bg-white shadow-md flex items-center justify-center">
                <img src="https://via.placeholder.com/600x300" alt="analytics" className="h-full w-full object-cover rounded-lg" />
              </div>
            </div>
          </div>
        </section>

        {/* Section 6: Storage */}
        <section className="w-full border-t border-neutral-200">
          <div className="max-w-7xl mx-auto px-6 lg:px-8 py-20 lg:py-28 flex flex-col lg:flex-row items-center gap-12">
            <div className="lg:w-1/2 opacity-0 translate-y-6 transition-all duration-700" ref={setRef}>
              <h3 className="text-3xl font-serif text-rose-800 mb-4">Hang onto your memories</h3>
              <p className="text-neutral-700">We store your posts safely with backups and reliability so your content remains secure across time.</p>
            </div>
            <div className="lg:w-1/2 opacity-0 translate-y-6 transition-all duration-700" ref={setRef}>
              <img src="https://via.placeholder.com/600x400/efe7f2" alt="memories" className="rounded-lg shadow-lg" />
            </div>
          </div>
        </section>

        {/* Section 7: CTA */}
        <section className="w-full border-t border-neutral-200">
          <div className="max-w-3xl mx-auto px-6 lg:px-8 py-20 text-center">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif text-rose-800 mb-3">Join millions of others</h2>
            <p className="text-neutral-700 mb-8">Share your ideas with the world.</p>
            <Link href="/signup" className="inline-block bg-rose-600 text-white px-8 py-4 rounded-full text-lg shadow-lg hover:bg-rose-700 transition">Get Started</Link>
          </div>
        </section>

        {/* Footer */}
        <footer className={styles.footer}>
          <div className={styles.footerContainer}>
            <div className={styles.footerGrid}>
              <div className={styles.footerSection}>
                <h4>About</h4>
                <Link href="/about">About Us</Link>
                <Link href="/careers">Careers</Link>
                <Link href="/press">Press</Link>
              </div>
              <div className={styles.footerSection}>
                <h4>Support</h4>
                <Link href="/help">Help Center</Link>
                <Link href="/guidelines">Writing Guidelines</Link>
                <Link href="/contact">Contact Us</Link>
              </div>
              <div className={styles.footerSection}>
                <h4>Legal</h4>
                <Link href="/privacy">Privacy Policy</Link>
                <Link href="/terms">Terms of Service</Link>
                <Link href="/cookies">Cookie Policy</Link>
              </div>
              <div className={styles.footerSection}>
                <h4>Social</h4>
                <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">Twitter</a>
                <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer">LinkedIn</a>
                <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">Facebook</a>
              </div>
            </div>
            <div className={styles.footerBottom}>
              <p>&copy; {new Date().getFullYear()} BlogApp. All rights reserved.</p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  )
}
