"use client"

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2, AlertCircle } from 'lucide-react'
import { useGitHubAuth } from '@/hooks/useGitHubAuth'

export default function AuthCallback() {
  const router = useRouter()
  const { exchangeCodeForToken } = useGitHubAuth()
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const handleCallback = async () => {
      const urlParams = new URLSearchParams(window.location.search)
      const code = urlParams.get('code')
      const state = urlParams.get('state')
      const savedState = localStorage.getItem('github_oauth_state')

      if (!code) {
        setError('No authorization code received')
        return
      }

      if (state !== savedState) {
        setError('Invalid state parameter')
        return
      }

      try {
        // Exchange code for access token using backend
        const data = await exchangeCodeForToken(code)
        
        // Store token and user data
        localStorage.setItem('github_access_token', data.access_token)
        localStorage.setItem('github_user', JSON.stringify(data.user))
        
        // Clean up
        localStorage.removeItem('github_oauth_state')
        
        // Redirect back to home
        router.push('/')
      } catch (err) {
        console.error('Auth callback error:', err)
        setError('Failed to complete authentication')
      }
    }

    handleCallback()
  }, [router, exchangeCodeForToken])

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
        <div className="max-w-md w-full text-center">
          <div className="flex items-center justify-center mb-4">
            <AlertCircle className="h-12 w-12 text-red-500" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Authentication Error</h1>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => router.push('/')}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Go Back Home
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center">
        <div className="flex items-center justify-center mb-4">
          <Loader2 className="h-12 w-12 animate-spin text-blue-500" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Completing Authentication</h1>
        <p className="text-gray-600">Please wait while we complete your GitHub login...</p>
      </div>
    </div>
  )
} 