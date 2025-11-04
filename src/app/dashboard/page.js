'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '../context/AuthContext'

export default function ProfileSettingsPage() {
  const router = useRouter()
  const { user, logout } = useAuth()
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  useEffect(() => {
    if (!user) {
      router.push('/login')
      return
    }
    // Load user data
    setUsername(user.username || '')
    setEmail(user.email || '')
  }, [user, router])

  const handleUpdateProfile = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')

    try {
      // For now, just show success message
      // In a real app, you'd call an API endpoint to update the profile
      setSuccess('Profile updated successfully!')
      setTimeout(() => setSuccess(''), 3000)
    } catch (error) {
      setError('Failed to update profile')
    } finally {
      setLoading(false)
    }
  }

  const handleChangePassword = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')

    if (newPassword !== confirmPassword) {
      setError('New passwords do not match')
      setLoading(false)
      return
    }

    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters long')
      setLoading(false)
      return
    }

    try {
      // For now, just show success message
      // In a real app, you'd call an API endpoint to change password
      setSuccess('Password changed successfully!')
      setCurrentPassword('')
      setNewPassword('')
      setConfirmPassword('')
      setTimeout(() => setSuccess(''), 3000)
    } catch (error) {
      setError('Failed to change password')
    } finally {
      setLoading(false)
    }
  }

  if (!user) {
    return null
  }

  return (
    <main className="flex-1 p-8 max-w-4xl">
      {/* Header */}
      <div className="mb-12">
        <h1 className="text-5xl font-bold text-black mb-4">
          Profile Settings
        </h1>
        <p className="text-xl text-black/60">
          Manage your account settings and preferences
        </p>
      </div>

      {/* Profile Information Section */}
      <div className="mb-12">
        <div className="border border-black/10 rounded-2xl p-8 mb-8">
          <h2 className="text-3xl font-bold text-black mb-6">Profile Information</h2>
          
          {error && (
            <div className="border border-black/20 bg-black/5 text-black px-4 py-3 rounded-xl mb-6">
              {error}
            </div>
          )}
          
          {success && (
            <div className="border border-black/20 bg-black/5 text-black px-4 py-3 rounded-xl mb-6">
              {success}
            </div>
          )}

          <form onSubmit={handleUpdateProfile} className="space-y-6">
            <div>
              <label htmlFor="username" className="block text-sm font-semibold text-black mb-2">
                Username
              </label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-6 py-4 border border-black/20 rounded-xl text-black placeholder-black/40 focus:outline-none focus:ring-2 focus:ring-black focus:border-black transition-all bg-white"
                placeholder="Enter your username"
                disabled
              />
              <p className="text-xs text-black/50 mt-1">Username cannot be changed</p>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-black mb-2">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-6 py-4 border border-black/20 rounded-xl text-black placeholder-black/40 focus:outline-none focus:ring-2 focus:ring-black focus:border-black transition-all bg-white"
                placeholder="Enter your email"
                disabled
              />
              <p className="text-xs text-black/50 mt-1">Email cannot be changed</p>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="bg-black text-white px-8 py-4 rounded-full hover:bg-black/90 transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Updating...' : 'Update Profile'}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Change Password Section */}
      <div className="mb-12">
        <div className="border border-black/10 rounded-2xl p-8">
          <h2 className="text-3xl font-bold text-black mb-6">Change Password</h2>

          <form onSubmit={handleChangePassword} className="space-y-6">
            <div>
              <label htmlFor="currentPassword" className="block text-sm font-semibold text-black mb-2">
                Current Password
              </label>
              <input
                id="currentPassword"
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="w-full px-6 py-4 border border-black/20 rounded-xl text-black placeholder-black/40 focus:outline-none focus:ring-2 focus:ring-black focus:border-black transition-all bg-white"
                placeholder="Enter current password"
                required
              />
            </div>

            <div>
              <label htmlFor="newPassword" className="block text-sm font-semibold text-black mb-2">
                New Password
              </label>
              <input
                id="newPassword"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full px-6 py-4 border border-black/20 rounded-xl text-black placeholder-black/40 focus:outline-none focus:ring-2 focus:ring-black focus:border-black transition-all bg-white"
                placeholder="Enter new password"
                minLength={6}
                required
              />
              <p className="text-xs text-black/50 mt-1">Password must be at least 6 characters</p>
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-semibold text-black mb-2">
                Confirm New Password
              </label>
              <input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-6 py-4 border border-black/20 rounded-xl text-black placeholder-black/40 focus:outline-none focus:ring-2 focus:ring-black focus:border-black transition-all bg-white"
                placeholder="Confirm new password"
                minLength={6}
                required
              />
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="bg-black text-white px-8 py-4 rounded-full hover:bg-black/90 transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Changing Password...' : 'Change Password'}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Account Actions Section */}
      <div className="border-t border-black/10 pt-8">
        <h2 className="text-3xl font-bold text-black mb-6">Account Actions</h2>
        <div className="space-y-4">
          <button
            onClick={logout}
            className="border-2 border-black text-black px-8 py-4 rounded-full hover:bg-black hover:text-white transition-colors font-semibold"
          >
            Logout
          </button>
        </div>
      </div>
    </main>
  )
}
