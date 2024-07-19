import NextAuth from "next-auth"
import { nextAuthConfig } from '@/entities/session/next-auth-config'

const handler = NextAuth(nextAuthConfig)

export { handler as GET, handler as POST }