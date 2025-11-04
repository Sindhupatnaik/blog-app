import './globals.css'
import { AuthProvider } from './context/AuthContext'
import ConditionalLayout from '../components/ConditionalLayout'

export const metadata = {
  title: 'Blog App',
  description: 'A modern blogging platform',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-white">
        <AuthProvider>
          <ConditionalLayout>
            {children}
          </ConditionalLayout>
        </AuthProvider>
      </body>
    </html>
  )
}






