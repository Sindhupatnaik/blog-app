"use client"

import React from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import styles from './Navbar.module.css'
import { useAuth } from '../app/context/AuthContext'

export default function Navbar() {
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    // remove cookie as well
    document.cookie = 'auth_token=; path=/; max-age=0';
    router.push('/');
  }

  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <div className="brand logo">
          <Link href="/" className={styles.logo}>BlogApp</Link>
        </div>

        <nav className={styles.nav}>
          <a className={styles.link} href="/">Home</a>
          <a className={styles.link} href="/blogs">Blogs</a>
          {!user && <a className={styles.link} href="/login">Log in</a>}
          {!user && <Link href="/signup" className={styles.cta}>Sign up</Link>}
          {user && <Link href="/dashboard" className={styles.link}>Dashboard</Link>}
          {user && <button className={styles.cta} onClick={handleLogout}>Sign out</button>}
        </nav>
      </div>
    </header>
  )
}
