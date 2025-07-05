"use client"

import { useState, useEffect } from "react"
import { useSession, signIn, signOut } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Github, Zap, Server, Globe, ArrowRight, Star, GitBranch, LogOut, Loader2, AlertCircle } from "lucide-react"

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
  const { data: session, status } = useSession()
  const [selectedOption, setSelectedOption] = useState<"walrus" | "oasis" | null>(null)
  const [selectedRepo, setSelectedRepo] = useState<Repository | null>(null)
  const [repositories, setRepositories] = useState<Repository[]>([])
  const [loading, setLoading] = useState(false)
  const [deploying, setDeploying] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (session && selectedOption) {
      fetchRepositories()
    }
  }, [session, selectedOption])

  const fetchRepositories = async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch("/api/github/repos")
      if (response.ok) {
        const repos = await response.json()
        console.log("Fetched repositories:", repos)
        
        // Ensure repos is an array
        if (Array.isArray(repos)) {
          setRepositories(repos)
        } else {
          console.error("Repositories is not an array:", repos)
          setError("Invalid data received from server")
          setRepositories([])
        }
      } else {
        const errorData = await response.json().catch(() => ({}))
        console.error("API error:", errorData)
        throw new Error(errorData.error || "Failed to fetch repositories")
      }
    } catch (error) {
      console.error("Error fetching repositories:", error)
      setError("Failed to load repositories. Please try again.")
      setRepositories([])
    } finally {
      setLoading(false)
    }
  }

  const handleSignIn = async () => {
    try {
      await signIn("github", { callbackUrl: "/" })
    } catch (error) {
      console.error("Sign in error:", error)
      setError("Failed to sign in. Please try again.")
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

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="flex items-center space-x-2">
          <Loader2 className="h-8 w-8 animate-spin" />
          <span>Loading...</span>
        </div>
      </div>
    )
  }

  if (!session) {
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
                    <AvatarImage src={session.user?.image || ""} />
                    <AvatarFallback>{session.user?.name?.[0]}</AvatarFallback>
                  </Avatar>
                  <span className="text-sm font-medium">{session.user?.name}</span>
                </div>
                <Button variant="outline" size="sm" onClick={() => signOut()}>
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
                    <Badge variant="secondary">Frontend</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">
                    Perfect for React, Vue, Angular, and static sites. Deploy your frontend applications with global CDN
                    and automatic SSL.
                  </p>
                  <div className="space-y-2 text-sm text-gray-500">
                    <div className="flex items-center">
                      <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                      Global CDN
                    </div>
                    <div className="flex items-center">
                      <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                      Automatic SSL
                    </div>
                    <div className="flex items-center">
                      <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                      Custom Domains
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
                    <Badge variant="secondary">Backend</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">
                    Deploy Node.js, Python, Go, and other backend applications with auto-scaling and monitoring.
                  </p>
                  <div className="space-y-2 text-sm text-gray-500">
                    <div className="flex items-center">
                      <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                      Auto-scaling
                    </div>
                    <div className="flex items-center">
                      <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                      Health Monitoring
                    </div>
                    <div className="flex items-center">
                      <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                      Database Support
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {selectedOption && (
              <div className="text-center">
                <Button onClick={() => setSelectedOption(selectedOption)} size="lg" className="px-8">
                  Continue with {selectedOption === "walrus" ? "Walrus" : "Oasis"}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Select Repository</h1>
              <p className="text-gray-600">
                Choose a repository to deploy with {selectedOption === "walrus" ? "Walrus" : "Oasis"}
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <Badge variant="outline" className="text-sm">
                <Github className="h-3 w-3 mr-1" />
                Connected
              </Badge>
              <Button variant="outline" size="sm" onClick={() => setSelectedOption(null)}>
                Back
              </Button>
            </div>
          </div>

          {error && (
            <div className="flex items-center space-x-2 text-red-600 bg-red-50 p-4 rounded mb-6">
              <AlertCircle className="h-4 w-4" />
              <span>{error}</span>
            </div>
          )}

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin" />
              <span className="ml-2">Loading repositories...</span>
            </div>
          ) : (
            <div className="grid gap-4 mb-8">
              {Array.isArray(repositories) && repositories.length > 0 ? (
                repositories.map((repo) => (
                  <Card
                    key={repo.id}
                    className={`cursor-pointer transition-all hover:shadow-md ${selectedRepo?.id === repo.id ? "ring-2 ring-blue-500" : ""}`}
                    onClick={() => setSelectedRepo(repo)}
                  >
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center mb-2">
                            <h3 className="text-lg font-semibold text-gray-900 mr-3">{repo.name}</h3>
                            {repo.language && (
                              <Badge variant="secondary" className="text-xs mr-2">
                                {repo.language}
                              </Badge>
                            )}
                            {repo.private && (
                              <Badge variant="outline" className="text-xs">
                                Private
                              </Badge>
                            )}
                          </div>
                          <p className="text-gray-600 mb-3">{repo.description || "No description available"}</p>
                          <div className="flex items-center text-sm text-gray-500 space-x-4">
                            <div className="flex items-center">
                              <Star className="h-3 w-3 mr-1" />
                              {repo.stargazers_count}
                            </div>
                            <div className="flex items-center">
                              <GitBranch className="h-3 w-3 mr-1" />
                              {repo.default_branch}
                            </div>
                            <span>Updated {formatDate(repo.updated_at)}</span>
                          </div>
                        </div>
                        {selectedRepo?.id === repo.id && (
                          <div className="ml-4">
                            <div className="h-5 w-5 bg-blue-500 rounded-full flex items-center justify-center">
                              <div className="h-2 w-2 bg-white rounded-full"></div>
                            </div>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <div className="text-center py-12">
                  <p className="text-gray-500">No repositories found or failed to load repositories.</p>
                </div>
              )}
            </div>
          )}

          {selectedRepo && (
            <div className="flex items-center justify-between bg-white p-6 rounded-lg border">
              <div>
                <h3 className="font-semibold text-gray-900">Ready to Deploy</h3>
                <p className="text-gray-600">
                  Deploy <span className="font-medium">{selectedRepo.name}</span> using{" "}
                  {selectedOption === "walrus" ? "Walrus" : "Oasis"}
                </p>
              </div>
              <Button onClick={handleDeploy} size="lg" className="px-8" disabled={deploying}>
                {deploying ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Deploying...
                  </>
                ) : (
                  <>
                    <Zap className="mr-2 h-4 w-4" />
                    Deploy Now
                  </>
                )}
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
