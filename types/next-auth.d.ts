declare module "next-auth" {
  interface Session {
    accessToken?: string
    user: {
      name?: string | null
      email?: string | null
      image?: string | null
      login?: string
    }
  }

  interface Profile {
    login?: string
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    accessToken?: string
    login?: string
  }
}
