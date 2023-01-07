import { AuthOptions } from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import DiscordProvider from 'next-auth/providers/discord'
import { TwitterLegacy } from 'next-auth/providers/twitter'
import MicrosoftProvider from 'next-auth/providers/azure-ad'
import YahooProvider from './yahoo'
import EmailProvider from 'next-auth/providers/email'
import { authAdapter } from './adapter'
import { sendNotificationEmail, updateSendGrid } from 'lib/services/sendgrid/server'
import {
  createAccount,
  createUser,
  findUser,
  findUserByAccount,
  recordUserLogin,
} from 'lib/services/directus/server/users'
import { Member, memberFields, Profile, User, UserStatusType } from 'lib/models'
import { sendNotification } from '../twilio/server'

const allowedStatuses: UserStatusType[] = ['new', 'active', 'inactive', 'stale']
export const authOptions: AuthOptions = {
  adapter: authAdapter,
  secret: process.env.AUTH_SECRET,
  session: {
    strategy: 'database',
    maxAge: 10 * 24 * 60 * 60, // 10 days
    updateAge: 1 * 24 * 60 * 60, // 1 day
  },
  theme: {
    logo: 'https://static.guysnheat.com/static/logo.png',
    brandColor: '#0038A8', // brand.colors.primary.DEFAULT,
    colorScheme: 'dark',
  },

  callbacks: {
    async signIn({ email, profile, account }) {
      console.debug('callback:signIn')

      if (email?.verificationRequest) {
        const user = await findUser(account.userId)
        return user && allowedStatuses.includes(user.status)
      } else if (profile?.email) {
        let user: Partial<User> = await findUser(profile.email)
        if (!user) {
          console.debug('creating user')
          user = await createUser({
            email: profile.email,
            first_name: profile.name,
            user_type: 'subscriber',
            status: 'new',
            notes: 'Tried to login without an invite',
          })
          const {
            provider,
            providerAccountId,
            type,
            access_token,
            expires_at,
            id_token,
            refresh_token,
            scope,
          } = account
          await createAccount({
            provider,
            provider_id: providerAccountId,
            user: user.id,
            type,
            scope,
            access_token,
            expires_at,
            id_token,
            refresh_token,
          })
          return '/limited'
        }
        let existingAccount = await findUserByAccount(account.provider, account.providerAccountId)
        if (!existingAccount) {
          console.debug('creating user')
          const {
            provider,
            providerAccountId,
            type,
            access_token,
            expires_at,
            id_token,
            refresh_token,
            scope,
          } = account
          await createAccount({
            provider,
            provider_id: providerAccountId,
            user: user.id,
            type,
            scope,
            access_token,
            expires_at,
            id_token,
            refresh_token,
          })
        }
        return true
      }
      return true
    },
    async session({ session, user }) {
      console.debug('callback:session')
      const fullUser = await findUser<Member>(user.email, memberFields)
      session.user = fullUser
      return session
    },
  },
  events: {
    async createUser({ user }) {
      console.log('event:createUser')
      console.dir(user)
      await updateSendGrid(user as Profile)
      await sendNotificationEmail(
        user.email,
        user.name,
        `Application Status`,
        'Thank you for applying for membership!',
        {
          button_text: 'Complete Application',
          button_url: 'https://guysnheat.com/apply/resume',
        }
      )
    },
    async signIn({ user, account, profile }) {
      console.log('event:signIn')
      //console.dir({ user, account, profile })
      /* on successful sign in */
      await recordUserLogin(user.id)
    },
  },
  providers: [
    GoogleProvider({
      clientId:
        process.env.GOOGLE_CLIENT_ID ||
        '806946159244-d8tvf8n5rcb9hshl4agk2lfgli6vdmhe.apps.googleusercontent.com',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      allowDangerousEmailAccountLinking: true,
    }),
    DiscordProvider({
      clientId: process.env.DISCORD_CLIENT_ID || '1027516437134319648',
      clientSecret: process.env.DISCORD_CLIENT_SECRET,
      allowDangerousEmailAccountLinking: true,
    }),
    TwitterLegacy({
      name: 'Twitter',
      clientId: process.env.TWITTER_CLIENT_ID || 'LigZOUxGK6JVIUXRURIKKukYu',
      clientSecret: process.env.TWITTER_CLIENT_SECRET,
      allowDangerousEmailAccountLinking: true,
    }),
    MicrosoftProvider({
      id: 'microsoft',
      name: 'Microsoft',
      clientId: process.env.MICROSOFT_CLIENT_ID || 'bcb07c66-6c9b-422a-b6a1-29966b392849',
      clientSecret: process.env.MICROSOFT_CLIENT_SECRET,
      allowDangerousEmailAccountLinking: true,
    }),
    YahooProvider({
      clientId:
        process.env.YAHOO_CLIENT_ID ||
        'dj0yJmk9SlNWNlB3UDlqaGluJmQ9WVdrOWNsVmFlbmh6ZFcwbWNHbzlNQT09JnM9Y29uc3VtZXJzZWNyZXQmc3Y9MCZ4PTA1',
      clientSecret: process.env.YAHOO_CLIENT_SECRET,
      allowDangerousEmailAccountLinking: true,
    }),
    EmailProvider({
      async sendVerificationRequest({ identifier: email, url }) {
        await sendNotificationEmail(
          email,
          'User',
          'Sign in to GuysNHeat',
          'Click the button below to sign in to GuysNHeat',
          {
            button_link: 'Sign In',
            button_url: url,
          }
        )
      },
    }),
  ],
}
