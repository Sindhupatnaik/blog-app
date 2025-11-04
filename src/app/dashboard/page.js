"use client"

import React, { useEffect, useState } from 'react'
import '../../../styles/dashboard.css'

export default function DashboardPage(){
  const [theme, setTheme] = useState('light')

  useEffect(()=>{
    try{
      const stored = localStorage.getItem('theme')
      const initial = stored || (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
      setTheme(initial)
      document.documentElement.setAttribute('data-theme', initial)
    }catch(e){}
  },[])

  function toggleTheme(){
    const next = theme === 'light' ? 'dark' : 'light'
    setTheme(next)
    try{ localStorage.setItem('theme', next) }catch(e){}
    document.documentElement.setAttribute('data-theme', next)
  }

  return (
    <div className="db-root">
      <header className="db-header">
        <div className="db-container db-header-inner">
          <div className="logo">BlogApp</div>
          <nav className="db-nav">
            <a href="/blogs">Blogs</a>
            <a href="/write">Write</a>
            <button className="theme-toggle" onClick={toggleTheme} aria-label="Toggle theme">
              {theme === 'light' ? '🌙' : '☀️'}
            </button>
          </nav>
        </div>
      </header>

      <main className="db-main">
        <div className="db-container db-hero">
          <div className="hero-left">
            <h1>Welcome to Your Dashboard</h1>
            <p className="sub">Create and manage your blog posts</p>
            <div className="hero-ctas">
              <a className="btn btn-black" href="/write">Start Writing</a>
            </div>
          </div>

          <div className="hero-right" aria-hidden="true">
            <div className="illustration" />
          </div>
        </div>
      </main>

      
    </div>
  )
}
