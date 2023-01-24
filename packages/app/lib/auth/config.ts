import { AuthOptions } from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import MicrosoftProvider from 'next-auth/providers/azure-ad'
import YahooProvider from './yahoo'
import EmailProvider from 'next-auth/providers/email'
import { TwitterLegacy } from 'next-auth/providers/twitter'
import { authAdapter } from './adapter'
import { sendNotificationEmail, updateSendGrid } from 'lib/services/sendgrid/server'
import {
  findUser,
  findUserByAccount,
  getUser,
  recordUserLogin,
  recordUserLogout,
} from 'lib/services/directus/server/users'
import { Member, memberFields, Profile, UserStatusType } from 'lib/models'
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
    buttonText: 'Use',
  },

  callbacks: {
    async signIn({ user, email, profile, account }) {
      //return true
      console.debug('callback:signIn')

      if (email?.verificationRequest) {
        let found = (await getUser(user.id)) || (await findUser(account.userId))
        return found != null
      }
      if (user?.id) {
        let found = await getUser(user.id)
        return found != null
      }
      if (profile?.email) {
        let user = await findUser(profile.email)
        return user && allowedStatuses.includes(user.status as UserStatusType)
      }
      if (account?.providerAccountId) {
        let user = await findUserByAccount(account.provider, account.providerAccountId)
        return user && allowedStatuses.includes(user.status as UserStatusType)
      }
      return false
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
      //console.log('event:createUser')
      //console.dir(user)
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
      //console.log('event:signIn')
      await recordUserLogin(user.id)
    },
    async signOut(props) {
      console.log('event:signOut', props)
      //if (session?.user.id) await recordUserLogout(session.user.id)
    },
  },
  providers: [
    GoogleProvider({
      clientId: google.clientId,
      clientSecret: google.clientSecret,
      allowDangerousEmailAccountLinking: true,
    }),
    //DiscordProvider({
    //  clientId: discord.clientId,
    //  clientSecret: discord.clientSecret,
    //  allowDangerousEmailAccountLinking: true,
    //}),
    TwitterLegacy({
      id: 'twitter',
      name: 'Twitter',
      clientId: twitter.clientId,
      clientSecret: twitter.clientSecret,
      allowDangerousEmailAccountLinking: true,
    }),
    MicrosoftProvider({
      name: 'Microsoft',
      id: 'microsoft',
      clientId: microsoft.clientId,
      clientSecret: microsoft.clientSecret,
      allowDangerousEmailAccountLinking: true,
    }),
    YahooProvider({
      id: 'yahoo',
      clientId: yahoo.clientId,
      clientSecret: yahoo.clientSecret,
      allowDangerousEmailAccountLinking: true,
    }),
    EmailProvider({
      maxAge: 24 * 60 * 60 * 2, // 24 hours
      async sendVerificationRequest({ identifier: email, url }) {
        const user = await findUser(email)
        if (user && user.status !== 'banned') {
          await sendNotificationEmail(
            email,
            'User',
            'Sign in to GuysNHeat',
            'Click the button below to sign in to GuysNHeat',
            {
              button_text: 'Sign In',
              button_url: url,
            }
          )
        }
      },
    }),
  ],
}
