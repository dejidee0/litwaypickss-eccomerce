import React from 'react'
import { useAuth } from '../../lib/auth-context'
import LoginModal from './LoginModal'

export default function ProtectedRoute({ children, requireAdmin = false, requireAuth = true }) {
  const { isAuthenticated, isAdmin, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  if (requireAuth && !isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center space-y-6">
          <div className="bg-white p-8 rounded-xl shadow-lg max-w-md mx-auto">
            <div className="bg-red-100 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <svg className="h-8 w-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Authentication Required</h2>
            <p className="text-gray-600 mb-6">Please sign in to access this page.</p>
            <LoginModal isOpen={true} onClose={() => window.history.back()} />
          </div>
        </div>
      </div>
    )
  }

  if (requireAdmin && !isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center space-y-6">
          <div className="bg-white p-8 rounded-xl shadow-lg max-w-md mx-auto">
            <div className="bg-red-100 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <svg className="h-8 w-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728L5.636 5.636m12.728 12.728L18.364 5.636M5.636 18.364l12.728-12.728" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Access Denied</h2>
            <p className="text-gray-600 mb-6">
              You need administrator privileges to access this page.
            </p>
            <div className="space-y-3">
              <button
                onClick={() => window.history.back()}
                className="w-full btn btn-outline"
              >
                Go Back
              </button>
              <LoginModal isOpen={true} onClose={() => window.history.back()} />
            </div>
          </div>
        </div>
      </div>
    )
  }

  return children
}