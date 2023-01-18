import { Adapter, AdapterUser, AdapterSession, VerificationToken } from 'next-auth/adapters'

import { DirectusFile, UserVerificationToken, User, UserSession } from 'lib/models'
import {
  createUser,
  findUser,
  findUserByAccount,
  getUser,
  updateUser,
  deleteAccount,
  createAccount,
} from '../directus/server/users'
import {
  createSession,
  deleteSession,
  findSession,
  updateSession,
  addVerificationToken,
  deleteVerificationToken,
  findVerificationToken,
} from '../directus/server/users/auth'
import { importFile, UploadFolder } from '../directus/server/files'
import { getAssetUrl } from '../../utils'

function mapUser(user: User): AdapterUser {
  return {
    id: user.id,
    email: user.email,
    emailVerified: new Date(user.date_created),
    name: user.first_name,
    image: user.picture ? getAssetUrl(user.picture as string) : null,
  }
}

function mapSession(session: UserSession): AdapterSession {
  return {
    userId: session.user as string,
    expires: new Date(session.expires),
    sessionToken: session.session_token,
  }
}

function mapToken(token: UserVerificationToken): VerificationToken {
  return {
    identifier: token.email,
    expires: new Date(token.expires),
    token: token.token,
  }
}

const authAdapter: Adapter = {
  async createUser(user: AdapterUser) {
    try {
      //console.debug('createUser', user)
      let image: DirectusFile = null
      if (user.image) {
        image = await importFile(user.image, UploadFolder.members, `avatar-${user.email}`)
      }
      const newUser = await createUser({
        email: user.email,
        email_verified: user.emailVerified != null,
        nickname: user.name,
        first_name: user.name,
        picture: image,
      })
      return mapUser(newUser)
    } catch (e) {
      console.error(e.response?.body?.errors[0].message || e)
    }
  },
  async getUser(id) {
    try {
      console.debug('getUser', id)
      const user = await getUser(id)
      return mapUser(user)
    } catch (e) {
      console.error(e.response?.body?.errors[0].message || e)
    }
  },
  async getUserByEmail(email) {
    try {
      console.debug('getUserByEmail', email)
      const user = await findUser<User>(email, '*.*')
      if (!user) return null
      return mapUser(user)
    } catch (e) {
      console.error(e.response?.body?.errors[0].message || e)
    }
  },
  async getUserByAccount({ providerAccountId, provider }) {
    try {
      console.debug('getUserByAccount', providerAccountId, provider)
      const user = await findUserByAccount(provider, providerAccountId)
      if (!user) return null
      return mapUser(user)
    } catch (e) {
      console.error(e.response?.body?.errors[0].message || e)
    }
  },
  async updateUser(user) {
    try {
      console.debug('updateUser', user)
      const updatedUser = await updateUser(user.id, {
        email: user.email,
        email_verified: user.emailVerified != null,
        status: 'active',
      })
      return mapUser(updatedUser)
    } catch (e) {
      console.error(e.response?.body?.errors[0].message || e)
    }
  },
  async linkAccount(account) {
    try {
      console.debug('linkAccount', account)

      const {
        provider,
        providerAccountId,
        type,
        userId,
        access_token,
        expires_at,
        id_token,
        refresh_token,
        scope,
      } = account
      await createAccount({
        provider,
        provider_id: providerAccountId,
        user: userId,
        type,
        scope,
        access_token,
        expires_at,
        id_token,
        refresh_token,
      })
    } catch (e) {
      console.error(e.response?.body?.errors[0].message || e)
    }
  },
  async unlinkAccount({ providerAccountId, provider }) {
    try {
      console.debug('unlinkAccount', providerAccountId, provider)
      await deleteAccount(provider, providerAccountId)
    } catch (e) {
      console.error(e.response?.body?.errors[0].message || e)
    }
  },
  async createSession(sessionData) {
    try {
      console.debug('createSession', sessionData)
      const session = await createSession({
        session_token: sessionData.sessionToken,
        user: sessionData.userId,
        expires: sessionData.expires.toISOString(),
      } as any)
      return mapSession(session as UserSession)
    } catch (e) {
      console.error(e.response?.body?.errors[0].message || e)
    }
  },
  async getSessionAndUser(sessionToken) {
    try {
      console.debug('getSessionAndUser', sessionToken)
      const session = await findSession(sessionToken)
      return {
        user: mapUser(session.user as User),
        session: mapSession(session),
      }
    } catch (e) {
      console.error(e.response?.body?.errors[0].message || e)
    }
  },
  async updateSession(session) {
    try {
      console.debug('updateSession', session)
      const updatedSession = await updateSession({
        session_token: session.sessionToken,
        expires: session.expires.toISOString(),
      })
      return mapSession(updatedSession as UserSession)
    } catch (e) {
      console.error(e.response?.body?.errors[0].message || e)
    }
  },
  async deleteSession(sessionToken) {
    try {
      console.debug('deleteSession', sessionToken)
      await deleteSession(sessionToken)
    } catch (e) {
      console.error(e.response?.body?.errors[0].message || e)
    }
  },
  async createVerificationToken(token) {
    try {
      const verificationToken = await addVerificationToken(
        token.identifier,
        token.token,
        token.expires.toISOString()
      )
      return mapToken(verificationToken)
    } catch (e) {
      console.error(e.response?.body?.errors[0].message)
    }
  },
  async useVerificationToken({ identifier, token }) {
    try {
      console.debug('useVerificationToken', identifier, token)
      const verificationToken = await findVerificationToken(identifier)
      if (!verificationToken) return null
      if (verificationToken.token !== token) return null
      await deleteVerificationToken(identifier)
      return mapToken(verificationToken)
    } catch (e) {
      console.error(e.response?.body?.errors[0].message || e)
    }
  },
}

export { authAdapter }
