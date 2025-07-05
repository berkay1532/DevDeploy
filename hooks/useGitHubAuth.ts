import { useState, useEffect } from 'react'

interface GitHubUser {
  id: number
  login: string
  name: string
  avatar_url: string
  email: string
}

interface Repository {
  id: number
  name: string
  full_name: string
  description: string
  language: string
  stargazers_count: number
  updated_at: string
  html_url: string
  default_branch: string
  private: boolean
}

export function useGitHubAuth() {
  const [user, setUser] = useState<GitHubUser | null>(null)
  const [accessToken, setAccessToken] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Check if user is already authenticated
  useEffect(() => {
    const token = localStorage.getItem('github_access_token')
    const userData = localStorage.getItem('github_user')
    
    if (token && userData) {
      setAccessToken(token)
      setUser(JSON.parse(userData))
    }
  }, [])

  const signIn = async () => {
    setLoading(true)
    setError(null)
    
    try {
      const clientId = process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID
      const redirectUri = window.location.origin + '/auth/callback'
      
      // Generate random state for security
      const state = Math.random().toString(36).substring(7)
      
      // Store state in localStorage
      localStorage.setItem('github_oauth_state', state)
      
      // Build authorization URL
      const authUrl = new URL('https://github.com/login/oauth/authorize')
      authUrl.searchParams.set('client_id', clientId!)
      authUrl.searchParams.set('redirect_uri', redirectUri)
      authUrl.searchParams.set('scope', 'read:user user:email repo')
      authUrl.searchParams.set('state', state)
      
      window.location.href = authUrl.toString()
    } catch (err) {
      setError('Failed to initiate GitHub login')
      setLoading(false)
    }
  }

  const signOut = () => {
    localStorage.removeItem('github_access_token')
    localStorage.removeItem('github_user')
    localStorage.removeItem('github_oauth_state')
    setUser(null)
    setAccessToken(null)
  }

  const exchangeCodeForToken = async (code: string): Promise<{ access_token: string; user: GitHubUser }> => {
    // Backend endpoint URL - bunu kendi backend URL'inizle değiştirin
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3001'
    
    const response = await fetch(`${backendUrl}/auth/github`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ code }),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.error || 'Failed to exchange code for token')
    }

    const data = await response.json()

    // Backend sadece access_token döndürüyor, user bilgisini ayrıca alalım
    const userResponse = await fetch('https://api.github.com/user', {
      headers: {
        Authorization: `Bearer ${data.access_token}`,
        Accept: 'application/vnd.github.v3+json',
      },
    })

    if (!userResponse.ok) {
      throw new Error('Failed to fetch user information')
    }

    const userData = await userResponse.json()

    return {
      access_token: data.access_token,
      user: {
        id: userData.id,
        login: userData.login,
        name: userData.name,
        avatar_url: userData.avatar_url,
        email: userData.email,
      },
    }
  }

  const fetchRepositories = async (): Promise<Repository[]> => {
    if (!accessToken) {
      throw new Error('No access token available')
    }

    const response = await fetch('https://api.github.com/user/repos?sort=updated&per_page=50', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: 'application/vnd.github.v3+json',
      },
    })

    if (!response.ok) {
      throw new Error('Failed to fetch repositories')
    }

    const repos = await response.json()
    
    return repos.map((repo: any) => ({
      id: repo.id,
      name: repo.name,
      full_name: repo.full_name,
      description: repo.description,
      language: repo.language,
      stargazers_count: repo.stargazers_count,
      updated_at: repo.updated_at,
      html_url: repo.html_url,
      clone_url: repo.clone_url,
      default_branch: repo.default_branch,
      private: repo.private,
    }))
  }

  return {
    user,
    accessToken,
    loading,
    error,
    signIn,
    signOut,
    exchangeCodeForToken,
    fetchRepositories,
  }
} 