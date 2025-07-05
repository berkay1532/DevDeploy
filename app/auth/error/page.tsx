"use client"

import { useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle, ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function AuthError() {
  const searchParams = useSearchParams()
  const error = searchParams.get("error")

  const getErrorMessage = (error: string | null) => {
    switch (error) {
      case "Configuration":
        return "There is a problem with the server configuration."
      case "AccessDenied":
        return "Access was denied. Please try again."
      case "Verification":
        return "The verification token has expired or has already been used."
      case "OAuthSignin":
        return "Error in constructing an authorization URL."
      case "OAuthCallback":
        return "Error in handling the response from an OAuth provider."
      case "OAuthCreateAccount":
        return "Could not create OAuth account in the database."
      case "EmailCreateAccount":
        return "Could not create email account in the database."
      case "Callback":
        return "Error in the OAuth callback handler route."
      case "OAuthAccountNotLinked":
        return "The account is not linked. Please sign in with the same account you used originally."
      case "EmailSignin":
        return "Sending the e-mail with the verification token failed."
      case "CredentialsSignin":
        return "The authorize callback returned null in the Credentials provider."
      case "SessionRequired":
        return "The content of this page requires you to be signed in at all times."
      default:
        return "An unknown error occurred during authentication."
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <Card>
          <CardHeader className="text-center">
            <div className="mx-auto h-12 w-12 bg-red-100 rounded-lg flex items-center justify-center mb-4">
              <AlertCircle className="h-6 w-6 text-red-600" />
            </div>
            <CardTitle className="text-red-900">Authentication Error</CardTitle>
            <CardDescription>{getErrorMessage(error)}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded">
              <strong>Error Code:</strong> {error || "Unknown"}
            </div>
            <div className="flex flex-col space-y-2">
              <Link href="/">
                <Button className="w-full">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Home
                </Button>
              </Link>
              <Button variant="outline" onClick={() => window.location.reload()}>
                Try Again
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
