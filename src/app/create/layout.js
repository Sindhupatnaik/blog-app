'use client'

import DashboardSidebar from '../../components/DashboardSidebar'

export default function CreateLayout({ children }) {
  return (
    <div className="flex min-h-screen bg-white">
      <DashboardSidebar />
      <div className="flex-1">
        {children}
      </div>
    </div>
  )
}

