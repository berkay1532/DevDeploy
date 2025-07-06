"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Github, Zap, Server, Globe, ArrowRight, Star, GitBranch, LogOut, Loader2, AlertCircle } from "lucide-react"
import { useGitHubAuth } from "@/hooks/useGitHubAuth"

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

export default function HomePage() {
  const { user, loading, error, signIn, signOut, fetchRepositories, exchangeCodeForToken } = useGitHubAuth()
  const [selectedOption, setSelectedOption] = useState<"walrus" | "oasis" | null>(null)
  const [selectedRepo, setSelectedRepo] = useState<Repository | null>(null)
  const [repositories, setRepositories] = useState<Repository[]>([])
  const [reposLoading, setReposLoading] = useState(false)
  const [deploying, setDeploying] = useState(false)
  const [reposError, setReposError] = useState<string | null>(null)

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const code = params.get('code')
    const state = params.get('state')

    if (code) {
      exchangeCodeForToken(code)
        .then(({ access_token, user }) => {
          localStorage.setItem('github_access_token', access_token)
          localStorage.setItem('github_user', JSON.stringify(user))
          window.location.href = '/' // Sayfayı temizle
        })
        .catch((err) => {
          console.error('GitHub login failed:', err.message)
        })
    }
  }, [])

  useEffect(() => {
    if (user && selectedOption) {
      fetchUserRepositories()
    }
  }, [user, selectedOption])

  const fetchUserRepositories = async () => {
    setReposLoading(true)
    setReposError(null)
    try {
      const repos = await fetchRepositories()
      setRepositories(repos)
    } catch (err) {
      console.error("Error fetching repositories:", err)
      setReposError("Failed to load repositories. Please try again.")
      setRepositories([])
    } finally {
      setReposLoading(false)
    }
  }

  const handleSignIn = async () => {
    try {
      await signIn()
    } catch (err) {
      console.error("Sign in error:", err)
    }
  }

  const handleDeploy = async () => {
    if (selectedRepo && selectedOption) {
      setDeploying(true)
      // Simulate deployment process
      setTimeout(() => {
        alert(`Successfully deployed ${selectedRepo.name} using ${selectedOption.toUpperCase()}!`)
        setDeploying(false)
      }, 2000)
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffTime = Math.abs(now.getTime() - date.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    if (diffDays === 1) return "1 day ago"
    if (diffDays < 7) return `${diffDays} days ago`
    if (diffDays < 30) return `${Math.ceil(diffDays / 7)} weeks ago`
    return `${Math.ceil(diffDays / 30)} months ago`
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="flex items-center space-x-2">
          <Loader2 className="h-8 w-8 animate-spin" />
          <span>Loading...</span>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <div className="mx-auto h-12 w-12 bg-black rounded-lg flex items-center justify-center mb-4">
              <Zap className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">DevDeploy</h1>
            <p className="mt-2 text-gray-600">Deploy your projects with ease</p>
          </div>

          <Card>
            <CardHeader className="text-center">
              <CardTitle>Welcome to DevDeploy</CardTitle>
              <CardDescription>
                Connect your GitHub account to start deploying your projects using Walrus or Oasis
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {error && (
                <div className="flex items-center space-x-2 text-red-600 bg-red-50 p-3 rounded">
                  <AlertCircle className="h-4 w-4" />
                  <span className="text-sm">{error}</span>
                </div>
              )}

              <Button onClick={handleSignIn} className="w-full" size="lg">
                <Github className="mr-2 h-5 w-5" />
                Continue with GitHub
              </Button>

              <div className="mt-6 grid grid-cols-2 gap-4 text-sm text-gray-600">
                <div className="flex items-center">
                  <Globe className="h-4 w-4 mr-2 text-blue-500" />
                  Frontend with Walrus
                </div>
                <div className="flex items-center">
                  <Server className="h-4 w-4 mr-2 text-green-500" />
                  Backend with Oasis
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  if (!selectedOption) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center justify-between mb-8">
              <div className="text-center flex-1">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Choose Your Deployment Platform</h1>
                <p className="text-gray-600">Select how you want to deploy your project</p>
              </div>
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user.avatar_url} />
                    <AvatarFallback>{user.name?.[0] || user.login[0]}</AvatarFallback>
                  </Avatar>
                  <span className="text-sm font-medium">{user.name || user.login}</span>
                </div>
                <Button variant="outline" size="sm" onClick={signOut}>
                  <LogOut className="h-4 w-4 mr-2" />
                  Sign Out
                </Button>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <Card
                className={`cursor-pointer transition-all hover:shadow-lg ${selectedOption === "walrus" ? "ring-2 ring-blue-500" : ""}`}
                onClick={() => setSelectedOption("walrus")}
              >
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="h-10 w-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                        <Globe className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <CardTitle className="text-xl">Walrus</CardTitle>
                        <CardDescription>Frontend Deployment</CardDescription>
                      </div>
                    </div>
                    <ArrowRight className="h-5 w-5 text-gray-400" />
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 mb-4">
                    Deploy your frontend applications with automatic builds, CDN distribution, and global edge caching.
                  </p>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                      Automatic builds from Git
                    </div>
                    <div className="flex items-center">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                      Global CDN distribution
                    </div>
                    <div className="flex items-center">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                      SSL certificates included
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card
                className={`cursor-pointer transition-all hover:shadow-lg ${selectedOption === "oasis" ? "ring-2 ring-green-500" : ""}`}
                onClick={() => setSelectedOption("oasis")}
              >
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="h-10 w-10 bg-green-100 rounded-lg flex items-center justify-center mr-3">
                        <Server className="h-5 w-5 text-green-600" />
                      </div>
                      <div>
                        <CardTitle className="text-xl">Oasis</CardTitle>
                        <CardDescription>Backend Deployment</CardDescription>
                      </div>
                    </div>
                    <ArrowRight className="h-5 w-5 text-gray-400" />
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 mb-4">
                    Deploy your backend services with container orchestration, auto-scaling, and database management.
                  </p>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center">
                      <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                      Container orchestration
                    </div>
                    <div className="flex items-center">
                      <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                      Auto-scaling capabilities
                    </div>
                    <div className="flex items-center">
                      <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                      Database management
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Select Repository for {selectedOption === "walrus" ? "Walrus" : "Oasis"} Deployment
              </h1>
              <p className="text-gray-600">
                Choose a repository from your GitHub account to deploy
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={user.avatar_url} />
                  <AvatarFallback>{user.name?.[0] || user.login[0]}</AvatarFallback>
                </Avatar>
                <span className="text-sm font-medium">{user.name || user.login}</span>
              </div>
              <Button variant="outline" size="sm" onClick={() => setSelectedOption(null)}>
                Back
              </Button>
              <Button variant="outline" size="sm" onClick={signOut}>
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </Button>
            </div>
          </div>

          {reposError && (
            <div className="mb-6 flex items-center space-x-2 text-red-600 bg-red-50 p-4 rounded-lg">
              <AlertCircle className="h-5 w-5" />
              <span>{reposError}</span>
            </div>
          )}

          {reposLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="flex items-center space-x-2">
                <Loader2 className="h-6 w-6 animate-spin" />
                <span>Loading repositories...</span>
              </div>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {repositories.map((repo) => (
                <Card
                  key={repo.id}
                  className={`cursor-pointer transition-all hover:shadow-lg ${
                    selectedRepo?.id === repo.id ? "ring-2 ring-blue-500" : ""
                  }`}
                  onClick={() => setSelectedRepo(repo)}
                >
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <CardTitle className="text-lg truncate">{repo.name}</CardTitle>
                        <CardDescription className="truncate">
                          {repo.description || "No description"}
                        </CardDescription>
                      </div>
                      {repo.private && (
                        <Badge variant="secondary" className="ml-2 flex-shrink-0">
                          Private
                        </Badge>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {repo.language && (
                        <div className="flex items-center text-sm text-gray-600">
                          <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
                          {repo.language}
                        </div>
                      )}
                      <div className="flex items-center justify-between text-sm text-gray-600">
                        <div className="flex items-center">
                          <Star className="h-4 w-4 mr-1" />
                          {repo.stargazers_count}
                        </div>
                        <div className="flex items-center">
                          <GitBranch className="h-4 w-4 mr-1" />
                          {repo.default_branch}
                        </div>
                      </div>
                      <div className="text-xs text-gray-500">
                        Updated {formatDate(repo.updated_at)}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {selectedRepo && (
            <div className="mt-8">
              <Card>
                <CardHeader>
                  <CardTitle>Deploy {selectedRepo.name}</CardTitle>
                  <CardDescription>
                    Ready to deploy {selectedRepo.full_name} using {selectedOption === "walrus" ? "Walrus" : "Oasis"}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div>
                        <h3 className="font-medium">{selectedRepo.name}</h3>
                        <p className="text-sm text-gray-600">{selectedRepo.description || "No description"}</p>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium">{selectedOption === "walrus" ? "Walrus" : "Oasis"}</div>
                        <div className="text-xs text-gray-500">Deployment Platform</div>
                      </div>
                    </div>
                    <Button
                      onClick={handleDeploy}
                      disabled={deploying}
                      className="w-full"
                      size="lg"
                    >
                      {deploying ? (
                        <>
                          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                          Deploying...
                        </>
                      ) : (
                        <>
                          <Zap className="mr-2 h-5 w-5" />
                          Deploy Now
                        </>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
