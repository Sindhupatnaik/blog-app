'use client';

import '../styles/globals.css';
import '../styles/components.css';
import { ThemeProvider } from '../context/ThemeContext';
import { AuthProvider } from '../context/AuthContext';

export default function DashboardLayout({ children }) {
  return (
    
        <ThemeProvider>
          <AuthProvider>
            <main>
              {children}
            </main>
            <footer className="footer">
              <div className="container">
                
              </div>
            </footer>
          </AuthProvider>
        </ThemeProvider>
  );
}