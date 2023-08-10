import { OAuthConfig, OAuthUserConfig } from "next-auth/providers";

export interface YahooProfile {
  aud: string
  sub: string
  iss: string
  iat: number
  email: string
  email_verified: boolean
  exp: number
  family_name: string
  given_name: string
  name: string
  birthdate: string
}

export default function Yahoo<P extends YahooProfile>(options: OAuthUserConfig<P>): OAuthConfig<P> {
  return {
    id: 'yahoo',
    name: 'Yahoo',
    type: 'oauth',
    version: '2.0',
    wellKnown: 'https://api.login.yahoo.com/.well-known/openid-configuration',
    authorization: { params: { scope: 'openid openid2 email profile' } },
    idToken: true,
    client: {
      authorization_signed_response_alg: 'ES256',
      id_token_signed_response_alg: 'ES256',
    },
    checks: ['pkce', 'state'],
    clientId: process.env.YAHOO_CLIENT_ID,
    clientSecret: process.env.YAHOO_CLIENT_SECRET,
    profile(profile: YahooProfile) {
      return {
        id: profile.sub,
        sub: profile.sub,
        name: profile.name,
        first_name: profile.given_name,
        last_name: profile.family_name,
        email: profile.email.toLocaleLowerCase(),
        email_verified: profile.email_verified,
        birthdate: profile.birthdate,
        iss: profile.iss,
        iat: profile.iat,
        exp: profile.exp,
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
