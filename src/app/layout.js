'use client';

import './styles/globals.css';
import './styles/components.css';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import Navbar from '../components/Navbar';
import { usePathname } from 'next/navigation';

export default function RootLayout({ children }) {
  const pathname = usePathname();

  // ✅ Hide Navbar on all dashboard pages
  const hideNavbar = pathname.startsWith('/dashboard');

  return (
    <html lang="en">
      <body>
        <ThemeProvider>
          <AuthProvider>

            {!hideNavbar && <Navbar />}   {/* ✅ Only show Navbar when NOT on /dashboard */}

            <main>
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
