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
} from 'lib/services/directus/server/users'
import {
  createSession,
  deleteSession,
  findSession,
  updateSession,
  addVerificationToken,
  findVerificationToken,
} from 'lib/services/directus/server/users/auth'
import { importFile, UploadFolder } from '../services/directus/server/files'
import { getAssetUrl } from '../utils'

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

function log(...args) {
  // console.debug(...args)
}

const authAdapter: Adapter = {
  async createUser(user: AdapterUser | any) {
    try {
      log('createUser', user)
      let image: DirectusFile = null
      if (user.image || user.picture) {
        const imageUrl = (user.image || user.picture) as string
        image = await importFile(imageUrl, UploadFolder.members, `avatar-${user.email}`)
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
      log('getUser', id)
      const user = await getUser(id)
      return mapUser(user)
    } catch (e) {
      console.error(e.response?.body?.errors[0].message || e)
    }
  },
  async getUserByEmail(email) {
    try {
      log('getUserByEmail', email)
      const user = await findUser<User>(email, '*.*')
      if (!user) return null
      return mapUser(user)
    } catch (e) {
      console.error(e.response?.body?.errors[0].message || e)
    }
  },
  async getUserByAccount({ providerAccountId, provider }) {
    try {
      log('getUserByAccount', providerAccountId, provider)
      const user = await findUserByAccount(provider, providerAccountId)
      if (!user) return null
      return mapUser(user)
    } catch (e) {
      console.error(e.response?.body?.errors[0].message || e)
    }
  },
  async updateUser(user) {
    try {
      log('updateUser', user)
      const updatedUser = await updateUser(user.id, {
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
      log('linkAccount', account)

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
      log('unlinkAccount', providerAccountId, provider)
      await deleteAccount(provider, providerAccountId)
    } catch (e) {
      console.error(e.response?.body?.errors[0].message || e)
    }
  },
  async createSession(sessionData) {
    try {
      log('createSession', sessionData)
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
      log('getSessionAndUser', sessionToken)
      const session = await findSession(sessionToken)
      if (!session) return null
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
      log('updateSession', session)
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
      log('deleteSession', sessionToken)
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
      log('useVerificationToken', identifier, token)
      const verificationToken = await findVerificationToken(identifier, token)
      if (!verificationToken) return null

      return mapToken(verificationToken)
    } catch (e) {
      console.error(e.response?.body?.errors[0].message || e)
    }
  },
}

export { authAdapter }
