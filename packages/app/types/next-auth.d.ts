import NextAuth, { DefaultSession } from 'next-auth'
import { JWT, DefaultJWT } from 'next-auth/jwt'
import { Profile } from 'lib/models/users'

declare module 'next-auth' {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user: DefaultSession['user'] & Profile
  }
}
declare module 'next-auth/JWT' {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface JWT extends DefaultJWT, Profile {}
}
