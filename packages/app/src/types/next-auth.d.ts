import NextAuth, { DefaultSession } from "next-auth";
import { DefaultJWT, JWT } from "next-auth/jwt";
import { User, UserSession } from "../lib/models";

declare module 'next-auth' {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session extends DefaultSession {
    user: Partial<User>;
  }
}
declare module 'next-auth/JWT' {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface JWT extends DefaultJWT, Profile { }
}
