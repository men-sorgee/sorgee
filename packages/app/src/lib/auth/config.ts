import { brand } from "lib/config/brand";
import config from "lib/config/server";
import { MemberLevel, Profile, User, UserStatusType } from "lib/models";
import {
  extendUserPresence,
  findUser,
  findUserByAccount,
  getUser,
  recordUserLogin
} from "lib/services/db/server/users";
import { setUserAverageRating } from "lib/services/directus/server";
import {
  SendGridCategory,
  SendGridTemplate,
  sendNotificationEmail,
  updateSendGrid
} from "lib/services/sendgrid/server";
import { sendNotification } from "lib/services/twilio/server";
import { AuthOptions } from "next-auth";
import MicrosoftProvider from "next-auth/providers/azure-ad";
import DiscordProvider from "next-auth/providers/discord";
import EmailProvider from "next-auth/providers/email";
import GoogleProvider from "next-auth/providers/google";
import { TwitterLegacy } from "next-auth/providers/twitter";

import { authAdapter } from "./adapter";
import YahooProvider from "./yahoo";

const { google, discord, twitter, yahoo, microsoft } = config

const allowedStatuses: UserStatusType[] = ['new', 'active', 'stale']

const userCanSignin = (user: User | any) => {
  const can =
    user &&
    allowedStatuses.includes(user.status as UserStatusType) &&
    MemberLevel[user.userType as string] >= MemberLevel.applicant

  return can
}

export const authOptions: AuthOptions = {
  adapter: authAdapter,
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: 'database',
    maxAge: 10 * 24 * 60 * 60, // 10 days
    updateAge: 1 * 24 * 60 * 60, // 1 day
  },
  theme: {
    logo: '/logo.svg',
    brandColor: brand.colors.primary.DEFAULT,
    colorScheme: 'dark',
    buttonText: 'Use',
  },

  callbacks: {
    async signIn(data) {
      let { user, email: is, profile, account } = data
      let email: string =
        profile?.email ||
        user?.email ||
        ((account?.user || account?.sub || account?.userId || account?.email) as string)

      if (is?.verificationRequest) {
        console.debug('callback:signIn:verificationRequest')
        let found = (await getUser(user.id)) || (await findUser(email))
        return found != null
      }
      console.debug('callback:signIn')

      if (email) {
        let user = await findUser(email)
        return userCanSignin(user)
      }
      if (account?.providerAccountId) {
        let user = await findUserByAccount(account.provider, account.providerAccountId)
        return userCanSignin(user)
      }
      if (user?.id) {
        user = await getUser(user.id as string)
        return userCanSignin(user)
      }
      return false
    },
    async session({ session, user }) {
      console.debug('callback:session')
      const fullUser = await findUser(user.email)
      session.user = fullUser


      return session
    },
  },
  events: {
    async createUser({ user }) {
      console.log('event:createUser')
      await recordUserLogin(user.id)

      const member = await findUser(user.email)
      if (member && !member.inSendgrid) await updateSendGrid(user as Profile)

      if (member && member.status == 'new')
        await sendNotificationEmail(
          user.email,
          user.name,
          `Application Status`,
          'Thank you for applying for membership!',
          {
            button_text: 'Complete Application',
            button_url: 'https://guysnheat.com/apply',
          }
        )
    },
    async signIn({ user }) {
      console.log('event:signIn')
      await recordUserLogin(user.id)
      await setUserAverageRating(user.id)
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
    DiscordProvider({
      clientId: discord.clientId,
      clientSecret: discord.clientSecret,
      allowDangerousEmailAccountLinking: true,
    }),
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
      maxAge: 60 * 60, // 1 hour
      async sendVerificationRequest({ identifier: email, url }) {
        const user = await findUser(email)
        console.log('sendVerificationRequest')
        if (userCanSignin(user)) {
          // check if the user needs to sign in with their phone
          if (user.phone && user.phoneVerified && user.authWithPhone) {
            try {
              await sendNotification(user.phone, `Sign in:  ${url}`)
              console.log(`Sent sign in link to ${user.phone} for ${user.email} `)
              return
            } catch (e) {
              console.error(e)
            }
          }
          console.log(`Sending sign in link to ${user.email} `)
          await sendNotificationEmail(
            email,
            'User',
            'Sign in to GuysNHeat',
            'Click the button below to sign in to GuysNHeat',
            {
              button_text: 'Sign In',
              button_url: url,
            },
            SendGridTemplate.Notification,
            SendGridCategory.Notification
          )
        } else {
          console.log('User not active')
        }
      },
      normalizeIdentifier(identifier: string): string {
        let [local, domain] = identifier.toLowerCase().trim().split('@')
        return `${local}@${domain}`
      },
    }),
  ],
}
