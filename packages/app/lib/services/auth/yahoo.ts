import { OAuthConfig, OAuthUserConfig } from 'next-auth/providers'

export interface YahooProfile extends Record<string, any> {
  aud: string
  sub: string
  email: string
  email_verified: boolean
  exp: number
  family_name: string
  given_name: string
  iat: number
  name: string
}

export default function Yahoo<P extends YahooProfile>(options: OAuthUserConfig<P>): OAuthConfig<P> {
  return {
    id: 'yahoo',
    name: 'Yahoo',
    type: 'oauth',
    version: '2.0',
    wellKnown: 'https://api.login.yahoo.com/.well-known/openid-configuration',
    authorization: { params: { scope: 'openid email profile' } },
    idToken: true,
    checks: ['pkce', 'state'],
    clientId: process.env.YAHOO_CLIENT_ID,
    clientSecret: process.env.YAHOO_CLIENT_SECRET,
    profile(profile) {
      return {
        id: profile.sub,
        name: profile.name,
        email: profile.email,
      }
    },
    style: {
      logo: null,
      logoDark: null,
      bgDark: '#6001D1',
      bg: '#6001D1',
      text: '#FFF',
      textDark: '#FFF',
    },
    options,
  }
}
