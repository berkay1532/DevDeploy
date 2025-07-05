import type { NextAuthOptions } from "next-auth"
import GithubProvider from "next-auth/providers/github"

// if (!process.env.GITHUB_CLIENT_ID || !process.env.GITHUB_CLIENT_SECRET) {
//   throw new Error("Missing GitHub OAuth credentials")
// }

// if (!process.env.NEXTAUTH_SECRET) {
//   throw new Error("Missing NEXTAUTH_SECRET")
// }

export const authOptions: NextAuthOptions = {
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET || "c38eae951027b7f41d790c3be9800d1c12a766a0",
      authorization: {
        params: {
          scope: "read:user user:email repo",
        },
      },
    }),
  ],
  callbacks: {
    async jwt({ token, account, profile }) {
      if (account) {
        token.accessToken = account.access_token
        token.login = (profile as any)?.login
      }
      return token
    },
    async session({ session, token }) {
      if (token.accessToken) {
        session.accessToken = token.accessToken as string
      }
      if (token.login) {
        session.user.login = token.login as string
      }
      return session
    },
  },
  pages: {
    signIn: "/",
    error: "/auth/error",
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
}
