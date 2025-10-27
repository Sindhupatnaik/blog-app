'use client';

import './styles/globals.css';
import './styles/components.css';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useTheme } from './context/ThemeContext';

function Navbar() {
  const { darkMode, toggleTheme } = useTheme();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('auth_token');
    const user = localStorage.getItem('user');
    if (token && user) {
      setIsLoggedIn(true);
      setUsername(JSON.parse(user).name);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user');
    setIsLoggedIn(false);
    setUsername('');
    window.location.href = '/';
  };

  return (
    <header className={darkMode ? 'dark-mode' : ''}>
      <nav className="container">
        <div className="nav-brand">
          <Link href="/">BlogSpace</Link>
        </div>
        <div className="nav-links">
          <Link href="/">Home</Link>
          {isLoggedIn ? (
            <>
              <Link href="/create">Write Blog</Link>
              <Link href="/my-blogs">My Blogs</Link>
              <button onClick={handleLogout} className="nav-button">Logout</button>
              <span className="username">Welcome, {username}</span>
            </>
          ) : (
            <>
              <Link href="/signup">Sign Up</Link>
              <Link href="/login">Login</Link>
            </>
          )}
          <button onClick={toggleTheme} className="theme-toggle">
            {darkMode ? '☀️' : '🌙'}
          </button>
        </div>
      </nav>
    </header>
  );
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <ThemeProvider>
          <AuthProvider>
            <Navbar />
            <main className="container">
              {children}
            </main>
            <footer className="footer">
              <div className="container">
                <p>&copy; {new Date().getFullYear()} BlogSpace. All rights reserved.</p>
              </div>
            </footer>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}