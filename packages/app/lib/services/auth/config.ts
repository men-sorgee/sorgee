import { AuthOptions } from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import DiscordProvider from 'next-auth/providers/discord'
import MicrosoftProvider from 'next-auth/providers/azure-ad'
import YahooProvider from './yahoo'
import EmailProvider from 'next-auth/providers/email'
import { TwitterLegacy } from 'next-auth/providers/twitter'
import { authAdapter } from './adapter'
import { sendNotificationEmail, updateSendGrid } from 'lib/services/sendgrid/server'
import {
  createAccount,
  createUser,
  findUser,
  findUserByAccount,
  recordUserLogin,
  // recordUserLogout,
} from 'lib/services/directus/server/users'
import { Member, memberFields, Profile, User, UserStatusType } from 'lib/models'
import config from 'lib/config/server'
const { google, discord, twitter, yahoo, microsoft } = config
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
    logo: '/logo.svg',
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
    async signIn({ user }) {
      console.log('event:signIn')
      await recordUserLogin(user.id)
    },
    async signOut(props) {
      console.log('event:signOut')
      //await recordUserLogout(user.id)
    },
  },
  providers: [
    GoogleProvider({
      clientId: google.clientId,
      clientSecret: google.clientSecret,
      allowDangerousEmailAccountLinking: true,
    }),
    DiscordProvider({
      clientId: discord.clientId,
      clientSecret: discord.clientSecret,
      allowDangerousEmailAccountLinking: true,
    }),
    TwitterLegacy({
      name: 'Twitter',
      clientId: twitter.clientId,
      clientSecret: twitter.clientSecret,
      allowDangerousEmailAccountLinking: true,
    }),
    MicrosoftProvider({
      name: 'Microsoft',
      clientId: microsoft.clientId,
      clientSecret: microsoft.clientSecret,
      allowDangerousEmailAccountLinking: true,
    }),
    YahooProvider({
      clientId: yahoo.clientId,
      clientSecret: yahoo.clientSecret,
      allowDangerousEmailAccountLinking: true,
    } as any),
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
