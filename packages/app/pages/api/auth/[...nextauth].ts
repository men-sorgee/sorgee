import NextAuth from 'next-auth'
import { authOptions } from 'lib/services/auth/config'

export default NextAuth(authOptions);
