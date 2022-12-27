import NextAuth, { AuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import DiscordProvider from 'next-auth/providers/discord';
import TwitterProvider from 'next-auth/providers/twitter';
import MicrosoftProvider from 'next-auth/providers/azure-ad';
import OAuthProvider from 'next-auth/providers/oauth';
import EmailProvider from 'next-auth/providers/email';
import { authAdapter } from '@/lib/services/directus/auth-adapter';
import {
  sendNotificationEmail,
  SendGridTemplate,
  updateSendGrid
} from 'lib/services/sendgrid/server';
import {
  createAccount,
  findUser,
  findUserByAccount,
  recordUserLogin
} from 'lib/services/directus/server/users';
import { Profile, StatusType } from 'lib/models';

const allowedStatuses: StatusType[] = ['new', 'active', 'inactive', 'stale'];
export const authOptions: AuthOptions = {
  adapter: authAdapter,
  session: {
    strategy: 'jwt',
    maxAge: 10 * 24 * 60 * 60 // 10 days
  },
  theme: {
    logo: 'https://static.guysnheat.com/static/logo.png',
    brandColor: '#0038A8', // brand.colors.primary.DEFAULT,
    colorScheme: 'dark'
  },
  callbacks: {
    async signIn({ email, profile, account }) {
      console.log('callback:signIn');
      console.dir({
        email,
        profile,
        account
      });
      if (email && email.verificationRequest) {
        const user = await findUser(account.userId);
        return user && allowedStatuses.includes(user.status);
      } else if (profile && profile.email) {
        console.log('creating account');
        const user = await findUser(profile.email);
        const existing = await findUserByAccount(
          account.provider,
          account.providerAccountId
        );
        if (!existing && user) {
          const {
            provider,
            providerAccountId,
            type,
            access_token,
            expires_at,
            id_token,
            refresh_token,
            scope
          } = account;
          await createAccount({
            provider,
            provider_id: providerAccountId,
            user: user.id,
            type,
            scope,
            access_token,
            expires_at,
            id_token,
            refresh_token
          });
        }
      }
      return true;
    },
    async session({ session, token }) {
      console.log('callback:session');
      console.dir({ session, token });
      const { user } = session;
      const fullUser = await findUser(user.email);
      session.user = Object.apply(user, fullUser);
      return session;
    }
  },
  events: {
    async createUser({ user }) {
      console.log('event:createUser');
      console.dir({ user });
      await updateSendGrid(user as Profile);
    },
    async signIn({ user, account, profile }) {
      console.log('event:signIn');
      console.dir({ user, account, profile });
      /* on successful sign in */
      await recordUserLogin(user.id);
    }
  },
  providers: [
    //Auth0Provider({
    //  clientId: process.env.AUTH0_CLIENT_ID,
    //  clientSecret: process.env.AUTH0_CLIENT_SECRET,
    //  issuer: process.env.AUTH0_ISSUER
    //}),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      allowDangerousEmailAccountLinking: false
    }),
    DiscordProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      allowDangerousEmailAccountLinking: false
    }),
    EmailProvider({
      //from: 'system@guysnheat.com',
      //server: {
      //  host: 'smtp.sendgrid.net',
      //  port: 587,
      //  auth: {
      //    user: 'apikey',
      //    pass: process.env.SENDGRID_API_KEY
      //  }
      //}
      async sendVerificationRequest({ identifier: email, url }) {
        await sendNotificationEmail(
          email,
          'Sign in to GuysNHeat',
          'Click the button below to sign in to GuysNHeat',
          'Sign In',
          url,
          SendGridTemplate.AppNotification
        );
      }
    })
  ]
};

export default NextAuth(authOptions);
